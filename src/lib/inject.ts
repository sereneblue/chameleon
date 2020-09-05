import * as lang from '../lib/language';
import audioContext from './spoof/audioContext';
import clientRects from './spoof/clientRects';
import cssExfil from './spoof/cssExfil';
import font from './spoof/font';
import history from './spoof/history';
import kbFingerprint from './spoof/kbFingerprint';
import language from './spoof/language';
import media from './spoof/media';
import mediaSpoof from './spoof/mediaSpoof';
import navigator from './spoof/navigator';
import referer from './spoof/referer';
import screen from './spoof/screen';
import timezone from './spoof/timezone';
import winName from './spoof/name';
import util from './util';
import whitelisted from './whitelisted';

const moment = require('moment-timezone');

class Injector {
  public enabled: boolean;
  public notifyId: string;
  private spoof = {
    custom: '',
    overwrite: [],
    metadata: {},
  };

  constructor(settings: any, tempStore: any, profileCache: any, seed: number) {
    if (!settings.config.enabled) {
      this.enabled = false;
      return;
    }

    this.enabled = true;
    this.notifyId = tempStore.notifyId;

    // profile to be used for injection
    let p: any = null;
    let wl = util.findWhitelistRule(settings.whitelist.rules, window.top.location.host, window.top.location.href);

    if (wl === null) {
      if (tempStore.profile && tempStore.profile != 'none') {
        p = profileCache[tempStore.profile];
      } else {
        if (settings.profile.selected != 'none') {
          p = profileCache[settings.profile.selected];
        }
      }

      if (p) {
        this.spoof.metadata['profileOS'] = p.osId;
      } else {
        // get real profile
        let profileId: string = '';

        if (window.navigator.userAgent.includes('Windows NT 6.1')) {
          profileId = 'win1';
        } else if (window.navigator.userAgent.includes('Windows NT 6.2')) {
          profileId = 'win2';
        } else if (window.navigator.userAgent.includes('Windows NT 6.3')) {
          profileId = 'win3';
        } else if (window.navigator.userAgent.includes('Windows NT 10.0')) {
          profileId = 'win4';
        } else if (window.navigator.userAgent.includes('Mac OS X 10_15')) {
          profileId = 'mac3';
        } else if (window.navigator.userAgent.includes('Mac OS X 10_14')) {
          profileId = 'mac2';
        } else if (window.navigator.userAgent.includes('Mac OS X 10_')) {
          // fallback for 10.13 and older
          profileId = 'mac1';
        } else if (window.navigator.userAgent.includes('Android 6') || window.navigator.userAgent.includes('Android 5')) {
          profileId = 'and1';
        } else if (window.navigator.userAgent.includes('Android 7')) {
          profileId = 'and2';
        } else if (window.navigator.userAgent.includes('Android 8')) {
          profileId = 'and3';
        } else if (window.navigator.userAgent.includes('Android 9') || window.navigator.userAgent.includes('Android 10')) {
          profileId = 'and4';
        } else if (window.navigator.userAgent.includes('Ubuntu')) {
          profileId = 'lin3';
        } else if (window.navigator.userAgent.includes('Fedora')) {
          profileId = 'lin2';
        } else if (window.navigator.userAgent.includes('Linux')) {
          profileId = 'lin1';
        }

        this.spoof.metadata['profileOS'] = profileId;
      }

      if (settings.options.blockMediaDevices) {
        this.updateInjectionData(media);
      } else {
        if (settings.options.spoofMediaDevices) {
          this.updateInjectionData(mediaSpoof);
        }
      }

      if (settings.options.blockCSSExfil) {
        this.updateInjectionData(cssExfil);
      }

      if (settings.options.limitHistory) this.updateInjectionData(history);

      if (settings.options.protectKBFingerprint.enabled) {
        this.spoof.metadata['kbDelay'] = settings.options.protectKBFingerprint.delay;
        this.updateInjectionData(kbFingerprint);
      }

      if (settings.headers.spoofAcceptLang.enabled) {
        if (settings.headers.spoofAcceptLang.value != 'default') {
          let spoofedLang: string;

          if (settings.headers.spoofAcceptLang.value === 'ip') {
            spoofedLang = tempStore.ipInfo.lang;
          } else {
            spoofedLang = settings.headers.spoofAcceptLang.value;
          }

          let l = lang.getLanguage(spoofedLang);
          this.spoof.metadata['language'] = {
            code: spoofedLang,
            nav: l.nav,
          };
          this.updateInjectionData(language);
        }
      }

      if (settings.options.protectWinName) {
        // check if google domain
        if (!/\.google\.com$/.test(window.top.location.host)) {
          this.updateInjectionData(winName);
        }
      }

      if (settings.options.spoofAudioContext) {
        this.spoof.metadata['audioContextSeed'] = seed;
        this.updateInjectionData(audioContext);
      }

      if (settings.options.spoofClientRects) {
        this.spoof.metadata['clientRectsSeed'] = seed;
        this.updateInjectionData(clientRects);
      }

      if (settings.options.spoofFontFingerprint) {
        this.updateInjectionData(font);
      }

      if (settings.options.screenSize != 'default') {
        if (settings.options.screenSize == 'profile' && p) {
          this.spoof.metadata['screen'] = {
            width: p.screen.width,
            height: p.screen.height,
            availHeight: p.screen.availHeight,
            deviceScaleFactor: p.screen.deviceScaleFactor,
            usingProfileRes: true,
          };
        } else {
          let scr: number[] = settings.options.screenSize.split('x').map(Number);

          this.spoof.metadata['screen'] = {
            width: scr[0],
            height: scr[1],
            usingProfileRes: false,
          };
        }

        this.updateInjectionData(screen);
      }

      if (settings.options.timeZone != 'default') {
        let tz: string = settings.options.timeZone;

        if (tz === 'ip') {
          tz = tempStore.ipInfo.tz;
        }

        this.spoof.metadata['timezone'] = {
          locale: 'en-US',
          zone: moment.tz.zone(tz),
        };

        this.updateInjectionData(timezone);
      }

      if (settings.headers.referer.disabled) {
        this.updateInjectionData(referer);
      }
    } else {
      if (wl.options.name) this.updateInjectionData(winName);

      let l = lang.getLanguage(wl.lang);

      this.spoof.metadata['language'] = {
        code: wl.lang,
        nav: l.nav,
      };
      this.updateInjectionData(language);

      if (wl.profile != 'none') {
        if (wl.profile === 'default' && settings.whitelist.defaultProfile != 'none') {
          p = profileCache[settings.whitelist.defaultProfile];
        } else {
          p = profileCache[wl.profile];
        }
      }
    }

    if (p) {
      for (let i = 0; i < navigator.data.length; i++) {
        navigator.data[i].value = p.navigator[navigator.data[i].prop];
      }

      this.updateInjectionData(navigator);
    }
  }

