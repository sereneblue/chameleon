let data = null;
let intervals = [0, -1, 1, 5, 10, 20, 30, 40, 50, 60];

let screenSizes = [
	'default', 'custom', 'profile', 
	'1366x768', '14404x900', '1600x900', 
	'1920x1080', '2560x1440', '2560x1600'
];

let timeZoneValues = [
	"default",
	"ip",
	"Pacific/Kwajalein",
	"Pacific/Midway",
	"Pacific/Honolulu",
	"Pacific/Marquesas",
	"America/Anchorage",
	"America/Los_Angeles",
	"America/Phoenix",
	"America/Chicago",
	"America/New_York",
	"America/Puerto_Rico",
	"America/St_Johns",
	"America/Sao_Paulo",
	"Atlantic/South_Georgia",
	"Atlantic/Azores",
	"Europe/London",
	"Europe/Berlin",
	"Europe/Kaliningrad",
	"Asia/Baghdad",
	"Asia/Tehran",
	"Europe/Moscow",
	"Asia/Kabul",
	"Asia/Karachi",
	"Asia/Kolkata",
	"Asia/Kathmandu",
	"Asia/Almaty",
	"Asia/Yangon",
	"Asia/Bangkok",
	"Asia/Hong_Kong",
	"Asia/Tokyo",
	"Australia/Darwin",
	"Australia/Sydney",
	"Australia/Lord_Howe",
	"Asia/Magadan",
	"Pacific/Auckland",
	"Pacific/Chatham",
	"Pacific/Tongatapu",
	"Pacific/Kiritimati"
];

let profileValues = [
	"real",
	"random",
	"randomDesktop",
	"randomMobile",
	"random_windows",
	"random_macos",
	"random_linux",
	"random_ios",
	"random_android",
	"custom"
].concat(
	Object
	.entries(uaList)
	.reduce((flat, next) => flat.concat(next[1].value), [])
);

let whitelistOptions = ["auth", "ip", "ref", "screen", "websocket", "winName"];


function get(key) {
	return new Promise((resolve) => {
		chrome.storage.local.get(key, (item) => {
			typeof key == "string" ? resolve(item[key]) : resolve(item);
		});
	});
}

// validate settings
function validate(cfg) {
	if (!(
		cfg.headers &&
		cfg.excluded && 
		cfg.settings && 
		cfg.whitelist)) throw Error;

	for (h in cfg.headers) {
		if (['blockEtag', 'disableAuth', 'disableRef', 'enableDNT', 
			 'spoofAcceptEnc', 'spoofAcceptLang',  'spoofSourceRef', 'spoofVia',
			 'spoofXFor', 'upgradeInsecureRequests'].includes(h)) {
			if (typeof(cfg.headers[h]) != "boolean") throw Error;
		}

		if (['refererXorigin', 'refererTrimming'].includes(h) && 
		    ( 0 > cfg.headers[h] || cfg.headers[h] > 2)) {
			throw Error;
		}

		if (['spoofViaValue', 'spoofXForValue'].includes(h) && 
		    ( 0 > cfg.headers[h] || cfg.headers[h] > 1)) {
			throw Error;
		}

		if (h == 'spoofAcceptLangValue') {
			var found = languages.findIndex(l => l.value == cfg.headers[h]);

			if ((found == -1 && cfg.headers[h] != "ip") && cfg.headers[h] != "") throw Error;
		}

		if (['viaIP', 'viaIP_profile', 'xforwardedforIP', 'xforwardedforIP_profile'].includes(h) && 
			!/^((?:[0-9]{1,3}\.){3}[0-9]{1,3})?$/.test(cfg.headers[h])) {
			throw Error;
		}
	}

	for (e in cfg.excluded) {
		if (cfg.excluded[e].length != data.excluded[e].length) throw Error;

		for (i in cfg.excluded[e]) {
			if (typeof(cfg.excluded[e][i]) != "boolean") throw Error;
		}
	}

    for (s in cfg.settings) {
		if (['disableWebSockets', 'enableScriptInjection', 'limitHistory', 'notificationsEnabled', 
				  'protectWinName', 'spoofAudioContext', 'spoofClientRects'].includes(s)) {
			if (typeof(cfg.settings[s]) != "boolean") throw Error;
		}

		if (s == "customScreen" && !/^([0-9]{3,4}x[0-9]{3,4})?$/.test(cfg.settings[s])) throw Error;

		if (s == "screenSize" && !screenSizes.includes(cfg.settings[s])) throw Error;
		
		if (s == "timeZone" && !timeZoneValues.includes(cfg.settings[s])) throw Error;

		if (s == "interval") {
			if (!(cfg.settings[s] in intervals)) throw Error;

			if (cfg.settings[s] == "-1" && (cfg.minInterval > cfg.maxInterval)) throw Error;
		}

		if (s == "useragent" && !profileValues.includes(cfg.settings[s])) throw Error;
	}

	for (w in cfg.whitelist) {
		if (w == "urlList") {
			for (index in cfg.whitelist[w]) {
				if (!cfg.whitelist[w][index].url || 
					(cfg.whitelist[w][index].re == true && !cfg.whitelist[w][index].pattern)) throw Error;
				
				for (opt in cfg.whitelist[w][index].options) {
					if (!whitelistOptions.includes(opt)) throw Error;
					if (typeof(cfg.whitelist[w][index].options[opt]) != "boolean") throw Error;
				}
			}
			continue;
		} else if (w == "profile") {
			continue;
		}

		if (!['enabled', 'enableRealProfile'].includes(w)) throw Error;
		if (typeof(cfg.whitelist[w]) != "boolean") throw Error;
	}

	$("#import-msg").text("Successfully imported settings").css('color', 'olivedrab');
	chrome.runtime.sendMessage({
		action: "import",
		data: cfg
	});
}

document.addEventListener('DOMContentLoaded', async function() {
	data = await get(null);
	
	$("#import").change(async function() {
		var reader = new FileReader();

		// inject an image with the src url
		reader.onload = function(event) {
			fetch(event.target.result)
			.then(res => res.json())
			.then(settings => {
				validate(settings);
			})
			.catch(err => {
				$("#import-msg").text("Could not import settings").css('color', 'red');
			});
		}

		// when the file is read it triggers the onload event above.
		reader.readAsDataURL(this.files[0]);
	});
});