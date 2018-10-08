// useragent list
let uaList = {
	"windows": [{
		"ua": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.81 Safari/537.36",
		"name": "Chrome 69 (Win 7)",
		"value": "win1"
	}, {
		"ua": "Mozilla/5.0 (Windows NT 6.2; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.81 Safari/537.36",
		"name": "Chrome 69 (Win 8)",
		"value": "win2"
	}, {
		"ua": "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.81 Safari/537.36",
		"name": "Chrome 69 (Win 8.1)",
		"value": "win3"
	}, {
		"ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.81 Safari/537.36",
		"name": "Chrome 69 (Win 10)",
		"value": "win4"
	}, {
		"ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36 Edge/18.17749",
		"name": "Edge 18 (Win 10)",
		"value": "win5"
	}, {
		"ua": "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:62.0) Gecko/20100101 Firefox/62.0",
		"name": "Firefox 62 (Win 7)",
		"value": "win6"
	}, {
		"ua": "Mozilla/5.0 (Windows NT 6.2; Win64; x64; rv:62.0) Gecko/20100101 Firefox/62.0",
		"name": "Firefox 62 (Win 8)",
		"value": "win7"
	}, {
		"ua": "Mozilla/5.0 (Windows NT 6.3; Win64; x64; rv:62.0) Gecko/20100101 Firefox/62.0",
		"name": "Firefox 62 (Win 8.1)",
		"value": "win8"
	}, {
		"ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:62.0) Gecko/20100101 Firefox/62.0",
		"name": "Firefox 62 (Win 10)",
		"value": "win9"
	}, {
		"ua": "Mozilla/5.0 (Windows NT 6.1; rv:60.0) Gecko/20100101 Firefox/60.0",
		"name": "Firefox 60 ESR (Win 7)",
		"value": "win13"
	}, {
		"ua": "Mozilla/5.0 (Windows NT 6.3; rv:60.0) Gecko/20100101 Firefox/60.0",
		"name": "Firefox 60 ESR (Win 8.1)",
		"value": "win14"
	}, {
		"ua": "Mozilla/5.0 (Windows NT 10.0; rv:60.0) Gecko/20100101 Firefox/60.0",
		"name": "Firefox 60 ESR (Win 10)",
		"value": "win15"
	}, {
		"ua": "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)",
		"name": "Internet Explorer 10 (Win 8)",
		"value": "win10"
	}, {
		"ua": "Mozilla/5.0 (Windows NT 6.1; Trident/7.0; rv:11.0) like Gecko",
		"name": "Internet Explorer 11 (Win 7)",
		"value": "win11"
	}, {
		"ua": "Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko",
		"name": "Internet Explorer 11 (Win 8.1)",
		"value": "win12"
	}],
	"macos": [{
		"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.81 Safari/537.36",
		"name": "Chrome 69 (macOS 10.12)",
		"value": "mac1"
	}, {
		"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.81 Safari/537.36",
		"name": "Chrome 69 (macOS 10.13)",
		"value": "mac2"
	}, {
		"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:62.0) Gecko/20100101 Firefox/62.0",
		"name": "Firefox 62 (macOS 10.12)",
		"value": "mac3"
	}, {
		"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:62.0) Gecko/20100101 Firefox/62.0",
		"name": "Firefox 62 (macOS 10.13)",
		"value": "mac4"
	}, {
		"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:60.0) Gecko/20100101 Firefox/60.0",
		"name": "Firefox 60 ESR (macOS 10.12)",
		"value": "mac8"
	}, {
		"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/603.3.8 (KHTML, like Gecko) Version/10.1.2 Safari/603.3.8",
		"name": "Safari 10.1.2 (macOS 10.12)",
		"value": "mac5"
	}, {
		"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.1.2 Safari/605.1.15",
		"name": "Safari 11.1.2 (macOS 10.12)",
		"value": "mac6"
	}, {
		"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.1.2 Safari/605.1.15",
		"name": "Safari 11.1.2 (macOS 10.13)",
		"value": "mac7"
	}],
	"linux": [{
		"ua": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.81 Safari/537.36",
		"name": "Chrome 69 (Linux 64)",
		"value": "linux1"
	}, {
		"ua": "Mozilla/5.0 (X11; Fedora; x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.81 Safari/537.36",
		"name": "Chrome 69 (Fedora 64)",
		"value": "linux2"
	}, {
		"ua": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chrome/69.0.3497.81 Safari/537.36",
		"name": "Chrome 69 (Ubuntu 64)",
		"value": "linux3"
	}, {
		"ua": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/69.0.3497.81 Chrome/69.0.3497.81 Safari/537.36",
		"name": "Chromium 69 (Linux 64)",
		"value": "linux4"
	}, {
		"ua": "Mozilla/5.0 (X11; Fedora; x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chromium/69.0.3497.81 Chrome/69.0.3497.81 Safari/537.36",
		"name": "Chromium 69 (Fedora 64)",
		"value": "linux5"
	}, {
		"ua": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/69.0.3497.81 Chrome/69.0.3497.81 Safari/537.36",
		"name": "Chromium 69 (Ubuntu 64)",
		"value": "linux6"
	}, {
		"ua": "Mozilla/5.0 (X11; Linux x86_64; rv 62.0) Gecko/20100101 Firefox 62.0",
		"name": "Firefox 62 (Linux 64)",
		"value": "linux7"
	}, {
		"ua": "Mozilla/5.0 (X11; Fedora; Linux x86_64; rv 62.0) Gecko/20100101 Firefox 62.0",
		"name": "Firefox 62 (Fedora 64)",
		"value": "linux8"
	}, {
		"ua": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv 62.0) Gecko/20100101 Firefox 62.0",
		"name": "Firefox 62 (Ubuntu 64)",
		"value": "linux9"
	}, {
		"ua": "Mozilla/5.0 (X11; Linux x86_64; rv 60.0) Gecko/20100101 Firefox 60.0",
		"name": "Firefox 60 ESR (Linux 64)",
		"value": "linux10"
	}, {
		"ua": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv 60.0) Gecko/20100101 Firefox 60.0",
		"name": "Firefox 60 ESR (Ubuntu 64)",
		"value": "linux11"
	}],
	"ios": [{
		"ua": "Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1",
		"name": "iOS 9.1 - iPhone - Safari 9",
		"value": "ios1"
	}, {
		"ua": "Mozilla/5.0 (iPad; CPU OS 9_3_2 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13F69 Safari/601.1",
		"name": "iOS 9.3.2 - iPad - Safari 9",
		"value": "ios2"
	}, {
		"ua": "Mozilla/5.0 (iPhone; CPU iPhone OS 9_3_2 like Mac OS X) AppleWebKit/601.1 (KHTML, like Gecko) CriOS/51.0.2704.104 Mobile/13F69 Safari/601.1.46",
		"name": "iOS 9.3.2 - iPhone - Chrome 51",
		"value": "ios3"
	}, {
		"ua": "Mozilla/5.0 (iPad; CPU OS 10_2 like Mac OS X) AppleWebKit/602.3.12 (KHTML, like Gecko) Version/10.0 Mobile/14C92 Safari/602.1",
		"name": "iOS 10.2 - iPad - Safari 10",
		"value": "ios4",
	}, {
		"ua": "Mozilla/5.0 (iPhone; CPU iPhone OS 10_2_1 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/69.0.3497.71 Mobile/14D27 Safari/602.1",
		"name": "iOS 10.2.1 - iPhone - Chrome 69",
		"value": "ios5"
	}, {
		"ua": "Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1",
		"name": "iOS 10.3.1 - iPhone - Safari 10",
		"value": "ios6"
	}, {
		"ua": "Mozilla/5.0 (iPhone; CPU iPhone OS 11_2_5 like Mac OS X) AppleWebKit/604.5.6 (KHTML, like Gecko) Version/11.1 Mobile/15D60 Safari/604.1",
		"name": "iOS 11.2.5 - iPhone - Safari 11.1",
		"value": "ios7"
	}, {
		"ua": "Mozilla/5.0 (iPad; CPU OS 11_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.1 Mobile/15E148 Safari/604.1",
		"name": "iOS 11.3 - iPad - Safari 11.1",
		"value": "ios8"
	}, {
		"ua": "Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) CriOS/69.0.3497.71 Mobile/16A5288q Safari/604.1",
		"name": "iOS 12 - iPhone - Chrome 69",
		"value": "ios9"
	}],
	"android": [{
		"ua": "Mozilla/5.0 (Android; Mobile; rv:62.0) Gecko/62.0 Firefox/62.0",
		"name": "Android - Firefox 62",
		"value": "android1"
	}, {
		"ua": "Mozilla/5.0 (Linux; Android 4.4.2; SM-G800Y Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.86 Mobile Safari/537.36",
		"name": "Android 4.4.2 - Chrome 69",
		"value": "android2"
	}, {
		"ua": "Mozilla/5.0 (Linux; U; Android 4.4.4; Nexus 5 Build/KTU84P) AppleWebkit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30",
		"name": "Android 4.4.4 - Android Browser",
		"value": "android3"
	}, {
		"ua": "Mozilla/5.0 (Linux; Android 5.1.1; SAMSUNG-SM-G530AZ Build/LMY48B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.86 Mobile Safari/537.36",
		"name": "Android 5.1.1 - Chrome 69",
		"value": "android4"
	}, {
		"ua": "Mozilla/5.0 (Linux; Android 6.0.1; N9136 Build/MMB29M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.86 Mobile Safari/537.36",
		"name": "Android 6.0.1 - Chrome 69",
		"value": "android5"
	}, {
		"ua": "Mozilla/5.0 (Linux; U; Android 6.0.1; en-US; SM-J700F Build/MMB29K) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/40.0.2214.89 UCBrowser/11.5.1.944 Mobile Safari/537.36",
		"name": "Android 6.0.1 - UC Browser 11.5",
		"value": "android6"
	}, {
		"ua": "Mozilla/5.0 (Linux; Android 7.0; SM-G935F Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.86 Mobile Safari/537.36",
		"name": "Android 7.0 - Chrome 69",
		"value": "android7"
	}, {
		"ua": "Mozilla/5.0 (Linux; Android 7.0; SAMSUNG SM-N920C Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/7.4 Chrome/59.0.3071.125 Mobile Safari/537.36",
		"name": "Android 7.0 - Samsung Browser 7.4",
		"value": "android8"
	}]
}

// platform list
let platforms = Object.keys(uaList);
platforms.push("custom");

// menu headers
let menu = ["profile", "headers", "options", "whitelist", "about"];

// options
let options = ["scriptInjection", "standard", "cookies", "misc", "reporting"];

// whitelist
let whitelist = ["whitelistProfile", "whitelistRules"];