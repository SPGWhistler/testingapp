/*global facebookAPI, OneTouch, alert, _wyleiSupport, wylei, AppMobi, jQuery, $, __testApp, ddebug */
jQuery('#page1').on('pageinit', function (event) {
	$.getJSON(__testApp.paths.localhost + '/~tpetty/testapp/buttons.php' + "?callback=?", null, function (data) {
		$(data).appendTo('body');
	});
});

var serviceName = "twitter";
var onDeviceReady = function () {
	//hide the splash screen
	AppMobi.device.hideSplashScreen();
	AppMobi.device.managePower(true, false); //When app is open, dont go to sleep
	AppMobi.notification.checkPushUser('tpetty', 'tpetty');
	__testApp.settings.build += ' AMCv' + AppMobi.device.appmobiversion;
};
document.addEventListener("appMobi.device.ready", onDeviceReady, false);

/* This code runs when notifications are registered */
var didAdd = false;
var tmpEvts = [];
var notificationsRegistered = function (event) {
	//This is first called from the checkPushUser event above.
	//If a user is not found, success = false, and this tries to add that user.
	if (event.success === false) {
		if (didAdd === false) {
			didAdd = true;
			//AppMobi.notification.alert("Doing addPushUser now...","My Message","OK");
			//Try adding the user now - sending unique user id, password, and email address.
			ddebug('adding new push user');
			AppMobi.notification.addPushUser('tpetty', 'tpetty', 'tony@wylei.com');
			//This will fire the push.enable event again, so that is why we use didAdd to make sure
			//we dont add the user twice if this fails for any reason.
			return;
		}
		//AppMobi.notification.alert("Notifications Failed: " + event.message,"My Message","OK");
		return;
	}
	var msg = event.message || 'success';
	ddebug('push registered event: ' + event.success);
	//AppMobi.notification.alert("Notifications Enabled: " + event.message + "\n" + AppMobi.device.uuid,"My Message","OK");
};
document.addEventListener("appMobi.notification.push.enable", notificationsRegistered, false);

/*
document.addEventListener("appMobi.notification.push.receive", function () {
	console.log('got push message');
	var myNotifications=AppMobi.notification.getNotificationList();
	console.log(myNotifications);
	var len=myNotifications.length;
	if(len > 0) {
		for(i=0; i < len; i++) {
			msgObj=AppMobi.notification.getNotificationData(myNotifications[i]);
			console.log(msgObj);
		}
	}
}, false);
*/

document.addEventListener("wylei.user.ready", function (d) {
	wylei.user.login(true);
}, false);

function reload_me() {
	__testApp.addJsScripts([{
		src: __testApp.paths.localhost + '/~tpetty/testapp/jsfunc.js'
	}]);
}
function reload_page() {
	ddebug(__testApp.paths.localhost + '/~tpetty/testapp/buttons.php');
	//#TODO This wont work this way - because its cross domain.
	//I'll need to inject the page in the dom some how - probably
	//first erasing what is there.
	$.mobile.allowCrossDomainPages = true;
	$.mobile.changePage(__testApp.paths.localhost + '/~tpetty/testapp/buttons.php', {
		allowSamePageTransition: true,
		changeHash: false,
		reloadPage: true,
		showLoadMsg: true,
		transition: 'flip'
	});
}

function doOptimize() {
	ddebug('doing optimize');
	wylei.optimizer.optimizeEvent($('#optimizer_events input:checked').val());
}

function doFakePush() {
	var bundle = {
		"event_name" : "push1",
		"event_type" : "pushmsg",
		"onetime_offer" : false,
		"offers" : [{
			"modal_title" : "achievement modal title",
			"modal_message" : "achievement modal message",
			"asks" : [{
				"type" : "pushmsg",
				"modal_title" : "push modal title",
				"modal_message" : "push modal message"
			}],
			"incentives" : [{
				"type" : "inapp_currency",
				"key" : "tokens",
				"value" : 50,
				"modal_title" : "inapp modal title",
				"modal_message" : "inapp modal message"
			}]
		}]
	};
	wylei.optimizer.optimizeEvent(bundle);
}

