"use strict"

// headers contains the default header settings
// on extension load, overwrites values with saved settings 
let headers = {
	disableAuth: false,
	disableRef: false,
	enableDNT: false,
	refererXorigin: 0,
	refererTrimming: 0,
	spoofAcceptEnc: false,
	spoofAcceptLang: false,
	spoofAcceptLangValue: "",
	spoofEtag: false,
	spoofSourceRef: false,
	spoofVia: false,
	spoofViaValue: 0,
	spoofXFor: false,
	spoofXForValue: 0,
	viaIP: "",
	xforwardedforIP: "",
	useragent: ""
};

// spoof contains functions that return js to inject
// also contains the profileResolution to persist profile resolution
let spoof = {
	dnt: function () {
		return `Object.defineProperty(navigator, "doNotTrack", { get: function() { return true; }});\n`;
	},
	name: function () {
		return `Object.defineProperty(window, "name", { get: function() { return ""; }});\n`;
	},
	navigator: function (url) {
		if (whitelist.enabled && whitelisted(url)) {
			return `Object.defineProperty(navigator, "appCodeName", { get: function () { return "${whitelist.profile.appCodeName}"; }});
			\ Object.defineProperty(navigator, "appName", { get: function () { return "${whitelist.profile.appName}"; }});
			\ Object.defineProperty(navigator, "appVersion", { get: function () { return "${whitelist.profile.appVersion}"; }});
			\ Object.defineProperty(navigator, "hardwareConcurrency", { get: function () { return ${whitelist.profile.hardwareConcurrency}; }});
			\ Object.defineProperty(navigator, "oscpu", { get: function () { return "${whitelist.profile.osCPU}"; }});
			\ Object.defineProperty(navigator, "platform", { get: function () { return "${whitelist.profile.platform}"; }});
			\ Object.defineProperty(navigator, "vendor", { get: function () { return "${whitelist.profile.vendor}"; }});
			\ Object.defineProperty(navigator, "vendorSub", { get: function () { return "${whitelist.profile.vendorSub}"; }});
			\ Object.defineProperty(navigator, "userAgent", { get: function () { return "${whitelist.profile.useragent}"; }});
			\n`
		}

		var appVersion, hardwareConcurrency, oscpu, platform, vendor;

		if (headers.useragent.match(/Win/)) {
			oscpu = headers.useragent.match(/(Windows .*?);/)[1];
			platform = "Win64";
			hardwareConcurrency = 4;
			vendor = "";
			appVersion = headers.useragent.match(/Firefox/) ? "5.0 (Windows)" : headers.useragent.match(/Mozilla\/(.*)/)[1];
		} else if (headers.useragent.match(/OS X 10(_|\.)/)) {
			oscpu = headers.useragent.match(/(Intel Mac OS X 10(_|\.)\d+)/)[0].replace("_",".");
			platform = "MacIntel";
			hardwareConcurrency = 4;
			vendor = "Apple Computer, Inc";
			appVersion = headers.useragent.match(/Firefox/) ? "5.0 (Macintosh)": headers.useragent.match(/Mozilla\/(.*)/)[1];
		} else if (headers.useragent.match(/X11/)) {
			platform = oscpu = "Linux x86_64";
			hardwareConcurrency = 4;
			appVersion = headers.useragent.match(/Firefox/) ? "5.0 (X11)": headers.useragent.match(/Mozilla\/(.*)/)[1];
		} else if (headers.useragent.match(/iPhone/)) {
			platform = "iPhone";
			vendor = "Apple Computer, Inc";
			hardwareConcurrency = 2;
		} else if (headers.useragent.match(/iPad/)) {
			platform = "iPad";
			vendor = "Apple Computer, Inc";
			hardwareConcurrency = 2;
		} else if (headers.useragent.match(/Android/)) {
			platform = "Linux armv7l";
			vendor = "Google Inc";
			hardwareConcurrency = 1;
			appVersion = headers.useragent.match(/Firefox/) ? "5.0 (Android)": headers.useragent.match(/Mozilla\/(.*)/)[1];
		}

		return `Object.defineProperty(navigator, "userAgent", { get: function () { return "${headers.useragent}"; }});
		\ Object.defineProperty(navigator, "platform", { get: function () { return "${platform}"; }});
		\ Object.defineProperty(navigator, "hardwareConcurrency", { get: function () { return ${hardwareConcurrency}; }});
		\ Object.defineProperty(navigator, "oscpu", { get: function () { return "${oscpu}"; }});
		\ Object.defineProperty(navigator, "vendor", { get: function () { return "${vendor}"; }});
		\ Object.defineProperty(navigator, "vendorSub", { get: function () { return ""; }});
		\ Object.defineProperty(navigator, "appVersion", { get: function () { return "${appVersion}"; }});
		\n`;
	},
	profileResolution: "",
	screen: function(screenSize) {
		var width, height;
		var depth = 24;

		if (screenSize == "profile") {
			if (spoof.profileResolution != "") {
				var s = spoof.profileResolution.split("x");
				width = parseInt(s[0]);
				height = parseInt(s[1]);
			} else {
				var screenData = getScreenResolution(headers.useragent);
				width = screenData[0];
				height = screenData[1];
				depth = screenData[2];
			}
		} else {
			var s = screenSize.split("x");
			width = parseInt(s[0]);
			height = parseInt(s[1]);
		}

		return `Object.defineProperty(screen,"width", { get: function () { return ${width}; }});
		\ Object.defineProperty(screen,"height", { get: function () { return ${height}; }});
		\ Object.defineProperty(window,"outerWidth", { get: function () { return ${width}; }});
		\ Object.defineProperty(window,"outerHeight", { get: function () { return ${height}; }});
		\ Object.defineProperty(window,"innerWidth", { get: function () { return ${width}; }});
		\ Object.defineProperty(window,"innerHeight", { get: function () { return ${height}; }});
		\ Object.defineProperty(screen,"availWidth", { get: function () { return ${width}; }});
		\ Object.defineProperty(screen,"availHeight", { get: function () { return ${height}; }});
		\ Object.defineProperty(screen,"top", { get: function () { return 0; }});
		\ Object.defineProperty(screen,"left", { get: function () { return 0; }});
		\ Object.defineProperty(screen,"availTop", { get: function () { return 0; }});
		\ Object.defineProperty(screen,"availLeft", { get: function () { return 0; }});
		\ Object.defineProperty(screen,"colorDepth", { get: function () { return ${depth}; }});
		\ Object.defineProperty(screen,"pixelDepth", { get: function () { return ${depth}; }});
		\ Object.defineProperty(document.documentElement, "clientWidth", { get: function () { return ${width}; }});
		\ Object.defineProperty(document.documentElement, "clientHeight", { get: function () { return ${height}; }});
		\n`;
	},
	websocket: function () {
		return `WebSocket = undefined;\n MozWebSocket = undefined;\n`;
	}
};

