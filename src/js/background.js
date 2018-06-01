"use strict"

let ua = "";

function rewriteUserAgentHeader(e) {
    for (var header of e.requestHeaders) {
        if (ua != "") {
            if (header.name.toLowerCase() === "user-agent") {
                header.value = ua;
            }
        }
    }
    return {
        requestHeaders: e.requestHeaders
    };
}

function changeTimer(duration) {
    chrome.alarms.clear("profile");
    if (duration > 0) {
        chrome.alarms.create("profile", {
            when: Date.now() + 2,
            periodInMinutes: duration
        });
    }
}

function get(key) {
    return new Promise((resolve) => {
        chrome.storage.local.get(key, (item) => {
            key ? resolve(item[key]) : resolve(item);
        });
    });
}

async function start() {
    // pick new useragent
    let useragents = {};
    let useragentType = await get('useragent');

    if (useragentType.match(/.*?\d/) || useragentType == "custom") {
        ua = await get('useragentValue');
    } else if (useragentType.match(/random_/)) {
        let platform = useragentType.split('_')[1];

        useragents = await get('useragents');
        ua = useragents[platform][Math.floor(Math.random() * useragents[platform].length)].ua;
    } else if (useragentType == "random") {
        // random useragent
        let platforms = Object.keys(useragents);
        let platform = platforms[Math.floor(Math.random() * platforms.length)];

        useragents = await get('useragents');
        ua = useragents[platform][Math.floor(Math.random() * useragents[platform].length)].ua;
    } else if (useragentType == "randomDesktop") {
        // random desktop useragent

        let platforms = ["windows", "macOS", "linux"];
        let platform = platforms[Math.floor(Math.random() * platforms.length)];

        useragents = await get('useragents');
        ua = useragents[platform][Math.floor(Math.random() * useragents[platform].length)].ua;
    } else if (useragentType == "randomMobile") {
        // random mobile useragent

        let platforms = ["iOS", "android"];
        let platform = platforms[Math.floor(Math.random() * platforms.length)];

        useragents = await get('useragents');
        ua = useragents[platform][Math.floor(Math.random() * useragents[platform].length)].ua;
    } else {
        // real profile

        ua = "";
    }
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.duration >= 0) {
        changeTimer(request.duration);
    };
});

chrome.webRequest.onBeforeSendHeaders.addListener(
    rewriteUserAgentHeader, {
        urls: ["<all_urls>"]
    }, ["blocking", "requestHeaders"]
);

chrome.alarms.onAlarm.addListener(function(alarm) {
    start()
});