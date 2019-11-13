const psl = require('psl');

let findWhitelistRule = (rules: any, host: string, url: string): any => {
  for (var i = 0; i < rules.length; i++) {
    for (var j = 0; j < rules[i].domains.length; j++) {
      if (host.includes(rules[i].domains[j].domain)) {
        if (rules[i].domains[j].re) {
          if (!new RegExp(rules[i].domains[j].pattern).test(url)) {
            return null;
          }
        }

        return {
          id: rules[i].id,
          idx: j,
          profile: rules[i].profile,
        };
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
  return ipToInt(from) <= ipToInt(to);
};

export default {
  findWhitelistRule,
  generateIP,
  ipToInt,
  ipToString,
  parseURL,
  validateIPRange,
};
