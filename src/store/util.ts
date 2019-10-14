export default {
  enableChameleon: (enabled: boolean): void => {
    browser.runtime.getPlatformInfo().then(plat => {
      if (enabled === false && plat.os != 'android') {
        browser.browserAction.setIcon({
          path: '../icons/icon_disabled_48.png',
        });
      } else {
        browser.browserAction.setIcon({
          path: '../icons/icon_48.png',
        });
      }
    });
  },
  enableContextMenu: (enabled: boolean, rules: any): void => {
    browser.contextMenus.removeAll();

    if (enabled) {
      browser.runtime.getPlatformInfo().then(plat => {
        if (plat.os != 'android') {
          browser.contextMenus.create({
            id: 'chameleon-openInWhitelist',
            title: 'Open in whitelist editor',
            contexts: ['page'],
            onclick: function(details) {
              var l = document.createElement('a');
              l.href = details.pageUrl;

              if (['http:', 'https:'].includes(l.protocol)) {
                let rule = this.findWhitelistRule(rules, l.host, l.href);

                if (rule !== null) {
                  chrome.tabs.create({
                    url: chrome.runtime.getURL(`/options/options.html#whitelist?id=${rule.id}&index=${rule.idx}`),
                  });
                  return;
                }

                chrome.tabs.create({
                  url: chrome.runtime.getURL(`/options/options.html#whitelist?domain=${l.host}`),
                });
              }
            },
            icons: {
              '16': 'icon/icon_16.png',
              '32': 'icon/icon_32.png',
            },
          });
        }
      });
    }
  },
  findWhitelistRule: (rules: any, host: string, url: string): any => {
    for (var i = 0; i < rules.length; i++) {
      for (var j = 0; j < rules[i].domains.length; j++) {
        if (host.includes(rules[i].domains[j].domain)) {
          if (rules[i].domains[j].re) {
            if (!new RegExp(rules[i].domains[j].pattern).test(url)) {
              return null;
            }
          }

          return {
            id: rules[i].id,
            idx: j,
            profile: rules[i].profile,
          };
        }
      }
    }

    return null;
  },
};
