const psl = require('psl');
const CIDR = require('cidr-js');

const cidr = new CIDR();
const REGEX_HTTP = new RegExp('^https?:', 'i');
const LINK = document.createElement('a');

let deepMerge = (target: object, source: object) => {
  Object.entries(source).forEach(([key, value]) => {
    if (value && typeof value === 'object') {
      deepMerge((target[key] = target[key] || {}), value);
      return;
    }
    target[key] = value;
  });

  return target;
};

let determineRequestType = (source: string, destination: string): string => {
  if (!source) return 'none';

  LINK.href = source;
  let s = psl.parse(LINK.hostname);
  LINK.href = destination;
  let d = psl.parse(LINK.hostname);

  if (s.domain != d.domain) {
    return 'cross-site';
  } else {
    if (s.subdomain === d.subdomain) {
      return 'same-origin';
    }

    return 'same-site';
  }
};

let findWhitelistRule = (rules: any, host: string, url: string): any => {
  for (var i = 0; i < rules.length; i++) {
    for (var j = 0; j < rules[i].sites.length; j++) {
      let whitelistURL = new URL((REGEX_HTTP.test(rules[i].sites[j].domain) ? '' : 'http://') + rules[i].sites[j].domain);

      if (host.includes(whitelistURL.host.replace(/^(www\.)/, ''))) {
        if (!rules[i].sites[j].pattern || (rules[i].sites[j].pattern && new RegExp(rules[i].sites[j].pattern).test(url))) {
          return {
            id: rules[i].id,
            siteIndex: j,
            name: rules[i].name,
            lang: rules[i].lang,
            pattern: rules[i].sites[j],
            profile: rules[i].profile,
            options: rules[i].options,
            spoofIP: rules[i].spoofIP,
          };
        }
      }
    }
  }

  return null;
};

let generateByte = (): number => {
  let octet: number = Math.floor(Math.random() * 256);
  return octet === 10 || octet === 172 || octet === 192 ? generateByte() : octet;
};

let generateIP = (): string => {
  return `${generateByte()}.${generateByte()}.${generateByte()}.${generateByte()}`;
};

let getIPRange = (ipRange: string): string => {
  let range: any = cidr.range(ipRange);

  if (range === null) {
    return ipRange;
  }

  return `${range.start}-${range.end}`;
};

let ipInRange = (ip: string, range: string): boolean => {
  if (range.length === 1) {
    return ip === range[0];
  } else {
    let ipToCompare: number = ipToInt(ip);
    let ipRangeFrom: number = ipToInt(range[0]);
    let ipRangeTo: number = ipToInt(range[1]);

    return ipRangeFrom <= ipToCompare && ipToCompare <= ipRangeTo;
  }
};

let ipToInt = (ip: string): number => {
  return (
    ip.split('.').reduce(function(ipInt: number, octet: string) {
      return (ipInt << 8) + parseInt(octet, 10);
    }, 0) >>> 0
  );
};

let ipToString = (ip: number): string => {
  return (ip >>> 24) + '.' + ((ip >> 16) & 255) + '.' + ((ip >> 8) & 255) + '.' + (ip & 255);
};

let isInternalIP = (host: string): boolean => {
  return (
    /^localhost$|^127(?:\.[0-9]+){0,2}\.[0-9]+$|^(?:0*\:)*?:?0*1$/.test(host) ||
    /(^192\.168\.([0-9]|[0-9][0-9]|[0-2][0-5][0-5])\.([0-9]|[0-9][0-9]|[0-2][0-5][0-5])$)|(^172\.([1][6-9]|[2][0-9]|[3][0-1])\.([0-9]|[0-9][0-9]|[0-2][0-5][0-5])\.([0-9]|[0-9][0-9]|[0-2][0-5][0-5])$)|(^10\.([0-9]|[0-9][0-9]|[0-2][0-5][0-5])\.([0-9]|[0-9][0-9]|[0-2][0-5][0-5])\.([0-9]|[0-9][0-9]|[0-2][0-5][0-5])$)/.test(
      host
    )
  );
};

let isValidURL = (url: string): boolean => {
  try {
    new URL(url);
    return true; // The URL is valid
  } catch (e) {
    return false; // The URL is not valid
  }
};

let isValidIP = (ip: string): boolean => {
  return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
    ip
  );
};

let parseURL = (url: string): any => {
  let u = new URL(url);
  let uParsed = psl.parse(u.hostname);

  return {
    base: u.hostname
      .split('.')
      .splice(-2)
      .join('.'),
    domain: uParsed.domain,
    hostname: u.hostname,
    origin: u.origin,
    pathname: u.pathname,
  };
};

let validateIPRange = (from: string, to: string): boolean => {
  return isValidIP(from) && isValidIP(to) && ipToInt(from) <= ipToInt(to);
};

export default {
  deepMerge,
  determineRequestType,
  findWhitelistRule,
  generateIP,
  getIPRange,
  ipInRange,
  ipToInt,
  ipToString,
  isInternalIP,
  isValidIP,
  isValidURL,
  parseURL,
  validateIPRange,
};
