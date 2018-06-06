chrome.runtime.sendMessage({action: "inject"}, function (response) {
	if (response) {
		var scripts = document.getElementsByTagName('script');

		var script = document.createElement('script');
		script.appendChild(document.createTextNode(response.script));

		scripts.length ? document.head.insertBefore(script, document.head.firstChild) : (document.head || document.documentElement).appendChild(script);
		script.remove();
	}
});