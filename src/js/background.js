"use strict"

// store chameleon settings
let chameleon = {
	headers: {
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
		viaIP_profile: "",
		xforwardedforIP: "",
		xforwardedforIP_profile: "",
		useragent: ""
	},
	excluded: {
		win: [false,false,false,false,false,false,false,false,false,false,false,false],
		mac: [false,false,false,false,false,false,false],
		linux: [false,false,false,false,false,false,false,false,false],
		ios: [false,false,false,false,false,false,false,false,false],
		android: [false,false,false,false,false,false,false,false]
	},
	settings: {
		disableWebSockets: false,
		enableScriptInjection: false,
		interval: 0,
		notificationsEnabled: false,
		protectWinName: false,
		screenSize: "default",
		useragent: "real",
		useragentValue: ""
	},
	whitelist: {
		enabled: false,
		enableRealProfile: false,
		profile: {
			acceptEnc: "",
			acceptLang: "",
			appCodeName: "",
			appName: "",
			appVersion: "",
			hardwareConcurrency: 4,
			osCPU: "",
			platform: "",
			productSub: "",
			useragent: "",
			vendor: "",
			vendorSub: ""
		},
		urlList: []
	}
}

// spoof contains functions that return js to inject
// also contains the profileResolution to persist profile resolution
let spoof = {
	dnt: function (injectionArray) {
		injectionArray.push({ obj: "window.navigator", prop: "doNotTrack", value: true });
		return injectionArray;
	},
	name: function (injectionArray) {
		injectionArray.push({ obj: "window", prop: "name", value: "" });
		return injectionArray;
	},
	navigator: function (url, injectionArray) {
		if (chameleon.whitelist.enabled && whitelisted(url)) {
			injectionArray.push(...[
				{ obj: "window.navigator", prop: "appCodeName", value: chameleon.whitelist.profile.appCodeName },
				{ obj: "window.navigator", prop: "appName", value: chameleon.whitelist.profile.appName },
				{ obj: "window.navigator", prop: "appVersion", value: chameleon.whitelist.profile.appVersion },
				{ obj: "window.navigator", prop: "hardwareConcurrency", value: chameleon.whitelist.profile.hardwareConcurrency },
				{ obj: "window.navigator", prop: "oscpu", value: chameleon.whitelist.profile.osCPU },
				{ obj: "window.navigator", prop: "platform", value: chameleon.whitelist.profile.platform },
				{ obj: "window.navigator", prop: "vendor", value: chameleon.whitelist.profile.vendor },
				{ obj: "window.navigator", prop: "vendorSub", value: chameleon.whitelist.profile.vendorSub },
				{ obj: "window.navigator", prop: "userAgent", value: chameleon.whitelist.profile.useragent },
				{ obj: "window.navigator", prop: "productSub", value: chameleon.whitelist.profile.productSub },
			]);
			return injectionArray;
		}

		var appVersion, hardwareConcurrency, oscpu, platform, productSub, vendor;

		if (chameleon.headers.useragent.match(/Win/)) {
			oscpu = chameleon.headers.useragent.match(/(Windows .*?);/)[1];
			platform = "Win64";
			hardwareConcurrency = 4;
			vendor = "";
			appVersion = headers.useragent.match(/Firefox/) ? "5.0 (Windows)" :chameleon.headers.useragent.match(/Mozilla\/(.*)/)[1];
		} else if (chameleon.headers.useragent.match(/OS X 10(_|\.)/)) {
			oscpu = chameleon.headers.useragent.match(/(Intel Mac OS X 10(_|\.)\d+)/)[0].replace("_",".");
			platform = "MacIntel";
			hardwareConcurrency = 4;
			vendor = "Apple Computer, Inc";
			appVersion = chameleon.headers.useragent.match(/Firefox/) ? "5.0 (Macintosh)": chameleon.headers.useragent.match(/Mozilla\/(.*)/)[1];
		} else if (chameleon.headers.useragent.match(/X11/)) {
			platform = oscpu = "Linux x86_64";
			hardwareConcurrency = 4;
			appVersion = chameleon.headers.useragent.match(/Firefox/) ? "5.0 (X11)": chameleon.headers.useragent.match(/Mozilla\/(.*)/)[1];
		} else if (chameleon.headers.useragent.match(/iPhone/)) {
			platform = "iPhone";
			vendor = "Apple Computer, Inc";
			hardwareConcurrency = 2;
		} else if (chameleon.headers.useragent.match(/iPad/)) {
			platform = "iPad";
			vendor = "Apple Computer, Inc";
			hardwareConcurrency = 2;
		} else if (chameleon.headers.useragent.match(/Android/)) {
			platform = "Linux armv7l";
			vendor = "Google Inc";
			hardwareConcurrency = 1;
			appVersion = chameleon.headers.useragent.match(/Firefox/) ? "5.0 (Android)": chameleon.headers.useragent.match(/Mozilla\/(.*)/)[1];
		}

		if (chameleon.headers.useragent.match(/Firefox/)) {
			productSub = "20010725";
		} else if (chameleon.headers.useragent.match(/Chrome/) || chameleon.headers.useragent.match(/Safari/)) {
			productSub = "20030107";
		} else if (chameleon.headers.useragent.match(/IE/)) {
			productSub = null;
		} else {
			productSub = "";
		}

		injectionArray.push(...[
				{ obj: "window.navigator", prop: "userAgent", value: chameleon.headers.useragent },
				{ obj: "window.navigator", prop: "platform", value: platform },
				{ obj: "window.navigator", prop: "productSub", value: productSub },
				{ obj: "window.navigator", prop: "hardwareConcurrency", value: hardwareConcurrency },
				{ obj: "window.navigator", prop: "oscpu", value: oscpu },
				{ obj: "window.navigator", prop: "vendor", value: vendor },
				{ obj: "window.navigator", prop: "vendorSub", value: "" },
				{ obj: "window.navigator", prop: "appVersion", value: appVersion },
			]);
		return injectionArray;
	},
	profileResolution: "",
	screen: function(screenSize, injectionArray) {
		var width, height;
		var depth = 24;

		if (screenSize == "profile") {
			if (spoof.profileResolution != "") {
				var s = spoof.profileResolution.split("x");
				width = parseInt(s[0]);
				height = parseInt(s[1]);
			} else {
				var screenData = getScreenResolution(chameleon.headers.useragent);
				width = screenData[0];
				height = screenData[1];
				depth = screenData[2];
			}
		} else {
			var s = screenSize.split("x");
			width = parseInt(s[0]);
			height = parseInt(s[1]);
		}

		injectionArray.push(...[
				{ obj: "window.screen", prop: "width", value: width },
				{ obj: "window.screen", prop: "height", value: height },
				{ obj: "window.screen", prop: "outerWidth", value: width },
				{ obj: "window.screen", prop: "outerHeight", value: height },
				{ obj: "window.screen", prop: "innerWidth", value: width },
				{ obj: "window.screen", prop: "innerHeight", value: height },
				{ obj: "window.screen", prop: "availWidth", value: width },
				{ obj: "window.screen", prop: "availHeight", value: height },
				{ obj: "window.screen", prop: "top", value: 0 },
				{ obj: "window.screen", prop: "left", value: 0 },
				{ obj: "window.screen", prop: "availTop", value: 0 },
				{ obj: "window.screen", prop: "availLeft", value: 0 },
				{ obj: "window.screen", prop: "colorDepth", value: depth },
				{ obj: "window.screen", prop: "pixelDepth", value: depth },
				{ obj: "window.document.documentElement", prop: "clientWidth", value: width },
				{ obj: "window.document.documentElement", prop: "clientHeight", value: height },
			]);
		return injectionArray;
	},
	websocket: function () {
		return `WebSocket = undefined;\n MozWebSocket = undefined;\n`;
	}
};

