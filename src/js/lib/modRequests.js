// rewrite request headers 
function rewriteHeaders(e) {
	let wl = whitelisted(e);
	let accept = null;
	let https = e.url.match(/^https:\/\//);

	if (wl.on) {
		if (wl.profile == "default") {
			if (chameleon.whitelist.defaultProfile != "none") {
				accept = spoof.accept(
					profiles.find(p => p.value == chameleon.whitelist.defaultProfile).ua,
					https
				)
			}
		} else {
			if (wl.profile != "real") {
				accept = spoof.accept(
					profiles.find(p => p.value == wl.profile).ua,
					https
				);
			}
		}
	} else {
		if (chameleon.headers.useragent) {
			accept = spoof.accept(
				chameleon.headers.useragent,
				https
			)
		}
	}

	e.requestHeaders.forEach(function(header){
		if (header.name.toLowerCase() == "referer") {
			if (!wl.on) {
				if (chameleon.headers.disableRef) {
					header.value = "";
				} else if (chameleon.headers.spoofSourceRef) {
					// don't spoof referer for cloudflare pages
					if (!/chk_jschl/.test(e.url)) {
						header.value = e.url;
					}
				} else {
					// check referer policies
					if (chameleon.headers.refererXorigin >= 1) {
						var url = new URL(e.url);
						var ref = new URL(header.value);

						if (chameleon.headers.refererXorigin == 1) {
							if (url.hostname.split('.').splice(-2).join(".") != ref.hostname.split('.').splice(-2).join(".")) {
								header.value = "";
							}
						} else {
							if (url.origin != ref.origin) {
								header.value = "";
							}
						}
					}

					if (chameleon.headers.refererTrimming >= 1) {
						if (header.value != "") {
							var url = new URL(header.value);
							header.value = (chameleon.headers.refererTrimming == 1) ? (url.origin + url.pathname) : url.origin;
						}
					}
				}
			} else if (wl.opt.ref) {
				header.value = "";
			}
		} else if (header.name.toLowerCase() == "user-agent") {
			if (wl.on) {
				if (wl.profile == "default") {
					if (chameleon.whitelist.defaultProfile != "none") {
						header.value = profiles.find(p => p.value == chameleon.whitelist.defaultProfile).ua;
					}
				} else if (wl.profile != "real") {
					header.value = profiles.find(p => p.value == wl.profile).ua;
				}
			} else {
				if (chameleon.headers.useragent) header.value = chameleon.headers.useragent;
			}
		} else if (header.name.toLowerCase() == "accept") {
			if (chameleon.headers.spoofAccept) {
				if (accept && ["main_frame", "sub_frame"].includes(e.type)) {
					header.value = accept[0];
				}
			}
		} else if (header.name.toLowerCase() == "accept-encoding") {	
			if (chameleon.headers.spoofAccept) {
				if (accept && ["main_frame", "sub_frame"].includes(e.type)) {
					header.value = accept[1];
				}
			}
		} else if (header.name.toLowerCase() === "accept-language") {
			if (wl.on && wl.lang != "") {
				header.value = wl.lang;
			} else {
				if (chameleon.headers.spoofAcceptLang) {
					if (chameleon.headers.spoofAcceptLangValue == "ip") {
						header.value = chameleon.ipInfo.language; 
					} else {
						header.value = chameleon.headers.spoofAcceptLangValue;
					}
				}
			}
		}
	});

	let dntIndex = e.requestHeaders.findIndex(h => h.name.toLowerCase() == "dnt");
	if (chameleon.headers.enableDNT) {
		if (dntIndex == -1) e.requestHeaders.push({ name: "DNT", value: "1"});
	} else {
		if (dntIndex >= 0) e.requestHeaders.splice(dntIndex, 1);
	}

	if (chameleon.headers.upgradeInsecureRequests) {
		e.requestHeaders.push({ name: "Upgrade-Insecure-Requests", value: "1"});
	}

	if (wl.on) {
		if (wl.opt.ip) {
			if (wl.spoofIP) {
				e.requestHeaders.push({ name: "Via", value: "1.1 " + wl.spoofIP });
				e.requestHeaders.push({ name: "X-Forwarded-For", value: wl.spoofIP });
								
				return { requestHeaders: e.requestHeaders };
			}
		} else {
			return { requestHeaders: e.requestHeaders };
		}
	}

	if (chameleon.headers.spoofVia) {
		if (chameleon.headers.spoofViaValue == 1) {
			e.requestHeaders.push({ name: "Via", value: "1.1 " + chameleon.headers.viaIP });
		} else {
			e.requestHeaders.push({ name: "Via", value: "1.1 " + chameleon.headers.viaIP_profile });
		}
	}

	if (chameleon.headers.spoofXFor) {
		if (chameleon.headers.spoofXForValue == 1) {
			e.requestHeaders.push({ name: "X-Forwarded-For", value: chameleon.headers.xforwardedforIP })
		} else {
			e.requestHeaders.push({ name: "X-Forwarded-For", value: chameleon.headers.xforwardedforIP_profile });
		}
	}

	return { requestHeaders: e.requestHeaders };
}

// rewrite response headers
function rewriteResponseHeaders(e) {
	var wl = whitelisted(e);

	e.responseHeaders.forEach(function(header){
		if (header.name.toLowerCase() == "etag") {
			if (!wl.on) {
				if (chameleon.headers.blockEtag) header.value = "";
			}
		}
	});

	return { responseHeaders: e.responseHeaders };
}

// block malicious auth
function blockAuth(details) {
	let wl = whitelisted(details);

	if (details.isProxy == false) {
		if (details.type == "image" || details.type == "media") {
			if ((!wl.on && chameleon.headers.disableAuth) || wl.opt.auth ) {
				return { cancel: true };
			}
		}
	}
}

// block websocket
function blockWebsocket(details) {
	let wl = whitelisted(details);

	let isWebSocketRequest = false;
	if (details.requestHeaders) {
		for (let h of details.requestHeaders) {
			if (h.name.toLowerCase() == "x-websocket-extensions") {
				isWebSocketRequest = true;
			}
		}
	}

	if (details.type == "websocket" || details.url.includes("transport=polling") || isWebSocketRequest) {
		if (wl.on) {
			return { cancel: wl.opt.websocket };
		}

		if (chameleon.settings.webSockets == "block_all") {
			return { cancel: true };
		} else if (chameleon.settings.webSockets == "block_3rd_party") {
			let frameUrl = details.documentUrl || details.originUrl;
			let frame = psl.parse(new URL(frameUrl).hostname);
			let ws = psl.parse(new URL(details.url).hostname);

			if (!frame.error && !ws.error) {
				if (frame.domain != ws.domain) {
					return { cancel: true };
				}
			}
		}
	}
}

// fix youtube issue
// only check if script injection enabled
function fixYoutube(request) {
	let isChrome = (type, match) => {
		if (type == "profile") {
			return [
				"win1", "win2", "win3", "win4", 
				"mac1", "mac2", "linux1", "linux2", "linux3",
				"linux4", "linux5", "linux6"].includes(match);
		} else {
			if (/Chrome/.test(match) && 
				!/Edge/.test(match) || !/Android/.test(match)) {
				return true;
			}
		}
	}

	if (chameleon.settings.enableScriptInjection) {
		// check if youtube in whitelist
		let wl = whitelisted(request);
		if (!wl.on) {
			if (!isChrome("ua", chameleon.headers.useragent)) {
				return;
			}
		} else {
			if (wl.profile == "default") {
				if (!isChrome("profile", chameleon.whitelist.defaultProfile)) {
					return;
				}
			} else if (!isChrome("profile", wl.profile)) {
				return;
			}
		}

		if (!request.url.includes("disable_polymer")) {
			let link = new URL(request.url);
			let params = new URLSearchParams(link.search);
			params.set('disable_polymer', 'true');

			link.search = params.toString();

			return {
				redirectUrl: link.toString()
			};
		}
	}
}