// whitelist contains default whitelist settings, functions similarly to headers
let whitelist = {
	enabled: false,
	profile: {
		acceptEnc: "",
		acceptLang: "",
		appCodeName: "",
		appName: "",
		appVersion: "",
		hardwareConcurrency: 4,
		osCPU: "",
		platform: "",
		useragent: "",
		vendor: "",
		vendorSub: "" 
	},
	urlList: []
};

// builds script to inject into pages
async function buildInjectScript(url, sendResponse) {
	let injectEnabled = await get("enableScriptInjection");
	let ss = await get("screenSize");
	let useragentType = await get("useragent");
	let scriptText = "";

	if (injectEnabled || (whitelist.enabled && whitelisted(url))) {
		if (await get("protectWinName")) scriptText += spoof.name();
		if (await get("disableWebSockets")) scriptText += spoof.websocket();
			
		if (useragentType != "custom" ) {
			scriptText += spoof.navigator(url);
		}

		if (ss != undefined && ss != "default") {
			scriptText += spoof.screen(ss); 
		}

		if (headers.enableDNT) {
			scriptText += spoof.dnt();
		}
	}

	sendResponse({ script: scriptText });
}

// activates timer for new profile page
function changeTimer(duration) {
	chrome.alarms.clear("profile");
	
	let task = {when: Date.now() + 250};

	if (duration > 0) {
		task["periodInMinutes"] = duration;
	}
	
	chrome.alarms.create("profile", task);
}

// generates an IP address for spoofed headers
function generateByte() {
	var num = Math.floor(Math.random() * (256));
	return (num === 10 || num === 172 || num === 192) ? generateByte() : num;
}

// gets screen resolution & depths from user agent
function getScreenResolution(ua) {
	var screens;
	var depth = 24; // both color and pixel depth

	if (ua.match(/Win/) || ua.match(/X11/)) {
		screens = [
			[1366, 768],
			[1400, 1050],
			[1440, 900],
			[1600, 900],
			[1920, 1080],
			[1920, 1200],
			[2560, 1440],
			[2560, 1600]
		];
	} else if (ua.match(/OS X 10/)) {
		screens = [
			[1920, 1080],
			[2560, 1440],
			[2560, 1600]
		];
	} else if (ua.match(/iPhone/)) {
		screens = [
			[414, 736],
			[375, 667]
		];
		depth = 32;
	} else if (ua.match(/iPad/)) {
		screens = [
			[1024, 768]
		];
		depth = 32;
	} else if (ua.match(/Android/)) {
		screens = [
			[360, 740],
			[411, 731],
			[480, 853]
		];
		depth = 32;
	}

	var num = Math.floor(Math.random() * screens.length);

	return [screens[num][0], screens[num][1], depth];
}