// builds script to inject into pages
async function buildInjectScript(url, sendResponse) {
	let injectionArray = [];
	let scriptText = "";

	if (chameleon.settings.enableScriptInjection || (chameleon.whitelist.enabled && whitelisted(url))) {
		if (chameleon.settings.enableWhitelistRealProfile && chameleon.whitelist.enabled && whitelisted(url)) return;
		if (chameleon.settings.protectWinName) injectionArray = spoof.name(injectionArray);
		if (chameleon.settings.disableWebSockets) scriptText += spoof.websocket(scriptText);
			
		if (chameleon.settings.useragent != "custom" ) {
			injectionArray = spoof.navigator(url, injectionArray);
		}

		if (chameleon.settings.screenSize != "default") {
			injectionArray = spoof.screen(chameleon.settings.screenSize, injectionArray);
		}

		if (chameleon.headers.enableDNT) {
			injectionArray = spoof.dnt(injectionArray);
		}
	}

	sendResponse({
		script: scriptText,
		injection: JSON.stringify(injectionArray)
	});
}

// activates timer for new profile
function changeTimer() {
	chrome.alarms.clear("profile");
	
	let task = {when: Date.now() + 250};

	if (chameleon.settings.interval) {
		task["periodInMinutes"] = chameleon.settings.interval;
	}
	
	chrome.alarms.create("profile", task);
}

