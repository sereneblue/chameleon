let enableContextMenu = (enabled: boolean, rules: any): void => {
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
                browser.tabs.create({
                  url: browser.runtime.getURL(`/options/options.html#whitelist?id=${rule.id}&index=${rule.idx}`),
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
    });
  }
};

let findWhitelistRule = (rules: any, host: string, url: string): any => {
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
};

let ipConverter = (ip: any): number | string => {
  if (ip['type'] === 'full') {
    return (
      ip.data.split('.').reduce(function(ipInt: number, octet: string) {
        return (ipInt << 8) + parseInt(octet, 10);
      }, 0) >>> 0
    );
  }

  return (ip.num >>> 24) + '.' + ((ip.num >> 16) & 255) + '.' + ((ip.num >> 8) & 255) + '.' + (ip.num & 255);
};

let validateIPRange = (from: string, to: string): boolean => {
  return ipConverter({ data: from, type: 'full' }) <= ipConverter({ data: to, type: 'full' });
};

export default {
  enableContextMenu,
  findWhitelistRule,
  ipConverter,
  validateIPRange,
};
