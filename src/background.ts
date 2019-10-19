import store from './store';
import webext from './lib/webext';

class Chameleon {
  public settings: any;
  private defaultSettings: any;
  public timeout: any;
  public version: string;

  constructor(initSettings: any) {
    this.settings = initSettings;
    this.defaultSettings = initSettings;
    this.version = browser.runtime.getManifest().version;
  }

  public init(storedSettings: any): void {
    if (storedSettings.version < this.version) {
      this.migrate(storedSettings);
    }

    this.saveSettings(this.settings);
  }

  private migrate(prevSettings: any): void {}

  private reset(): void {
    this.saveSettings(this.defaultSettings);
  }

  public start(): void {}

  public saveSettings(settings: any): void {
    webext.setSettings({ ...settings, version: this.version });
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
  if (request.action == 'save') {
    if (chameleon.timeout) {
      clearTimeout(chameleon.timeout);
    }

    chameleon.timeout = setTimeout(() => {
      chameleon.settings = request.data;
      chameleon.saveSettings(request.data);
    }, 400);
  }

  return true;
});

(async () => {
  let settings: any = await webext.getSettings(null);
  chameleon.init(settings);
  chameleon.start();
})();
