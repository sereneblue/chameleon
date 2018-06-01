"use strict"

let headers = {
    disableAuth: false,
    disableRef: false,
    enableDNT: false,
    refererXorigin: 0,
    refererTrimming: 0,
    spoofAcceptEnc: false,
    spoofAcceptLang: false,
    spoofAcceptLangValue: "",
    spoofEtag: false,
    spoofSourceRef: false,
    spoofVia: false,
    spoofViaValue: 0,
    spoofXFor: false,
    spoofXForValue: 0,
    viaIP: "",
    xforwardedforIP: "",
    useragent: ""
}

function changeTimer(duration) {
    chrome.alarms.clear("profile");
    
    let task = {when: Date.now() + 250};

    if (duration > 0) {
        task["periodInMinutes"] = duration;
    }
    
    chrome.alarms.create("profile", task);
}

function generateByte() {
    var num = Math.floor(Math.random() * (256));
    return (num === 10 || num === 172 || num === 192) ? generateByte() : num;
}

function generateRandomIP() {
    let ip = `${generateByte()}.${generateByte()}.${generateByte()}.${generateByte()}`;
    return ip;
}

function get(key) {
    return new Promise((resolve) => {
        chrome.storage.local.get(key, (item) => {
            key ? resolve(item[key]) : resolve(item);
        });
    });
}

function rewriteHeaders(e) {
    for (var header of e.requestHeaders) {
        if (headers.disableAuth) {
            if (header.name.toLowerCase() === "authorization") {
                header.value = "";
            }
        }

        if (headers.disableRef) {
            if (header.name.toLowerCase() === "referer") {
                header.value = "";
            }
        } else if (headers.spoofSourceRef) {
            if (header.name.toLowerCase() === "referer") {
                header.value = e.url;
            }
        } else {
            // check referer policies
            if (headers.refererXorigin >= 1) {
                if (header.name.toLowerCase() === "referer") {
                    var url = new URL(e.url);
                    var ref = new URL(header.value);

                    if (headers.refererXorigin == 1) {
                        if (url.hostname.split('.').splice(-2).join(".") != ref.hostname.split('.').splice(-2).join(".")) {
                            header.value = "";
                        }
                    } else {
                        if (url.origin != ref.origin) {
                            header.value = "";
                        }
                    }
                }
            }

            if (headers.refererTrimming >= 1) {
                if (header.name.toLowerCase() === "referer" && header.value != "") {
                    var url = new URL(header.value);

                    header.value = (headers.refererTrimming == 1) ? (url.origin + url.pathname) : url.origin;
                }
            }
        }

        if (headers.spoofEtag) {
            if (header.name.toLowerCase() === "if-none-match") {
                header.value = (Math.random() * 10).toString(36).substr(2, Math.random() * (10 - 5 + 1) + 5);
            }
        }

        if (headers.useragent) {
            if (header.name.toLowerCase() === "user-agent") {
                header.value = headers.useragent;
            }
        }

        if (headers.spoofAcceptEnc) {
            if (header.name.toLowerCase() === "accept-encoding") {
                header.value = "gzip, deflate";
            }   
        }

        if (headers.spoofAcceptLang) {
            if (header.name.toLowerCase() === "accept-language") {
                header.value = headers.spoofAcceptLangValue;
            }   
        }
    }

    let dntIndex = e.requestHeaders.findIndex(h => h.name.toLowerCase() == "dnt");
    if (headers.enableDNT) {
        if (dntIndex == -1) e.requestHeaders.push({ name: "DNT", value: "1"});
    } else {
        e.requestHeaders.splice(dntIndex, 1);
    }

    if (headers.spoofVia) {
        if (headers.spoofViaValue == 1) {
            e.requestHeaders.push({ name: "Via", value: "1.1 " + headers.viaIP });
        } else {
            e.requestHeaders.push({ name: "Via", value: "1.1 " + generateRandomIP() });
        }
    }

    if (headers.spoofXFor) {
        if (headers.spoofXForValue == 1) {
            e.requestHeaders.push({ name: "X-Forwarded-For", value: headers.xforwardedforIP })
        } else {
            e.requestHeaders.push({ name: "X-Forwarded-For", value: generateRandomIP() });
        }
    }

    return { requestHeaders: e.requestHeaders };
}

async function start() {
    // pick new useragent
    let useragents = {};
    let useragentType = await get('useragent');

    if (useragentType.match(/.*?\d/) || useragentType == "custom") {
        headers.useragent = await get('useragentValue');
    } else if (useragentType.match(/random_/)) {
        let platform = useragentType.split('_')[1];

        useragents = await get('useragents');
        headers.useragent = useragents[platform][Math.floor(Math.random() * useragents[platform].length)].ua;
    } else if (useragentType == "random") {
        // random useragent
        useragents = await get('useragents');

        let platforms = Object.keys(useragents);
        let platform = platforms[Math.floor(Math.random() * platforms.length)];

        headers.useragent = useragents[platform][Math.floor(Math.random() * useragents[platform].length)].ua;
    } else if (useragentType == "randomDesktop") {
        // random desktop useragent

        let platforms = ["windows", "macOS", "linux"];
        let platform = platforms[Math.floor(Math.random() * platforms.length)];

        useragents = await get('useragents');
        headers.useragent = useragents[platform][Math.floor(Math.random() * useragents[platform].length)].ua;
    } else if (useragentType == "randomMobile") {
        // random mobile useragent

        let platforms = ["iOS", "android"];
        let platform = platforms[Math.floor(Math.random() * platforms.length)];

        useragents = await get('useragents');
        headers.useragent = useragents[platform][Math.floor(Math.random() * useragents[platform].length)].ua;
    } else {
        // real profile

        headers.useragent = "";
    }
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.duration >= 0) {
        chrome.storage.local.set({interval: request.duration });
        changeTimer(request.duration);
    } else if (request.headers) {
        var tmp = {};

        tmp[request.headers.field] = request.headers.value;
        headers[request.headers.field] = request.headers.value;

        chrome.storage.local.set(tmp);
    } else if (request.useragent) {
        chrome.storage.local.set({useragent: request.useragent });
    } else if (request.useragents) {
        chrome.storage.local.set({useragents: request.useragents });
    } else if (request.useragentValue) {
        chrome.storage.local.set({useragentValue: request.useragentValue });
    }
});

chrome.webRequest.onBeforeSendHeaders.addListener(
    rewriteHeaders, {
        urls: ["<all_urls>"]
    }, ["blocking", "requestHeaders"]
);

chrome.alarms.onAlarm.addListener(function(alarm) {
    start();
});

(async function init(){
    let data = await get(null);

    Object.keys(headers).forEach(key => {
        if (data[key] != undefined && key != "useragent") {
            headers[key] = data[key];
        }
    });

    changeTimer(data.interval);
})();