// spoof contains functions that return js to inject
// also contains the profileResolution to persist profile resolution
let spoof = {
	accept: function(ua, https) {
		if (/Firefox/.test(ua) || /Edge/.test(ua)) {
			if (/60\.0/.test(ua)) {
				return [
					"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
					https ? "gzip, deflate, br" : "gzip, deflate"
				];
			}

			return [
				"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
				https ? "gzip, deflate, br" : "gzip, deflate"
			];
		} else if (/Chrome/.test(ua)) {
			return [
				"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
				https ? "gzip, deflate, br" : "gzip, deflate"
			]
		} else if (/Trident/.test(ua)) {
			return [
				"text/html, application/xhtml+xml, image/jxr, */*",
				"gzip, deflate"
			];
		} else if (/Safari/.test(ua)) {
			return [
				"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
				https ? "br, gzip, deflate" : "gzip, deflate"
			]
		}

		return null;
	},
	dnt: function (injection) {
		injection.dnt = [{ obj: "window.navigator", prop: "doNotTrack", value: true }];
		return injection;
	},
	history: function (injection) {
		injection.history = [{ obj: "window.history", prop: "length", value: 2 }];
		return injection;
	},
	language: function (spoofVal, ipInfo, injection) {
		let l = spoofVal == "ip" ?
				languages.find(l => l.value == ipInfo) :
				languages.find(l => l.value == spoofVal);

		injection.lang = [
			{ obj: "window.navigator", prop: "language", value: l.lang },
			{ obj: "window.navigator", prop: "languages", value: l.langs }
		];
		
		return injection;
	},
	name: function (injection) {
		injection.name = [{ obj: "window", prop: "name", value: "" }];
		return injection;
	},
	navigator: function (ua, injection) {
		var appVersion, buildID, hardwareConcurrency, oscpu, platform, productSub, vendor;

		if (ua == "") return injection;

		if (/Win/.test(ua)) {
			oscpu = ua.match(/(Windows .*?);/)[1];

			if (!ua.match(/Firefox/)) {
				platform = "Win32";
			} else {
				platform = parseInt(ua.match(/Firefox\/(\d+).\d/)[1]) <= 63 ? "Win64" : "Win32";
			}

			hardwareConcurrency = 4;
			vendor = "";
			appVersion = /Firefox/.test(ua) ? "5.0 (Windows)" : ua.match(/Mozilla\/(.*)/)[1];
		} else if (/OS X 10(_|\.)/.test(ua)) {
			oscpu = ua.match(/(Intel Mac OS X 10(_|\.)\d+)/)[0].replace("_",".");
			platform = "MacIntel";
			hardwareConcurrency = 4;
			vendor = "Apple Computer, Inc";
			appVersion = /Firefox/.test(ua) ? "5.0 (Macintosh)" : ua.match(/Mozilla\/(.*)/)[1];
		} else if (/X11/.test(ua)) {
			platform = oscpu = "Linux x86_64";
			hardwareConcurrency = 4;
			appVersion = /Firefox/.test(ua) ? "5.0 (X11)" : ua.match(/Mozilla\/(.*)/)[1];
		} else if (/iPhone/.test(ua)) {
			platform = "iPhone";
			vendor = "Apple Computer, Inc";
			hardwareConcurrency = 2;
		} else if (/iPad/.test(ua)) {
			platform = "iPad";
			vendor = "Apple Computer, Inc";
			hardwareConcurrency = 2;
		} else if (/Android/.test(ua)) {
			platform = "Linux armv7l";
			vendor = "Google Inc";
			hardwareConcurrency = 1;
			appVersion = /Firefox/.test(ua) ? "5.0 (Android)" : ua.match(/Mozilla\/(.*)/)[1];
		} else {
			injection.nav = [
				{ obj: "window.navigator", prop: "userAgent", value: ua }
			];

			return injection;
		}

		if (/Firefox/.test(ua)) {
			productSub = "20010725";
			buildID = parseInt(ua.match(/Firefox\/(\d+).\d/)[1]) >= 64 ? "20181001000000" : "20100101";
		} else {
			oscpu = "undef";
			buildID = "undef";
			if (/Chrome|Safari/.test(ua)) {
				productSub = "20030107";

				if (/Chrome/.test(ua)) {
					vendor = "Google Inc.";
				}
			} else if (/IE/.test(ua)) {
				productSub = null;
			} else {
				productSub = "";
			}
		}

		injection.nav = [
			{ obj: "window.navigator", prop: "userAgent", value: ua },
			{ obj: "window.navigator", prop: "platform", value: platform },
			{ obj: "window.navigator", prop: "productSub", value: productSub },
			{ obj: "window.navigator", prop: "hardwareConcurrency", value: hardwareConcurrency },
			{ obj: "window.navigator", prop: "oscpu", value: oscpu },
			{ obj: "window.navigator", prop: "vendor", value: vendor },
			{ obj: "window.navigator", prop: "vendorSub", value: "" },
			{ obj: "window.navigator", prop: "appVersion", value: appVersion },
			{ obj: "window.navigator", prop: "buildID", value: buildID }
		];

		return injection;
	},
	profileResolution: "",
	screen: function(screenSize, ua, profile, custom, injection) {
		var s;
		var depth = 24;

		if (screenSize == "profile") {
			if (profile == "" || profile == "real") {
				return injection;
			} else if (spoof.profileResolution != "") {
				s = spoof.profileResolution.split("x");
			} else {
				s = getScreenResolution(ua);
				depth = s[2];
			}
		} else if (screenSize == "custom") {
			s = custom.split("x");
		} else {
			s = screenSize.split("x");
		}

		let width = parseInt(s[0]);
		let height = parseInt(s[1]);

		// use real profile screen resolution if couldn't determine from useragent
		if (width == null) return injection;

		injection.screen = [
			{ obj: "window", prop: "innerWidth", value: width },
			{ obj: "window", prop: "innerHeight", value: height },
			{ obj: "window", prop: "outerWidth", value: width },
			{ obj: "window", prop: "outerHeight", value: height },
			{ obj: "window.screen", prop: "availWidth", value: width },
			{ obj: "window.screen", prop: "availHeight", value: height },
			{ obj: "window.screen", prop: "top", value: 0 },
			{ obj: "window.screen", prop: "left", value: 0 },
			{ obj: "window.screen", prop: "availTop", value: 0 },
			{ obj: "window.screen", prop: "availLeft", value: 0 },
			{ obj: "window.screen", prop: "width", value: width },
			{ obj: "window.screen", prop: "height", value: height },
			{ obj: "window.screen", prop: "colorDepth", value: depth },
			{ obj: "window.screen", prop: "pixelDepth", value: depth },
			{ obj: "window.document.documentElement", prop: "clientWidth", value: width },
			{ obj: "window.document.documentElement", prop: "clientHeight", value: height }
		];

		return injection;
	}
};

// gets screen resolution & depths from user agent
function getScreenResolution(ua) {
	var screens;
	var depth = 24; // both color and pixel depth

	if (/Win|X11/.test(ua)) {
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
	} else if (/OS X 10/.test(ua)) {
		screens = [
			[1920, 1080],
			[2560, 1440],
			[2560, 1600]
		];
	} else if (/iPhone/.test(ua)) {
		screens = [
			[414, 736],
			[375, 667]
		];
		depth = 32;
	} else if (/iPad/.test(ua)) {
		screens = [
			[1024, 768]
		];
		depth = 32;
	} else if (/Android/.test(ua)) {
		screens = [
			[360, 740],
			[411, 731],
			[480, 853]
		];
		depth = 32;
	} else {
		return [null, null, null];
	}

	var num = Math.floor(Math.random() * screens.length);

	return [screens[num][0], screens[num][1], depth];
}