// intercepts requests
import * as prof from './profiles';
import * as lang from './language';
import util from './util';

enum RefererXOriginOption {
  AlwaysSend = 0,
  MatchBaseDomain = 1,
  MatchHost = 2,
}

enum RefererTrimOption {
  SendFullURI = 0,
  SchemeWithPath = 1,
  SchemeNoPath = 2,
}

interface WhitelistOptions {
  auth?: boolean;
  ip?: boolean;
  ref?: boolean;
  timezone?: boolean;
  websocket?: boolean;
  winName?: boolean;
}

interface WhitelistResult {
  active?: boolean;
  opt?: WhitelistOptions;
  lang?: string;
  pattern?: object;
  profile?: string;
  spoofIP?: string;
}

class Interceptor {
  private LINK: any;
  private profiles: prof.Generator;
  private settings: any;
  private tempStore: any;
  private regex: any;

  constructor(settings: any, tempStore: any) {
    this.regex = {
      CLOUDFLARE: RegExp(/chk_jschl/),
      HTTPS: RegExp(/^https:\/\//),
      HAS_INT: RegExp(/\d/),
    };

    this.LINK = document.createElement('a');
    this.profiles = new prof.Generator();
    this.settings = settings;
    this.tempStore = tempStore;
  }

  blockWebsocket(details: any): any {
    if (!this.settings.config.enabled) return;

    let wl = this.checkWhitelist(details);

    if (!wl.active && this.settings.options.webSockets === 'allow_all') {
      return;
    }

    let isWebSocketRequest = false;
    if (details.requestHeaders) {
      for (let h of details.requestHeaders) {
        if (h.name.toLowerCase() == 'x-websocket-extensions') {
          isWebSocketRequest = true;
        }
      }
    }

    if (details.type === 'websocket' || details.url.includes('transport=polling') || isWebSocketRequest) {
      if (wl.active) {
        return { cancel: wl.opt.websocket };
      }

      if (this.settings.options.webSockets === 'block_all') {
        return { cancel: true };
      } else if (this.settings.options.webSockets === 'block_3rd_party') {
        let frame = util.parseURL(details.documentUrl || details.originUrl);
        let ws = util.parseURL(details.url);

        if (!frame.error && !ws.error) {
          if (frame.domain != ws.domain) {
            return { cancel: true };
          }
        }
      }
    }
  }

  checkWhitelist(request: any): WhitelistResult {
    if (this.settings.whitelist.enabled) {
      let url: string;

      /* Get document url of request */
      if (request.type === 'main_frame') {
        url = request.url;
      } else if (request.frameId === 0) {
        url = request.documentUrl;
      } else {
        let root = request.frameAncestors ? request.frameAncestors.find(f => f.frameId === 0) : '';
        if (root) {
          url = root.url;
        }
      }

      if (url) {
        this.LINK.href = url;
        let rule = util.findWhitelistRule(this.settings.whitelist.rules, this.LINK.host, url);

        return {
          active: true,
          lang: rule.lang,
          opt: rule.options,
          pattern: rule.pattern,
          profile: rule.profile,
          spoofIP: rule.spoofIP,
        };
      }
    }

    return { active: false };
  }

  modifyRequest(details: any): any {
    if (!this.settings.config.enabled) return;

    let wl: WhitelistResult = this.checkWhitelist(details);

    // used to send different accept headers for https requests
    let isSecure: boolean = this.regex.HTTPS.test(details.url);

    let dntIndex: number = -1;

    let profile: prof.BrowserProfile;
    if (wl.active) {
      if (wl.profile === 'default') {
        if (this.settings.whitelist.defaultProfile != 'none') {
          profile = this.profiles.getProfile(this.settings.whitelist.defaultProfile);
        }
      } else if (wl.profile != 'none') {
        profile = this.profiles.getProfile(wl.profile);
      }
    } else {
      if (this.settings.profile.selected != 'none') {
        profile = this.profiles.getProfile(this.regex.HAS_INT.test(this.settings.profile.selected) ? this.settings.profile.selected : this.tempStore.profile);
      }
    }

    for (let i = 0; i < details.requestHeaders.length; i++) {
      let header: string = details.requestHeaders[i].name.toLowerCase();

      if (header === 'referer') {
        if (!wl.active) {
          if (this.settings.headers.referer.disabled) {
            details.requestHeaders[i].value = '';
          } else {
            // check referer policies, preserve referer for cloudflare challenges
            if (!this.regex.CLOUDFLARE.test(details.url)) {
              if (this.settings.headers.referer.xorigin != RefererXOriginOption.AlwaysSend) {
                let dest = util.parseURL(details.url);
                let ref = util.parseURL(details.requestHeaders[i].value);

                if (this.settings.headers.referer.xorigin === RefererXOriginOption.MatchBaseDomain) {
                  if (dest.domain != ref.domain) {
                    details.requestHeaders[i].value = '';
                  }
                } else {
                  if (dest.origin != ref.origin) {
                    details.requestHeaders[i].value = '';
                  }
                }
              }

              if (this.settings.headers.referer.trimming != RefererTrimOption.SendFullURI) {
                if (details.requestHeaders[i].value != '') {
                  let ref = util.parseURL(details.requestHeaders[i].value);
                  details.requestHeaders[i].value = this.settings.headers.referer.trimming === RefererTrimOption.SchemeWithPath ? ref.origin + ref.pathname : ref.origin;
                }
              }
            }
          }
        } else if (wl.opt.ref) {
          details.requestHeaders[i].value = '';
        }
      } else if (header === 'user-agent') {
        if (profile) {
          details.requestHeaders[i].value = profile.useragent;
        }
      } else if (header === 'accept') {
        if (details.type === 'main_frame' || details.type === 'sub_frame') {
          if (profile) {
            details.requestHeaders[i].value = profile.accept.header;
          }
        }
      } else if (header === 'accept-encoding') {
        if (details.type === 'main_frame' || details.type === 'sub_frame') {
          if (profile) {
            details.requestHeaders[i].value = isSecure ? profile.accept.encodingHTTPS : profile.accept.encodingHTTP;
          }
        }
      } else if (header === 'accept-language') {
        if (wl.active && wl.lang != '') {
          details.requestHeaders[i].value = wl.lang;
        } else {
          if (this.settings.headers.spoofAcceptLang.enabled) {
            if (this.settings.headers.spoofAcceptLang.value === 'ip') {
              details.requestHeaders[i].value = lang.getLanguage(this.tempStore.ipInfo.lang).value;
            } else if (this.settings.headers.spoofAcceptLang.value !== 'default') {
              details.requestHeaders[i].value = lang.getLanguage(this.settings.headers.spoofAcceptLang.value).value;
            }
          }
        }
      } else if (header === 'dnt') {
        dntIndex = i;
      }
    }

    if (this.settings.headers.enableDNT) {
      if (dntIndex === -1) {
        details.requestHeaders.push({ name: 'DNT', value: '1' });
      }
    } else {
      if (dntIndex > -1) {
        details.requestHeaders.splice(dntIndex, 1);
      }
    }

    if (wl.active && wl.opt.ip) {
      details.requestHeaders.push({
        name: 'Via',
        value: '1.1 ' + wl.spoofIP,
      });
      details.requestHeaders.push({
        name: 'X-Forwarded-For',
        value: wl.spoofIP,
      });
    } else {
      if (this.settings.headers.spoofIP.enabled) {
        details.requestHeaders.push({
          name: 'Via',
          value: '1.1 ' + this.tempStore.spoofIP,
        });
        details.requestHeaders.push({
          name: 'X-Forwarded-For',
          value: this.tempStore.spoofIP,
        });
      }
    }

    return { requestHeaders: details.requestHeaders };
  }

  modifyResponse(details: any): any {
    if (!this.settings.config.enabled) return;

    let wl = this.checkWhitelist(details);

    if (!wl.active && this.settings.headers.blockEtag) {
      for (let i = 0; i < details.responseHeaders.length; i++) {
        if (details.responseHeaders[i].name.toLowerCase() === 'etag') {
          details.responseHeaders[i].value = '';
        }
      }
    }

    return { responseHeaders: details.responseHeaders };
  }
}

export { Interceptor };