function doWyleiPush() {
	var bundle, d = new Date(), url = 'https://webservices.appmobi.com/pushmobi.aspx?CMD=SendBroadcastMessage';
	url += '&authuser=tpetty@appmobi.com';
	url += '&authpw=qwerty1!';
	url += '&appname=' + AppMobi.app;
	url += '&msg=' + d.getHours() + ':' + d.getMinutes();
	bundle = {
		"event_name" : "push1",
		"event_type" : "pushmsg",
		"onetime_offer" : false,
		"offers" : [{
			"modal_title" : "achievement modal title",
			"modal_message" : "achievement modal message",
			"asks" : [{
				"type" : "pushmsg",
				"modal_title" : "push modal title",
				"modal_message" : "push modal message"
			}],
			"incentives" : [{
				"type" : "inapp_currency",
				"key" : "tokens",
				"value" : 50,
				"modal_title" : "inapp modal title",
				"modal_message" : "inapp modal message"
			}]
		}]
	};
	bundle = encodeURIComponent(JSON.stringify(bundle));
	if ($('#inc_bundle:checked').val()) {
		url += '&data=' + bundle;
	}
	ddebug(url);
	_wyleiSupport.getUrl(url);
	alert('sent');
}

function twitterAvail() {
	AppMobi.exec("AppMobiTwitter.available");
}
document.addEventListener("appMobi.twitter.available", function (evt) {
	if (evt.available === true) {
		//User has twitter installed
		ddebug('twitter available');
		AppMobi.exec("AppMobiTwitter.authorize");
	} else {
		//User does not have twitter installed.
		ddebug('twitter not available');
		alert('you must install twitter first in settings');
	}
}, false);

document.addEventListener("appMobi.twitter.authorized", function (evt) {
	if (evt.success === false && evt.nouser === true && evt.denied === false) {
		//Not signed in yet
		ddebug('not signed in yet');
		alert('you must signin to twitter first in settings');
	} else if (evt.success === false && evt.nouser === false && evt.denied === true) {
		//They denied us access
		ddebug('access denied');
		alert('you have denided this app access to twitter');
	} else if (evt.success === true) {
		//Access granted
		ddebug('access granted');
		document.getElementById('tweet').disabled = false;
		/*
		var update = { "status" : "Testing new auth" };
		AppMobi.exec("AppMobiTwitter.performRequest", "http://api.twitter.com/1.1/statuses/update.json", "POST", JSON.stringify(update));
		*/
	} else {
		//Something else happened
		ddebug('something went wrong');
		ddebug(evt);
	}
}, false);

document.addEventListener("appMobi.twitter.request", function (evt) {
	ddebug('twitter request event');
	if (evt.success === false) {
		ddebug('update failed');
		ddebug(evt);
		alert(evt.message);
	}
}, false);

document.addEventListener("appMobi.twitter.busy", function (evt) {
	ddebug('twitter busy event');
	ddebug(arguments);
}, false);

function twitterTweet() {
	var d = new Date(), t = d.getTime(), update = { "status" : "Testing new auth" + t };
	alert('about to tweet: ' + update.status);
	AppMobi.exec("AppMobiTwitter.performRequest", "http://api.twitter.com/1.1/statuses/update.json", "POST", JSON.stringify(update));
}

function login(provider, obj) {
	ddebug('doing login');
	wylei.user.login(provider, obj);
}

function logout() {
	ddebug('doing logout');
	wylei.user.logout();
}

document.addEventListener("wylei.user.login", function (e) {
	ddebug('login success event received');
	if (e.success) {
		$('#message').html('hi ' + e.userinfo.name + ', you are logged in. Id: ' + e.userinfo.id);
		$('#headertxt').html('Unscrambler - ' + e.userinfo.name);
	} else {
		$('#message').html('not logged in');
		$('#headertxt').html('Unscrambler');
	}
}, false);

function onetouch() {
	ddebug('doing 1touch purchase');
	OneTouch.buy('spottedcow2', 1, function () {
		ddebug('1touch payment success');
		ddebug(arguments);
		alert('success');
	}, function () {
		ddebug('1touch payment fail');
		ddebug(arguments);
		alert('fail');
	});
}
function onetouch_restore() {
	ddebug('doing 1touch restore');
	OneTouch.restore(function () {
		ddebug('1touch restore callback');
		ddebug(arguments);
	});
}

