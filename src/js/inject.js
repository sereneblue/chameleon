(async function() {
	let response = await chrome.runtime.sendMessage({action: "inject"});

	if (response) {
		var scripts = document.getElementsByTagName('script');
		var script = document.createElement('script');

		// modified mutation observer from https://gitlab.com/ntninja/user-agent-switcher/blob/master/content/override-navigator-data.js
		script.appendChild(document.createTextNode(`
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

				${response.script}
			})(${response.injection});
			`));
		
		scripts.length ? document.head.insertBefore(script, document.head.firstChild) : (document.head || document.documentElement).appendChild(script);
		script.remove();
	}
})()

// waiting for values to inject takes time
// some sites may read the values before they are spoofed
// set default values to Chrome on Windows 10 (some sites like Discord break)
// https://github.com/sereneblue/chameleon/issues/19
var scripts = document.getElementsByTagName('script');
var script = document.createElement('script');

script.appendChild(document.createTextNode(`
	Object.defineProperty(navigator, "userAgent", { configurable: true, value: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36" });
	Object.defineProperty(navigator, "platform", { configurable: true, value: "Win64" });
	Object.defineProperty(navigator, "hardwareConcurrency", { configurable: true, value: 4 });
	Object.defineProperty(navigator, "oscpu", { configurable: true, value: "" });
	Object.defineProperty(navigator, "vendor", { configurable: true, value: "Google Inc." });
	Object.defineProperty(navigator, "vendorSub", { configurable: true, value: "" });
	Object.defineProperty(navigator, "appCodeName", {configurable: true, value: "Mozilla" });
	Object.defineProperty(navigator, "appName", {configurable: true, value: "Netscape" });
	Object.defineProperty(navigator, "appVersion", {configurable: true, value: "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36" });
	Object.defineProperty(navigator, "productSub", {configurable: true, value: "20030107" });
`));

scripts.length ? document.head.insertBefore(script, document.head.firstChild) : (document.head || document.documentElement).appendChild(script);
script.remove();