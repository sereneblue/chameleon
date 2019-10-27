import store from './store';
import webext from './lib/webext';
import util from './lib/util';

class Chameleon {
  public settings: any;
  private defaultSettings: any;
  public platform: any;
  public timeout: any;
  public version: string;

  constructor(initSettings: any) {
    this.settings = initSettings;
    this.defaultSettings = initSettings;
    this.version = browser.runtime.getManifest().version;
  }

  public async init(storedSettings: any) {
    if (storedSettings.version < this.version) {
      this.migrate(storedSettings);
    } else {
      this.settings = storedSettings;
    }

    this.platform = await browser.runtime.getPlatformInfo();
    this.saveSettings(this.settings);
  }

  private migrate(prevSettings: any): void {}

  private reset(): void {
    this.saveSettings(this.defaultSettings);
  }

  public start(): void {}

  public async saveSettings(settings: any) {
    await webext.setSettings({ ...settings, version: this.version });
  }
}

let chameleon = new Chameleon(JSON.parse(JSON.stringify(store.state)));

browser.runtime.onInstalled.addListener((details: any) => {
  if (!details.temporary && details.reason === 'install') {
    browser.tabs.create({
      url: 'https://sereneblue.github.io/chameleon',
    });
  }
});

browser.runtime.onMessage.addListener((request: any) => {
  if (request.action === 'save') {
    if (chameleon.timeout) {
      clearTimeout(chameleon.timeout);
    }

    chameleon.timeout = setTimeout(() => {
      chameleon.settings = request.data;
      chameleon.saveSettings(request.data);
    }, 400);
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
  }

  return true;
});

(async () => {
  let settings: any = await webext.getSettings(null);
  await chameleon.init(settings);
  chameleon.start();
})();
