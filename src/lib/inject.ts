import * as lang from '../lib/language';
import audioContext from './spoof/audioContext';
import clientRects from './spoof/clientRects';
import history from './spoof/history';
import kbFingerprint from './spoof/kbFingerprint';
import language from './spoof/language';
import media from './spoof/media';
import referer from './spoof/referer';
import screen from './spoof/screen';
import timezone from './spoof/timezone';
import winName from './spoof/name';
import util from './util';

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
    let wl = util.findWhitelistRule(settings.whitelist.rules, window.location.host, window.location.href);

    if (wl === null) {
      if (tempStore.profile && tempStore.profile != 'none') {
        p = profileCache[tempStore.profile];
      } else {
        if (settings.profile.selected != 'none') {
          p = profileCache[settings.profile.selected];
        }
      }

      if (settings.options.blockMediaDevices) this.updateInjectionData(media);
      
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
          if (language.data[0].value === 'code') {
            language.data[0].value = spoofedLang;
            // @ts-ignore
            language.data[1].value = l.nav;
          } else {
            // @ts-ignore
            language.data[0].value = l.nav;
            language.data[1].value = spoofedLang;
          }
        }
      }

      if (settings.options.protectWinName) this.updateInjectionData(winName);

      if (settings.options.spoofAudioContext) {
        this.spoof.metadata['audioContextSeed'] = seed;
        this.updateInjectionData(audioContext);
      }

      if (settings.options.spoofClientRects) {
        this.spoof.metadata['clientRectsSeed'] = seed;
        this.updateInjectionData(clientRects);
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
      if (language.data[0].value === 'code') {
        language.data[0].value = wl.lang;
        // @ts-ignore
        language.data[1].value = l.nav;
      } else {
        // @ts-ignore
        language.data[0].value = l.nav;
        language.data[1].value = wl.lang;
      }

      if (wl.profile != 'none') {
        if (wl.profile === 'default' && settings.whitelist.defaultProfile != 'none') {
          p = profileCache[settings.whitelist.defaultProfile];
        } else {
          p = profileCache[wl.profile];
        }
      }
    }

    if (language.data[0].value != 'code') {
      this.updateInjectionData(language);
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
        if (
          window.location.href.startsWith("https://www.google.com/recaptcha/api2") || 
          window.location.href.startsWith("https://disqus.com/embed/comments/")    ||
          window.CHAMELEON_SPOOF
        ) { 
          return;
        }

        let CHAMELEON_SPOOF = new WeakMap();
        CHAMELEON_SPOOF.set(window, JSON.parse(\`${JSON.stringify(this.spoof.metadata)}\`));
        window.CHAMELEON_SPOOF = Symbol.for("CHAMELEON_SPOOF");

        let injectionProperties = JSON.parse(\`${JSON.stringify(this.spoof.overwrite)}\`);

        injectionProperties.forEach(injProp => {
          if (injProp.obj === 'window') {
            window[injProp.prop] = injProp.value;
          } else if (injProp.obj === 'window.navigator' && injProp.value === null) {
            delete navigator.__proto__[injProp.prop];
          } else {
            Object.defineProperty(injProp.obj.split('.').reduce((p,c)=>p&&p[c]||null, window), injProp.prop, {
              configurable: true,
              value: injProp.value
            });
          }
        });
        
        let iframeWindow = HTMLIFrameElement.prototype.__lookupGetter__('contentWindow');
        let frameWindow = HTMLFrameElement.prototype.__lookupGetter__('contentWindow');
        let iframeDocument = HTMLIFrameElement.prototype.__lookupGetter__('contentDocument');
        let frameDocument = HTMLFrameElement.prototype.__lookupGetter__('contentDocument');

        ${this.spoof.custom}

        Object.defineProperties(HTMLIFrameElement.prototype, {
          contentWindow: {
            get: function() {
              let f = iframeWindow.apply(this);
              if (f) {
                f.Date = window.Date;
                f.Intl.DateTimeFormat = window.Intl.DateTimeFormat;
                f.screen = window.screen;
                f.navigator = window.navigator;
              }
              return f;
            }
          },
          contentDocument: {
            get: function() {
              let f = iframeDocument.apply(this);
              return f;
            }
          }
        });

        Object.defineProperties(HTMLFrameElement.prototype, {
          contentWindow: {
            get: function() {
              let f = frameWindow.apply(this);
              if (f) {
                f.Date = window.Date;
                f.Intl.DateTimeFormat = window.Intl.DateTimeFormat;
                f.screen = window.screen;
                f.navigator = window.navigator;
              }
              return f;
            }
          },
          contentDocument: {
            get: function() {
              let f = frameDocument.apply(this);
              return f;
            }
          }
        });

        // Proxy access to objects for fingerprint panel in popup
        window.AudioContext = new Proxy(window.AudioContext, {  
          construct: function(target, args) {
            window.top.postMessage({fp: 'audioContext', id: "${this.notifyId}"}, "*");
            return new target(...args);
          }
        });

        window.OfflineAudioContext = new Proxy(window.OfflineAudioContext, {  
          construct: function(target, args) {
            window.top.postMessage({fp: 'audioContext', id: "${this.notifyId}"}, "*");
            return new target(...args);
          }
        });

        window.WebSocket = new Proxy(window.WebSocket, {  
          construct: function(target, args) {
            window.top.postMessage({fp: 'webSocket', id: "${this.notifyId}"}, "*");
            return new target(...args);
          }
        });

        window.Date = new Proxy(window.Date, {  
          construct: function(target, args) {
            window.top.postMessage({fp: 'date', id: "${this.notifyId}"}, "*");
            return new target(...args);
          }
        });

        ((innerHeight, innerWidth, outerHeight, outerWidth, clientHeight, clientWidth) => {
          Object.defineProperty(window, 'innerHeight', {
            configurable: true,
            get: () => {
              window.top.postMessage({fp: 'screen', id: "${this.notifyId}"}, "*");
              return innerHeight;
            }
          });
          
          Object.defineProperty(window, 'innerWidth', {
            configurable: true,
            get: () => {
              window.top.postMessage({fp: 'screen', id: "${this.notifyId}"}, "*");
              return innerWidth;
            }
          });

          Object.defineProperty(window, 'outerHeight', {
            configurable: true,
            get: () => {
              window.top.postMessage({fp: 'screen', id: "${this.notifyId}"}, "*");
              return outerHeight;
            }
          });
          
          Object.defineProperty(window, 'outerWidth', {
            configurable: true,
            get: () => {
              window.top.postMessage({fp: 'screen', id: "${this.notifyId}"}, "*");
              return outerWidth;
            }
          });

          Object.defineProperty(window.document.documentElement, 'clientHeight', {
            configurable: true,
            get: () => {
              window.top.postMessage({fp: 'screen', id: "${this.notifyId}"}, "*");
              return clientHeight;
            }
          });
          
          Object.defineProperty(window.document.documentElement, 'clientWidth', {
            configurable: true,
            get: () => {
              window.top.postMessage({fp: 'screen', id: "${this.notifyId}"}, "*");
              return clientWidth;
            }
          });

          window.screen = new Proxy(window.screen, {  
            get: function(obj, prop) {
              window.top.postMessage({fp: 'screen', id: "${this.notifyId}"}, "*");
              return obj[prop];
            }
          });
        })(window.innerHeight, window.innerWidth, window.outerHeight, window.outerWidth, window.document.documentElement.clientHeight, window.document.documentElement.clientWidth);

        ((getClientRects, getBoundingClientRect, rgetClientRects, rgetBoundingClientRect) => {
          window.Element.prototype.getClientRects = function(){
            window.top.postMessage({fp: 'clientRects', id: "${this.notifyId}"}, "*");
            return getClientRects.apply(this);
          }

          window.Element.prototype.getBoundingClientRect = function(){
            window.top.postMessage({fp: 'clientRects', id: "${this.notifyId}"}, "*");
            return getBoundingClientRect.apply(this);
          }

          window.Range.prototype.getClientRects = function(){
            window.top.postMessage({fp: 'clientRects', id: "${this.notifyId}"}, "*");
            return rgetClientRects.apply(this);
          }

          window.Range.prototype.getBoundingClientRect = function(){
            window.top.postMessage({fp: 'clientRects', id: "${this.notifyId}"}, "*");
            return rgetBoundingClientRect.apply(this);
          }
        })(window.Element.prototype.getClientRects, window.Element.prototype.getBoundingClientRect, window.Range.prototype.getClientRects, window.Range.prototype.getBoundingClientRect);
    })()
    `.replace(/CHAMELEON_SPOOF/g, chameleonObjName);
  }

  private updateInjectionData(option: any) {
    if (option.type === 'overwrite') {
      this.spoof.overwrite = this.spoof.overwrite.concat(option.data);
    } else {
      this.spoof.custom += option.data;
    }
  }
}

// @ts-ignore
let chameleonInjector = new Injector(settings, tempStore, profileCache, seed);

window.addEventListener('message', function(evt: any) {
  if (evt.data.id === chameleonInjector.notifyId) {
    browser.runtime.sendMessage({
      action: 'fpDetect',
      data: evt.data.fp,
    });
  }
});

if (chameleonInjector.enabled) {
  chameleonInjector.injectIntoPage();
}