// wrapper for storage API to use with async function
function get(key) {
	return new Promise((resolve) => {
		chrome.storage.local.get(key, (item) => {
			key ? resolve(item[key]) : resolve(item);
		});
	});
}

// rewrite headers per request 
function rewriteHeaders(e) {
	e.requestHeaders.forEach(function(header){
		if (header.name.toLowerCase() == "authorization") {
			if (headers.disableAuth) header.value = "";
		} else if (header.name.toLowerCase() == "referer") {
			if (headers.disableRef) {
				header.value = "";
			} else if (headers.spoofSourceRef) {
				header.value = e.url;
			} else {
				// check referer policies
				if (headers.refererXorigin >= 1) {
					var url = new URL(e.url);
					var ref = new URL(header.value);

					if (headers.refererXorigin == 1) {
						if (url.hostname.split('.').splice(-2).join(".") != ref.hostname.split('.').splice(-2).join(".")) {
							header.value = "";
						}
					} else {
						if (url.origin != ref.origin) {
							header.value = "";
						}
					}
				}

				if (headers.refererTrimming >= 1) {
					if (header.value != "") {
						var url = new URL(header.value);
						header.value = (headers.refererTrimming == 1) ? (url.origin + url.pathname) : url.origin;
					}
				}
			}
		} else if (header.name.toLowerCase() == "if-none-match") {
			if (headers.spoofEtag) header.value = (Math.random() * 10).toString(36).substr(2, Math.random() * (10 - 5 + 1) + 5);
		} else if (header.name.toLowerCase() == "user-agent") {
			if (whitelist.enabled && whitelisted(e.url)) {
				header.value = whitelist.profile.useragent;
			} else {
				if (headers.useragent) header.value = headers.useragent;
			}
		} else if (header.name.toLowerCase() == "accept-encoding") {
			if (whitelist.enabled && whitelisted(e.url)) {
				header.value = whitelist.profile.acceptEnc;
			} else {
				if (headers.spoofAcceptEnc) header.value = "gzip, deflate";
			}
		} else if (header.name.toLowerCase() === "accept-language") {
			if (whitelist.enabled && whitelisted(e.url)) {
				header.value = whitelist.profile.acceptLang;
			} else {
				if (headers.spoofAcceptLang) header.value = headers.spoofAcceptLangValue;
			}
		}
	});

	let dntIndex = e.requestHeaders.findIndex(h => h.name.toLowerCase() == "dnt");
	if (headers.enableDNT) {
		if (dntIndex == -1) e.requestHeaders.push({ name: "DNT", value: "1"});
	} else {
		e.requestHeaders.splice(dntIndex, 1);
	}

	if (headers.spoofVia) {
		if (headers.spoofViaValue == 1) {
			e.requestHeaders.push({ name: "Via", value: "1.1 " + headers.viaIP });
		} else {
			e.requestHeaders.push({ name: "Via", value: "1.1 " + `${generateByte()}.${generateByte()}.${generateByte()}.${generateByte()}` });
		}
	}

	if (headers.spoofXFor) {
		if (headers.spoofXForValue == 1) {
			e.requestHeaders.push({ name: "X-Forwarded-For", value: headers.xforwardedforIP })
		} else {
			e.requestHeaders.push({ name: "X-Forwarded-For", value: `${generateByte()}.${generateByte()}.${generateByte()}.${generateByte()}` });
		}
	}

	return { requestHeaders: e.requestHeaders };
}

