import { Chameleon } from './lib/chameleon';
import store from './store';
import webext from './lib/webext';

webext.firstTimeInstall();

store.state.version = browser.runtime.getManifest().version;

let chameleon = new Chameleon(JSON.parse(JSON.stringify(store.state)));
let messageHandler = (request: any, sender: any, sendResponse: any) => {
  if (request.action === 'save') {
    if (chameleon.timeout) {
      clearTimeout(chameleon.timeout);
    }

    chameleon.settings = Object.assign(chameleon.settings, request.data);
    chameleon.timeout = setTimeout(() => {
      chameleon.saveSettings(request.data);
      sendResponse('done');
    }, 200);
  } else if (request.action === 'implicitSave') {
    if (chameleon.timeout) {
      clearTimeout(chameleon.timeout);
    }

    chameleon.timeout = setTimeout(() => {
      chameleon.saveSettings(chameleon.settings);
      sendResponse('done');
    }, 200);
  } else if (request.action === 'contextMenu') {
    chameleon.toggleContextMenu(request.data);
  } else if (request.action === 'toggleBadgeText') {
    chameleon.updateBadgeText(request.data);
  } else if (request.action === 'getSettings') {
    (async () => {
      if (!!browser.privacy) {
        let cookieSettings = await browser.privacy.websites.cookieConfig.get({});
        chameleon.settings.options.cookieNotPersistent = cookieSettings.value.nonPersistentCookies;
        chameleon.settings.options.cookiePolicy = cookieSettings.value.behavior;

        let firstPartyIsolate = await browser.privacy.websites.firstPartyIsolate.get({});
        chameleon.settings.options.firstPartyIsolate = firstPartyIsolate.value;

        let resistFingerprinting = await browser.privacy.websites.resistFingerprinting.get({});
        chameleon.settings.options.resistFingerprinting = resistFingerprinting.value;

        let trackingProtectionMode = await browser.privacy.websites.trackingProtectionMode.get({});
        chameleon.settings.options.trackingProtectionMode = trackingProtectionMode.value;

        let peerConnectionEnabled = await browser.privacy.network.peerConnectionEnabled.get({});
        chameleon.settings.options.disableWebRTC = !peerConnectionEnabled.value;

        let webRTCIPHandlingPolicy = await browser.privacy.network.webRTCIPHandlingPolicy.get({});
        chameleon.settings.options.webRTCPolicy = webRTCIPHandlingPolicy.value;
      }

      let settings = Object.assign({}, chameleon.settings);
      settings.config.hasPrivacyPermission = !!browser.privacy;

      sendResponse(settings);
    })();
  } else if (request.action === 'init') {
    browser.runtime.sendMessage(
      {
        action: 'tempStore',
        data: chameleon.tempStore,
      },
      response => {
        if (browser.runtime.lastError) return;
      }
    );
    sendResponse('done');
  } else if (request.action === 'reloadInjectionScript') {
    chameleon.buildInjectionScript();
    sendResponse('done');
  } else if (request.action === 'reloadIPInfo') {
    if (chameleon.settings.options.timeZone === 'ip' || (chameleon.settings.headers.spoofAcceptLang.value === 'ip' && chameleon.settings.headers.spoofAcceptLang.enabled)) {
      chameleon.updateIPInfo();
      sendResponse('done');
    }
  } else if (request.action === 'reloadProfile') {
    chameleon.setTimer(request.data);
    chameleon.buildInjectionScript();
    sendResponse('done');
  } else if (request.action === 'reloadSpoofIP') {
    if (request.data[0].name === 'headers.spoofIP.enabled') {
      chameleon.settings.headers.spoofIP.enabled = request.data[0].value;
    } else if (request.data[0].name === 'headers.spoofIP.option') {
      chameleon.settings.headers.spoofIP.option = request.data[0].value;
    } else if (request.data[0].name === 'headers.spoofIP.rangeFrom') {
      chameleon.settings.headers.spoofIP.rangeFrom = request.data[0].value;
      chameleon.settings.headers.spoofIP.rangeTo = request.data[1].value;
    }

    chameleon.updateSpoofIP();
    sendResponse('done');
  } else if (request.action === 'reset') {
    chameleon.reset();
    browser.runtime.reload();
  } else if (request.action === 'updateIPRules') {
    chameleon.settings.ipRules = request.data;

    chameleon.timeout = setTimeout(() => {
      chameleon.saveSettings(chameleon.settings);
      sendResponse('done');
    }, 200);
  } else if (request.action === 'updateProfile') {
    chameleon.settings.profile.selected = request.data;

    // reset interval timer and send notification
    chameleon.setTimer();
    sendResponse('done');
  } else if (request.action === 'updateWhitelist') {
    chameleon.settings.whitelist = request.data;
    chameleon.updateProfileCache();

    chameleon.timeout = setTimeout(() => {
      chameleon.saveSettings(chameleon.settings);
      sendResponse('done');
    }, 200);
  } else if (request.action === 'validateSettings') {
    let res = chameleon.validateSettings(request.data);
    sendResponse(res);
  }

  return true;
};

browser.alarms.onAlarm.addListener(() => {
  chameleon.run();
});

browser.runtime.onMessage.addListener(messageHandler);

(async () => {
  await chameleon.init(await webext.getSettings(null));

  if (chameleon.settings.options.timeZone === 'ip' || (chameleon.settings.headers.spoofAcceptLang.value === 'ip' && chameleon.settings.headers.spoofAcceptLang.enabled)) {
    setTimeout(() => {
      chameleon.updateIPInfo();
    }, chameleon.settings.config.reloadIPStartupDelay * 1000);
  }

  if (!!browser.privacy) {
    await chameleon.changeBrowserSettings();
  }

  chameleon.setupHeaderListeners();
  chameleon.setTimer();

  webext.enableChameleon(chameleon.settings.config.enabled);
  chameleon.toggleContextMenu(chameleon.settings.whitelist.enabledContextMenu);

  /*
    Allow Chameleon to be controlled by another extension

    Enabled only in developer builds
  */
  if (browser.runtime.getManifest().version_name.includes('-')) {
    browser.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
      messageHandler(request, sender, sendResponse);

      return true;
    });
  }

  if (chameleon.platform.os != 'android') {
    browser.browserAction.setBadgeBackgroundColor({
      color: 'green',
    });
  }
})();
