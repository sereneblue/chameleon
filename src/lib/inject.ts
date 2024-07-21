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
import quirks from './spoof/quirks';
import referer from './spoof/referer';
import screen from './spoof/screen';
import timezone from './spoof/timezone';
import winName from './spoof/name';
import util from './util';
import whitelisted from './whitelisted';

const moment = require('moment-timezone');

class Injector {
  public enabled: boolean;
  private randObjName: string;
  private spoof = {
    custom: '',
    overwrite: [],
    metadata: {},
  };

  constructor(settings: any, tempStore: any, profileCache: any, seed: number, randObjName: string) {
    if (!settings.config.enabled) {
      this.enabled = false;
      return;
    }

    this.enabled = true;
    this.randObjName = randObjName;

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
        this.spoof.metadata['browser'] = p.browser;
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
        } else if (window.navigator.userAgent.includes('Mac OS X 11_')) {
          profileId = 'mac3';
        } else if (window.navigator.userAgent.includes('Mac OS X 10_15')) {
          profileId = 'mac2';
        } else if (window.navigator.userAgent.includes('Mac OS X 10_')) {
          // fallback for 10.14 and older
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
        this.spoof.metadata['browser'] = 'firefox';
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

        if (this.spoof.metadata['screen']) {
          this.updateInjectionData(screen);
        }
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

      if (wl.options.audioContext) {
        this.spoof.metadata['audioContextSeed'] = seed;
        this.updateInjectionData(audioContext);
      }

      if (wl.options.clientRects) {
        this.spoof.metadata['clientRectsSeed'] = seed;
        this.updateInjectionData(clientRects);
      }

      if (wl.options.cssExfil) this.updateInjectionData(cssExfil);
      if (wl.options.mediaDevices) this.updateInjectionData(media);

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

      this.spoof.metadata['profileOS'] = p.osId;
      this.spoof.metadata['browser'] = p.browser;

      this.updateInjectionData(navigator);
      this.updateInjectionData(quirks);
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

    return `
    (function(){
      const inject = (spoofContext) => {
        if (spoofContext.CHAMELEON_SPOOF) return;

        spoofContext.CHAMELEON_SPOOF = "CHAMELEON_SPOOF";

        let CHAMELEON_SPOOF = new WeakMap();
        CHAMELEON_SPOOF.set(spoofContext, JSON.parse(\`${JSON.stringify(this.spoof.metadata)}\`));
        
        let ORIGINAL_INTL = spoofContext.Intl.DateTimeFormat;
        let ORIGINAL_INTL_PROTO = spoofContext.Intl.DateTimeFormat.prototype;
        let _supportedLocalesOfDTF = spoofContext.Intl.DateTimeFormat.supportedLocalesOf;
        let _supportedLocalesOfRTF = spoofContext.Intl.RelativeTimeFormat.supportedLocalesOf;
        let _supportedLocalesOfLF = spoofContext.Intl.ListFormat.supportedLocalesOf;
        let _supportedLocalesOfNF = spoofContext.Intl.NumberFormat.supportedLocalesOf;
        let _supportedLocalesOfPR = spoofContext.Intl.PluralRules.supportedLocalesOf;
        let _supportedLocalesOfC = spoofContext.Intl.Collator.supportedLocalesOf;
        let _open = spoofContext.open;
        let _enumerateDevices;

        if (spoofContext.navigator.mediaDevices && spoofContext === spoofContext.parent) {
          _enumerateDevices = spoofContext.navigator.mediaDevices.enumerateDevices.bind(spoofContext.navigator.mediaDevices);
        }

        let modifiedAPIs = [];
        let injectionProperties = JSON.parse(\`${JSON.stringify(this.spoof.overwrite)}\`);
        
        injectionProperties.forEach(injProp => {
          if (injProp.obj === 'window') {
            Object.defineProperty(spoofContext, injProp.prop, {
              get: (() => injProp.value).bind(null)
            });
          } else if (injProp.obj === 'window.navigator' && injProp.value === null) {
            delete spoofContext.navigator.__proto__[injProp.prop];
          } else if (injProp.obj === 'window.navigator' && injProp.prop == 'mimeTypes') {
            let mimes = (() => {
              const mimeArray = {}
              injProp.value.forEach((m, i) => {
                function FakeMimeType () { return m }
                const mime = new FakeMimeType()
                Object.setPrototypeOf(mime, MimeType.prototype);
                Object.defineProperty(mimeArray, i, {
                  configurable: false,
                  enumerable: true,
                  value: mime
                });
                Object.defineProperty(mimeArray, m.type, {
                  configurable: false,
                  enumerable: false,
                  value: mime
                });
              })
              Object.setPrototypeOf(mimeArray, MimeTypeArray.prototype);
              Object.defineProperty(mimeArray, 'length', {
                configurable: false,
                enumerable: true,
                value: injProp.value.length
              });
              Object.defineProperty(mimeArray, 'item', {
                configurable: false,
                enumerable: true,
                value: function item() {
                  return this[arguments[0]] || null;
                }
              });
              Object.defineProperty(mimeArray, 'namedItem', {
                configurable: false,
                enumerable: true,
                value: function namedItem() {
                  return this[arguments[0]] || null;
                }
              });
              return mimeArray
            })();
            Object.defineProperty(spoofContext.navigator, 'mimeTypes', {
              configurable: true,
              value: mimes
            });
          } else if (injProp.obj === 'window.navigator' && injProp.prop == 'plugins') {
            let plugins = (() => {
              const pluginArray = {};
              injProp.value.forEach((p, i) => {
                function FakePlugin () { return p }
                const plugin = new FakePlugin();
                Object.setPrototypeOf(plugin, Plugin.prototype);
                Object.defineProperty(plugin, 'length', {
                  configurable: false,
                  enumerable: true,
                  value: p.__mimeTypes.length
                });
                Object.defineProperty(plugin, 'version', {
                  configurable: false,
                  enumerable: false,
                  value: undefined
                });
                Object.defineProperty(plugin, 'item', {
                  configurable: false,
                  enumerable: true,
                  value: function item() {
                    return this[arguments[0]] || null;
                  }
                });
                Object.defineProperty(plugin, 'namedItem', {
                  configurable: false,
                  enumerable: true,
                  value: function namedItem() {
                    return this[arguments[0]] || null;
                  }
                });

                // iterate mime types
                for (let j = 0; j < p.__mimeTypes.length; j++) {
                  Object.defineProperty(plugin, j, {
                    configurable: false,
                    enumerable: true,
                    value: navigator.mimeTypes[p.__mimeTypes[j]]
                  });

                  Object.defineProperty(plugin, p.__mimeTypes[j], {
                    configurable: false,
                    enumerable: false,
                    value: navigator.mimeTypes[p.__mimeTypes[j]]
                  });
                }

                delete p.__mimeTypes;

                Object.defineProperty(pluginArray, i, {
                  configurable: false,
                  enumerable: true,
                  value: p
                });

                Object.defineProperty(pluginArray, p.name, {
                  configurable: false,
                  enumerable: false,
                  value: p
                });
              })
              Object.defineProperty(pluginArray, 'length', {
                configurable: false,
                enumerable: true,
                value: injProp.value.length
              });
              Object.defineProperty(pluginArray, 'item', {
                configurable: false,
                enumerable: true,
                value: function item() {
                  return this[arguments[0]] || null;
                }
              });
              Object.defineProperty(pluginArray, 'namedItem', {
                configurable: false,
                enumerable: true,
                value: function namedItem() {
                  return this[arguments[0]] || null;
                }
              });
              Object.defineProperty(pluginArray, 'refresh', {
                configurable: false,
                enumerable: true,
                value: function refresh() {
                  return;
                }
              });

              pluginArray[Symbol.iterator] = function() {
                const numPlugins = Object.keys(this).length - 4;
                let index = 0;

                return {
                  next: () => {
                    if (index < numPlugins) {
                      const value = this[index];
                      index++;
                      return {
                        value,
                        done: false
                      };
                    }
                    return {
                      value: undefined,
                      done: true
                    };
                  }
                };
              };

              return pluginArray;
            })();

            Object.setPrototypeOf(plugins, PluginArray.prototype);
            
            Object.defineProperty(spoofContext.navigator, 'plugins', {
              configurable: true,
              value: plugins
            });

            let pluginsArray = Array.from(navigator.plugins);

            // iterate mimetypes to add enabledPlugin property
            for (let i = 0; i < navigator.mimeTypes.length; i++) {
              let p = pluginsArray.find(p => p[navigator.mimeTypes[i].type] != undefined);
              Object.defineProperty(navigator.mimeTypes[i], 'enabledPlugin', {
                configurable: false,
                enumerable: true,
                value: p
              });
            }
          } else {
            let tmpObj = injProp.obj.split('.').reduce((p,c)=>p&&p[c]||null, spoofContext);

            if (tmpObj[injProp.prop] != injProp.value) {
              Object.defineProperty(tmpObj, injProp.prop, {
                configurable: true,
                value: injProp.value
              });
            }
          }
        });

        ${this.spoof.custom}

        if (injectionProperties.length > 0 || ${this.spoof.custom != ''}) {
          spoofContext.Intl.DateTimeFormat = function(...args) {
            let locale = spoofContext.navigator.language || "en-US";
            
            if (CHAMELEON_SPOOF.has(spoofContext)) {
              if (CHAMELEON_SPOOF.get(spoofContext).timezone) {
                let spoofData = Object.assign({}, CHAMELEON_SPOOF.get(spoofContext).timezone);
    
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
              } else if (CHAMELEON_SPOOF.get(spoofContext).language) {
                if (args.length == 0 || !args[0]) {
                  args[0] = locale;
                }
              }
            }
  
            return new (Function.prototype.bind.apply(ORIGINAL_INTL, [null].concat(args)));
          }

          modifiedAPIs.push([
            spoofContext.Intl.DateTimeFormat, "DateTimeFormat"
          ]);

          spoofContext.Intl.DateTimeFormat.prototype = ORIGINAL_INTL_PROTO;
          spoofContext.Intl.DateTimeFormat.supportedLocalesOf = _supportedLocalesOfDTF;
          spoofContext.Intl.RelativeTimeFormat.supportedLocalesOf = _supportedLocalesOfRTF;
          spoofContext.Intl.NumberFormat.supportedLocalesOf = _supportedLocalesOfNF;
          spoofContext.Intl.PluralRules.supportedLocalesOf = _supportedLocalesOfPR;
          spoofContext.Intl.ListFormat.supportedLocalesOf = _supportedLocalesOfLF;
          spoofContext.Intl.Collator.supportedLocalesOf = _supportedLocalesOfC;

          spoofContext.open = function(){
            let w;
            if (arguments.length) {
              w = _open.call(this, ...arguments);
            } else {
              w = _open.call(this);
            }

            if (w) {
              Object.defineProperty(w, 'Date', {
                value: spoofContext.Date
              });
      
              Object.defineProperty(w.Intl, 'DateTimeFormat', {
                value: spoofContext.Intl.DateTimeFormat
              });
      
              Object.defineProperty(w, 'screen', {
                value: spoofContext.screen
              });
      
              Object.defineProperty(w, 'navigator', {
                value: spoofContext.navigator
              });
      
              Object.defineProperty(w.Element.prototype, 'getBoundingClientRect', {
                value: spoofContext.Element.prototype.getBoundingClientRect
              });
      
              Object.defineProperty(w.Element.prototype, 'getClientRects', {
                value: spoofContext.Element.prototype.getClientRects
              });
      
              Object.defineProperty(w.Range.prototype, 'getBoundingClientRect', {
                value: spoofContext.Range.prototype.getClientRects
              });
      
              Object.defineProperty(w.Range.prototype, 'getClientRects', {
                value: spoofContext.Range.prototype.getClientRects
              });
            }

            return w;
          }
          
          modifiedAPIs.push([
            spoofContext.open, "open"
          ]);
        }

        (
          (spoofContext, inject, fn) => {
            ["appendChild", "insertBefore", "replaceChild"].forEach(method => {
              const _original = spoofContext.Node.prototype[method];

              spoofContext.Node.prototype[method] = function() {
                let e = _original.apply(this, arguments);

                if (e && e.tagName === "IFRAME") {
                  try {
                    inject(e.contentWindow);                    
                  } catch (err) {};
                } else {
                  for (let i = 0; i < spoofContext.length; i++) {
                    try {
                      inject(spoofContext[i]);                    
                    } catch (err) {};
                  }
                }

                if (e && e.nodeName === 'LINK' && fn.CHAMELEON_SPOOF_f) CHAMELEON_SPOOF_f();

                return e;
              }
            });

            ["append", "insertAdjacentElement", "insertAdjacentHTML", 
              "insertAdjacentText", "prepend", "replaceWith"].forEach(method => {
              const _original = spoofContext.Element.prototype[method];

              spoofContext.Element.prototype[method] = function() {
                let e = _original.apply(this, Array.from(arguments));

                if (e && e.tagName === "IFRAME") {
                  try {
                    inject(e.contentWindow);                    
                  } catch (err) {};
                } else {
                  for (let i = 0; i < spoofContext.length; i++) {
                    try {
                      inject(spoofContext[i]);                    
                    } catch (err) {};
                  }
                } 

                return e;
              }
            });

            ['innerHTML', 'outerHTML'].forEach(p => {
              let obj = Object.getOwnPropertyDescriptor(spoofContext.Element.prototype, p);

              Object.defineProperty(spoofContext.Element.prototype, p, {
                set(html) {
                  obj.set.call(this, html);

                  for (let i = 0; i < spoofContext.length; i++) {
                    try {
                      inject(spoofContext[i]);                    
                    } catch (err) {};
                  }

                  if (fn.modifyNodeFont) {
                    modifyNodeFont(this.parentNode);
                  }
                }
              });
            });
          }
        )(spoofContext, inject, {
          modifyNodeFont: typeof modifyNodeFont !== 'undefined' ? modifyNodeFont : null,
          CHAMELEON_SPOOF_f: typeof CHAMELEON_SPOOF_f !== 'undefined' ? CHAMELEON_SPOOF_f : null
        });

        modifiedAPIs.push([
          [ spoofContext.Element.innerHTML, "innerHTML" ],
          [ spoofContext.Element.outerHTML, "outerHTML" ],
          [ spoofContext.Node.appendChild, "appendChild" ],
          [ spoofContext.Node.insertBefore, "insertBefore" ],
          [ spoofContext.Node.replaceChild, "replaceChild" ],
          [ spoofContext.Element.append, "append" ],
          [ spoofContext.Element.insertAdjacentElement, "insertAdjacentElement" ],
          [ spoofContext.Element.insertAdjacentHTML, "insertAdjacentHTML" ],
          [ spoofContext.Element.insertAdjacentText, "insertAdjacentText" ],
          [ spoofContext.Element.prepend, "prepend" ],
          [ spoofContext.Element.replaceWith, "replaceWith" ]
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
      };

      inject(window);
    })()
    `
      .replace(/CHAMELEON_SPOOF/g, this.randObjName)
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
let chameleonInjector = new Injector(settings, tempStore, profileCache, seed, randObjName);

if (
  chameleonInjector.enabled &&
  whitelisted.findIndex(url => {
    return window.top.location.href.startsWith(url) || window.location.href.startsWith(url);
  }) == -1 &&
  !util.isInternalIP(window.top.location.hostname)
) {
  chameleonInjector.injectIntoPage();
}