// determines useragent and screen resolution when new task created
async function start() {
	// pick new useragent
	let useragents = {};
	let useragentType = await get('useragent');

	if (useragentType == undefined || useragentType == "real"){
		// real profile
		headers.useragent = "";
	} else if (useragentType.match(/.*?\d/) || useragentType == "custom") {
		headers.useragent = await get('useragentValue');
	} else if (useragentType.match(/random_/)) {
		let platform = useragentType.split('_')[1];

		useragents = await get('useragents');
		headers.useragent = useragents[platform][Math.floor(Math.random() * useragents[platform].length)].ua;
	} else if (useragentType == "random") {
		// random useragent
		useragents = await get('useragents');

		let platforms = Object.keys(useragents);
		let platform = platforms[Math.floor(Math.random() * platforms.length)];

		headers.useragent = useragents[platform][Math.floor(Math.random() * useragents[platform].length)].ua;
	} else if (useragentType == "randomDesktop") {
		// random desktop useragent

		let platforms = ["windows", "macos", "linux"];
		let platform = platforms[Math.floor(Math.random() * platforms.length)];

		useragents = await get('useragents');
		headers.useragent = useragents[platform][Math.floor(Math.random() * useragents[platform].length)].ua;
	} else if (useragentType == "randomMobile") {
		// random mobile useragent

		let platforms = ["ios", "android"];
		let platform = platforms[Math.floor(Math.random() * platforms.length)];

		useragents = await get('useragents');
		headers.useragent = useragents[platform][Math.floor(Math.random() * useragents[platform].length)].ua;
	}

	if (await get("screenSize") == "profile") {
		var screenData = getScreenResolution(headers.useragent);
		spoof.profileResolution = `${screenData[0]}x${screenData[1]}`;
	}
	
	if (headers.useragent && await get('notificationsEnabled')) {
		chrome.notifications.create({
			"type": "basic",
			"title": "Chameleon",
			"message": "Browser Profile Changed\r\n" + headers.useragent
		});
	}
}

// check if a url is whitelisted, prevents script injection
function whitelisted(url) {
	if (url) {
		for (var u of whitelist.urlList) {
			if (url.indexOf(u.url) > -1) {
				return true;
			}
		}
		return false;
	}
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.action == "inject") {
		buildInjectScript(sender.url, sendResponse)
		return true;
	} else if (request.action == "interval") {
		chrome.storage.local.set({interval: request.data });
		changeTimer(request.data);
	} else if (request.action == "headers") {
		var tmp = {};

		tmp[request.data.key] = request.data.value;
		headers[request.data.key] = request.data.value;

		chrome.storage.local.set(tmp);
	} else if (request.action == "option") {
		if (request.data.key == "enableTrackingProtection") {
			chrome.privacy.websites.trackingProtectionMode.set({
				"value": request.data.value ? "always" : "never"
			});
		} else if (request.data.key == "cookieConfig") {
			chrome.privacy.websites[request.data.key].set({
				"value": {
					behavior: request.data.value
				}
			});
		} else if (request.data.key == "firstPartyIsolate" ||
				   request.data.key == "resistFingerprinting") {
			chrome.privacy.websites[request.data.key].set({
				"value": request.data.value
			});
		} else {
			var tmp = {};

			tmp[request.data.key] = request.data.value;
			chrome.storage.local.set(tmp);
		}
	} else if (request.action == "storage") {
		var tmp = {};

		tmp[request.data.key] = request.data.value;
		chrome.storage.local.set(tmp);

		if (request.data.key == "useragent") {
			if (request.data.value == "real") {
				chrome.browserAction.setIcon({
					path: "img/icon_disabled_48.png"
				});
			} else {
				chrome.browserAction.setIcon({
					path: "img/icon_48.png"
				});
			}
		}
	} else if (request.action == "whitelist") {
		var tmp = {};

		tmp[request.data.key] = request.data.value;
		chrome.storage.local.set(tmp);

		if (request.data.key == "enableWhitelist") {
			whitelist.enabled = request.data.value;
		} else if (request.data.key.match(/wl_/)) {
			whitelist[request.data.key.slice(3)] = request.data.value;
		} else {
			whitelist.urlList = JSON.parse(request.data.value);
		}
	}
});

chrome.webRequest.onBeforeSendHeaders.addListener(
	rewriteHeaders, {
		urls: ["<all_urls>"]
	}, ["blocking", "requestHeaders"]
);

chrome.alarms.onAlarm.addListener(function(alarm) {
	start();
});

// when extension is loaded, load settings and start new task
(async function init(){
	let data = await get(null);

	Object.keys(headers).forEach(key => {
		if (data[key] != undefined && key != "useragent") {
			headers[key] = data[key];
		}
	});

	if (data.useragent == "real") {
		chrome.browserAction.setIcon({
			path: "img/icon_disabled_48.png"
		});
	}

	if (data.enableWhitelist) {
		whitelist.enabled = true;
	}

	Object.keys(whitelist.profile).forEach(key => {
		whitelist.profile[key] = data[`wl_${key}`];
	});

	if (data.wl_urls) {
		whitelist.urlList = JSON.parse(data.wl_urls);
	}

	changeTimer(data.interval);
})();
