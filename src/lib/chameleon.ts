import * as lang from '../lib/language';
import * as prof from '../lib/profiles';
import { getTimezones } from '../lib/tz';

import util from './util';
import webext from './webext';
import { Interceptor } from './intercept';
import { v4 as uuidv4 } from 'uuid';

enum IntervalOption {
  None = 0,
  Custom = -1,
}

enum SpoofIPOption {
  Random = 0,
  Custom = 1,
}

interface TemporarySettings {
  badge: any;
  ipInfo: any;
  profile: string;
  screenSize: string;
  spoofIP: string;
  version: string;
}

export class Chameleon {
  public settings: any;
  private defaultSettings: any;
  private injectionScript: any;
  private intercept: Interceptor;
  private profileCache: any;
  private REGEX_UUID: RegExp;
  public intervalTimeout: any;
  public platform: any;
  private browserInfo: any;
  public tempStore: TemporarySettings;
  public timeout: any;
  public updateContextMenu: Function;
  public version: string;

  constructor(initSettings: any) {
    this.settings = initSettings;
    this.defaultSettings = initSettings;
    this.tempStore = {
      badge: {
        text: '',
        title: '',
      },
      ipInfo: {
        cache: null,
        lang: '',
        tz: '',
      },
      profile: '',
      screenSize: '',
      spoofIP: '',
      version: '',
    };
    this.injectionScript = null;
    this.intervalTimeout = null;
    this.profileCache = {};
    this.version = browser.runtime.getManifest().version;
    this.REGEX_UUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

    this.updateContextMenu = (info, tab) => {
      browser.contextMenus.removeAll();

      // remove menu ids
      for (let i = 0; i < this.settings.whitelist.rules.length; i++) {
        browser.contextMenus.remove('chameleon-rule-' + this.settings.whitelist.rules[i].id);
      }

      // check if site already in whitelist
      let l = document.createElement('a');
      l.href = info.pageUrl;

      let rule = util.findWhitelistRule(this.settings.whitelist.rules, l.host, info.pageUrl);

      if (rule) {
        browser.contextMenus.create({
          id: 'chameleon-rule-' + rule.id,
          title: browser.i18n.getMessage('text-removeFromRule', rule.name),
          contexts: ['page'],
          onclick: details => {
            let l = document.createElement('a');
            l.href = details.pageUrl;

            if (['http:', 'https:'].includes(l.protocol)) {
              const ruleIndex = this.settings.whitelist.rules.findIndex(r => r.id === rule.id);

              if (ruleIndex > -1) {
                this.settings.whitelist.rules[ruleIndex].sites.splice(rule.siteIndex, 1);
                this.saveSettings(this.settings);
                this.buildInjectionScript();
              }
            }
          },
        });
      } else {
        // create new rule
        browser.contextMenus.create({
          id: 'chameleon-openInWhitelist',
          title: browser.i18n.getMessage('text-createNewRule'),
          contexts: ['page'],
          onclick: function(details) {
            var l = document.createElement('a');
            l.href = details.pageUrl;

            if (['http:', 'https:'].includes(l.protocol)) {
              browser.tabs.create({
                url: browser.runtime.getURL(`/options/options.html#whitelist?site=${l.host}`),
              });
            }
          },
        });

        for (let i = 0; i < this.settings.whitelist.rules.length; i++) {
          browser.contextMenus.create({
            id: 'chameleon-rule-' + this.settings.whitelist.rules[i].id,
            title: browser.i18n.getMessage('text-addToRule', this.settings.whitelist.rules[i].name),
            contexts: ['page'],
            onclick: details => {
              let l = document.createElement('a');
              l.href = details.pageUrl;

              if (['http:', 'https:'].includes(l.protocol)) {
                this.settings.whitelist.rules[i].sites.push({
                  domain: l.host,
                });
                this.saveSettings(this.settings);
                this.buildInjectionScript();
              }
            },
          });
        }
      }

      browser.contextMenus.refresh();
    };
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
      js: [
        {
          code: `
            let settings = JSON.parse(\`${JSON.stringify(this.settings)}\`);
            let tempStore = JSON.parse(\`${JSON.stringify(this.tempStore)}\`);
            let profileCache = JSON.parse(\`${JSON.stringify(this.profileCache)}\`);
            let seed = ${Math.random() * 0.00000001};
            let randObjName = '${String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
              Math.random()
                .toString(36)
                .substring(Math.floor(Math.random() * 5) + 5)}';
          `,
        },
        { file: 'inject.js' },
      ],
      runAt: 'document_start',
    });
  }

  public async changeBrowserSettings(): Promise<void> {
    await browser.privacy.websites.cookieConfig.set({
      value: {
        behavior: this.settings.options.cookiePolicy,
        nonPersistentCookies: this.settings.options.cookieNotPersistent,
      },
    });

    ['firstPartyIsolate', 'resistFingerprinting', 'trackingProtectionMode'].forEach(async key => {
      await browser.privacy.websites[key].set({
        value: this.settings.options[key],
      });
    });

    await browser.privacy.network.peerConnectionEnabled.set({
      value: !this.settings.options.disableWebRTC,
    });

    await browser.privacy.network.webRTCIPHandlingPolicy.set({
      value: this.settings.options.webRTCPolicy,
    });
  }

  public cleanSettings(): void {
    if (typeof this.settings.options.protectKBFingerprint.delay === 'string') {
      this.settings.options.protectKBFingerprint.delay = Number(this.settings.options.protectKBFingerprint.delay);
    }

    if (typeof this.settings.headers.referer.xorigin === 'string') {
      this.settings.headers.referer.xorigin = Number(this.settings.headers.referer.xorigin);
    }

    if (typeof this.settings.headers.referer.trimming === 'string') {
      this.settings.headers.referer.trimming = Number(this.settings.headers.referer.trimming);
    }

    if (this.settings.settings) {
      delete this.settings.settings;
    }

    // updated whitelist options introduced in v0.22
    let newOptions = ['audioContext', 'clientRects', 'cssExfil', 'mediaDevices'];

    for (let i = 0; i < this.settings.whitelist.rules.length; i++) {
      for (let j = 0; j < newOptions.length; j++) {
        if (!(newOptions[j] in this.settings.whitelist.rules[i].options)) {
          this.settings.whitelist.rules[i].options[newOptions[j]] = false;
        }
      }
    }

    this.settings.config.reloadIPStartupDelay = this.settings.config.reloadIPStartupDelay || 0;
  }

  public async init(storedSettings: any): Promise<void> {
    if (/^0\.12/.test(storedSettings.version)) {
      this.migrateLegacy(storedSettings);
    } else {
      if (storedSettings.options) {
        this.settings = storedSettings;
      } else {
        this.settings = this.defaultSettings;
      }
    }

    this.cleanSettings();

    if (!!browser.privacy) {
      // get current modified preferences
      let cookieSettings = await browser.privacy.websites.cookieConfig.get({});
      this.settings.options.cookieNotPersistent = cookieSettings.value.nonPersistentCookies;
      this.settings.options.cookiePolicy = cookieSettings.value.behavior;

      let firstPartyIsolate = await browser.privacy.websites.firstPartyIsolate.get({});
      this.settings.options.firstPartyIsolate = firstPartyIsolate.value;

      let resistFingerprinting = await browser.privacy.websites.resistFingerprinting.get({});
      this.settings.options.resistFingerprinting = resistFingerprinting.value;

      let trackingProtectionMode = await browser.privacy.websites.trackingProtectionMode.get({});
      this.settings.options.trackingProtectionMode = trackingProtectionMode.value;

      let peerConnectionEnabled = await browser.privacy.network.peerConnectionEnabled.get({});
      this.settings.options.disableWebRTC = !peerConnectionEnabled.value;

      let webRTCIPHandlingPolicy = await browser.privacy.network.webRTCIPHandlingPolicy.get({});
      this.settings.options.webRTCPolicy = webRTCIPHandlingPolicy.value;
    }

    this.platform = await browser.runtime.getPlatformInfo();
    this.browserInfo = await browser.runtime.getBrowserInfo();

    this.tempStore.version = this.browserInfo.version;

    this.intercept = new Interceptor(this.settings, this.tempStore, this.profileCache, parseInt(this.browserInfo.version) < 90);

    await this.saveSettings(this.settings);
  }

  private getProfileInUse(): void {
    if (this.settings.profile.selected === 'none' || this.settings.excluded.includes(this.settings.profile.selected) || this.tempStore.profile === 'none') {
      this.tempStore.badge = {
        text: '',
        title: browser.i18n.getMessage('text-realProfile'),
      };
    } else {
      let profiles: any = new prof.Generator().getAllProfiles();
      for (let k of Object.keys(profiles)) {
        let found = profiles[k].find(p => p.id == (/\d/.test(this.settings.profile.selected) ? this.settings.profile.selected : this.tempStore.profile));

        if (found != null) {
          this.tempStore.badge = {
            text: found.badge,
            title: found.name,
          };
        }
      }
    }
  }

  private migrateLegacy(prev: any, importing: boolean = false): object {
    let s: any = Object.assign({}, this.defaultSettings);
    let msg: string = '';

    let languages: lang.Language[] = lang.getAllLanguages();
    let profiles = new prof.Generator().getAllProfiles();
    let timezoneIds: string[] = getTimezones().map(t => t.zone);
    let mappedProfiles = {
      custom: ' none',
      real: 'none',
      none: 'none',
      random: 'random',
      randomDesktop: 'randomDesktop',
      randomMobile: 'randomMobile',
      random_win: 'windows',
      random_mac: 'macOS',
      random_linux: 'linux',
      random_ios: 'iOS',
      random_android: 'android',
      win1: 'win1-gcr',
      win2: 'win2-gcr',
      win3: 'win3-gcr',
      win4: 'win4-gcr',
      win6: 'win1-ff',
      win7: 'win2-ff',
      win8: 'win3-ff',
      win9: 'win4-ff',
      win10: 'win2-ie',
      win11: 'win1-ie',
      win12: 'win3-ie',
      win13: 'win1-esr',
      win14: 'win3-esr',
      win15: 'win4-esr',
      win16: 'win4-ie',
      mac1: 'mac1-gcr',
      mac2: 'mac2-gcr',
      mac3: 'mac1-ff',
      mac4: 'mac2-ff',
      mac5: 'mac1-sf',
      mac6: 'mac2-sf',
      mac7: 'mac3-sf',
      mac8: 'mac1-esr',
      linux1: 'lin1-gcr',
      linux2: 'lin2-gcr',
      linux3: 'lin3-gcr',
      linux4: 'lin1-cr',
      linux5: 'lin2-cr',
      linux6: 'lin3-cr',
      linux7: 'lin1-ff',
      linux8: 'lin2-ff',
      linux9: 'lin3-ff',
      linux10: 'lin1-esr',
      linux11: 'lin3-esr',
      ios1: 'ios1-sfm',
      ios2: 'ios1-sft',
      ios3: 'ios1-gcrm',
      ios4: 'ios2-sft',
      ios5: 'ios2-gcrm',
      ios6: 'ios2-sfm',
      ios7: 'ios3-sfm',
      ios8: 'ios3-sft',
      ios9: 'ios3-gcrm',
      android1: 'and4-ff',
      android2: 'and1-gcrm',
      android3: 'and1-gcrm',
      android4: 'and2-gcrm',
      android5: 'and2-gcrm',
      android6: 'and3-gcrm',
      android7: 'and3-gcrm',
      android8: 'and3-gcrm',
      android9: 'and4-gcrm',
    };

    if (!prev.settings && importing) {
      msg = browser.i18n.getMessage('options-import-invalid-settings');

      return {
        error: true,
        msg,
      };
    } else {
      if (importing) {
        let options = [
          ['config.notificationsEnabled', prev.settings.notificationsEnabled, 'boolean'],
          ['options.limitHistory', prev.settings.limitHistory, 'boolean'],
          ['options.protectWinName', prev.settings.protectWinName, 'boolean'],
          ['profile.interval.option', prev.settings.interval, [0, -1, 1, 5, 10, 20, 30, 40, 50, 60]],
          ['profile.interval.min', prev.settings.minInterval === null ? 1 : prev.settings.minInterval, 'number'],
          ['profile.interval.max', prev.settings.maxInterval === null ? 1 : prev.settings.maxInterval, 'number'],
          ['options.spoofClientRects', prev.settings.spoofClientRects, 'boolean'],
          ['options.spoofAudioContext', prev.settings.spoofAudioContext, 'boolean'],
          ['options.webSockets', prev.settings.webSockets, ['allow_all', 'block_3rd_party', 'block_all']],
          ['options.protectKBFingerprint.enabled', prev.settings.protectKeyboardFingerprint, 'boolean'],
          ['options.protectKBFingerprint.delay', prev.settings.kbDelay, 'number'],
          ['options.screenSize', prev.settings.screenSize, ['default', 'profile', '1366x768', '1440x900', '1600x900', '1920x1080', '2560x1440', '2560x1600']],
          ['options.timeZone', prev.settings.timeZone, timezoneIds.concat(['default', 'ip'])],
        ];

        for (let i = 0; i < options.length; i++) {
          let v = this.checkValidOption(options[i][0], options[i][1], options[i][2]);
          if (v.error) {
            return v;
          }
        }
      }

      s.config.notificationsEnabled = prev.settings.notificationsEnabled;
      s.options.limitHistory = prev.settings.limitHistory;
      s.options.protectWinName = prev.settings.protectWinName;
      s.profile.interval.option = prev.settings.interval;
      s.profile.interval.min = prev.settings.minInterval === null ? 1 : prev.settings.minInterval;
      s.profile.interval.max = prev.settings.maxInterval === null ? 1 : prev.settings.maxInterval;
      s.options.spoofClientRects = prev.settings.spoofClientRects;
      s.options.spoofAudioContext = prev.settings.spoofAudioContext;
      s.options.webSockets = prev.settings.webSockets;
      s.options.protectKBFingerprint.enabled = prev.settings.protectKeyboardFingerprint;
      s.options.protectKBFingerprint.delay = prev.settings.kbDelay;
      s.options.screenSize = prev.settings.screenSize;
      s.options.timeZone = prev.settings.timeZone;

      if (prev.settings.useragent) {
        if (prev.settings.useragent in mappedProfiles) {
          s.profile.selected = mappedProfiles[prev.settings.useragent];
        } else {
          if (importing) {
            msg = browser.i18n.getMessage('options-import-invalid-profile');

            return {
              error: true,
              msg,
            };
          }
        }
      }
    }

    if (!prev.headers && importing) {
      msg = browser.i18n.getMessage('options-import-invalid-headers');

      return {
        error: true,
        msg,
      };
    } else {
      let spoofLangValue: string = '';

      if (prev.headers.spoofAcceptLangValue === '') {
        spoofLangValue = 'default';
      } else if (prev.headers.spoofAcceptLangValue === 'ip') {
        spoofLangValue = 'ip';
      } else {
        spoofLangValue = languages.find(l => l.value === prev.headers.spoofAcceptLangValue).code;
      }

      if (importing) {
        // can be a string...sometimes??
        prev.headers.refererXorigin = Number(prev.headers.refererXorigin) || 0;
        prev.headers.refererTrimming = Number(prev.headers.refererTrimming) || 0;

        let options = [
          ['headers.blockEtag', prev.headers.blockEtag, 'boolean'],
          ['headers.enableDNT', prev.headers.enableDNT, 'boolean'],
          ['headers.referer.disabled', prev.headers.disableRef, 'boolean'],
          ['headers.referer.xorigin', prev.headers.refererXorigin, [0, 1, 2]],
          ['headers.referer.trimming', prev.headers.refererTrimming, [0, 1, 2]],
          ['headers.spoofAcceptLang.enabled', prev.headers.spoofAcceptLang, 'boolean'],
          ['headers.spoofAcceptLang.value', spoofLangValue, ['default', 'ip'].concat(languages.map(l => l.code))],
          ['headers.spoofIP.enabled', prev.headers.spoofIP, 'boolean'],
          ['headers.spoofIP.option', Number(prev.headers.spoofIPValue), [0, 1]],
          ['headers.spoofIP.rangeFrom', util.isValidIP(prev.headers.rangeFrom), 'boolean'],
          ['headers.spoofIP.rangeTo', util.isValidIP(prev.headers.rangeTo), 'boolean'],
        ];

        for (let i = 0; i < options.length; i++) {
          let v = this.checkValidOption(options[i][0], options[i][1], options[i][2]);
          if (v.error) {
            return v;
          }
        }
      }

      s.headers.blockEtag = prev.headers.blockEtag;
      s.headers.enableDNT = prev.headers.enableDNT;
      s.headers.referer.disabled = prev.headers.disableRef;
      s.headers.referer.xorigin = prev.headers.refererXorigin;
      s.headers.referer.trimming = prev.headers.refererTrimming;
      s.headers.spoofAcceptLang.enabled = prev.headers.spoofAcceptLang;
      s.headers.spoofAcceptLang.value = spoofLangValue;
      s.headers.spoofIP.enabled = prev.headers.spoofIP;
      s.headers.spoofIP.option = prev.headers.spoofIPValue;
      s.headers.spoofIP.rangeFrom = prev.headers.rangeFrom;
      s.headers.spoofIP.rangeTo = prev.headers.rangeTo;
    }

    if (!prev.excluded && importing) {
      msg = browser.i18n.getMessage('options-import-invalid-excluded');

      return {
        error: true,
        msg,
      };
    } else {
      let excludedProfiles = new Set();

      ['win', 'mac', 'linux', 'ios', 'android'].forEach(platform => {
        prev.excluded[platform].filter((isExcluded: boolean, i: number) => {
          if (isExcluded) {
            if (`${platform}${i + 1}` === 'win5') {
              // exclude all edge profiles
              excludedProfiles.add('win1-edg');
              excludedProfiles.add('win2-edg');
              excludedProfiles.add('win3-edg');
              excludedProfiles.add('win4-edg');
            } else {
              excludedProfiles.add(mappedProfiles[`${platform}${i + 1}`]);
            }
          }
        });
      });

      // assumes that if all esr versions were excluded then this one should be too
      if (prev.excluded.win[12] && prev.excluded.win[13] && prev.excluded.win[14]) {
        excludedProfiles.add('win2-esr');
      }

      let platforms = ['windows', 'macOS', 'linux', 'iOS', 'android'];
      prev.excluded.all.filter((isExcluded: boolean, i: number) => {
        if (isExcluded) {
          profiles[platforms[i]].forEach(p => {
            excludedProfiles.add(p.id);
          });
        }
      });

      s.excluded = Array.from(excludedProfiles);
    }

    if (!prev.ipRules && importing) {
      msg = browser.i18n.getMessage('options-import-invalid-ipRules');

      return {
        error: true,
        msg,
      };
    } else {
      for (let i = 0; i < prev.ipRules.length; i++) {
        let ipRule: any = {};

        ipRule.id = uuidv4();
        ipRule.name = `Rule #${i + 1}`;
        ipRule.lang = languages.find(l => l.name == prev.ipRules[i].lang).code;
        ipRule.tz = prev.ipRules[i].tz;
        ipRule.ips = [];

        for (let j = 0; j < prev.ipRules[i].ip.length; j++) {
          ipRule.ips.push(util.getIPRange(prev.ipRules[i].ip[j]));
        }

        s.ipRules.push(ipRule);
      }
    }

    if (!prev.whitelist && importing) {
      msg = browser.i18n.getMessage('options-import-invalid-whitelist');

      return {
        error: true,
        msg,
      };
    } else {
      if (importing) {
        let options = [
          ['whitelist.enabledContextMenu', prev.whitelist.enabledContextMenu, 'boolean'],
          ['whitelist.defaultProfile', prev.whitelist.defaultProfile, Object.keys(mappedProfiles)],
        ];

        for (let i = 0; i < options.length; i++) {
          let v = this.checkValidOption(options[i][0], options[i][1], options[i][2]);
          if (v.error) {
            return v;
          }
        }
      }

      s.whitelist.enabledContextMenu = prev.whitelist.enabledContextMenu;
      s.whitelist.defaultProfile = mappedProfiles[prev.whitelist.defaultProfile];
      s.whitelist.rules = [];

      for (let i = 0; i < prev.whitelist.urlList.length; i++) {
        let wlRule: any = {};

        wlRule.id = uuidv4();
        wlRule.name = `Rule #${i + 1}`;
        wlRule.sites = [];

        for (let j = 0; j < prev.whitelist.urlList[i].domains.length; j++) {
          let site: any = {
            domain: prev.whitelist.urlList[i].domains[j].domain,
          };

          if (prev.whitelist.urlList[i].domains[j].pattern != '') {
            site.pattern = prev.whitelist.urlList[i].domains[j].pattern;
          }

          wlRule.sites.push(site);
        }

        wlRule.spoofIP = prev.whitelist.urlList[i].spoofIP;
        wlRule.profile = prev.whitelist.urlList[i].profile === 'default' ? 'default' : mappedProfiles[prev.whitelist.urlList[i].profile];

        let tempLang = languages.find(l => l.value === prev.whitelist.urlList[i].lang);
        wlRule.lang = tempLang ? tempLang.code : 'en-US';

        wlRule.options = {
          name: prev.whitelist.urlList[i].options.winName === true,
          ref: prev.whitelist.urlList[i].options.ref === true,
          tz: prev.whitelist.urlList[i].options.timezone === true,
          ws: prev.whitelist.urlList[i].options.websocket === true,
        };

        s.whitelist.rules.push(wlRule);
      }
    }

    if (importing) {
      setTimeout(async () => {
        await this.saveSettings(s);
        browser.runtime.reload();
      }, 2500);

      msg = browser.i18n.getMessage('options-import-success');

      return {
        error: false,
        msg,
      };
    } else {
      this.settings = s;
    }
  }

  public updateProfileCache(): void {
    let profGen = new prof.Generator();

    // update cache for default whitelist profile
    if (!(this.settings.whitelist.defaultProfile in this.profileCache) && this.settings.whitelist.defaultProfile != 'none') {
      this.profileCache[this.settings.whitelist.defaultProfile] = profGen.getProfile(this.settings.whitelist.defaultProfile);
    }

    // update cache for whitelist profiles
    for (let i = 0; i < this.settings.whitelist.rules.length; i++) {
      let p: string = this.settings.whitelist.rules[i].profile;

      if (!['default', 'none'].includes(p) && !(p in this.profileCache)) {
        this.profileCache[p] = profGen.getProfile(p);
      }
    }

    // update cache for selected profile
    if (this.settings.profile.selected.includes('-')) {
      if (!(this.settings.profile.selected in this.profileCache)) {
        this.profileCache[this.settings.profile.selected] = profGen.getProfile(this.settings.profile.selected);
      }
    }

    // update cache for temp profile
    if (this.tempStore.profile && this.tempStore.profile != 'none') {
      if (!(this.tempStore.profile in this.profileCache)) {
        this.profileCache[this.tempStore.profile] = profGen.getProfile(this.tempStore.profile);
      }
    }

    if (this.settings.options.screenSize === 'profile') {
      let p: any;

      if (this.tempStore.profile && this.tempStore.profile != 'none') {
        p = this.profileCache[this.tempStore.profile];
      } else {
        if (this.settings.profile.selected != 'none') {
          p = this.profileCache[this.settings.profile.selected];
        }
      }

      if (p) {
        this.tempStore.screenSize = `${p.screen.width}x${p.screen.height}`;
      } else {
        this.tempStore.screenSize = '';
      }
    }

    this.getProfileInUse();

    browser.runtime.sendMessage(
      {
        action: 'tempStore',
        data: this.tempStore,
      },
      response => {
        if (browser.runtime.lastError) return;
      }
    );

    if (this.platform.os != 'android') {
      this.updateBadgeText();

      browser.browserAction.setTitle({
        title: this.tempStore.badge.title,
      });
    }
  }

  public reset(): void {
    this.saveSettings(this.defaultSettings);
  }

  public run(): void {
    this.start();

    if (this.settings.config.notificationsEnabled) {
      browser.notifications.create({
        type: 'basic',
        title: 'Chameleon',
        message: `${browser.i18n.getMessage('notifications-profileChange')} ` + this.tempStore.badge.title,
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
        let _this = this;
        this.intervalTimeout = setTimeout(function() {
          _this.setTimer();
        }, interval);
      } else {
        alarmInfo['periodInMinutes'] = option;
      }
    }

    browser.alarms.create(alarmInfo);
  }

  public start(): void {
    this.updateProfile(this.settings.profile.selected);
    this.updateSpoofIP();
    this.updateProfileCache();
    this.buildInjectionScript();
  }

  public async saveSettings(settings: any): Promise<void> {
    await webext.setSettings({ ...settings, version: this.version });
  }

  public updateBadgeText(enabled: boolean = undefined): void {
    if (enabled !== undefined) {
      this.settings.profile.showProfileOnIcon = enabled;
    }

    browser.browserAction.setBadgeText({
      text: this.settings.profile.showProfileOnIcon ? this.tempStore.badge.text : '',
    });
  }

  public async updateIPInfo(): Promise<void> {
    try {
      let notificationMsg: string;

      let res = await fetch('https://geoip-lookup.vercel.app/api/geoip');
      this.tempStore.ipInfo.cache = await res.json();

      let data = this.tempStore.ipInfo.cache;

      if ((data.timezone && data.languages) || data.ip) {
        // check if IP defined in IP rules
        let foundRule: boolean = false;

        for (let i = 0; i < this.settings.ipRules.length; i++) {
          for (let j = 0; j < this.settings.ipRules[i].ips.length; j++) {
            if (util.ipInRange(data.ip, this.settings.ipRules[i].ips[j].split('-'))) {
              foundRule = true;
              this.tempStore.ipInfo.lang = this.settings.ipRules[i].lang;
              this.tempStore.ipInfo.tz = this.settings.ipRules[i].tz;

              notificationMsg = `${browser.i18n.getMessage('notifications-usingIPRule')} ${this.tempStore.ipInfo.tz}, ${lang.getLanguage(this.tempStore.ipInfo.lang).name}`;
            }
          }
        }

        if (!foundRule) {
          if ((data.timezone === '' && this.settings.options.timeZone === 'ip') || (data.languages === '' && this.settings.headers.spoofAcceptLang.value === 'ip')) {
            throw 'Couldn\'t find info';
          }

          notificationMsg = `${browser.i18n.getMessage('notifications-usingIPInfo')} `;

          if (this.settings.options.timeZone === 'ip') {
            this.tempStore.ipInfo.tz = data.timezone;
            notificationMsg = `${notificationMsg} ${data.timezone}${this.settings.headers.spoofAcceptLang.value === 'ip' ? ', ' : ''}`;
          }

          if (this.settings.headers.spoofAcceptLang.value === 'ip') {
            let ipLang: string = data.languages.split(',')[0];
            let allLanguages: lang.Language[] = lang.getAllLanguages();
            let foundLang: lang.Language;

            if (ipLang !== 'en' && ipLang !== 'en-US') {
              foundLang = allLanguages.find(l => l.nav.includes(ipLang));

              if (foundLang) {
                this.tempStore.ipInfo.lang = foundLang.code;
              } else {
                let languageIndexes = [];

                // find primary ip lang in existing langauges
                // compare with other returned results
                // get closest match
                let ipLangPrimary = ipLang.split('-')[0];
                if (ipLangPrimary !== 'en') {
                  for (let i = 0; i < allLanguages.length; i++) {
                    let idx: number = allLanguages[i].nav.findIndex(l => l.includes(ipLangPrimary));

                    if (idx > -1) {
                      languageIndexes.push([
                        i, // language index
                        idx, // index of found primary ip lang
                      ]);
                    }
                  }
                }

                if (languageIndexes.length > 0) {
                  languageIndexes.sort((a: any, b: any): number => {
                    if (a[1] > b[1]) {
                      return 1;
                    }
                    if (a[1] < b[1]) {
                      return -1;
                    }
                    return 0;
                  });

                  foundLang = allLanguages[languageIndexes[0][0]];
                  this.tempStore.ipInfo.lang = foundLang.code;
                }

                if (!foundLang) {
                  // use english as default language if no match is found
                  foundLang = lang.getLanguage('en-US');
                  this.tempStore.ipInfo.lang = foundLang.nav[0];
                }
              }
            } else {
              foundLang = lang.getLanguage('en-US');
              this.tempStore.ipInfo.lang = foundLang.nav[0];
            }

            notificationMsg = `${notificationMsg} ${foundLang.name}`;
          }
        }

        browser.runtime.sendMessage(
          {
            action: 'tempStore',
            data: this.tempStore,
          },
          response => {
            if (browser.runtime.lastError) return;
          }
        );

        if (this.settings.config.notificationsEnabled) {
          browser.notifications.create({
            type: 'basic',
            title: 'Chameleon',
            message: notificationMsg,
          });
        }

        this.buildInjectionScript();
      }
    } catch (e) {
      let message: string = browser.i18n.getMessage('notifications-unableToGetIPInfo');

      if (this.settings.config.notificationsEnabled) {
        browser.notifications.create({
          type: 'basic',
          title: 'Chameleon',
          message,
        });
      }
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
      msg: `${browser.i18n.getMessage('options-import-invalid-setting')} ${settingName}`,
    };
  }

  public toggleContextMenu(enabled: boolean): void {
    if (enabled && this.platform.os != 'android') {
      browser.contextMenus.onShown.addListener(this.updateContextMenu);
    } else if (this.platform.os != 'android' && !enabled) {
      browser.contextMenus.removeAll();
      browser.contextMenus.onShown.removeListener(this.updateContextMenu);
    }
  }

  public validateSettings(impSettings: any): object {
    if (/^0\.12/.test(impSettings.version)) {
      return this.migrateLegacy(impSettings, true);
    }

    let s: any = Object.assign({}, this.defaultSettings);
    let msg: string = '';

    let profiles = new prof.Generator().getAllProfiles();
    let keys = Object.keys(profiles);

    let profileIds: string[] = [];
    for (let k of keys) {
      profileIds = profileIds.concat(profiles[k].map(p => p.id));
    }

    let languageIds: string[] = lang.getAllLanguages().map(l => l.code);
    let timezoneIds: string[] = getTimezones().map(t => t.zone);

    if (impSettings.version.split('.', 3).join('.') > this.settings.version.split('.', 3).join('.')) {
      msg = browser.i18n.getMessage('options-import-invalid-version');

      return {
        error: true,
        msg,
      };
    }

    if (!impSettings.config) {
      msg = browser.i18n.getMessage('options-import-invalid-config');

      return {
        error: true,
        msg,
      };
    } else {
      if (!('hasPrivacyPermission' in impSettings.config)) {
        impSettings.config.hasPrivacyPermission = !!browser.privacy;
      }

      let options = [
        ['config.enabled', impSettings.config.enabled, 'boolean'],
        ['config.notificationsEnabled', impSettings.config.notificationsEnabled, 'boolean'],
        ['config.theme', impSettings.config.theme, ['light', 'dark']],
        ['config.hasPrivacyPermission', impSettings.config.hasPrivacyPermission == undefined ? !!browser.privacy : impSettings.config.hasPrivacyPermission, 'boolean'],
        ['config.reloadIPStartupDelay', impSettings.config.reloadIPStartupDelay || 0, 'number'],
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
      msg = browser.i18n.getMessage('options-import-invalid-excluded');

      return {
        error: true,
        msg,
      };
    } else {
      let excludedProfiles = [];

      for (let p of impSettings.excluded) {
        if (profileIds.includes(p)) {
          excludedProfiles.push(p);
        }
      }

      s.excluded = excludedProfiles;
    }

    if (!impSettings.ipRules) {
      msg = browser.i18n.getMessage('options-import-invalid-ipRules');

      return {
        error: true,
        msg,
      };
    } else {
      let seen = new Set();
      let hasDupes: boolean = impSettings.ipRules.some(r => {
        return seen.size === seen.add(r.id).size;
      });

      if (hasDupes) {
        msg = browser.i18n.getMessage('options-import-invalid-ipRulesDupe');

        return {
          error: true,
          msg,
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
          msg = browser.i18n.getMessage('options-import-invalid-ipRuleName');

          return {
            error: true,
            msg,
          };
        }

        if (!this.REGEX_UUID.test(impSettings.ipRules[i].id)) {
          msg = browser.i18n.getMessage('options-import-invalid-ipRuleId');

          return {
            error: true,
            msg,
          };
        }

        // validate ip range
        for (let j = 0; j < impSettings.ipRules[i].ips.length; j++) {
          let ipRange: string[] = impSettings.ipRules[i].ips[j].split('-');

          if (ipRange.length > 2 || (ipRange.length === 2 && !util.validateIPRange(ipRange[0], ipRange[1])) || (ipRange.length === 1 && !util.isValidIP(ipRange[0]))) {
            msg = browser.i18n.getMessage('options-import-invalid-ipRuleRange');

            return {
              error: true,
              msg,
            };
          }
        }

        s.ipRules = impSettings.ipRules;
      }
    }

    if (!impSettings.profile) {
      msg = browser.i18n.getMessage('options-import-invalid-profile');

      return {
        error: true,
        msg,
      };
    } else {
      let options = [
        ['profile.selected', impSettings.profile.selected, profileIds.concat(['none', 'random', 'randomDesktop', 'randomMobile', 'windows', 'macOS', 'linux', 'iOS', 'android'])],
        ['profile.interval.option', impSettings.profile.interval.option, [0, -1, 1, 5, 10, 20, 30, 40, 50, 60]],
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

      if (impSettings?.profile?.showProfileOnIcon != undefined) {
        s.profile.showProfileOnIcon = impSettings.profile.showProfileOnIcon;
      }
    }

    if (!impSettings.headers) {
      msg = browser.i18n.getMessage('options-import-invalid-headers');

      return {
        error: true,
        msg,
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
          msg = browser.i18n.getMessage('options-import-invalid-spoofIP');

          return {
            error: true,
            msg,
          };
        } else {
          s.headers.spoofIP.rangeFrom = impSettings.headers.spoofIP.rangeFrom;
          s.headers.spoofIP.rangeTo = impSettings.headers.spoofIP.rangeTo;
        }
      }
    }

    if (!impSettings.options) {
      msg = browser.i18n.getMessage('options-import-invalid-options');

      return {
        error: true,
        msg,
      };
    } else {
      // check if mediadevices exists (v0.20.22+)
      if (!('spoofMediaDevices' in impSettings.options)) {
        impSettings.options.spoofMediaDevices = false;
      }

      if (!('blockCSSExfil' in impSettings.options)) {
        impSettings.options.blockCSSExfil = false;
      }

      let options = [
        ['options.blockMediaDevices', impSettings.options.blockMediaDevices, 'boolean'],
        ['options.disableWebRTC', impSettings.options.disableWebRTC, 'boolean'],
        ['options.firstPartyIsolate', impSettings.options.firstPartyIsolate, 'boolean'],
        ['options.limitHistory', impSettings.options.limitHistory, 'boolean'],
        ['options.protectKBFingerprint.enabled', impSettings.options.protectKBFingerprint.enabled, 'boolean'],
        ['options.protectKBFingerprint.delay', impSettings.options.protectKBFingerprint.delay, 'number'],
        ['options.protectWinName', impSettings.options.protectWinName, 'boolean'],
        ['options.resistFingerprinting', impSettings.options.resistFingerprinting, 'boolean'],
        ['options.spoofAudioContext', impSettings.options.spoofAudioContext, 'boolean'],
        ['options.spoofClientRects', impSettings.options.spoofClientRects, 'boolean'],
        ['options.spoofFontFingerprint', impSettings.options.spoofFontFingerprint, 'boolean'],
        ['options.spoofMediaDevices', impSettings.options.spoofMediaDevices, 'boolean'],
        ['options.blockCSSExfil', impSettings.options.blockCSSExfil, 'boolean'],
        [
          'options.screenSize',
          impSettings.options.screenSize,
          ['default', 'profile', '1366x768', '1440x900', '1600x900', '1920x1080', '1920x1200', '2560x1440', '2560x1600', '3840x2160', '4096x2304', '5120x2880'],
        ],
        ['options.timeZone', impSettings.options.timeZone, timezoneIds.concat(['default', 'ip'])],
        ['options.cookieNotPersistent', impSettings.options.cookieNotPersistent, 'boolean'],
        [
          'options.cookiePolicy',
          impSettings.options.cookiePolicy,
          ['allow_all', 'allow_visited', 'reject_all', 'reject_third_party', 'reject_trackers', 'reject_trackers_and_partition_foreign'],
        ],
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
      msg = browser.i18n.getMessage('options-import-invalid-whitelist');

      return {
        error: true,
        msg,
      };
    } else {
      let seen = new Set();
      let hasDupes: boolean = impSettings.whitelist.rules.some(r => {
        return seen.size === seen.add(r.id).size;
      });

      if (hasDupes) {
        msg = browser.i18n.getMessage('options-import-invalid-whitelistDupe');

        return {
          error: true,
          msg,
        };
      }

      let options = [
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
          msg = browser.i18n.getMessage('options-import-invalid-whitelistName');

          return {
            error: true,
            msg,
          };
        }

        if (!this.REGEX_UUID.test(impSettings.whitelist.rules[i].id)) {
          msg = browser.i18n.getMessage('options-import-invalid-whitelistId');

          return {
            error: true,
            msg,
          };
        }

        if (impSettings.whitelist.rules[i].spoofIP && !util.isValidIP(impSettings.whitelist.rules[i].spoofIP)) {
          msg = browser.i18n.getMessage('options-import-invalid-whitelistSpoofIP');

          return {
            error: true,
            msg,
          };
        }

        if (impSettings.version < '0.22') {
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
            msg = browser.i18n.getMessage('options-import-invalid-whitelistOpt');

            return {
              error: true,
              msg,
            };
          }
        } else {
          // validate whitelist options
          let keys = Object.keys(impSettings.whitelist.rules[i].options);
          if (
            keys.length !== 8 ||
            !keys.includes('audioContext') ||
            !keys.includes('clientRects') ||
            !keys.includes('cssExfil') ||
            !keys.includes('mediaDevices') ||
            !keys.includes('name') ||
            !keys.includes('ref') ||
            !keys.includes('tz') ||
            !keys.includes('ws') ||
            typeof impSettings.whitelist.rules[i].options.audioContext != 'boolean' ||
            typeof impSettings.whitelist.rules[i].options.clientRects != 'boolean' ||
            typeof impSettings.whitelist.rules[i].options.cssExfil != 'boolean' ||
            typeof impSettings.whitelist.rules[i].options.mediaDevices != 'boolean' ||
            typeof impSettings.whitelist.rules[i].options.name != 'boolean' ||
            typeof impSettings.whitelist.rules[i].options.ref != 'boolean' ||
            typeof impSettings.whitelist.rules[i].options.tz != 'boolean' ||
            typeof impSettings.whitelist.rules[i].options.ws != 'boolean'
          ) {
            msg = browser.i18n.getMessage('options-import-invalid-whitelistOpt');

            return {
              error: true,
              msg,
            };
          }
        }
      }

      s.whitelist = impSettings.whitelist;
    }

    if (!s.config.hasPrivacyPermission) {
      // need user input to grant permission
      browser.permissions.remove({
        permissions: ['privacy'],
      });
    }

    setTimeout(async () => {
      this.settings = s;
      await this.saveSettings(this.settings);

      if (this.settings.config.hasPrivacyPermission) {
        await this.changeBrowserSettings();
      }

      browser.runtime.reload();
    }, 2500);

    msg = browser.i18n.getMessage('options-import-success');

    return {
      error: false,
      msg,
    };
  }
}
