import * as lang from '../lib/language';
import * as prof from '../lib/profiles';
import util from './util';
import webext from './webext';
import { Interceptor } from './intercept';

enum IntervalOption {
  None = 0,
  Custom = -1,
}

enum SpoofIPOption {
  Random = 0,
  Custom = 1,
}

interface TemporarySettings {
  ipInfo: any;
  profile: string;
  spoofIP: string;
}

export class Chameleon {
  public settings: any;
  private defaultSettings: any;
  private injectionScript: any;
  private intercept: Interceptor;
  private tabsFP: any;
  public intervalTimeout: any;
  public platform: any;
  public tempStore: TemporarySettings;
  public timeout: any;
  public version: string;

  constructor(initSettings: any) {
    this.settings = initSettings;
    this.defaultSettings = initSettings;
    this.tempStore = {
      ipInfo: {
        lang: '',
        tz: '',
      },
      profile: '',
      spoofIP: '',
    };
    this.injectionScript = null;
    this.intervalTimeout = null;
    this.tabsFP = {};
    this.version = browser.runtime.getManifest().version;
  }

  public async buildInjectionScript() {
    if (this.injectionScript) {
      await this.injectionScript.unregister();
      this.injectionScript = null;
    }

    this.injectionScript = await browser.contentScripts.register({
      allFrames: true,
      matchAboutBlank: true,
      matches: ['http://*/*', 'https://*/*'],
      excludeMatches: ['http://127.0.0.1/*', 'http://localhost/*'],
      js: [
        {
          code: `
        let chameleonSettings = JSON.parse(\`${JSON.stringify(this.settings)}\`);
        let chameleonSeed = ${Math.random() * 0.00000001};
      `,
        },
        { file: 'inject.js' },
      ],
      runAt: 'document_start',
    });
  }

  public async init(storedSettings: any) {
    if (storedSettings.version < this.version) {
      this.migrate(storedSettings);
    } else if (storedSettings.profile) {
      this.settings = storedSettings;
    }

    this.intercept = new Interceptor(this.settings, this.tempStore);
    this.platform = await browser.runtime.getPlatformInfo();
    await this.saveSettings(this.settings);
  }

  private migrate(prevSettings: any): void {}

  public reset(): void {
    this.saveSettings(this.defaultSettings);
  }

  public run(): void {
    this.start();

    if (this.settings.config.notificationsEnabled) {
      browser.notifications.create({
        type: 'basic',
        title: 'Chameleon',
        message: 'Profile changed!',
      });
    }
  }

  public setupHeaderListeners(): void {
    /* Block websocket connections */
    browser.webRequest.onBeforeRequest.addListener(
      details => {
        return this.intercept.blockWebsocket(details);
      },
      {
        urls: ['<all_urls>'],
      },
      ['blocking']
    );

    /* Modify request headers and block websocket long polling connections */
    browser.webRequest.onBeforeSendHeaders.addListener(
      details => {
        return this.intercept.modifyRequest(details);
      },
      {
        urls: ['<all_urls>'],
      },
      ['blocking', 'requestHeaders']
    );

    /* Block etags */
    browser.webRequest.onHeadersReceived.addListener(
      details => {
        return this.intercept.modifyResponse(details);
      },
      {
        urls: ['<all_urls>'],
      },
      ['blocking', 'responseHeaders']
    );
  }

  public getTabFPDetected(tabId: number): any {
    return this.tabsFP[tabId]
      ? this.tabsFP[tabId]
      : {
          audioContext: false,
          clientRects: false,
          date: false,
          screen: false,
          webSocket: false,
        };
  }

  public resetTabFP(tabId: number): void {
    this.tabsFP[tabId] = {
      audioContext: false,
      clientRects: false,
      date: false,
      screen: false,
      webSocket: false,
    };
  }

  public setTabFPDetected(tabId: number, fpDetected: string): void {
    if (!this.tabsFP[tabId]) {
      this.tabsFP[tabId] = {
        audioContext: false,
        clientRects: false,
        date: false,
        screen: false,
        webSocket: false,
      };
    }

    this.tabsFP[tabId][fpDetected] = true;
  }

  public setTimer(option = null): void {
    browser.alarms.clearAll();

    let alarmInfo = { when: Date.now() + 250 };

    if (option === null) option = this.settings.profile.interval.option;

    if (option != IntervalOption.None) {
      if (option === IntervalOption.Custom) {
        if (!this.settings.profile.interval.min || !this.settings.profile.interval.max) return;

        let interval: number =
          Math.random() * (this.settings.profile.interval.max * 60 * 1000 - this.settings.profile.interval.min * 60 * 1000) + this.settings.profile.interval.min * 60 * 1000;

        /* 
          Use regular timeout for custom interval
          Allows irregular periods between alarm  
        */

        if (this.intervalTimeout) clearTimeout(this.intervalTimeout);
        this.intervalTimeout = setTimeout(this.setTimer, interval);
      } else {
        alarmInfo['periodInMinutes'] = option;
      }
    }

    browser.alarms.create(alarmInfo);
  }

