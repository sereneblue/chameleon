let inject = (props, whitelist, injectionText, settings, languages, zoneName) => {
	let randValue = Math.random().toString(36);

	return `
		let tz = {};
		let timezone = '${zoneName}';
		if (timezone != "default") {
			let d = new Date();
			let zone = moment.tz(d, timezone);

			tz.offset = zone.utcOffset();
			tz.abbr = zone.format("z");
			tz.name = timezone;
		}

		let urlOK = false;
		let properties = ${JSON.stringify(props)};
		let whitelist = ${JSON.stringify(whitelist)};
		let languages = ${JSON.stringify(languages)};
		let wlOptions = {
			name: false,
			timezone: false
		};
		let wlProfile = {
			"profile" : "default"
		};

		if (whitelist.enabled) {
			let idx = [-1, -1];

			for (var i = 0; i < whitelist.urlList.length; i++) {
				for (var j = 0; j < whitelist.urlList[i].domains.length; j++) {
					if (window.location.href.includes(whitelist.urlList[i].domains[j].domain)) idx = [i, j];
				}
			}

			if (idx[0] > -1) {
				urlOK = true;
				wlOptions = whitelist.urlList[idx[0]].options;
				wlOptions.lang = whitelist.urlList[idx[0]].lang;

				wlProfile.profile = whitelist.urlList[idx[0]].profile; 
				wlProfile.screen = whitelist.urlList[idx[0]].injectProfile.screen;
				wlProfile.nav = whitelist.urlList[idx[0]].injectProfile.nav;

				if (whitelist.urlList[idx[0]].domains[idx[1]].re) {
					urlOK = new RegExp(whitelist.urlList[idx[0]].domains[idx[1]].pattern, "i").test(window.location.href) ? true : false;
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
			}
		}

		if (!(urlOK && (wlOptions.winName == false && wlOptions.timezone == false) && 
			 (
				wlProfile.profile == "real" ||
				(wlProfile.profile == "default" && whitelist.injectProfile.screen.length == 0) // real profile
			 ))) {
			let code = \`
				(function(){
					let tz = \$\{JSON.stringify(tz)\};
					let properties = \$\{JSON.stringify(properties)\};
					let wlOptions = \$\{JSON.stringify(wlOptions)\};
					let urlOK = \$\{urlOK\};

					if (window["${randValue}"]) {
						return;
					} else {
						window["${randValue}"] = true;
					}

					let settings = ${JSON.stringify(settings)};

					// check if older firefox for time spoof
					let _oldFF = false;
					if (properties.nav) {
						let navUA =  properties.nav.find(p => p.prop == "userAgent");
						if (navUA) {
							_oldFF = /60\.0/.test(navUA.value);
						}
					} else {
						_oldFF = /60\.0/.test(navigator.userAgent);
					}

					(function(props, tz){
						let override = ((window, injection, inFrame, tz) => {
							if (!urlOK) {
								${injectionText.audioContext}
								${injectionText.clientRects}
								${injectionText.kbFingerprint}

								if (!inFrame) {
									let offset = tz.offset;
									let tzAbbr = tz.abbr;
									let tzName = tz.name;
									${injectionText.timeSpoof}
								}
							} else {
								if (wlOptions.timezone && !inFrame) {
									let offset = tz.offset;
									let tzAbbr = tz.abbr;
									let tzName = tz.name;
									${injectionText.timeSpoof}
								}
							}

							for (let k in injection) {
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

						// fix window.name issues
						let {name, ...bypassProps} = props;
						
						// remove options
						if (urlOK) {
							if (!wlOptions.winName) props.name = [];
						} else {
							if (!settings.name) props.name = [];
						}

						// Override window properties
						override(window, props, false, tz);

						// Prevent leakage through properties of trusted iframes
						let observer = new MutationObserver((mutations) => {
							for(let mutation of mutations) {
								for(let node of mutation.addedNodes) {
									if(typeof(node.contentWindow)           !== "undefined"
									&& node.contentWindow 					!== null
									&& typeof(node.contentWindow.navigator) !== "undefined") {
										if (node.src.includes("https://www.google.com/recaptcha/api2") || 
											node.src.includes("https://disqus.com/embed/comments/")) {
											override(node.contentWindow, bypassProps, true, tz);
											continue;
										}

										override(node.contentWindow, props, true, tz);
									}
								}
							}
						});

						observer.observe(document.documentElement, {
							childList: true,
							subtree: true
						});
					})(properties, tz);
				})();\`;

			// inject directly into the page
			document.documentElement.appendChild(Object.assign(document.createElement('script'), {
	        textContent: code }));

			// https://github.com/violentmonkey/violentmonkey/pull/246
			// Fix CSP issue
			// injection for CSP sites, not run if already injected
			let script = document.createElement('script');
			script.src = URL.createObjectURL(new Blob([code], { type: 'text/javascript' }));
			(document.head || document.documentElement).appendChild(script);

			try {
				URL.revokeObjectURL(url);
			} catch (e) {
			}
			script.remove();
		}`;
};