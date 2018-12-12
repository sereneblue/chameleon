let inject = (props, whitelist, nav, injectionText, settings, languages) => {
	return `
		var scripts = document.getElementsByTagName('script');
		var script = document.createElement('script');

		script.appendChild(document.createTextNode(\`
		var properties = ${JSON.stringify(props)};
		var whitelist = ${JSON.stringify(whitelist)};
		var urlOK = false;
		var settings = ${JSON.stringify(settings)};
		var languages = ${JSON.stringify(languages)};
		var wlOptions = {
			websocket: false,
			screen: false,
			name: false,
		};

		if (whitelist.enabled) {
			var idx = whitelist.urlList.findIndex(u => window.location.href.indexOf(u.url) > -1);
			if (idx > -1) {
				urlOK = true;
				wlOptions = whitelist.urlList[idx].options;

				wlOptions.lang = whitelist.urlList[idx].lang;
				if (whitelist.urlList[idx].re) {
					urlOK = new RegExp(whitelist.urlList[idx].pattern, "i").test(window.location.href) ? true : false;
				}
			}
		}

		if (urlOK) {
			if (wlOptions.lang) {
				let langIndex = properties.findIndex(p => p.prop == "language");
				let langsIndex = properties.findIndex(p => p.prop == "languages");
				let langData = languages.find(l => l.value == wlOptions.lang);

				if (langIndex > -1) {
					properties[langIndex].value = wlOptions.lang;
				} else {
					properties.push({ obj: "window.navigator", prop: "language", value: langData.lang });
				}
				if (langsIndex > -1) {
					properties[langsIndex].value = langData.langs;
				} else {
					properties.push({ obj: "window.navigator", prop: "languages", value: langData.langs });
				}
			} else if (!whitelist.enableRealProfile) {
				properties.push(...[
					{ obj: "window.navigator", prop: "appCodeName", value: whitelist.profile.appCodeName },
					{ obj: "window.navigator", prop: "appName", value: whitelist.profile.appName },
					{ obj: "window.navigator", prop: "appVersion", value: whitelist.profile.appVersion },
					{ obj: "window.navigator", prop: "hardwareConcurrency", value: whitelist.profile.hardwareConcurrency },
					{ obj: "window.navigator", prop: "oscpu", value: whitelist.profile.osCPU },
					{ obj: "window.navigator", prop: "platform", value: whitelist.profile.platform },
					{ obj: "window.navigator", prop: "vendor", value: whitelist.profile.vendor },
					{ obj: "window.navigator", prop: "vendorSub", value: whitelist.profile.vendorSub },
					{ obj: "window.navigator", prop: "userAgent", value: whitelist.profile.useragent },
					{ obj: "window.navigator", prop: "productSub", value: whitelist.profile.productSub },
				]);
			}
		} else {
			properties.push(...${JSON.stringify(nav)});
		};

		(function(props){
			let override = ((window, injectArray) => {
				if (!urlOK) {
					${injectionText}
				}

				injectArray.forEach(i => {
					if (i.obj == "window") {
						window[i.prop] = i.value;
					} else {
						Object.defineProperty(i.obj.split('.').reduce((p,c)=>p&&p[c]||null, window), i.prop, {
							configurable: true,
							value: i.value
						});
					}
				});
			});

			// fix recaptcha window.name spoofing;
			let recaptchaProperties = props.slice();
			var windowNameIndex = props.findIndex(p => p.prop == "name");
			if (windowNameIndex > -1) {
				recaptchaProperties.splice(windowNameIndex, 1);
			}

			// remove options if whitelisted
			if (urlOK) {
				for (var i = props.length - 1; i >= 0; i--) {
					if ( (props[i].obj.indexOf("screen") > -1) 			||
						 (props[i].obj.indexOf("documentElement") > -1)
						) {
						if (!wlOptions.screen) props.splice(i, 1);
					} else if (props[i].prop.indexOf("Socket") > -1) {
						if (!wlOptions.websocket) props.splice(i, 1);
					} else if (props[i].prop == "name") {
						if (!wlOptions.winName) props.splice(i, 1);
					}
				}
			} else {
				for (var i = props.length - 1; i >= 0; i--) {
					// remove options if not enabled
					if ( (props[i].obj.indexOf("screen") > -1) 			||
						 (props[i].obj.indexOf("documentElement") > -1)
						) {
						if (!settings.screen) props.splice(i, 1);
					} else if (props[i].prop.indexOf("Socket") > -1) {
						if (!settings.websocket) props.splice(i, 1);
					} else if (props[i].prop == "name") {
						if (!settings.name) props.splice(i, 1);
					}
				}
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