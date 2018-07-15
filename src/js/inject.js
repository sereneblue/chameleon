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