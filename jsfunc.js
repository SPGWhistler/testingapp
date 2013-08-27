jQuery('#page1').on('pageinit', function(event){
	$.getJSON(__testApp.paths.localhost + '/~tpetty/testapp/buttons.php' + "?callback=?", null, function(data) {
		$(data).appendTo('body');
	});
});

var serviceName = "twitter";
var onDeviceReady=function(){
	ddebug('device ready');
	//hide the splash screen
	AppMobi.device.hideSplashScreen();
	AppMobi.notification.checkPushUser(AppMobi.device.uuid, AppMobi.device.uuid);
};
document.addEventListener("appMobi.device.ready",onDeviceReady,false);

/* This code runs when notifications are registered */
var didAdd = false;
var tmpEvts = [];
var notificationsRegistered=function(event) {
	//This is first called from the checkPushUser event above.
	//If a user is not found, success = false, and this tries to add that user.
	if(event.success === false) {
		if (didAdd === false) {
			didAdd = true;
			//AppMobi.notification.alert("Doing addPushUser now...","My Message","OK");
			//Try adding the user now - sending unique user id, password, and email address.
			AppMobi.notification.addPushUser(AppMobi.device.uuid, AppMobi.device.uuid, 'no@email.com');
			//This will fire the push.enable event again, so that is why we use didAdd to make sure
			//we dont add the user twice if this fails for any reason.
			return;
		}
		//AppMobi.notification.alert("Notifications Failed: " + event.message,"My Message","OK");
		return;
	}
	var msg = event.message || 'success';
	//AppMobi.notification.alert("Notifications Enabled: " + event.message + "\n" + AppMobi.device.uuid,"My Message","OK");
}
document.addEventListener("appMobi.notification.push.enable",notificationsRegistered,false);

document.addEventListener("appMobi.notification.push.receive", function(){
	var myNotifications=AppMobi.notification.getNotificationList();
	var len=myNotifications.length;
	if(len > 0) {
		for(i=0; i < len; i++) {
			msgObj=AppMobi.notification.getNotificationData(myNotifications[i]);
		}
	}
}, false);

document.addEventListener("wylei.ready", function(d){
	ddebug('wylei ready');
	wylei.user.login(true);
}, false);

function doOptimize(){
	ddebug('doing optimize');
	wylei.optimizer.optimizeEvent('level-5');
}

function twitterAvail(){
	AppMobi.exec("AppMobiTwitter.available");
};
document.addEventListener("appMobi.twitter.available", function(evt){
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

document.addEventListener("appMobi.twitter.authorized", function(evt){
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

document.addEventListener("appMobi.twitter.request", function(evt){
	ddebug('twitter request event');
	if (evt.success === false) {
		ddebug('update failed');
		ddebug(evt);
		alert(evt.message);
	}
}, false);

document.addEventListener("appMobi.twitter.busy", function(evt){
	ddebug('twitter busy event');
	ddebug(arguments);
}, false);

function twitterTweet(){
	var d = new Date;
	var t = d.getTime();
	var update = { "status" : "Testing new auth" + t };
	alert('about to tweet: ' + update.status);
	AppMobi.exec("AppMobiTwitter.performRequest", "http://api.twitter.com/1.1/statuses/update.json", "POST", JSON.stringify(update));
}

function login(provider, obj){
	ddebug('doing login');
	wylei.user.login(provider, obj);
}

function logout(){
	ddebug('doing logout');
	wylei.user.logout();
}

document.addEventListener("wylei.user.login",function(e){
	ddebug('login success event received');
	if (e.success) {
		$('#message').html('hi ' + e.userinfo.name + ', you are logged in. Id: ' + e.userinfo.id);
	} else {
		$('#message').html('not logged in');
	}
},false);

function onetouch(){
	ddebug('doing 1touch purchase');
	OneTouch.buy('spottedcow2', 1, function(){
		ddebug('1touch payment success');
		ddebug(arguments);
		alert('success');
	}, function(){
		ddebug('1touch payment fail');
		ddebug(arguments);
		alert('fail');
	});
};
function onetouch_restore(){
	ddebug('doing 1touch restore');
	OneTouch.restore(function(){
		ddebug('1touch restore callback');
		ddebug(arguments);
	});
};
