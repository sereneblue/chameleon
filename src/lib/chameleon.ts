import webext from './webext';

enum IntervalOption {
    None = 0,
    Custom = -1,
};

export class Chameleon {
  public settings: any;
  private defaultSettings: any;
  public intervalTimeout: any;
  public platform: any;
  public timeout: any;
  public version: string;

  constructor(initSettings: any) {
    this.settings = initSettings;
    this.defaultSettings = initSettings;
    this.intervalTimeout = null;
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

  public run(): void {}

  public setupTimer(): void {
    browser.alarms.clearAll();
      
    let alarmInfo = { when: Date.now() + 250 };

    if (this.settings.profile.interval.option != IntervalOption.None) {
      if (this.settings.profile.interval.option === IntervalOption.Custom) {
        if (!this.settings.profile.interval.min || !this.settings.profile.interval.max) return;

        let interval: number = (
                (Math.random() *
                (this.settings.profile.interval.max * 60 * 1000 - this.settings.profile.interval.min  * 60 * 1000)
               ) + this.settings.profile.interval.min  * 60 * 1000);

        /* 
          Use regular timeout for custom interval
          Allows irregular periods between alarm  
        */

        if (this.intervalTimeout) clearTimeout(this.intervalTimeout);
        this.intervalTimeout = setTimeout(this.setupTimer, interval);
      } else {
        alarmInfo["periodInMinutes"] = this.settings.profile.interval.option;
      }
    }

    browser.alarms.create(alarmInfo);
  }

  public start(): void {}

  public async saveSettings(settings: any) {
    await webext.setSettings({ ...settings, version: this.version });
  }
}
