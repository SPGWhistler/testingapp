/*global alert, $, AppMobi, wylei */

var __testApp = __testApp || {};

function ddebug(msg) {
	if (__testApp.scripts_ready.wylei) {
		console.log(msg);
	} else {
		__testApp.message_queue.push(msg);
	}
}

document.addEventListener("appMobi.device.ready", function () {
	ddebug('__testApp: appMobi ready');
	__testApp.scripts_ready.appMobi = true;
	clearTimeout(__testApp.timers.appMobi);
}, false);

document.addEventListener("wylei.ready", function () {
	ddebug('__testApp: wylei ready');
	__testApp.scripts_ready.wylei = true;
	clearTimeout(__testApp.timers.wylei);
}, false);

__testApp.settings = {
	office: true, //In office, or at home
	prod: false, //Use the production scripts or local scripts
	debug: true, //Add debug console script
	minified: false, //Use the minified versions
	build_date: '25/09/2013 15:50:39', //The build date [AR:D/M/Y H:i:s] <-- This is what my funciton looks for to auto replace the date
	build_version: '1.1', //The build version
	timers: {
		appMobi: 4500, //Milliseconds (from __testApp.init) to wait for appMobi js to fire its ready event
		wylei: 4600, //Milliseconds (from __testApp.init) to wait for wylei js to fire its ready event
		message_queue: 4700, //Milliseconds (from __testApp.init) to wait before flushing message queue
	},
	hosts: {
		prod: 'https://s3.amazonaws.com', //Prod host name
		home: 'http://192.168.11.12', //Home host name
		office: 'http://192.168.1.15' //Office host name
	},
	paths: {
		prod: '/wylei/', //Prod path
		home: '/~tpetty/amoauth/' //Home path
	},
	scripts: {
		static: [
			//Add static scripts here
		],
		dynamic: function () {
			var scripts = [
				//Add dynamic scripts here
				{
					src: 'http://code.jquery.com/jquery-1.9.1' + ((__testApp.settings.minified) ? '.min' : '') + '.js',
					random: false
				},
				{
					src: 'http://code.jquery.com/mobile/1.3.1/jquery.mobile-1.3.1' + ((__testApp.settings.minified) ? '.min' : '') + '.js',
					random: false
				},
				__testApp.paths.localhost + '/~tpetty/testapp/1touchlive/onetouch.js',
				__testApp.paths.scripthost + __testApp.paths.scriptpath + 'wylei' + ((__testApp.settings.minified) ? '.min' : '') + '.js',
				__testApp.paths.localhost + '/~tpetty/testapp/jsfunc.js'
			];
			return scripts;
		},
		debug: function () {
			var scripts = [
				//Add debug only scripts here
				{
					src: __testApp.paths.localhost + ':8080' + '/target/target-script-min.js',
					random: false
				}
			];
			return scripts;
		}
	}
};

__testApp.paths = {
	localhost: '',
	scripthost: '',
	scriptpath: ''
};

__testApp.script_queue = [];

__testApp.script_queue_length = 0;

__testApp.message_queue = [];

__testApp.scripts_ready = {
	appMobi: false,
	wylei: false
};

__testApp.timers = {
	appMobi: null,
	wylei: null
};

__testApp.init = function () {
	ddebug('__testApp: initializing');
	__testApp.timers.message_queue = setTimeout(function () {
		__testApp.flushMessageQueue();
	}, __testApp.settings.timers.message_queue);
	if (!this.scripts_ready.appMobi) {
		this.timers.appMobi = setTimeout(function () {
			if (!AppMobi) {
				ddebug('__testApp: The appmobi script didnt load.');
				alert('The appMobi script didnt load.');
			} else {
				ddebug('__testApp: The appmobi script didnt initialize in time.');
			}
			__testApp.flushMessageQueue();
		}, this.settings.timers.appMobi);
	}
	if (!this.scripts_ready.wylei) {
		this.timers.wylei = setTimeout(function () {
			__testApp.flushMessageQueue();
			if (!wylei) {
				ddebug('__testApp: The wylei script didnt load.');
				alert('The wylei script didnt load.');
			} else if (!wylei.initialized) {
				ddebug('__testApp: The wylei script didnt initialize in time.');
			} else {
				ddebug('__testApp: The wylei script didnt fire its ready event in time.');
			}
		}, this.settings.timers.wylei);
	}
	this.paths.localhost = (this.settings.office) ? this.settings.hosts.office : this.settings.hosts.home;
	this.paths.scripthost = (this.settings.prod) ? this.settings.hosts.prod : this.paths.localhost;
	this.paths.scriptpath = (this.settings.prod) ? this.settings.paths.prod : this.settings.paths.home;
	this.script_queue = this.settings.scripts.static;
	Array.prototype.push.apply(this.script_queue, this.settings.scripts.dynamic());
	if (this.settings.debug) {
		Array.prototype.push.apply(this.script_queue, this.settings.scripts.debug());
	}
	this.script_queue_length = this.script_queue.length;
	this.loadJsScript();
};

__testApp.loadJsScript = function () {
	var cur, add_random, randomh, script;
	if (!this.script_queue.length) {
		return;
	}
	cur = this.script_queue.shift();
	add_random = true;
	if (typeof cur === 'object') {
		add_random = (cur.random === false) ? false : true;
		cur = cur.src;
	}
	ddebug('__testApp: loading ' + cur + ' (' + ((add_random) ? 'not cached' : 'cached') + ') (' + (this.script_queue_length - this.script_queue.length) + ' of ' + this.script_queue_length + ')');
	randomh = (add_random) ? '?rnd=' + Math.random() : '';
	script = document.createElement("script");
	script.src = cur + randomh;
	script.type = "text/javascript";
	script.onload = function () {
		if (__testApp.script_queue.length) {
			__testApp.loadJsScript();
		}
	};
	script.onerror = function () {
		ddebug('__testApp: Error loading javascript.');
		alert('Script loading halted due to error.');
	};
	document.getElementsByTagName("head")[0].appendChild(script);
};

__testApp.addJsScripts = function (scripts) {
	var i;
	for (i in scripts) {
		if (scripts.hasOwnProperty(i)) {
			this.script_queue.push({
				src: scripts[i].src,
				random: (scripts[i].random === false) ? false : true
			});
		}
	}
	this.script_queue_length = this.script_queue.length;
	this.loadJsScript();
};

__testApp.flushMessageQueue = function () {
	var i;
	clearTimeout(this.timers.message_queue);
	for (i in this.message_queue) {
		if (this.message_queue.hasOwnProperty(i)) {
			console.log(this.message_queue[i]);
		}
	}
	this.message_queue = [];
	try {
		$('#skip_loading').click();
	} catch (err) {}
};

__testApp.build = function () {
	var str;
	str = 'v:' + this.settings.build_version + ' d:' + this.settings.build_date;
	if (AppMobi && AppMobi.device) {
		str += ' amv:' + AppMobi.device.appmobiversion + ' jsv:' + AppMobi.jsVersion;
	}
	return str;
};