function appdata_save() {
	ddebug('doing appdata save');
	wylei.appdata.save({
		key: 'testkey',
		value: 'testvalue',
		user_id: '7515861f-03a1-4cfd-af30-3e142a185312',
		callback: function () {
			ddebug('in appdata save callback');
			ddebug(arguments);
		}
	});
}
function appdata_get() {
	ddebug('doing appdata get');
	wylei.appdata.get({
		key: 'testkey',
		user_id: '7515861f-03a1-4cfd-af30-3e142a185312',
		callback: function () {
			ddebug('in appdata get callback');
			ddebug(arguments);
		}
	});
}
function appdata_getall() {
	ddebug('doing appdata getall');
	wylei.appdata.getall({
		user_id: '7515861f-03a1-4cfd-af30-3e142a185312',
		callback: function () {
			ddebug('in appdata getall callback');
			ddebug(arguments);
		}
	});
}
function appdata_deletekey() {
	ddebug('doing appdata deletekey');
	wylei.appdata.deletekey({
		key: 'testkey',
		user_id: '7515861f-03a1-4cfd-af30-3e142a185312',
		callback: function () {
			ddebug('in appdata deletekey callback');
			ddebug(arguments);
		}
	});
}
function appdata_deleteall() {
	ddebug('doing appdata deleteall');
	wylei.appdata.deleteall({
		user_id: '7515861f-03a1-4cfd-af30-3e142a185312',
		callback: function () {
			ddebug('in appdata deleteall callback');
			ddebug(arguments);
		}
	});
}

function achievements_earn() {
	ddebug('doing achievements earn');
	wylei.gamification.achievements.earn({
		id: 'light_snack',
		callback: function () {
			ddebug('achievements earn callback');
			ddebug(arguments);
		}
	});
}
function achievements_check() {
	ddebug('doing achievements check');
	var res = wylei.gamification.achievements.check({
		id: 'light_snack',
		callback: function () {
			ddebug('achievements check callback');
			ddebug(arguments);
		}
	});
	ddebug('achievements check return: ' + res);
}
function achievements_get(id) {
	ddebug('doing achievements get');
	var res = wylei.gamification.achievements.get(id);
	ddebug(res);
}

function leaderboards_getPlayerScore() {
	ddebug('doing leaderboards getPlayerScore');
	wylei.gamification.leaderboards.getPlayerScore({
		leaderboard: 'myleaderboard',
		rows_above: 5,
		rows_below: 5,
		callback: function () {
			ddebug('leaderboards getPlayerScore callback');
			ddebug(arguments);
		}
	});
}
function leaderboards_save() {
	ddebug('doing leaderboards save');
	wylei.gamification.leaderboards.save({
		leaderboard: 'myleaderboard',
		score: 5,
		mode: 'l',
		callback: function () {
			ddebug('leaderboards save callback');
			ddebug(arguments);
		}
	});
}
function leaderboards_getRange() {
	ddebug('doing leaderboards getRange');
	wylei.gamification.leaderboards.getRange({
		leaderboard: 'myleaderboard',
		offset: 1,
		limit: 5,
		callback: function () {
			ddebug('leaderboards getRange callback');
			ddebug(arguments);
		}
	});
}

function facebook_friends() {
	ddebug('doing facebook friends request');
	facebookAPI.friends("", function (data) {
		var i, name, id, pic, html;
		ddebug('facebook friends callback');
		ddebug(data);
		for (i in data.data) {
			if (data.data.hasOwnProperty(i)) {
				name = data.data[i].name;
				id = data.data[i].id;
				pic = facebookAPI.picture(data.data[i].id);
				html = "<li><a data-fb-id='" + id + "' data-fb-name='" + name + "' href='#'><img src='" + pic + "'><h2>" + name + "</h2></a></li>";
				$('#fbfriendslist').append(html);
			}
		}
		$('#fbfriendslist').listview("refresh");
		$('#fbfriendslist a').click(function () {
			var $obj = $(this);
			ddebug($obj.data('fb-name'));
			ddebug($obj.data('fb-id'));
			facebookAPI.post({
				"to": $obj.data('fb-id'),
				"name" : "test name",
				"caption" : "Hello, please use this awesome app",
				"description" : "test description",
				"link" : "http://www.google.com"
			}, function () {
				ddebug('post callback');
				ddebug(arguments);
			});
		});
	});
}
