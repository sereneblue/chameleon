import * as lang from '../lib/language';
import * as prof from '../lib/profiles';
import { getTimezones } from '../lib/tz';

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
  notifyId: string;
  profile: string;
  spoofIP: string;
}

export class Chameleon {
  public settings: any;
  private defaultSettings: any;
  private injectionScript: any;
  private intercept: Interceptor;
  private tabsFP: any;
  private REGEX_UUID: RegExp;
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
      notifyId: '',
      profile: '',
      spoofIP: '',
    };
    this.injectionScript = null;
    this.intervalTimeout = null;
    this.tabsFP = {};
    this.version = browser.runtime.getManifest().version;
    this.REGEX_UUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
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
            let settings = JSON.parse(\`${JSON.stringify(this.settings)}\`);
            let seed = ${Math.random() * 0.00000001};
            let notifyId = "${this.tempStore.notifyId}";
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

    this.tempStore.notifyId = 
      String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
      Math.random()
        .toString(36)
        .substring(Math.floor(Math.random() * 5) + 5);
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

    this.tempStore.notifyId = 
      String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
      Math.random()
        .toString(36)
        .substring(Math.floor(Math.random() * 5) + 5);
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
      let profiles: prof.Generator = new prof.Generator(this.settings.excluded);
      if (profile.includes('random')) {
        this.tempStore.profile = profiles.getRandomByDevice(profile);
      } else {
        this.tempStore.profile = profiles.getRandomByOS(profile);
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

  private checkValidOption(settingName: string, settingValue: any, possibleValues: any): any {
    if (possibleValues === 'boolean' && typeof settingValue === 'boolean') {
      return {
        error: false,
      };
    } else if (possibleValues === 'number' && typeof settingValue === 'number') {
      return {
        error: false,
      };
    } else if (possibleValues.includes(settingValue)) {
      return {
        error: false,
      };
    }

    return {
      error: true,
      msg: `Invalid setting value: ${settingName}`,
    };
  }

  public validateSettings(impSettings: any): object {
    let s: any = Object.assign({}, this.defaultSettings);

    let profiles = new prof.Generator().getAllProfiles();
    let keys = Object.keys(profiles);

    let profileIds: string[] = [];
    for (let k of keys) {
      profileIds = profileIds.concat(profiles[k].map(p => p.id));
    }

    let languageIds: string[] = lang.getAllLanguages().map(l => l.code);
    let timezoneIds: string[] = getTimezones().map(t => t.zone);

    if (impSettings.version > this.settings.version) {
      return {
        error: true,
        msg: 'Invalid settings: version is not accepted',
      };
    }

    if (!impSettings.config) {
      return {
        error: true,
        msg: 'Invalid settings: missing config',
      };
    } else {
      let options = [
        ['config.enabled', impSettings.config.enabled, 'boolean'],
        ['config.notificationsEnabled', impSettings.config.notificationsEnabled, 'boolean'],
        ['config.theme', impSettings.config.theme, ['light', 'dark']],
      ];

      for (let i = 0; i < options.length; i++) {
        let v = this.checkValidOption(options[i][0], options[i][1], options[i][2]);
        if (v.error) {
          return v;
        } else {
          let parts: string[] = options[i][0].split('.');
          let lastIndex: string = parts[parts.length - 1];
          let nSetting = parts.slice(0, -1).reduce((o, i) => o[i], s);
          let oSetting = parts.slice(0, -1).reduce((o, i) => o[i], impSettings);

          nSetting[lastIndex] = oSetting[lastIndex];
        }
      }
    }

    if (!impSettings.excluded) {
      return {
        error: true,
        msg: 'Invalid settings: missing excluded',
      };
    } else {
      if (!impSettings.excluded.every(p => profileIds.includes(p))) {
        return {
          error: true,
          msg: 'Invalid settings: excluded has an invalid profile',
        };
      } else {
        s.excluded = impSettings.excluded;
      }
    }

    if (!impSettings.ipRules) {
      return {
        error: true,
        msg: 'Invalid settings: missing IP rules',
      };
    } else {
      let seen = new Set();
      let hasDupes: boolean = impSettings.ipRules.some(r => {
        return seen.size === seen.add(r.id).size;
      });

      if (hasDupes) {
        return {
          error: true,
          msg: 'Invalid settings: duplicate IP rule id found',
        };
      }

      for (let i = 0; i < impSettings.ipRules.length; i++) {
        let options = [
          ['ipRule.lang', impSettings.ipRules[i].lang, languageIds],
          ['ipRule.tz', impSettings.ipRules[i].tz, getTimezones().map(t => t.zone)],
        ];

        for (let i = 0; i < options.length; i++) {
          let v = this.checkValidOption(options[i][0], options[i][1], options[i][2]);
          if (v.error) {
            return v;
          }
        }

        if (impSettings.ipRules[i].name === '') {
          return {
            error: true,
            msg: 'Invalid settings: missing IP rule name',
          };
        }

        if (!this.REGEX_UUID.test(impSettings.ipRules[i].id)) {
          return {
            error: true,
            msg: 'Invalid settings: invalid IP rule id',
          };
        }

        // validate ip range
        for (let j = 0; j < impSettings.ipRules[i].ips.length; j++) {
          let ipRange: string[] = impSettings.ipRules[i].ips[j].split('-');

          if (ipRange.length > 2 || (ipRange.length === 2 && !util.validateIPRange(ipRange[0], ipRange[1])) || (ipRange.length === 1 && !util.isValidIP(ipRange[0]))) {
            return {
              error: true,
              msg: 'Invalid settings: invalid IP rule IP range',
            };
          }
        }

        s.ipRules = impSettings.ipRules;
      }
    }

    if (!impSettings.profile) {
      return {
        error: true,
        msg: 'Invalid settings: missing profile',
      };
    } else {
      let options = [
        ['profile.selected', impSettings.profile.selected, profileIds.concat(['none', 'random', 'randomDesktop', 'randomMobile'])],
        ['profile.interval.option', impSettings.profile.interval.option, [0, 1]],
        ['profile.interval.min', impSettings.profile.interval.min, 'number'],
        ['profile.interval.max', impSettings.profile.interval.max, 'number'],
      ];

      for (let i = 0; i < options.length; i++) {
        let v = this.checkValidOption(options[i][0], options[i][1], options[i][2]);
        if (v.error) {
          return v;
        } else {
          let parts: string[] = options[i][0].split('.');
          let lastIndex: string = parts[parts.length - 1];
          let nSetting = parts.slice(0, -1).reduce((o, i) => o[i], s);
          let oSetting = parts.slice(0, -1).reduce((o, i) => o[i], impSettings);

          nSetting[lastIndex] = oSetting[lastIndex];
        }
      }
    }

    if (!impSettings.headers) {
      return {
        error: true,
        msg: 'Invalid settings: missing headers',
      };
    } else {
      let options = [
        ['headers.blockEtag', impSettings.headers.blockEtag, 'boolean'],
        ['headers.enableDNT', impSettings.headers.enableDNT, 'boolean'],
        ['headers.referer.disabled', impSettings.headers.referer.disabled, 'boolean'],
        ['headers.referer.xorigin', impSettings.headers.referer.xorigin, [0, 1, 2]],
        ['headers.referer.trimming', impSettings.headers.referer.trimming, [0, 1, 2]],
        ['headers.spoofAcceptLang.enabled', impSettings.headers.spoofAcceptLang.enabled, 'boolean'],
        ['headers.spoofAcceptLang.value', impSettings.headers.spoofAcceptLang.value, languageIds.concat(['default', 'ip'])],
        ['headers.spoofIP.enabled', impSettings.headers.spoofIP.enabled, 'boolean'],
        ['headers.spoofIP.option', impSettings.headers.spoofIP.option, [0, 1]],
      ];

      for (let i = 0; i < options.length; i++) {
        let v = this.checkValidOption(options[i][0], options[i][1], options[i][2]);
        if (v.error) {
          return v;
        } else {
          let parts: string[] = options[i][0].split('.');
          let lastIndex: string = parts[parts.length - 1];
          let nSetting = parts.slice(0, -1).reduce((o, i) => o[i], s);
          let oSetting = parts.slice(0, -1).reduce((o, i) => o[i], impSettings);

          nSetting[lastIndex] = oSetting[lastIndex];
        }
      }

      if (impSettings.headers.spoofIP.rangeFrom && impSettings.headers.spoofIP.rangeTo) {
        if (!util.validateIPRange(impSettings.headers.spoofIP.rangeFrom, impSettings.headers.spoofIP.rangeTo)) {
          return {
            error: true,
            msg: 'Invalid settings: Spoof header IP range is invalid',
          };
        } else {
          s.headers.spoofIP.rangeFrom = impSettings.headers.spoofIP.rangeFrom;
          s.headers.spoofIP.rangeTo = impSettings.headers.spoofIP.rangeTo;
        }
      }
    }

    if (!impSettings.options) {
      return {
        error: true,
        msg: 'Invalid settings: missing options',
      };
    } else {
      let options = [
        ['options.disableWebRTC', impSettings.options.disableWebRTC, 'boolean'],
        ['options.firstPartyIsolate', impSettings.options.firstPartyIsolate, 'boolean'],
        ['options.limitHistory', impSettings.options.limitHistory, 'boolean'],
        ['options.protectKBFingerprint.enabled', impSettings.options.protectKBFingerprint.enabled, 'boolean'],
        ['options.protectKBFingerprint.delay', impSettings.options.protectKBFingerprint.delay, 'number'],
        ['options.protectWinName', impSettings.options.protectWinName, 'boolean'],
        ['options.resistFingerprinting', impSettings.options.resistFingerprinting, 'boolean'],
        ['options.spoofAudioContext', impSettings.options.spoofAudioContext, 'boolean'],
        ['options.spoofClientRects', impSettings.options.spoofClientRects, 'boolean'],
        ['options.screenSize', impSettings.options.screenSize, ['default', 'profile', '1366x768', '1440x900', '1600x900', '1920x1080', '2560x1440', '2560x1600']],
        ['options.timeZone', impSettings.options.timeZone, timezoneIds.concat(['default', 'ip'])],
        ['options.cookiePolicy', impSettings.options.cookiePolicy, ['allow_all', 'allow_visited', 'reject_all', 'reject_third_party', 'reject_trackers']],
        ['options.trackingProtectionMode', impSettings.options.trackingProtectionMode, ['always', 'never', 'private_browsing']],
        [
          'options.webRTCPolicy',
          impSettings.options.webRTCPolicy,
          ['default', 'default_public_and_private_interfaces', 'default_public_interface_only', 'disable_non_proxied_udp'],
        ],
        ['options.webSockets', impSettings.options.webSockets, ['allow_all', 'block_3rd_party', 'block_all']],
      ];

      for (let i = 0; i < options.length; i++) {
        let v = this.checkValidOption(options[i][0], options[i][1], options[i][2]);
        if (v.error) {
          return v;
        } else {
          let parts: string[] = options[i][0].split('.');
          let lastIndex: string = parts[parts.length - 1];
          let nSetting = parts.slice(0, -1).reduce((o, i) => o[i], s);
          let oSetting = parts.slice(0, -1).reduce((o, i) => o[i], impSettings);

          nSetting[lastIndex] = oSetting[lastIndex];
        }
      }
    }

    if (!impSettings.whitelist) {
      return {
        error: true,
        msg: 'Invalid settings: missing whitelist',
      };
    } else {
      let seen = new Set();
      let hasDupes: boolean = impSettings.whitelist.rules.some(r => {
        return seen.size === seen.add(r.id).size;
      });

      if (hasDupes) {
        return {
          error: true,
          msg: 'Invalid settings: duplicate whitelist rule id found',
        };
      }

      let options = [
        ['whitelist.enabled', impSettings.whitelist.enabled, 'boolean'],
        ['whitelist.enabledContextMenu', impSettings.whitelist.enabledContextMenu, 'boolean'],
        ['whitelist.defaultProfile', impSettings.whitelist.defaultProfile, profileIds.concat(['none'])],
      ];

      for (let i = 0; i < options.length; i++) {
        let v = this.checkValidOption(options[i][0], options[i][1], options[i][2]);
        if (v.error) {
          return v;
        } else {
          let parts: string[] = options[i][0].split('.');
          let lastIndex: string = parts[parts.length - 1];
          let nSetting = parts.slice(0, -1).reduce((o, i) => o[i], s);
          let oSetting = parts.slice(0, -1).reduce((o, i) => o[i], impSettings);

          nSetting[lastIndex] = oSetting[lastIndex];
        }
      }

      for (let i = 0; i < impSettings.whitelist.rules.length; i++) {
        let options = [
          ['whitelist.rules.lang', impSettings.whitelist.rules[i].lang, languageIds],
          ['whitelist.rules.profile', impSettings.whitelist.rules[i].profile, profileIds.concat(['default', 'none'])],
        ];

        for (let i = 0; i < options.length; i++) {
          let v = this.checkValidOption(options[i][0], options[i][1], options[i][2]);
          if (v.error) {
            return v;
          }
        }

        if (impSettings.whitelist.rules[i].name === '') {
          return {
            error: true,
            msg: 'Invalid settings: missing whitelist rule name',
          };
        }

        if (!this.REGEX_UUID.test(impSettings.whitelist.rules[i].id)) {
          return {
            error: true,
            msg: 'Invalid settings: invalid whitelist rule id',
          };
        }

        if (impSettings.whitelist.rules[i].spoofIP && !util.isValidIP(impSettings.whitelist.rules[i].spoofIP)) {
          return {
            error: true,
            msg: 'Invalid settings: invalid whitelist rule spoof IP',
          };
        }

        // validate whitelist options
        let keys = Object.keys(impSettings.whitelist.rules[i].options);
        if (
          keys.length !== 4 ||
          !keys.includes('name') ||
          !keys.includes('ref') ||
          !keys.includes('tz') ||
          !keys.includes('ws') ||
          typeof impSettings.whitelist.rules[i].options.name != 'boolean' ||
          typeof impSettings.whitelist.rules[i].options.ref != 'boolean' ||
          typeof impSettings.whitelist.rules[i].options.tz != 'boolean' ||
          typeof impSettings.whitelist.rules[i].options.ws != 'boolean'
        ) {
          return {
            error: true,
            msg: 'Invalid settings: invalid whitelist rule options',
          };
        }
      }

      s.whitelist = impSettings.whitelist;
    }

    setTimeout(async () => {
      await this.saveSettings(s);
      browser.runtime.reload();
    }, 2500);

    return {
      error: false,
      msg: 'Successfully imported settings. Reloading extension...',
    };
  }
}