  public start(): void {
    this.updateProfile(this.settings.profile.selected);
    this.updateSpoofIP();
  }

  public async saveSettings(settings: any): Promise<void> {
    await webext.setSettings({ ...settings, version: this.version });
  }

  public async updateIPInfo(): Promise<void> {
    try {
      let res = await fetch('https://ipapi.co/json');
      let data = await res.json();
      let notificationMsg: string;

      if ((data.timezone && data.languages) || data.ip) {
        // check if IP defined in IP rules
        let foundRule: boolean;

        for (let i = 0; i < this.settings.ipRules.length; i++) {
          for (let j = 0; j < this.settings.ipRules[i].ips.length; j++) {
            if (util.ipInRange(data.ip, this.settings.ipRules[i].ips[j].split('-'))) {
              foundRule = true;
              this.tempStore.ipInfo.lang = this.settings.ipRules[i].lang;
              this.tempStore.ipInfo.tz = this.settings.ipRules[i].tz;

              notificationMsg = `Using IP Rule: ${this.tempStore.ipInfo.tz}, ${lang.getLanguage(this.tempStore.ipInfo.lang).name}`;
            }
          }
        }

        // if not defined, use info returned
        if (!foundRule) {
          if ((data.timezone === '' && this.settings.options.timeZone === 'ip') || (data.languages === '' && this.settings.headers.spoofAcceptLang.value === 'ip')) {
            throw 'Couldn\'t find info';
          }

          notificationMsg = `Using IP Info: `;

          if (this.settings.options.timeZone === 'ip') {
            this.settings.options.timeZone = data.timezone;
            notificationMsg = `${notificationMsg} ${data.timezone}${this.settings.headers.spoofAcceptLang.value === 'ip' ? ', ' : ''}`;
          }

          if (this.settings.headers.spoofAcceptLang.value === 'ip') {
            let ipLang: string = data.languages.split(',')[0];
            let allLanguages: lang.Language[] = lang.getAllLanguages();
            let foundLang: lang.Language = lang.getLanguage('en-US'); // use english as default lang

            if (ipLang !== 'en' && ipLang !== 'en-US') {
              foundLang = allLanguages.find(l => l.nav.includes(ipLang));

              if (foundLang !== null) {
                this.tempStore.ipInfo.lang = foundLang.value;
              } else {
                let languageIndexes = [];

                // find primary ip lang in existing langauges
                // compare with other returned results
                // get closest match
                let ipLangPrimary = ipLang.split('-')[0];
                if (ipLangPrimary !== 'en') {
                  for (let i = 0; i < allLanguages.length; i++) {
                    let idx = allLanguages.findIndex(l => l.nav.includes(ipLangPrimary));

                    if (idx > -1) {
                      languageIndexes.push([
                        idx > -1,
                        i, // language index
                        idx, // index of found primary ip lang
                      ]);
                    }
                  }
                }

                if (languageIndexes.length > 0) {
                  languageIndexes.sort((a: any, b: any): number => {
                    if (a[2] > b[2]) {
                      return 1;
                    }
                    if (a[2] < b[2]) {
                      return -1;
                    }
                    return 0;
                  });
                  foundLang = allLanguages[languageIndexes[0][1]];
                }

                this.tempStore.ipInfo.lang = foundLang.value;
              }
            }

            notificationMsg = `${notificationMsg} ${foundLang.name}`;
          }
        }

        browser.notifications.create({
          type: 'basic',
          title: 'Chameleon',
          message: notificationMsg,
        });
      }
    } catch (e) {
      browser.notifications.create({
        type: 'basic',
        title: 'Chameleon',
        message: 'Unable to get IP info',
      });
    }
  }

  public updateProfile(profile: string): void {
    // update current profile if random selected
    if (!/\d|none/.test(profile)) {
      let randProfile: string;
      let device: string | null;

      let profiles: prof.Generator = new prof.Generator();
      if (profile.includes('random')) {
        device = profile === 'random' ? null : profile.includes('Desktop') ? 'desktop' : 'mobile';
        this.tempStore.profile = profiles.getRandom(device, null);
      } else {
        this.tempStore.profile = profiles.getRandom(null, profile);
      }
    } else {
      this.tempStore.profile = '';
    }

    browser.runtime.sendMessage({
      action: 'tempStore',
      data: this.tempStore,
    });
  }

  public updateSpoofIP(): void {
    if (this.settings.headers.spoofIP.enabled) {
      if (this.settings.headers.spoofIP.option === SpoofIPOption.Random) {
        this.tempStore.spoofIP = util.generateIP();
      } else {
        let rangeFrom = util.ipToInt(this.settings.headers.spoofIP.rangeFrom);
        let rangeTo = util.ipToInt(this.settings.headers.spoofIP.rangeTo);

        this.tempStore.spoofIP = util.ipToString(Math.floor(Math.random() * (rangeTo - rangeFrom + 1) + rangeFrom));
      }
    }
  }
}
