// intercepts requests
import * as prof from './profiles';
import * as lang from './language';
import util from './util';
import whitelisted from './whitelisted';

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
  name: boolean;
  ref: boolean;
  tz: boolean;
  ws: boolean;
}

interface WhitelistResult {
  active: boolean;
  opt?: WhitelistOptions;
  lang?: string;
  pattern?: object;
  profile?: string;
  spoofIP?: string;
}

class Interceptor {
  private LINK: any;
  private profiles: prof.Generator;
  private profileCache: any;
  private settings: any;
  private tempStore: any;
  private regex: any;
  private olderThanNinety: boolean;

  constructor(settings: any, tempStore: any, profileCache: any, olderThanNinety: boolean) {
    this.regex = {
      CLOUDFLARE: RegExp(/chk_jschl/),
      HTTPS: RegExp(/^https:\/\//),
    };

    this.LINK = document.createElement('a');
    this.profiles = new prof.Generator();
    this.settings = settings;
    this.tempStore = tempStore;
    this.profileCache = profileCache;
    this.olderThanNinety = olderThanNinety;
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
        return { cancel: wl.opt.ws };
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
    let url: string;

    /* Get document url of request */
    if (request.type === 'main_frame') {
      url = request.url;
    } else if (request.parentFrameId == -1) {
      url = request.documentUrl;
    } else {
      let root = request.frameAncestors ? request.frameAncestors.find(f => f.frameId === 0) : '';
      if (root) {
        url = root.url;
      } else {
        url = request.documentUrl;
      }
    }

    if (url) {
      this.LINK.href = url;
      let rule = util.findWhitelistRule(this.settings.whitelist.rules, this.LINK.host, url);

      if (rule) {
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

    // don't modify request for sites below
    for (let i = 0; i < whitelisted.length; i++) {
      if (
        (details.originUrl && details.originUrl.startsWith(whitelisted[i])) ||
        (details.documentUrl && details.documentUrl.startsWith(whitelisted[i])) ||
        (details.url && details.url.startsWith(whitelisted[i]))
      ) {
        return;
      }
    }

    this.LINK.href = details.documentUrl || details.url;
    if (util.isInternalIP(this.LINK.hostname)) return;

    let wl: WhitelistResult = this.checkWhitelist(details);

    // used to send different accept headers for https requests
    let isSecure: boolean = this.regex.HTTPS.test(details.url);
    let dntIndex: number = -1;

    let profile: prof.BrowserProfile;
    if (wl.active) {
      if (wl.profile === 'default') {
        if (this.settings.whitelist.defaultProfile != 'none') {
          profile = this.profileCache[this.settings.whitelist.defaultProfile];
        }
      } else if (wl.profile != 'none') {
        profile = this.profileCache[wl.profile];
      }
    } else {
      if (this.settings.profile.selected != 'none' && !this.settings.excluded.includes(this.settings.profile.selected) && this.tempStore.profile != 'none') {
        let profileUsed: string = this.settings.profile.selected.includes('-') ? this.settings.profile.selected : this.tempStore.profile;
        profile = this.profileCache[profileUsed];
      }
    }

    let isChromeBased: boolean = profile ? profile.navigator.userAgent.includes('Chrome') : false;

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
          details.requestHeaders[i].value = profile.navigator.userAgent;
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
              if (this.tempStore.ipInfo.lang) {
                details.requestHeaders[i].value = lang.getLanguage(this.tempStore.ipInfo.lang).value;
              }
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

    if (wl.active) {
      if (wl.spoofIP) {
        if (
          // don't spoof header IP for cloudflare pages
          !details.url.includes('cdn-cgi/challenge-platform/generate/') &&
          !details.url.includes('__cf_chl_jschl_tk__=') &&
          !details.url.includes('jschal/js/nocookie/transparent.gif')
        ) {
          details.requestHeaders.push({
            name: 'Via',
            value: '1.1 ' + wl.spoofIP,
          });
          details.requestHeaders.push({
            name: 'X-Forwarded-For',
            value: wl.spoofIP,
          });
        }
      }
    } else {
      if (this.settings.headers.spoofIP.enabled) {
        if (
          // don't spoof header IP for cloudflare pages
          !details.url.includes('cdn-cgi/challenge-platform/generate/') &&
          !details.url.includes('__cf_chl_jschl_tk__=') &&
          !details.url.includes('jschal/js/nocookie/transparent.gif')
        ) {
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
    }

    if (isSecure && isChromeBased && this.olderThanNinety) {
      // https://www.w3.org/TR/fetch-metadata/#sec-fetch-dest-header
      // implementation below is missing some destinations (mostly worker related)
      let secDest = 'empty';

      if (details.type == 'main_frame') {
        secDest = 'document';
      } else if (details.type == 'sub_frame') {
        secDest = 'iframe';
      } else if (details.type == 'font') {
        secDest = 'font';
      } else if (details.type == 'imageset' || details.type == 'image') {
        secDest = 'image';
      } else if (details.type == 'media') {
        let h = details.requestHeaders.find(r => r.name.toLowerCase() == 'accept');
        if (h.value.charAt(0) == 'a') {
          secDest = 'audio';
        } else if (h.value.charAt(0) == 'v') {
          secDest = 'video';
        } else if (details.url.includes('.vtt')) {
          secDest = 'track';
        }
      } else if (details.type == 'xslt') {
        secDest = 'xslt';
      } else if (details.type == 'web_manifest') {
        secDest = 'manifest';
      } else if (details.type == 'csp_report') {
        secDest = 'report';
      } else if (details.type == 'object') {
        secDest = 'object'; // object is used for both <object> and <embed>
      } else if (details.type == 'stylesheet') {
        secDest = 'style';
      } else if (details.type == 'script') {
        secDest = 'script';
      }

      details.requestHeaders.push({
        name: 'sec-fetch-dest',
        value: secDest,
      });

      // https://w3c.github.io/webappsec-fetch-metadata/#sec-fetch-site-header
      // not quite accurate when determining whether a request from a user action
      let secSite = util.determineRequestType(details.type == 'main_frame' ? details.documentUrl : details.originUrl, details.url);
      details.requestHeaders.push({
        name: 'sec-fetch-site',
        value: secSite,
      });

      // https://w3c.github.io/webappsec-fetch-metadata/#sec-fetch-mode-header
      // naive implementation
      let secMode = 'no-cors';
      let hasOriginHeader = details.requestHeaders.findIndex(r => r.name.toLowerCase() == 'origin') > -1;
      if (details.type == 'websocket') {
        secMode = 'websocket';
      } else if (details.type == 'main_frame' || details.type == 'sub_frame') {
        secMode = 'navigate';
      } else if (hasOriginHeader) {
        secMode = 'cors';
      }

      details.requestHeaders.push({
        name: 'sec-fetch-mode',
        value: secMode,
      });

      // this is a guesstimate
      // can't determine if this is a user request from this method
      // iframe navigation won't be included with this request
      if (details.type === 'main_frame') {
        details.requestHeaders.push({
          name: 'sec-fetch-user',
          value: '?1',
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