// generates a number for ip address
function generateByte() {
	var num = Math.floor(Math.random() * (256));
	return (num === 10 || num === 172 || num === 192) ? generateByte() : num;
}

// wrappers for storage API to use with async function
function get(key) {
	return new Promise((resolve) => {
		chrome.storage.local.get(key, (item) => {
			typeof key == "string" ? resolve(item[key]) : resolve(item);
		});
	});
}

// fitler excluded profiles
function filterProfiles(uaList) {
	let uas = [];

	for (var i in uaList) {
		let key = uaList[i].value.match(/([a-z]+)(\d+)/);
		let index = parseInt(key[2]);
		if (!chameleon.excluded[key[1]][index - 1]) {
			uas.push(uaList[i]);
		}
	}

	return uas.length ? uas : [""];
}

// rewrite headers per request 
function rewriteHeaders(e) {
	e.requestHeaders.forEach(function(header){
		if (header.name.toLowerCase() == "authorization") {
			if (chameleon.headers.disableAuth) header.value = "";
		} else if (header.name.toLowerCase() == "referer") {
			if (chameleon.headers.disableRef) {
				header.value = "";
			} else if (chameleon.headers.spoofSourceRef) {
				header.value = e.url;
			} else {
				// check referer policies
				if (chameleon.headers.refererXorigin >= 1) {
					var url = new URL(e.url);
					var ref = new URL(header.value);

					if (chameleon.headers.refererXorigin == 1) {
						if (url.hostname.split('.').splice(-2).join(".") != ref.hostname.split('.').splice(-2).join(".")) {
							header.value = "";
						}
					} else {
						if (url.origin != ref.origin) {
							header.value = "";
						}
					}
				}

				if (chameleon.headers.refererTrimming >= 1) {
					if (header.value != "") {
						var url = new URL(header.value);
						header.value = (chameleon.headers.refererTrimming == 1) ? (url.origin + url.pathname) : url.origin;
					}
				}
			}
		} else if (header.name.toLowerCase() == "if-none-match") {
			if (chameleon.headers.spoofEtag) header.value = (Math.random() * 10).toString(36).substr(2, Math.random() * (10 - 5 + 1) + 5);
		} else if (header.name.toLowerCase() == "user-agent") {
			if (chameleon.whitelist.enabled && whitelisted(e.url)) {
				if (!chameleon.whitelist.enableRealProfile) header.value = chameleon.whitelist.profile.useragent;
			} else {
				if (chameleon.headers.useragent) header.value = chameleon.headers.useragent;
			}
		} else if (header.name.toLowerCase() == "accept-encoding") {
			if (chameleon.whitelist.enabled && whitelisted(e.url)) {
				if (!chameleon.whitelist.enableRealProfile) header.value = chameleon.whitelist.profile.acceptEnc;
			} else {
				if (chameleon.headers.spoofAcceptEnc) header.value = "gzip, deflate";
			}
		} else if (header.name.toLowerCase() === "accept-language") {
			if (chameleon.whitelist.enabled && whitelisted(e.url)) {
				if (!chameleon.whitelist.enableRealProfile) header.value = chameleon.whitelist.profile.acceptLang;
			} else {
				if (chameleon.headers.spoofAcceptLang) header.value = chameleon.headers.spoofAcceptLangValue;
			}
		}
	});

	let dntIndex = e.requestHeaders.findIndex(h => h.name.toLowerCase() == "dnt");
	if (chameleon.headers.enableDNT) {
		if (dntIndex == -1) e.requestHeaders.push({ name: "DNT", value: "1"});
	} else {
		e.requestHeaders.splice(dntIndex, 1);
	}

	if (chameleon.headers.spoofVia) {
		if (chameleon.headers.spoofViaValue == 1) {
			e.requestHeaders.push({ name: "Via", value: "1.1 " + chameleon.headers.viaIP });
		} else {
			e.requestHeaders.push({ name: "Via", value: "1.1 " + chameleon.headers.viaIP_profile });
		}
	}

	if (chameleon.headers.spoofXFor) {
		if (chameleon.headers.spoofXForValue == 1) {
			e.requestHeaders.push({ name: "X-Forwarded-For", value: chameleon.headers.xforwardedforIP })
		} else {
			e.requestHeaders.push({ name: "X-Forwarded-For", value: chameleon.headers.xforwardedforIP_profile });
		}
	}

	return { requestHeaders: e.requestHeaders };
}

