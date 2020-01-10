import { Chameleon } from './lib/chameleon';
import store from './store';
import webext from './lib/webext';
import util from './lib/util';

webext.firstTimeInstall();

let chameleon = new Chameleon(JSON.parse(JSON.stringify(store.state)));

browser.alarms.onAlarm.addListener(alarmInfo => {
  chameleon.run();
});

browser.runtime.onMessage.addListener((request: any) => {
  if (request.action === 'save') {
    if (chameleon.timeout) {
      clearTimeout(chameleon.timeout);
    }

    chameleon.timeout = setTimeout(() => {
      chameleon.settings = Object.assign(chameleon.settings, request.data);
      chameleon.saveSettings(request.data);
    }, 300);
  } else if (request.action === 'contextMenu') {
    browser.contextMenus.removeAll();

    if (request.data && chameleon.platform.os != 'android') {
      browser.contextMenus.create({
        id: 'chameleon-openInWhitelist',
        title: 'Open in whitelist editor',
        contexts: ['page'],
        onclick: function(details) {
          var l = document.createElement('a');
          l.href = details.pageUrl;

          if (['http:', 'https:'].includes(l.protocol)) {
            let rule = util.findWhitelistRule(chameleon.settings.whitelist.rules, l.host, l.href);

            if (rule !== null) {
              browser.tabs.create({
                url: browser.runtime.getURL(`/options/options.html#whitelist?id=${rule.id}}`),
              });
              return;
            }

            browser.tabs.create({
              url: browser.runtime.getURL(`/options/options.html#whitelist?domain=${l.host}`),
            });
          }
        },
        icons: {
          '16': 'icon/icon_16.png',
          '32': 'icon/icon_32.png',
        },
      });
    }
  } else if (request.action === 'reloadInjectionScript') {
    chameleon.buildInjectionScript();
  } else if (request.action === 'reloadIPInfo') {
    if (chameleon.settings.options.timeZone === 'ip' || chameleon.settings.headers.spoofAcceptLang.value === 'ip') {
      chameleon.updateIPInfo();
    } else {
      browser.notifications.create({
        type: 'basic',
        title: 'Chameleon',
        message: 'Neither timezone or Language are set to use IP.',
      });
    }
  } else if (request.action === 'reloadProfile') {
    chameleon.setTimer(request.data);
    chameleon.buildInjectionScript();
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
  } else if (request.action === 'tempStore') {
    browser.runtime.sendMessage({
      action: 'tempStore',
      data: chameleon.tempStore,
    });
  } else if (request.action === 'updateProfile') {
    chameleon.settings.profile.selected = request.data;

    // reset interval timer and send notification
    chameleon.setTimer();
  }

  return true;
});

(async () => {
  await chameleon.init(await webext.getSettings(null));
  await chameleon.buildInjectionScript();
  chameleon.setupHeaderListeners();
  chameleon.setTimer();
  if (chameleon.settings.options.timeZone === 'ip' || chameleon.settings.headers.spoofAcceptLang.value === 'ip') {
    chameleon.updateIPInfo();
  }
})();
