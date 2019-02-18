let inject = (props, whitelist, injectionText, settings, uaList, languages) => {
	return `
		var scripts = document.getElementsByTagName('script');
		var script = document.createElement('script');

		script.appendChild(document.createTextNode(\`

		var urlOK = false;
		var properties = ${JSON.stringify(props)};
		var whitelist = ${JSON.stringify(whitelist)};
		var settings = ${JSON.stringify(settings)};
		var languages = ${JSON.stringify(languages)};
		var uaList = ${JSON.stringify(uaList)};
		var wlOptions = {
			websocket: false,
			name: false,
			timezone: false,
		};
		var wlProfile = {
			"profile" : "default"
		};

		if (whitelist.enabled) {
			var idx = whitelist.urlList.findIndex(u => window.location.href.indexOf(u.url) > -1);
			if (idx > -1) {
				urlOK = true;
				wlOptions = whitelist.urlList[idx].options;
				wlOptions.lang = whitelist.urlList[idx].lang;

				wlProfile.profile = whitelist.urlList[idx].profile; 
				wlProfile.screen = whitelist.urlList[idx].injectProfile.screen;
				wlProfile.nav = whitelist.urlList[idx].injectProfile.nav;

				if (whitelist.urlList[idx].re) {
					urlOK = new RegExp(whitelist.urlList[idx].pattern, "i").test(window.location.href) ? true : false;
				}
			}
		}

		if (urlOK) {
			if (wlOptions.lang) {
				let langData = languages.find(l => l.value == wlOptions.lang);

				properties.lang = [
					{ obj: "window.navigator", prop: "language", value: langData.lang },
					{ obj: "window.navigator", prop: "languages", value: langData.langs }
				];
			}

			if (wlProfile.profile != "default") {
				// use rule profile
				properties.screen = wlProfile.screen;
				properties.nav = wlProfile.nav;
			} else {
				// use whitelist profile
				properties.screen = whitelist.injectProfile.screen;
				properties.nav = whitelist.injectProfile.nav;
			}
		}

		// check if older firefox for time spoof
		var _oldFF = false;
		if (properties.nav) {
			var navUA =  properties.nav.find(p => p.prop == "userAgent");
			if (navUA) {
				_oldFF = /60\.0/.test(navUA.value);
			}
		} else {
			_oldFF = /60\.0/.test(navigator.userAgent);
		}

		(function(props){
			let override = ((window, injection) => {
				if (!urlOK) {
					${injectionText.audioContext}
					${injectionText.clientRects}
					${injectionText.timeSpoof}
				} else {
					if (wlOptions.timezone) {
						${injectionText.timeSpoof}
					}
				}

				for (var k in injection) {
					injection[k].forEach(i => {
						if (i.obj == "window") {
							window[i.prop] = i.value;
						} else {
							if (i.value == "undef") {
								i.value = undefined;
							}

							Object.defineProperty(i.obj.split('.').reduce((p,c)=>p&&p[c]||null, window), i.prop, {
								configurable: true,
								value: i.value
							});
						}
					});
				}
			});

			// fix recaptcha window.name spoofing;
			let {name, ...recaptchaProperties} = props;
			
			// remove options
			if (urlOK) {
				if (!wlOptions.websocket) props.websocket = [];
				if (!wlOptions.winName) props.name = [];
			} else {
				if (!settings.websocket) props.websocket = [];
				if (!settings.name) props.name = [];
			}

			// Override window properties
			override(window, props);

			// Prevent leakage through properties of trusted iframes
			let observer = new MutationObserver((mutations) => {
				for(let mutation of mutations) {
					for(let node of mutation.addedNodes) {
						if(typeof(node.contentWindow)           !== "undefined"
						&& node.contentWindow 					!== null
						&& typeof(node.contentWindow.navigator) !== "undefined") {
							if (node.src.includes("https://www.google.com/recaptcha/api2")) {
								override(node.contentWindow, recaptchaProperties);
								continue;
							}

							override(node.contentWindow, props);
						}
					}
				}
			});

			observer.observe(document.documentElement, {
				childList: true,
				subtree: true
			});
		})(properties);\`));

		scripts.length ? document.head.insertBefore(script, document.head.firstChild) : (document.head || document.documentElement).appendChild(script);
		script.remove();`;
};