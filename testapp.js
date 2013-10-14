/*global alert, $, AppMobi, wylei */

var __testApp = __testApp || {};

var wylei = {
	debug_mode: true,
	//debug_filter: 'optimizer',
	facebook: {
		appId: '585428521518342'
	}
};

function ddebug(msg) {
	//@TODO Fix this with new wylei event structure
	//if (__testApp.scripts_ready.wylei) {
		console.log(msg);
	//} else {
		//__testApp.message_queue.push(msg);
	//}
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

__testApp.settings = __testApp.settings || {};

__testApp.settings.office = true; //In office, or at home (This will be set automatically.)
__testApp.settings.prod = false; //Use the production scripts or local scripts
__testApp.settings.debug = true; //Add debug console script
__testApp.settings.minified = false; //Use the minified versions
__testApp.settings.build_date = '14/10/2013 10:23:57'; //The build date [AR:D/M/Y H:i:s] <-- This is what my funciton looks for to auto replace the date
__testApp.settings.build_version = '1.1'; //The build version
__testApp.settings.timers = {
	appMobi: 4500, //Milliseconds (from ajax callback) to wait for appMobi js to fire its ready event
	wylei: 4600, //Milliseconds (from ajax callback) to wait for wylei js to fire its ready event
	message_queue: 4700, //Milliseconds (from __testApp.init) to wait before flushing message queue
};
__testApp.settings.hosts = {
	prod: 'https://s3.amazonaws.com', //Prod host name
	home: 'http://192.168.11.12', //Home host name
	office: 'http://192.168.1.3' //Office host name
};
__testApp.settings.paths = {
	prod: '/wylei/', //Prod path
	home: '/~tpetty/amoauth/' //Home path
};
__testApp.settings.scripts = {
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
	var self = this;
	ddebug('__testApp: initializing');
	__testApp.timers.message_queue = setTimeout(function () {
		__testApp.flushMessageQueue();
	}, __testApp.settings.timers.message_queue);
	this.jsonp.get('http://tpetty.remote.staging.appmobi.com/testingapp/location.php', {}, function (location) {
		if (!self.scripts_ready.appMobi) {
			self.timers.appMobi = setTimeout(function () {
				if (typeof AppMobi === 'undefined') {
					ddebug('__testApp: The appmobi script didnt load.');
					alert('The appMobi script didnt load.');
				} else {
					ddebug('__testApp: The appmobi script didnt initialize in time.');
				}
				__testApp.flushMessageQueue();
			}, self.settings.timers.appMobi);
		}
		if (!self.scripts_ready.wylei) {
			self.timers.wylei = setTimeout(function () {
				__testApp.flushMessageQueue();
				if (typeof wylei === 'undefined') {
					ddebug('__testApp: The wylei script didnt load.');
					alert('The wylei script didnt load.');
				} else if (!wylei.initialized) {
					ddebug('__testApp: The wylei script didnt initialize in time.');
				} else {
					ddebug('__testApp: The wylei script didnt fire its ready event in time.');
				}
			}, self.settings.timers.wylei);
		}
		self.settings.office = (location === 'office') ? true : false;
		ddebug('__testApp: in office: ' + self.settings.office);
		self.paths.localhost = (self.settings.office) ? self.settings.hosts.office : self.settings.hosts.home;
		self.paths.scripthost = (self.settings.prod) ? self.settings.hosts.prod : self.paths.localhost;
		self.paths.scriptpath = (self.settings.prod) ? self.settings.paths.prod : self.settings.paths.home;
		self.script_queue = self.settings.scripts.static;
		Array.prototype.push.apply(self.script_queue, self.settings.scripts.dynamic());
		if (self.settings.debug) {
			Array.prototype.push.apply(self.script_queue, self.settings.scripts.debug());
		}
		self.script_queue_length = self.script_queue.length;
		self.loadJsScript();
	});
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

__testApp.jsonp = (function () {
	var counter = 0, head, window = this, config = {};

	function load(url, pfnError) {
		var script = document.createElement('script'), done = false, errorHandler = pfnError || config.error;
		script.src = url;
		script.async = true;
		if (typeof errorHandler === 'function') {
			script.onerror = function (ex) {
				errorHandler({
					url: url,
					event: ex
				});
			};
		}
		script.onload = script.onreadystatechange = function () {
			if (!done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
				done = true;
				script.onload = script.onreadystatechange = null;
				if (script && script.parentNode) {
					script.parentNode.removeChild(script);
				}
			}
		};
		if (!head) {
			head = document.getElementsByTagName('head')[0];
		}
		head.appendChild(script);
	}

	function encode(str) {
		return encodeURIComponent(str);
	}

	function jsonp(url, params, callback, callbackName) {
		var query = (((url || '').indexOf('?') === -1) ? '?' : '&'), key, uniqueName = callbackName + "_json" + (counter += 1);
		callbackName = (callbackName || config.callbackName || 'callback');
		params = params || {};
		for (key in params) {
			if (params.hasOwnProperty(key)) {
				query += encode(key) + "=" + encode(params[key]) + "&";
			}
		}
		window[uniqueName] = function (data) {
			callback(data);
			try {
				delete window[uniqueName];
			} catch (e) {}
			window[uniqueName] = null;
		};
		load(url + query + callbackName + '=' + uniqueName);
		return uniqueName;
	}

	function setDefaults(obj) {
		config = obj;
	}
	return {
		get: jsonp,
		init: setDefaults
	};
}());
