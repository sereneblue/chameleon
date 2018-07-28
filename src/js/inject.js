let inject = (props, whitelist, nav, injectionText) => {
	return `
		var scripts = document.getElementsByTagName('script');
		var script = document.createElement('script');

		script.appendChild(document.createTextNode(\`

		var properties = ${JSON.stringify(props)};
		var whitelist = ${JSON.stringify(whitelist)};

		function whitelisted() {
			var url = window.location.href;
			for (var u of whitelist.urlList) {
				if (url.indexOf(u.url) > -1) {
					return true;
				}
			}

			return false;
		}

		if (whitelist.enabled && whitelisted()) {
			if (!whitelist.enableRealProfile) {
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
				injectArray.forEach(i => {
					Object.defineProperty(i.obj.split('.').reduce((p,c)=>p&&p[c]||null, window), i.prop, {
							configurable: true,
							value: i.value
					});
				});
			});

			// Override window properties
			override(window, props);

			// Prevent leakage through properties of trusted iframes
			let observer = new MutationObserver((mutations) => {
				for(let mutation of mutations) {
					for(let node of mutation.addedNodes) {
						if(typeof(node.contentWindow)           !== "undefined"
						&& typeof(node.contentWindow.navigator) !== "undefined") {
							override(node.contentWindow, props);
						}
					}
				}
			});

			observer.observe(document.documentElement, {
				childList: true,
				subtree: true
			});

			${injectionText}
		})(properties);\`));

		scripts.length ? document.head.insertBefore(script, document.head.firstChild) : (document.head || document.documentElement).appendChild(script);
		script.remove();`;
};