  public injectIntoPage(): void {
    let code: string = this.finalOutput();
    let scriptEl = Object.assign(document.createElement('script'), {
      textContent: code,
      id: 'chameleon',
    });

    document.documentElement.appendChild(scriptEl);
    scriptEl.remove();

    // try injecting again to bypass cors
    scriptEl = document.createElement('script');
    scriptEl.src = URL.createObjectURL(new Blob([code], { type: 'text/javascript' }));
    (document.head || document.documentElement).appendChild(scriptEl);
    try {
      URL.revokeObjectURL(scriptEl.src);
    } catch (e) {}
    scriptEl.remove();
  }

  public finalOutput(): string {
    if (!this.enabled) return '';

    // generate unique variable name
    let chameleonObjName =
      String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
      Math.random()
        .toString(36)
        .substring(Math.floor(Math.random() * 5) + 5);

    return `
    (function(){
      if (window.CHAMELEON_SPOOF) return;

      let CHAMELEON_SPOOF = new WeakMap();
      CHAMELEON_SPOOF.set(window, JSON.parse(\`${JSON.stringify(this.spoof.metadata)}\`));
      window.CHAMELEON_SPOOF = Symbol.for("CHAMELEON_SPOOF");

      let injectionProperties = JSON.parse(\`${JSON.stringify(this.spoof.overwrite)}\`);
      var ORIGINAL_INTL = window.Intl.DateTimeFormat;
      var ORIGINAL_INTL_PROTO = window.Intl.DateTimeFormat.prototype;
      var _supportedLocalesOfDTF = window.Intl.DateTimeFormat.supportedLocalesOf;
      var _supportedLocalesOfRTF = window.Intl.RelativeTimeFormat.supportedLocalesOf;
      var _supportedLocalesOfNF = window.Intl.NumberFormat.supportedLocalesOf;
      var _supportedLocalesOfC = window.Intl.Collator.supportedLocalesOf;

      var _open = window.open;

      let modifiedAPIs = [];

      injectionProperties.forEach(injProp => {
        if (injProp.obj === 'window') {
          window[injProp.prop] = injProp.value;
        } else if (injProp.obj === 'window.navigator' && injProp.value === null) {
          delete navigator.__proto__[injProp.prop];
        } else if (injProp.obj === 'window.navigator' && injProp.prop == 'mimeTypes') {
          let mimes = (() => {
            const mimeArray = []
            injProp.value.forEach(p => {
              function FakeMimeType () { return p }
              const mime = new FakeMimeType()
              Object.setPrototypeOf(mime, MimeType.prototype);
              mimeArray.push(mime)
            })
            Object.setPrototypeOf(mimeArray, MimeTypeArray.prototype);
            return mimeArray
          })();

          Object.defineProperty(window.navigator, 'mimeTypes', {
            configurable: true,
            value: mimes
          });
        } else if (injProp.obj === 'window.navigator' && injProp.prop == 'plugins') {
          let plugins = (() => {
            const pluginArray = []
            injProp.value.forEach(p => {
              function FakePlugin () { return p }
              const plugin = new FakePlugin();
              Object.setPrototypeOf(plugin, Plugin.prototype);
              pluginArray.push(plugin)
            })
            Object.defineProperty(pluginArray, 'item', {
              configurable: false,
              value: function item() {
                return this[arguments[0]];
              }
            });
            Object.defineProperty(pluginArray, 'namedItem', {
              configurable: false,
              value: function namedItem() {
                return this.find(p => p.name === arguments[0]);
              }
            });
            Object.defineProperty(pluginArray, 'refresh', {
              configurable: false,
              value: function refresh() {
                return;
              }
            });

            return pluginArray;
          })();

          Object.defineProperty(window.navigator, 'plugins', {
            configurable: true,
            value: plugins
          });
        } else {
          Object.defineProperty(injProp.obj.split('.').reduce((p,c)=>p&&p[c]||null, window), injProp.prop, {
            configurable: true,
            value: injProp.value
          });
        }
      });
      
      let iframeWindow = HTMLIFrameElement.prototype.__lookupGetter__('contentWindow');
      let iframeDocument = HTMLIFrameElement.prototype.__lookupGetter__('contentDocument');

      ${this.spoof.custom}
      
      if (injectionProperties.length > 0 || ${this.spoof.custom != ''}) {
        window.Intl.DateTimeFormat = function(...args) {
          let locale = navigator.language || "en-US";
          
          if (CHAMELEON_SPOOF.has(window)) {
            if (CHAMELEON_SPOOF.get(window).timezone) {
              let spoofData = Object.assign({}, CHAMELEON_SPOOF.get(window).timezone);
  
              if (args.length == 2) {
                if (!args[1].timeZone) {
                  args[1].timeZone = spoofData.zone.name;
                }
              } else if (args.length == 1) {
                args.push({
                  timeZone: spoofData.zone.name
                });
              } else {
                args = [
                  locale,
                  { timeZone: spoofData.zone.name }
                ];
              }
            } else if (CHAMELEON_SPOOF.get(window).language) {
              if (args.length == 0 || !args[0]) {
                args[0] = locale;
              }
            }
          }
          
          return new (Function.prototype.bind.apply(ORIGINAL_INTL, [null].concat(args)));
        }
        modifiedAPIs.push([
          window.Intl.DateTimeFormat, "DateTimeFormat"
        ]);
        Object.setPrototypeOf(window.Intl.DateTimeFormat, ORIGINAL_INTL_PROTO);
        window.Intl.DateTimeFormat.supportedLocalesOf = _supportedLocalesOfDTF;
        window.Intl.RelativeTimeFormat.supportedLocalesOf = _supportedLocalesOfRTF;
        window.Intl.NumberFormat.supportedLocalesOf = _supportedLocalesOfNF;
        window.Intl.Collator.supportedLocalesOf = _supportedLocalesOfC;

        Object.defineProperties(HTMLIFrameElement.prototype, {
          contentWindow: {
            get: function() {
              let f = iframeWindow.apply(this);
              if (f) {
                try {
                  Object.defineProperty(f, 'Date', {
                    value: window.Date
                  });
  
                  Object.defineProperty(f.Intl, 'DateTimeFormat', {
                    value: window.Intl.DateTimeFormat
                  });
  
                  Object.defineProperty(f, 'screen', {
                    value: window.screen
                  });
  
                  Object.defineProperty(f, 'navigator', {
                    value: window.navigator
                  });
  
                  Object.defineProperty(f.Element.prototype, 'getBoundingClientRect', {
                    value: window.Element.prototype.getBoundingClientRect
                  });
  
                  Object.defineProperty(f.Element.prototype, 'getClientRects', {
                    value: window.Element.prototype.getClientRects
                  });
  
                  Object.defineProperty(f.Range.prototype, 'getBoundingClientRect', {
                    value: window.Range.prototype.getClientRects
                  });
  
                  Object.defineProperty(f.Range.prototype, 'getClientRects', {
                    value: window.Range.prototype.getClientRects
                  });
                } catch (e) {}
              }
              return f;
            }
          },
          contentDocument: {
            get: function() {
              this.contentWindow;
              return iframeDocument.apply(this);
            }
          }
        });
  
        window.open = function(){
          let w = _open.apply(this, arguments);
  
          Object.defineProperty(w, 'Date', {
            value: window.Date
          });
  
          Object.defineProperty(w.Intl, 'DateTimeFormat', {
            value: window.Intl.DateTimeFormat
          });
  
          Object.defineProperty(w, 'screen', {
            value: window.screen
          });
  
          Object.defineProperty(w, 'navigator', {
            value: window.navigator
          });
  
          Object.defineProperty(w.Element.prototype, 'getBoundingClientRect', {
            value: window.Element.prototype.getBoundingClientRect
          });
  
          Object.defineProperty(w.Element.prototype, 'getClientRects', {
            value: window.Element.prototype.getClientRects
          });
  
          Object.defineProperty(w.Range.prototype, 'getBoundingClientRect', {
            value: window.Range.prototype.getClientRects
          });
  
          Object.defineProperty(w.Range.prototype, 'getClientRects', {
            value: window.Range.prototype.getClientRects
          });
  
          return w;
        }
        modifiedAPIs.push([
          window.open, "open"
        ]);
    
        for (let m of modifiedAPIs) {
          Object.defineProperty(m[0], 'toString', {
            configurable: false,
            value: function toString() {
              return \`function \$\{m[1]\}() {\n    [native code]\n}\`;
            }
          })
  
          Object.defineProperty(m[0], 'name', {
            configurable: false,
            value: m[1]
          })
        }
      }
    })()
    `
      .replace(/CHAMELEON_SPOOF/g, chameleonObjName)
      .replace(
        /ORIGINAL_INTL/g,
        String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
          Math.random()
            .toString(36)
            .substring(Math.floor(Math.random() * 5) + 5)
      );
  }

  private updateInjectionData(option: any) {
    if (option.type === 'overwrite') {
      this.spoof.overwrite = this.spoof.overwrite.concat(option.data);
    } else if (option.type === 'custom') {
      this.spoof.custom += '(() => {' + option.data + '})();';
    } else {
      option.data();
    }
  }
}

// @ts-ignore
let chameleonInjector = new Injector(settings, tempStore, profileCache, seed);

if (
  chameleonInjector.enabled &&
  whitelisted.findIndex(url => {
    return window.top.location.href.startsWith(url) || window.location.href.startsWith(url);
  }) == -1 &&
  !util.isInternalIP(window.top.location.hostname)
) {
  chameleonInjector.injectIntoPage();
}
