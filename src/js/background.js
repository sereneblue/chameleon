"use strict"

// store chameleon settings
let chameleon = {
	headers: {
		blockEtag: false,
		disableAuth: false,
		disableRef: false,
		enableDNT: false,
		refererXorigin: 0,
		refererTrimming: 0,
		spoofAccept: false,
		spoofAcceptLang: false,
		spoofAcceptLangValue: "",
		spoofSourceRef: false,
		spoofVia: false,
		spoofViaValue: 0,
		spoofXFor: false,
		spoofXForValue: 0,
		upgradeInsecureRequests: false,
		viaIP: "",
		viaIP_profile: "",
		xforwardedforIP: "",
		xforwardedforIP_profile: "",
		useragent: ""
	},
	ipRules: [],
	excluded: {
		win: [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
		mac: [false,false,false,false,false,false,false,false],
		linux: [false,false,false,false,false,false,false,false,false,false,false],
		ios: [false,false,false,false,false,false,false,false,false],
		android: [false,false,false,false,false,false,false,false,false],
		all: [false, false, false, false, false]
	},
	injection: null,
	ipInfo: {
		update: 0,
		language: "",
		timezone: ""
	},
	settings: {
		customScreen: "",
		enableScriptInjection: false,
		interval: 0,
		kbDelay: 0,
		limitHistory: false,
		minInterval: null,
		maxInterval: null,
		notificationsEnabled: false,
		protectKeyboardFingerprint: false,
		protectWinName: false,
		screenSize: "default",
		spoofAudioContext: false,
		spoofClientRects: false,
		timeZone: "default",
		useragent: "real",
		useragentValue: "",
		webSockets: "allow_all"
	},
	timeout: null,
	version: "0.12.11",
	whitelist: {
		enabled: false,
		enabledContextMenu: false,
		defaultProfile: "none",
		urlList: []
	}
}

let defaultSettings = JSON.parse(JSON.stringify(chameleon));
let customIntervalTimer = null;
let tooltipData = {};

// builds script to inject into pages
async function buildInjectScript() {
	let injectionProps = {};
	let injectionText = {
		audioContext: "",
		clientRects: "",
		kbFingerprint: "",
		timeSpoof: ""
	};
	let nav = [];	
	let profile = null;

	if (chameleon.settings.useragent != "custom") {
		let foundProfile = profiles.find(p => p.ua == chameleon.headers.useragent);
		profile = foundProfile ? foundProfile.name : "";
	} else {
		profile = "Custom Profile";
	}

	if (chameleon.settings.enableScriptInjection) {
		injectionProps = spoof.name(injectionProps);
		injectionProps = spoof.navigator(chameleon.headers.useragent, injectionProps);

		if (chameleon.settings.limitHistory) injectionProps = spoof.history(injectionProps);
		if (chameleon.settings.protectKeyboardFingerprint) injectionText.kbFingerprint = protectKB(chameleon.settings.kbDelay);
		if (chameleon.settings.spoofAudioContext) injectionText.audioContext = spoofAudioContext(`_${Math.random().toString(36)}`);
		if (chameleon.settings.spoofClientRects) injectionText.clientRects = spoofRects(`_${Math.random().toString(36)}`);

		if (chameleon.settings.screenSize != "default") {
			injectionProps = spoof.screen(
				chameleon.settings.screenSize,
				chameleon.headers.useragent,
				chameleon.settings.useragent,
				chameleon.settings.customScreen,
				injectionProps
			);
		}

		if (chameleon.headers.enableDNT) {
			injectionProps = spoof.dnt(injectionProps);
		}

		if (chameleon.headers.spoofAcceptLang) {
			injectionProps = spoof.language(
				chameleon.headers.spoofAcceptLangValue,
				chameleon.ipInfo.language, 
				injectionProps);
		}

		if (chameleon.settings.timeZone != "default") {
			injectionText.timeSpoof = spoofTime(
				`_${Math.random().toString(36)}`
			);
		}

		// load whitelist profiles
		let wl = JSON.parse(JSON.stringify(chameleon.whitelist));
		wl.injectProfile = {
			screen: [],
			nav: []
		}

		if (wl.defaultProfile != "none") {
			let spoofProfile = profiles.find(p => p.value == wl.defaultProfile);

			// whitelist screen
			wl.injectProfile = spoof.screen(
				"profile",
				spoofProfile.ua, 
				wl.defaultProfile,
				"",
				wl.injectProfile
			);

			// whitelist navigator
			wl.injectProfile = spoof.navigator(
				spoofProfile.ua, 
				wl.injectProfile
			);
		}

		// load profile for each whitelisted option
		for (var i = 0; i < wl.urlList.length; i++) {
			wl.urlList[i].injectProfile = {};

			if (wl.urlList[i].profile && !["default", "real"].includes(wl.urlList[i].profile)) {
				let spoofProfile = profiles.find(p => p.value == wl.urlList[i].profile);

				// whitelist screen
				wl.urlList[i].injectProfile = spoof.screen(
					"profile",
					spoofProfile.ua, 
					wl.urlList[i].profile,
					"",
					wl.urlList[i].injectProfile
				);

				// whitelist navigator
				wl.urlList[i].injectProfile = spoof.navigator(
					spoofProfile.ua, 
					wl.urlList[i].injectProfile
				);
			}
		}

		if (profile && chameleon.settings.notificationsEnabled) {
			let screenRes = injectionProps.screen ? ` / Screen:  ${injectionProps.screen[0].value}x${injectionProps.screen[1].value}` : "";

			chrome.notifications.create({
				"type": "basic",
				"title": "Chameleon",
				"message": `${browser.i18n.getMessage("notificationMessage")}\r\n${profile}${screenRes}`
			});
		}

		return inject(
			injectionProps,
			wl,
			injectionText,
			{
				name : chameleon.settings.protectWinName
			},
			languages,
			chameleon.settings.timeZone == "ip" ? chameleon.ipInfo.timezone : chameleon.settings.timeZone
		);
	}

	if (profile && chameleon.settings.notificationsEnabled) {
		chrome.notifications.create({
			"type": "basic",
			"title": "Chameleon",
			"message": `${browser.i18n.getMessage("notificationMessage")}\r\n${profile}`
		});
	}

	return "";
}

// get ip info from ipapi.co
async function getIPInfo() {
	try {
		let res = await request("https://ipapi.co/json");
		let data = await JSON.parse(res);
		let tzSpoof = "";
		let langSpoof = "";

		if (data.timezone && data.languages || data.ip) {
			// check if in ip rules
			let ruleIndex = (function() {
								for (var i = 0; i < chameleon.ipRules.length; i++) {
									for (var j = 0; j < chameleon.ipRules[i].ip.length; j++) {
										let cidr = new IPCIDR(chameleon.ipRules[i].ip[j]);

										if (cidr.contains(data.ip)) {
											return i;
										}
									}
								}

								return -1;
							})();

			if (ruleIndex > -1) {
				let lang = languages.find(l => l.display == chameleon.ipRules[ruleIndex].lang);

				tzSpoof = `${browser.i18n.getMessage("textTimezone")} UTC${moment().tz(chameleon.ipRules[ruleIndex].tz).format('Z')}`;
				langSpoof = `${browser.i18n.getMessage("textLanguage")}: ${lang.display}`;

				chameleon.ipInfo.timezone = chameleon.ipRules[ruleIndex].tz;
				chameleon.ipInfo.language = lang.value;;
			} else {
				if (!data.timezone && !data.languages) throw "Couldn't find info";
				if (chameleon.settings.timeZone == "ip") {
					tzSpoof = `${browser.i18n.getMessage("textTimezone")}: UTC${moment().tz(data.timezone).format('Z')}`;
					chameleon.ipInfo.timezone = data.timezone;
				}

				if (chameleon.headers.spoofAcceptLangValue == "ip") {
					let responseLanguage = data.languages.split(',')[0];
					let lang = languages.find(l => l.display == "English (US)"); // default value

					if (responseLanguage != "en" && responseLanguage != "en-US") {
						let index = langList.map(l => l[0]).findIndex(l => l.includes(responseLanguage));

						if (index > -1) {
							lang = languages[index];
						} else {
							// check the list again, not restricted to primary language
							let idxs = [];
							for (var i = 0; i < langList.length; i++) {
								let idx = langList[i].findIndex(l => l.includes(responseLanguage) || (l.includes(responseLanguage.split('-')[0]) && responseLanguage.split('-')[0] != "en"));
								if (idx > -1) {
									idxs.push([
										idx > -1,
										i,
										idx
									])
								}
							}
							if (idxs.length) {
								idxs.sort((a,b) => a[2] > b[2]);
								lang = languages[idxs[0][1]];
							}
						}
					}

					langSpoof = ` ${browser.i18n.getMessage("textLanguage")}: ${lang.display}`;
					chameleon.ipInfo.language = lang.value;
				}
			}

			if (chameleon.settings.notificationsEnabled && tzSpoof) {
				chrome.notifications.create({
					"type": "basic",
					"title": "Chameleon",
					"message": `${tzSpoof}${langSpoof}`
				});
			}
			
			return;
		}


		throw "Couldn't find info";
	} catch (e) {
		if (chameleon.settings.notificationsEnabled) {
			chrome.notifications.create({
				"type": "basic",
				"title": "Chameleon",
				"message": browser.i18n.getMessage("notificationMessageTimezone")
			});
		}

		chameleon.ipInfo.timezone = "Etc/UTC";
	}
}

// activates timer for new profile
function changeTimer() {
	chrome.alarms.clear("profile");
	
	let task = {when: Date.now() + 250};

	if (chameleon.settings.interval) {
		if (chameleon.settings.interval == "-1") {
			if (!chameleon.settings.minInterval || !chameleon.settings.maxInterval) return;

			var interval = ((Math.random() *
							(chameleon.settings.maxInterval * 60 * 1000 - chameleon.settings.minInterval  * 60 * 1000)) +
							chameleon.settings.minInterval  * 60 * 1000);

			if (customIntervalTimer) clearTimeout(customIntervalTimer);
			customIntervalTimer = setTimeout(changeTimer, interval);
		} else {
			task["periodInMinutes"] = chameleon.settings.interval;
		}
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

// extract data from useragent data for tooltip
function getTooltipInfo(u) {
	var os, browser, tmp;

	if (u.name.includes('(')) {
		tmp = u.name.match(/^(.*?)\s\((.*?)\)/);
		os = tmp[2];
		browser = tmp[1];
	} else if (u.name.includes('iOS')) {
		tmp = u.name.match(/(iOS.*?\s-\s\w+)\s-\s(.*?)$/);
		os = tmp[1];
		browser = tmp[2];
	} else {
		tmp = u.name.match(/(Android(\s.+)?)\s-\s(.*?)$/);
		os = tmp[1];
		browser = tmp[3];
	}

	return {
		os,
		browser
	}
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

	return uas.length ? uas : [];
}

// make XMLHttpRequest
function request(url) {
  return new Promise(function(resolve, reject) {
	const xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(e) {
	  if (xhr.readyState === 4) {
		if (xhr.status === 200) {
		  resolve(xhr.response)
		} else {
		  reject(xhr.status)
		}
	  }
	}
	xhr.ontimeout = function () {
	  reject('timeout')
	}
	xhr.open('get', url, true)
	xhr.send()
  })
}

// determines useragent and screen resolution when new task created
async function start() {
	var title, uas;

	// pick new useragent
	if (chameleon.settings.useragent == "" || chameleon.settings.useragent == "real"){
		// real profile
		title = "Profile Spoofing Disabled";
		chameleon.headers.useragent = "";
	} else if (/.*?\d+/.test(chameleon.settings.useragent)) {
		// check in case updated user agent
		var regexMatch = chameleon.settings.useragent.match(/(.*?)(\d+)/);
		var plat;

		if (regexMatch[1].includes("win")) {
			plat = "win";
		} else if (regexMatch[1].includes("mac")) {
			plat = "mac";
		} else {
			plat = regexMatch[1];
		}

		let u = uaList[plat].find(u => u.value == chameleon.settings.useragent);
		tooltipData = getTooltipInfo(u);

		chameleon.headers.useragent = u.ua;
	} else if (chameleon.settings.useragent == "custom") {
		tooltipData.os = "Custom";
		tooltipData.browser = "Custom";

		chameleon.headers.useragent = chameleon.settings.useragentValue;
	} else {
		if (/random_/.test(chameleon.settings.useragent)) {
			uas = filterProfiles(uaList[chameleon.settings.useragent.split('_')[1]]);
		} else if (chameleon.settings.useragent == "random") {
			// random useragent
			uas = filterProfiles(uaList.win.concat(
				uaList.mac,
				uaList.linux,
				uaList.ios,
				uaList.android
			));
		} else if (chameleon.settings.useragent == "randomDesktop") {
			// random desktop useragent
			uas = filterProfiles(uaList.win.concat(
				uaList.mac,
				uaList.linux
			));
		} else if (chameleon.settings.useragent == "randomMobile") {
			// random mobile useragent
			uas = filterProfiles(uaList.ios.concat(uaList.android));
		}

		if (uas.length > 0) {
			let u = uas[Math.floor(Math.random() * uas.length)];
			tooltipData = getTooltipInfo(u);
			chameleon.headers.useragent = u.ua;
		} else {
			chameleon.headers.useragent = "";
		}
	}

	let tmpIP = `${generateByte()}.${generateByte()}.${generateByte()}.${generateByte()}`;

	chameleon.headers.viaIP_profile = (chameleon.headers.spoofVia && chameleon.headers.spoofViaValue == 0) ? tmpIP : "";
	chameleon.headers.xforwardedforIP_profile = (chameleon.headers.spoofXFor && chameleon.headers.spoofXForValue == 0) ? tmpIP : "";
	
	title = tooltipData.os ? `Chameleon | ${tooltipData.os} - ${tooltipData.browser}` : "Chameleon";
	let platformInfo = browser.runtime.getPlatformInfo();
	if (platformInfo.os != "android") chrome.browserAction.setTitle({ title });

	saveSettings();
	rebuildInjectionScript();
	toggleContextMenu(chameleon.whitelist.enabledContextMenu);
}

// rebuilds injection script
// uses a small delay before building in case there are multiple function calls in a short period
async function rebuildInjectionScript() {
	clearTimeout(chameleon.timeout);

	chameleon.timeout = setTimeout(async function () {
		if (chameleon.ipInfo.update) {
			chameleon.ipInfo.update = 0;
			await getIPInfo();
		}

		if (chameleon.injection) {
			chameleon.injection.unregister();
			chameleon.injection = null;
		}

		chameleon.injection = await browser.contentScripts.register({
			matches: ["http://*/*", "https://*/*"],
			js: [
				{file: "js/dep/moment.min.js"},
				{file: "js/dep/moment-timezone-with-data.min.js"},
				{code: await buildInjectScript() }
			],
			runAt: "document_start"
		});
	}, 500);
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
		await save({
			excluded: chameleon.excluded,
			headers: chameleon.headers,
			ipRules: chameleon.ipRules,
			settings: chameleon.settings,
			whitelist: chameleon.whitelist
		});
		return;
	} else if (setting == "default") {
		await save({
			excluded: defaultSettings.excluded,
			headers: defaultSettings.headers,
			ipRules: defaultSettings.ipRules,
			settings: defaultSettings.settings,
			whitelist: defaultSettings.whitelist
		});
		browser.runtime.reload();
		return;
	}

	var tmp = {};
	tmp[setting] = chameleon[setting];
	await save(tmp);

	rebuildInjectionScript();
}

// check if a url is whitelisted, prevents script injection
function whitelisted(req) {
	if (chameleon.whitelist.enabled) {
		let url = "";

		if (req.type == "main_frame") {
			url = req.url;
		} else if (req.frameId == 0) {
			url = req.documentUrl;
		} else {
			let index = req.frameAncestors.findIndex(f => f.frameId == 0);
			if (index > -1) {
				url = req.frameAncestors[index].url;
			}
		}

		if (url) {
			var idx = findRule(chameleon.whitelist.urlList, url);
			if (idx[0] > -1) {
				if (chameleon.whitelist.urlList[idx[0]].domains[idx[1]].re) {
					if (!new RegExp(chameleon.whitelist.urlList[idx[0]].domains[idx[1]].pattern, "i").test(url)) {
						return {on: false};
					};
				}

				return {
					on: true,
					opt: chameleon.whitelist.urlList[idx[0]].options,
					lang: chameleon.whitelist.urlList[idx[0]].lang,
					profile: chameleon.whitelist.urlList[idx[0]].profile,
					spoofIP: chameleon.whitelist.urlList[idx[0]].spoofIP
				};
			}
		}
	}

	return {on: false};
}

function toggleContextMenu(show) {
	browser.contextMenus.removeAll();

	if (show) {
		browser.runtime.getPlatformInfo().then((platformInfo) => {
			if (platformInfo.os != "android") {
				browser.contextMenus.create({
					id: "chameleon-openInWhitelist",
					title: browser.i18n.getMessage("whitelistOpenEditor"),
					contexts: ["all"],
					onclick: function(details) {
						var l = document.createElement("a");
						l.href = details.pageUrl;

						if (l.protocol != "about:" && 
							l.protocol != "moz-extension:" &&
							l.protocol != "ftp:" && 
							l.protocol != "file:") {

							let idx = findRule(chameleon.whitelist.urlList, l.host);

							if (idx[0] >= 0) {
								chrome.tabs.create({
									url: chrome.runtime.getURL(`/whitelist.html?url=${chameleon.whitelist.urlList[idx[0]].domains[idx[1]].domain}&mode=edit`)
								});
							} else {
								chrome.tabs.create({
									url: chrome.runtime.getURL(`/whitelist.html?url=${l.host}&mode=create`)
								});
							}
						}
					},
					icons: {
						"16": "img/icon_16.png",
						"32": "img/icon_32.png"
					}
				});
			}
		});
	}
}

// initialize settings
function init(data) {
	["headers", "excluded", "settings", "whitelist"].forEach(opt => {
		Object.keys(chameleon[opt]).forEach(key => {
			if (data[opt][key] != undefined) chameleon[opt][key] = data[opt][key];
		})
	});

	chameleon.headers.useragent = "";

	if (data.ipRules) {
		chameleon.ipRules = data.ipRules;
	}

	saveSettings();
}

// migrate settings to newer version
function migrate(data) {
	if (data.whitelist == undefined) return;
	if (data.whitelist.enableRealProfile) delete data.whitelist.enableRealProfile;
	if (data.whitelist.profile) delete data.whitelist.profile;

	if (data.whitelist.defaultProfile == undefined) {
		data.whitelist.defaultProfile = "none";
	}
	
	for (var i = 0; i < data.whitelist.urlList.length; i++) {
		delete data.whitelist.urlList[i].options.screen;

		if (data.whitelist.urlList[i].url) {
			data.whitelist.urlList[i].id = Math.random().toString(36).substring(7);
			data.whitelist.urlList[i].domains = [{
				"domain": data.whitelist.urlList[i].url,
				"re": data.whitelist.urlList[i].re,
				"pattern": data.whitelist.urlList[i].pattern
			}];

			delete data.whitelist.urlList[i].url;
			delete data.whitelist.urlList[i].re;
			delete data.whitelist.urlList[i].pattern;
		}
	}
	
	if (data.ipRules != undefined) {
		for (var i = 0; i < data.ipRules.length; i++) {
			if (typeof data.ipRules[i].ip == "string") {
				data.ipRules[i].ip = [data.ipRules[i].ip];
			} else {
				// correct settings if invalid
				if (typeof data.ipRules[i].ip[0] == "object") {
					data.ipRules[i].ip = data.ipRules[i].ip.flat(10000);
				}
			}
		}
	}

	return data;
}

/*
	Event Listeners
*/

chrome.runtime.onMessage.addListener(function(request) {
	if (request.action == "clear") {
		if (request.data == "resetTracking") {
			chrome.privacy.websites.trackingProtectionMode.clear({});
		} else if (request.data == "resetFirstParty") {
			chrome.privacy.websites.firstPartyIsolate.clear({});
		} else if (request.data == "resetFingerprinting") {
			chrome.privacy.websites.resistFingerprinting.clear({});
		}
	} if (request.action == "exclude") {
		let key = request.data.key.split('_')[1].match(/([a-z]+)(\d+)/);
		let index = parseInt(key[2]);
		chameleon.excluded[key[1]][index - 1] = request.data.value;

		changeTimer();
		saveSettings("excluded");
	} else if (request.action == "import") {
		chameleon.headers = request.data.headers;
		chameleon.ipRules = request.data.ipRules;
		chameleon.settings = request.data.settings;
		chameleon.excluded = request.data.excluded;
		chameleon.whitelist = request.data.whitelist;

		browser.runtime.getPlatformInfo().then((plat) => {
			if (chameleon.settings.useragent == "real") {
				if (plat.os != "android") {
					chrome.browserAction.setIcon({
						path: "img/icon_disabled_48.png"
					});
				}
			} else {
				chrome.browserAction.setIcon({
					path: "img/icon_48.png"
				});
			}
		});

		if (chameleon.settings.timeZone == "ip" || (chameleon.headers.spoofAcceptLangValue == "ip" && chameleon.headers.spoofAcceptLang)) {
			chameleon.ipInfo.update = 1;
		}

		saveSettings();
		setTimeout(function () {
			browser.runtime.reload();
		}, 2000);
	} else if (request.action == "interval") {
		chameleon.settings.interval = request.data;

		if (request.data != "-1") {
			chameleon.settings.minInterval = chameleon.settings.maxInterval = null;
		}

		changeTimer();
		saveSettings("settings");
	} else if (request.action == "intervals") {
		chameleon.settings.minInterval = request.data[0];
		chameleon.settings.maxInterval = request.data[1];

		changeTimer();
		saveSettings("settings");
	} else if (request.action == "ipRules") {
		chameleon.ipRules = request.data;

		saveSettings("ipRules");
	} else if (request.action == "headers") {
		chameleon.headers[request.data.key] = request.data.value;

		if ((request.data.key == "spoofAcceptLangValue" && request.data.value == "ip" && chameleon.headers.spoofAcceptLang) ||
			(request.data.key == "spoofAcceptLang" && request.data.value && chameleon.headers.spoofAcceptLangValue == "ip")) {
			chameleon.ipInfo.update = 1;
		}

		saveSettings("headers");
	} else if (request.action == "option") {
		if (request.data.key == "cookieConfig") {
			chrome.privacy.websites[request.data.key].set({
				"value": {
					behavior: request.data.value
				}
			});
		} else if (request.data.key == "trackingProtectionMode") {
			chrome.privacy.websites[request.data.key].set({
				"value": request.data.value
			});
		} else if (request.data.key == "firstPartyIsolate" ||
				   request.data.key == "resistFingerprinting") {
			chrome.privacy.websites[request.data.key].set({
				"value": request.data.value
			});
		} else if (request.data.key == "webRTCIPHandlingPolicy") {
			chrome.privacy.network[request.data.key].set({
				"value": request.data.value
			});
		} else {
			let tooltip = (plat) => {
				if (plat.os != "android") {
					let title = "Chameleon";
					if (tooltipData.os) title = `Chameleon | ${tooltipData.os} - ${tooltipData.browser}`;

					chrome.browserAction.setTitle({ title });
				}
			}

			if (request.data.key == "screenSize" || request.data.key == "enableScriptInjection") {
				var platformInfo = browser.runtime.getPlatformInfo();
				platformInfo.then(tooltip);
			}

			if (request.data.key == "timeZone" && request.data.value == "ip") {
				chameleon.ipInfo.update = 1;
			}

			chameleon.settings[request.data.key] = request.data.value;
			saveSettings("settings");
		}
	} else if (request.action == "reloadIP") {
		getIPInfo();
		rebuildInjectionScript();
	} else if (request.action == "reset") {
		saveSettings("default");
	} else if (request.action == "storage") {
		let setIcon = (plat) => {
			// Firefox for Android doesn't support the browserAction API for icons
			if (plat.os != "android") {
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
			}
		}

		browser.runtime.getPlatformInfo().then(setIcon);

		chameleon.settings[request.data.key] = request.data.value;
		saveSettings("settings");
	} else if (request.action == "whitelist") {
		if (request.data.key == "enableWhitelist") {
			chameleon.whitelist.enabled = request.data.value;
		} else if (request.data.key == "enableContextMenu"){
			chameleon.whitelist.enabledContextMenu = request.data.value;
			save({
				whitelist: chameleon.whitelist
			});
			toggleContextMenu(request.data.value);
			return;
		} else if (request.data.key == "defaultProfile"){
			chameleon.whitelist.defaultProfile = request.data.value;
		} else if (request.data.key == "wl_urls"){
			chameleon.whitelist.urlList = JSON.parse(request.data.value);
		}

		saveSettings("whitelist");
	}
});

browser.webRequest.onBeforeSendHeaders.addListener(
	rewriteHeaders, {
		urls: ["<all_urls>"]
	}, ["blocking", "requestHeaders"]
);

browser.webRequest.onHeadersReceived.addListener(
	rewriteResponseHeaders, {
		urls: ["<all_urls>"]
	}, ["blocking", "responseHeaders"]
);

browser.webRequest.onBeforeRequest.addListener(
	fixYoutube, {
		urls: ["https://www.youtube.com/*"],
		types: ["main_frame"]
	}, ["blocking"]
);

browser.webRequest.onBeforeRequest.addListener(
	blockWebsocket, {
		urls: ["<all_urls>"],
		types: ["websocket"]
	}, ["blocking"]
);

browser.webRequest.onAuthRequired.addListener(
	blockAuth, {
		urls: ["<all_urls>"]
	}, ["blocking"]
);

chrome.alarms.onAlarm.addListener(() => { start(); });

browser.runtime.onInstalled.addListener((details) => {
	if (!details.temporary && details.reason == "install") {
		browser.tabs.create({
			url: "https://github.com/sereneblue/chameleon/wiki"
		});
	}
});

/*
	Chameleon Entry Point
*/
(async function run(){
	let data = await get(null);

	if (data.version == undefined) {
		saveSettings();
	}

	if (data.headers && data.headers.hasOwnProperty('spoofEtag')) {
		var blockEtag = data.headers.spoofEtag;
		delete data.headers.spoofEtag;
		data.headers.blockEtag = blockEtag;

		for (var i in data.whitelist.urlList) {
			data.whitelist.urlList[i].lang = "";
		}
	}

	// check for exclusion settings
	if (data.excluded && (data.excluded.win.length != uaList.win.length)) {
		for (var os of ["win", "mac", "linux", "ios", "android"]) {
			var diff = chameleon.excluded[os].length - data.excluded[os].length;
			for (var i = 0; i < diff; i++) {
				data.excluded[os].push(false);
			}
		}
	}

	// update old settings if neccessary
	data = migrate(data);

	if (data.headers && data.headers.spoofAcceptEnc) {
		data.headers.spoofAccept = data.headers.spoofAcceptEnc;
		delete data.headers.spoofAcceptEnc;
	}

	if (data.settings && data.settings.disableWebSockets) {
		data.settings.webSockets = data.settings.disableWebSockets ? "block_3rd_party": "allow_all";
		delete data.settings.disableWebSockets;
	}
	
	if (data.excluded && (data.excluded.android.length == 8)) {
		data.excluded.android.push(false);
	}

	if (data.settings && data.settings.timeZone == "America/Puerto_Rico") {
		data.settings.timeZone = "America/Santiago";
	}

	init(data);
	let plat = await browser.runtime.getPlatformInfo();

	if (chameleon.settings.useragent == "real") {
		if (plat.os != "android") {
			chrome.browserAction.setIcon({
				path: "img/icon_disabled_48.png"
			});
		}
	}

	if (chameleon.settings.timeZone == "ip" || (chameleon.headers.spoofAcceptLangValue == "ip" && chameleon.headers.spoofAcceptLang)) {
		chameleon.ipInfo.update = 1;
	}

	await save({ version: chameleon.version });
	changeTimer();
})();