// determines useragent and screen resolution when new task created
async function start() {
	// pick new useragent
	if (chameleon.settings.useragent == "" || chameleon.settings.useragent == "real"){
		// real profile
		chameleon.headers.useragent = "";
	} else if (chameleon.settings.useragent.match(/.*?\d/) || chameleon.settings.useragent == "custom") {
		chameleon.headers.useragent = chameleon.settings.useragentValue;
	} else if (chameleon.settings.useragent.match(/random_/)) {
		let uas = filterProfiles(uaList[chameleon.settings.useragent.split('_')[1]]);

		chameleon.headers.useragent = uas[Math.floor(Math.random() * uas.length)].ua;
	} else if (chameleon.settings.useragent == "random") {
		// random useragent
		let uas = filterProfiles(uaList.windows.concat(
			uaList.macos,
			uaList.linux,
			uaList.ios,
			uaList.android
		));

		chameleon.headers.useragent = uas[Math.floor(Math.random() * uas.length)].ua;
	} else if (chameleon.settings.useragent == "randomDesktop") {
		// random desktop useragent
		let uas = filterProfiles(uaList.windows.concat(
			uaList.macos,
			uaList.linux
		));

		chameleon.headers.useragent = uas[Math.floor(Math.random() * uas.length)].ua;
	} else if (chameleon.settings.useragent == "randomMobile") {
		// random mobile useragent
		let uas = filterProfiles(uaList.ios.concat(uaList.android));

		chameleon.headers.useragent = uas[Math.floor(Math.random() * uas.length)].ua;
	}

	if (chameleon.settings.screenSize == "profile") {
		var screenData = getScreenResolution(chameleon.headers.useragent);
		spoof.profileResolution = `${screenData[0]}x${screenData[1]}`;
	}
	
	chameleon.headers.viaIP_profile = chameleon.headers.xforwardedforIP_profile = `${generateByte()}.${generateByte()}.${generateByte()}.${generateByte()}`;

	if (chameleon.headers.useragent && chameleon.settings.notificationsEnabled) {
		chrome.notifications.create({
			"type": "basic",
			"title": "Chameleon",
			"message": "Browser Profile Changed\r\n" + chameleon.headers.useragent
		});
	}
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

function save(obj) {
	return new Promise((resolve) => {
	    chrome.storage.local.set(obj, () => {
	        resolve();
	    });
	});
}

async function saveSettings(setting="all") {
	if (setting == "all") {
		await save({ headers: chameleon.headers});
		await save({ whitelist: chameleon.whitelist});
		await save({ excluded: chameleon.excluded});
		await save({ settings: chameleon.settings});
	} else {
		var tmp = {};
		tmp[setting] = chameleon[setting];
		await save(tmp);
	}
}

// check if a url is whitelisted, prevents script injection
function whitelisted(url) {
	if (url) {
		for (var u of chameleon.whitelist.urlList) {
			if (url.indexOf(u.url) > -1) {
				return true;
			}
		}
	}

	return false;
}

// initialize settings
function init(data) {
	["headers", "excluded", "settings", "whitelist"].forEach(opt => {
		Object.keys(chameleon[opt]).forEach(key => {
			if (data[opt][key] != undefined) chameleon[opt][key] = data[opt][key];
		})
	});

	// missed this from v0.6.X
	if (data.useragents) chrome.storage.local.remove("useragents");
}

// migrate users from prev version
function migrate(data) {
	// migrate settings
	["disableWebSockets", "enableScriptInjection", "interval", "notificationsEnabled",
	  "screenSize", "useragent", "useragentValue"].forEach((key) => {
		if (data[key] != undefined) {
			chameleon.settings[key] = data[key];
			chrome.storage.local.remove(key);
		}
	});

	// migrate header settings
	["disableAuth", "disableRef", "enableDNT", "refererXorigin", "refererTrimming",
	 "spoofAcceptEnc", "spoofAcceptLang", "spoofAcceptLangValue", "spoofEtag",
	 "spoofSourceRef", "spoofVia", "spoofViaValue", "spoofXFor", "spoofXForValue",
	 "viaIP", "viaIP_profile", "xforwardedforIP", "xforwardedforIP_profile"].forEach((key) => {
		if (data[key] != undefined) {
			chameleon.headers[key] = data[key];
			chrome.storage.local.remove(key);
		}
	});

	// migrate whitelist settings
	["wl_useragent", "wl_acceptEnc", "wl_acceptLang", "wl_appCodeName", "wl_appName",
	 "wl_appVersion", "wl_hardwareConcurrency", "wl_osCPU", "wl_platform",
	 "wl_productSub", "wl_vendor", "wl_vendorSub"].forEach((key) => {
		if (data[key] != undefined) {
			chameleon.whitelist.profile[key.split('_')[1]] = data[key];
			chrome.storage.local.remove(key);
		}
	});

	if (data.enableWhitelist != undefined) chameleon.whitelist.enabled = data.enableWhitelist;
	if (data.enableWhitelistRealProfile != undefined) chameleon.whitelist.enableRealProfile = data.enableWhitelistRealProfile;
	if (data.wl_urls != undefined) chameleon.whitelist.urlList = JSON.parse(data.wl_urls);
	if (data.excluded != undefined) chameleon.excluded = data.excluded;

	chrome.storage.local.remove(["enableWhitelist", "enableWhitelistRealProfile", "wl_urls", "excluded", "useragents"]);
}

/*
	Event Listeners
*/

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.action == "inject") {
		buildInjectScript(sender.url, sendResponse)
		return true;
	} else if (request.action == "exclude") {
		let key = request.data.key.split('_')[1].match(/([a-z]+)(\d+)/);
		let index = parseInt(key[2]);
		chameleon.excluded[key[1]][index - 1] = request.data.value;
		saveSettings("excluded");
	} else if (request.action == "interval") {
		chameleon.settings.interval = request.data;

		changeTimer();
		saveSettings("settings");
	} else if (request.action == "headers") {
		chameleon.headers[request.data.key] = request.data.value;
		saveSettings("headers");
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
			chameleon.settings[request.data.key] = request.data.value;
			saveSettings("settings");
		}
	} else if (request.action == "storage") {
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
		chameleon.settings[request.data.key] = request.data.value;
		saveSettings("settings");
	} else if (request.action == "whitelist") {
		if (request.data.key == "enableWhitelist") {
			chameleon.whitelist.enabled = request.data.value;
		} else if (request.data.key == "enableWhitelistRealProfile") {
			chameleon.whitelist.enableRealProfile = request.data.value;
		} else if (request.data.key == "wl_urls"){
			chameleon.whitelist.urlList = JSON.parse(request.data.value);
		} else if (request.data.key.indexOf("wl_") > -1) {
			chameleon.whitelist.profile[request.data.key.slice(3)] = request.data.value;
		}
		saveSettings("whitelist");
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

/*
	Chameleon Entry Point
*/

(async function run(){
	let data = await get(null);

	// migrate users from v0.6.X to v0.7.0
	if (data.version == undefined) {
		migrate(data);
		saveSettings();
	} else {
		init(data);
	}

	if (chameleon.settings.useragent == "real") {
		chrome.browserAction.setIcon({
			path: "img/icon_disabled_48.png"
		});
	}

	await save({ version: "v0.7.0"});
	changeTimer();
})();