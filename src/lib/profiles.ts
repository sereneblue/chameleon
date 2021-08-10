const devices = require('./devices');

export interface BrowserProfile {
  accept: {
    header: string;
    encodingHTTP: string;
    encodingHTTPS: string;
  };
  navigator?: {
    appMinorVersion: string | null;
    appVersion: string | null;
    buildID: string | null;
    cpuClass: string | null;
    deviceMemory: number | null;
    hardwareConcurrency: number | null;
    maxTouchPoints: number;
    mimeTypes: object | null;
    oscpu: string | null;
    platform: string | null;
    plugins: object | null;
    productSub: string | null;
    userAgent: string;
    vendor: string | null;
    vendorSub: string | null;
  };
  screen?: {
    width: number;
    height: number;
    availHeight: number;
    deviceScaleFactor?: number;
  };
  osId: string;
  browser: string;
}

export interface ProfileListItem {
  id: string;
  badge: string;
  name: string;
}

const BrowserVersions: any = {
  edg: { win: '92.0.902.67', mac: '92.0.902.67', desktopChrome: '92.0.4515.131', android: '46.06.4.5160', androidChrome: '77.0.3865.116' },
  esr: { desktop: '78' },
  esr2: { desktop: '68' },
  ff: { desktop: '91', mobile: '90' },
  gcr: { desktop: '92.0.4515.131', ios: '92.0.4515.90', android: '92.0.4515.131' },
  sf: { desktop: '14.1.1', ios1: '12.1.2', ios2: '13.1', ios3: '14.1.1' },
};

const DesktopResolutions: string[] = ['1366x768', '1440x900', '1600x900', '1920x1080', '1920x1200', '2560x1440', '2560x1600', '3840x2160'];
const MacResolutions: string[] = ['1920x1080', '2560x1600', '4096x2304', '5120x2880'];

// operating systems to randomize harware for
const randomHW: string[] = ['win1', 'win2', 'win3', 'win4', 'lin1', 'lin2', 'lin3'];

let getBadge = (browser: string): string => {
  if (browser === 'edg' || browser === 'edgm') {
    return 'EDG';
  } else if (browser === 'esr' || browser === 'esr2') {
    return 'ESR';
  } else if (browser === 'ff' || browser === 'ffm' || browser === 'fft') {
    return 'FF';
  } else if (browser === 'gcr' || browser === 'gcrm' || browser === 'gcrt') {
    return 'GC';
  } else if (browser === 'ie') {
    return 'IE';
  } else if (browser === 'sf' || browser === 'sft' || browser === 'sfm') {
    return 'SAF';
  }
};

let getName = (os: string, browser: string) => {
  let osId: string;

  if (browser === 'edg') {
    return `${os} - Edge ${BrowserVersions.edg.win.split('.')[0]}`;
  } else if (browser === 'edgm') {
    return `${os} - Edge ${BrowserVersions.edg.win.split('.')[0]} (Phone)`;
  } else if (browser === 'esr') {
    return `${os} - Firefox ${BrowserVersions.esr.desktop} ESR`;
  } else if (browser === 'esr2') {
    return `${os} - Firefox ${BrowserVersions.esr2.desktop} ESR`;
  } else if (browser === 'ff') {
    return `${os} - Firefox ${BrowserVersions.ff.desktop}`;
  } else if (browser === 'ffm') {
    return `${os} - Firefox ${BrowserVersions.ff.mobile} (Phone)`;
  } else if (browser === 'fft') {
    return `${os} - Firefox ${BrowserVersions.ff.mobile} (Tablet)`;
  } else if (browser === 'gcr') {
    return `${os} - Chrome ${BrowserVersions.gcr.desktop.split('.')[0]}`;
  } else if (browser === 'gcrm') {
    let key = os.charAt(0) === 'i' ? 'ios' : 'android';
    return `${os} - Chrome ${BrowserVersions.gcr[key].split('.')[0]} (Phone)`;
  } else if (browser === 'gcrt') {
    let key = os.charAt(0) === 'i' ? 'ios' : 'android';
    return `${os} - Chrome ${BrowserVersions.gcr[key].split('.')[0]} (Tablet)`;
  } else if (browser === 'ie') {
    return `${os} - Internet Explorer 11`;
  } else if (browser === 'sf') {
    return `${os} - Safari ${BrowserVersions.sf.desktop.split('.')[0]}`;
  } else if (browser === 'sfm') {
    switch (os) {
      case 'iOS 12':
        osId = 'ios1';
        break;
      case 'iOS 13':
        osId = 'ios2';
        break;
      case 'iOS 14':
        osId = 'ios3';
        break;
      default:
        break;
    }
    return `${os} - Safari ${BrowserVersions.sf[osId].split('.')[0]} (iPhone)`;
  } else if (browser === 'sft') {
    switch (os) {
      case 'iOS 12':
        osId = 'ios1';
        break;
      case 'iOS 13':
        osId = 'ios2';
        break;
      case 'iOS 14':
        osId = 'ios3';
        break;
      default:
        break;
    }
    return `${os} - Safari ${BrowserVersions.sf[osId].split('.')[0]} (iPad)`;
  }
};

export class Generator {
  private browsers = {
    // edge
    edg: (os): BrowserProfile => {
      let versions: any = BrowserVersions.edg;
      let platform: string = os.nav.platform;

      let resolutions: string[] = os.id.includes('mac') ? MacResolutions : DesktopResolutions;
      let screenRes: number[] = resolutions[Math.floor(Math.random() * resolutions.length)].split('x').map(Number);

      let ua: string = `Mozilla/5.0 (${os.id.includes('mac') ? os.uaPlatform : os.nav.oscpu}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${
        versions.desktopChrome
      } Safari/537.36 Edg/${os.id.includes('win') ? versions.win : versions.mac}`;

      let hardwareConcurrency: number = randomHW.includes(os.id) ? (Math.random() > 0.5 ? 4 : 2) : 4;

      return {
        accept: {
          header: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
          encodingHTTP: 'gzip, deflate',
          encodingHTTPS: 'gzip, deflate, br',
        },
        osId: os.id,
        browser: 'edge',
        navigator: {
          appMinorVersion: null,
          appVersion: ua.split('Mozilla/')[1],
          buildID: null,
          cpuClass: null,
          deviceMemory: Math.random() > 0.5 ? 4 : 8,
          hardwareConcurrency,
          mimeTypes: [
            { type: 'application/pdf', suffixes: 'pdf', description: '' },
            { type: 'application/x-google-chrome-pdf', suffixes: 'pdf', description: 'Portable Document Format' },
          ],
          maxTouchPoints: 0,
          oscpu: null,
          platform,
          plugins: [
            {
              name: 'Microsoft Edge PDF Plugin',
              filename: 'internal-pdf-viewer',
              description: 'Portable Document Format',
              version: null,
              __mimeTypes: ['application/x-google-chrome-pdf'],
            },
            { name: 'Microsoft Edge PDF Viewer', filename: 'mhjfbmdgcfjbbpaeojofohoefgiehjai', description: '', version: null, __mimeTypes: ['application/pdf'] },
          ],
          productSub: '20030107',
          userAgent: ua,
          vendor: 'Google Inc.',
          vendorSub: '',
        },
        screen: {
          width: screenRes[0],
          height: screenRes[1],
          availHeight: screenRes[1] + os.screenOffset,
        },
      };
    },
    // edge (mobile)
    edgm: (os): BrowserProfile => {
      let versions: any = BrowserVersions.edg;

      const device = devices.getDevice('mobile', os.id);

      let screenRes: number[] = device.viewport.split('x').map(Number);
      let ua: string = `Mozilla/5.0 (Linux; ${os.uaPlatform}; ${device.build}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${versions.androidChrome} Safari/537.36 EdgA/${versions.android}`;

      return {
        accept: {
          header: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
          encodingHTTP: 'gzip, deflate',
          encodingHTTPS: 'gzip, deflate, br',
        },
        osId: os.id,
        browser: 'edge',
        navigator: {
          appMinorVersion: null,
          appVersion: ua.split('Mozilla/')[1],
          buildID: null,
          cpuClass: null,
          deviceMemory: device.memory,
          hardwareConcurrency: device.hw,
          mimeTypes: [],
          maxTouchPoints: 5,
          oscpu: null,
          platform: 'Linux aarch64',
          plugins: [],
          productSub: '20030107',
          userAgent: ua,
          vendor: 'Google Inc.',
          vendorSub: '',
        },
        screen: {
          width: screenRes[0],
          height: screenRes[1],
          availHeight: screenRes[1],
          deviceScaleFactor: device.deviceScaleFactor,
        },
      };
    },
    // firefox esr
    esr: (os): BrowserProfile => {
      let version: string = BrowserVersions.esr.desktop;
      let appVersion: string;
      let platform: string;

      let resolutions: string[] = os.id.includes('mac') ? MacResolutions : DesktopResolutions;
      let screenRes: number[] = resolutions[Math.floor(Math.random() * resolutions.length)].split('x').map(Number);

      let hardwareConcurrency: number = randomHW.includes(os.id) ? (Math.random() > 0.5 ? 4 : 2) : 4;

      switch (os.id) {
        case 'win1':
        case 'win2':
        case 'win3':
        case 'win4':
          platform = os.nav.oscpu;
          appVersion = '5.0 (Windows)';
          break;
        case 'mac1':
        case 'mac2':
        case 'mac3':
          platform = `Macintosh; ${os.nav.oscpu}`;
          appVersion = '5.0 (Macintosh)';
          break;
        case 'lin1':
        case 'lin2':
        case 'lin3':
          platform = os.uaPlatform;
          appVersion = '5.0 (X11)';
          break;
        default:
          break;
      }

      let ua = `Mozilla/5.0 (${platform}; rv:${version}.0) Gecko/20100101 Firefox/${version}.0`;

      return {
        accept: {
          header: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          encodingHTTP: 'gzip, deflate',
          encodingHTTPS: 'gzip, deflate, br',
        },
        osId: os.id,
        browser: 'firefox',
        navigator: {
          appMinorVersion: null,
          appVersion,
          buildID: '20181001000000',
          cpuClass: null,
          deviceMemory: null,
          hardwareConcurrency,
          mimeTypes: [],
          maxTouchPoints: 0,
          oscpu: os.nav.oscpu,
          platform: os.nav.platform,
          plugins: [],
          productSub: '20100101',
          userAgent: ua,
          vendor: '',
          vendorSub: '',
        },
        screen: {
          width: screenRes[0],
          height: screenRes[1],
          availHeight: screenRes[1] + os.screenOffset,
        },
      };
    },
    // firefox esr (previous version)
    esr2: (os): BrowserProfile => {
      let version: string = BrowserVersions.esr2.desktop;
      let appVersion: string;
      let platform: string;

      let resolutions: string[] = os.id.includes('mac') ? MacResolutions : DesktopResolutions;
      let screenRes: number[] = resolutions[Math.floor(Math.random() * resolutions.length)].split('x').map(Number);

      let hardwareConcurrency: number = randomHW.includes(os.id) ? (Math.random() > 0.5 ? 4 : 2) : 4;

      switch (os.id) {
        case 'win1':
        case 'win2':
        case 'win3':
        case 'win4':
          platform = os.nav.oscpu;
          appVersion = '5.0 (Windows)';
          break;
        case 'mac1':
        case 'mac2':
        case 'mac3':
          platform = `Macintosh; ${os.nav.oscpu}`;
          appVersion = '5.0 (Macintosh)';
          break;
        case 'lin1':
        case 'lin2':
        case 'lin3':
          platform = os.uaPlatform;
          appVersion = '5.0 (X11)';
          break;
        default:
          break;
      }

      let ua = `Mozilla/5.0 (${platform}; rv:${version}.0) Gecko/20100101 Firefox/${version}.0`;

      return {
        accept: {
          header: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          encodingHTTP: 'gzip, deflate',
          encodingHTTPS: 'gzip, deflate, br',
        },
        osId: os.id,
        browser: 'firefox',
        navigator: {
          appMinorVersion: null,
          appVersion,
          buildID: '20181001000000',
          cpuClass: null,
          deviceMemory: null,
          hardwareConcurrency,
          mimeTypes: [],
          maxTouchPoints: 0,
          oscpu: os.nav.oscpu,
          platform: os.nav.platform,
          plugins: [],
          productSub: '20100101',
          userAgent: ua,
          vendor: '',
          vendorSub: '',
        },
        screen: {
          width: screenRes[0],
          height: screenRes[1],
          availHeight: screenRes[1] + os.screenOffset,
        },
      };
    },
    // firefox
    ff: (os): BrowserProfile => {
      let version: string = BrowserVersions.ff.desktop;
      let appVersion: string;
      let platform: string;

      let resolutions: string[] = os.id.includes('mac') ? MacResolutions : DesktopResolutions;
      let screenRes: number[] = resolutions[Math.floor(Math.random() * resolutions.length)].split('x').map(Number);

      let hardwareConcurrency: number = randomHW.includes(os.id) ? (Math.random() > 0.5 ? 4 : 2) : 4;

      switch (os.id) {
        case 'win1':
        case 'win2':
        case 'win3':
        case 'win4':
          appVersion = '5.0 (Windows)';
          platform = os.nav.oscpu;
          break;
        case 'mac1':
        case 'mac2':
        case 'mac3':
          appVersion = '5.0 (Macintosh)';
          platform = `Macintosh; ${os.nav.oscpu}`;
          resolutions = [];
          break;
        case 'lin1':
        case 'lin2':
        case 'lin3':
          appVersion = '5.0 (X11)';
          platform = os.uaPlatform;
          break;
        default:
          break;
      }

      let ua = `Mozilla/5.0 (${platform}; rv:${version}.0) Gecko/20100101 Firefox/${version}.0`;

      return {
        accept: {
          header: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          encodingHTTP: 'gzip, deflate',
          encodingHTTPS: 'gzip, deflate, br',
        },
        osId: os.id,
        browser: 'firefox',
        navigator: {
          appMinorVersion: null,
          appVersion,
          buildID: '20181001000000',
          cpuClass: null,
          deviceMemory: null,
          hardwareConcurrency,
          mimeTypes: [],
          maxTouchPoints: 0,
          oscpu: os.nav.oscpu,
          platform: os.nav.platform,
          plugins: [],
          productSub: '20100101',
          userAgent: ua,
          vendor: '',
          vendorSub: '',
        },
        screen: {
          width: screenRes[0],
          height: screenRes[1],
          availHeight: screenRes[1] + (os.id === 'lin2' ? 0 : os.screenOffset), // firefox on fedora enables some privacy options
        },
      };
    },
    // firefox for android
    ffm: (os): BrowserProfile => {
      let version: string = BrowserVersions.ff.mobile;
      let ua: string;

      const device = devices.getDevice('mobile', os.id);
      let screenRes: number[] = device.viewport.split('x').map(Number);

      ua = `Mozilla/5.0 (${os.uaPlatform}; Mobile; rv:${version}.0) Gecko/${version}.0 Firefox/${version}.0`;

      return {
        accept: {
          header: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          encodingHTTP: 'gzip, deflate',
          encodingHTTPS: 'gzip, deflate, br',
        },
        osId: os.id,
        browser: 'firefox',
        navigator: {
          appMinorVersion: null,
          appVersion: `5.0 (${os.uaPlatform})`,
          buildID: '20181001000000',
          cpuClass: null,
          deviceMemory: null,
          hardwareConcurrency: device.hw,
          mimeTypes: [],
          maxTouchPoints: 5,
          oscpu: 'Linux aarch64',
          platform: 'Linux aarch64',
          plugins: [],
          productSub: '20100101',
          userAgent: ua,
          vendor: '',
          vendorSub: '',
        },
        screen: {
          width: screenRes[0],
          height: screenRes[1],
          availHeight: screenRes[1],
          deviceScaleFactor: device.deviceScaleFactor,
        },
      };
    },
    fft: (os): BrowserProfile => {
      let version: string = BrowserVersions.ff.mobile;
      let ua: string;

      const device = devices.getDevice('tablet', os.id);
      let screenRes: number[] = device.viewport.split('x').map(Number);

      ua = `Mozilla/5.0 (${os.uaPlatform}; Tablet; rv:${version}.0) Gecko/${version}.0 Firefox/${version}.0`;

      return {
        accept: {
          header: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          encodingHTTP: 'gzip, deflate',
          encodingHTTPS: 'gzip, deflate, br',
        },
        osId: os.id,
        browser: 'firefox',
        navigator: {
          appMinorVersion: null,
          appVersion: `5.0 (${os.uaPlatform})`,
          buildID: '20181001000000',
          cpuClass: null,
          deviceMemory: null,
          hardwareConcurrency: device.hw,
          mimeTypes: [],
          maxTouchPoints: 5,
          oscpu: 'Linux aarch64',
          platform: 'Linux aarch64',
          plugins: [],
          productSub: '20100101',
          userAgent: ua,
          vendor: '',
          vendorSub: '',
        },
        screen: {
          width: screenRes[0],
          height: screenRes[1],
          availHeight: screenRes[1],
          deviceScaleFactor: device.deviceScaleFactor,
        },
      };
    },
    // google chrome
    gcr: (os): BrowserProfile => {
      let version: string = BrowserVersions.gcr.desktop;
      let platform: string;

      let resolutions: string[] = os.id.includes('mac') ? MacResolutions : DesktopResolutions;
      let screenRes: number[] = resolutions[Math.floor(Math.random() * resolutions.length)].split('x').map(Number);

      switch (os.id) {
        case 'win1':
        case 'win2':
        case 'win3':
        case 'win4':
          platform = os.nav.oscpu;
          break;
        case 'mac1':
        case 'mac2':
        case 'mac3':
        case 'lin1':
        case 'lin2':
          platform = os.uaPlatform;
          break;
        case 'lin3':
          platform = 'Linux x86_64';
          break;
        default:
          break;
      }

      let ua: string = `Mozilla/5.0 (${platform}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${version} Safari/537.36`;

      let hardwareConcurrency: number = randomHW.includes(os.id) ? (Math.random() > 0.5 ? 4 : 2) : 4;

      return {
        accept: {
          header: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
          encodingHTTP: 'gzip, deflate',
          encodingHTTPS: 'gzip, deflate, br',
        },
        osId: os.id,
        browser: 'chrome',
        navigator: {
          appMinorVersion: null,
          appVersion: ua.split('Mozilla/')[1],
          buildID: null,
          cpuClass: null,
          deviceMemory: Math.random() > 0.5 ? 4 : 8,
          hardwareConcurrency,
          mimeTypes: [
            { type: 'application/pdf', suffixes: 'pdf', description: '' },
            { type: 'application/x-google-chrome-pdf', suffixes: 'pdf', description: 'Portable Document Format' },
          ],
          maxTouchPoints: 0,
          oscpu: null,
          platform: os.nav.platform,
          plugins: [
            {
              name: 'Chrome PDF Plugin',
              filename: 'internal-pdf-viewer',
              description: 'Portable Document Format',
              version: null,
              __mimeTypes: ['application/x-google-chrome-pdf'],
            },
            { name: 'Chrome PDF Viewer', filename: 'mhjfbmdgcfjbbpaeojofohoefgiehjai', description: '', version: null, __mimeTypes: ['application/pdf'] },
          ],
          productSub: '20030107',
          userAgent: ua,
          vendor: 'Google Inc.',
          vendorSub: '',
        },
        screen: {
          width: screenRes[0],
          height: screenRes[1],
          availHeight: screenRes[1] + os.screenOffset,
        },
      };
    },
    // google chrome (mobile)
    gcrm: (os): BrowserProfile => {
      let versions: any = BrowserVersions.gcr;
      let ua: string;

      let accept: any;
      let navigator: any;

      const device = devices.getDevice('mobile', os.id);
      let screenRes: number[] = device.viewport.split('x').map(Number);

      if (os.id.includes('ios')) {
        ua = `Mozilla/5.0 (iPhone; CPU iPhone OS ${os.uaPlatform} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/${versions.ios} Mobile/15E148 Safari/604.1`;

        (navigator = {
          appMinorVersion: null,
          appVersion: ua.split('Mozilla/')[1],
          buildID: null,
          cpuClass: null,
          deviceMemory: null,
          hardwareConcurrency: 8,
          mimeTypes: [],
          maxTouchPoints: 5,
          oscpu: null,
          platform: 'iPhone',
          plugins: [],
          productSub: '20030107',
          userAgent: ua,
          vendor: 'Apple Computer, Inc.',
          vendorSub: '',
        }),
          (accept = {
            header: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            encodingHTTP: 'gzip, deflate',
            encodingHTTPS: 'br, gzip, deflate',
          });
      } else {
        ua = `Mozilla/5.0 (Linux; ${os.uaPlatform}; ${device.build}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${versions.android} Mobile Safari/537.36`;

        navigator = {
          appMinorVersion: null,
          appVersion: ua.split('Mozilla/')[1],
          buildID: null,
          cpuClass: null,
          deviceMemory: device.mem,
          hardwareConcurrency: device.hw,
          mimeTypes: [],
          maxTouchPoints: 5,
          oscpu: null,
          platform: 'Linux armv8l',
          plugins: [],
          productSub: '20030107',
          userAgent: ua,
          vendor: 'Google Inc.',
          vendorSub: '',
        };

        accept = {
          header: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
          encodingHTTP: 'gzip, deflate',
          encodingHTTPS: 'gzip, deflate, br',
        };
      }

      return {
        accept,
        osId: os.id,
        browser: 'chrome',
        navigator,
        screen: {
          width: screenRes[0],
          height: screenRes[1],
          availHeight: screenRes[1],
          deviceScaleFactor: device.deviceScaleFactor,
        },
      };
    },
    // google chrome (tablet)
    gcrt: (os): BrowserProfile => {
      let versions: any = BrowserVersions.gcr;
      let ua: string;

      let accept: any;
      let navigator: any;

      const device = devices.getDevice('tablet', os.id);
      let screenRes: number[] = device.viewport.split('x').map(Number);

      if (os.id.includes('ios')) {
        ua = `Mozilla/5.0 (iPad; CPU OS ${os.uaPlatform} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/${versions.ios} Mobile/15E148 Safari/604.1`;

        navigator = {
          appMinorVersion: null,
          appVersion: ua.split('Mozilla/')[1],
          buildID: null,
          cpuClass: null,
          deviceMemory: null,
          hardwareConcurrency: 8,
          mimeTypes: [],
          maxTouchPoints: 5,
          oscpu: null,
          platform: 'iPad',
          plugins: [],
          productSub: '20030107',
          userAgent: ua,
          vendor: 'Apple Computer, Inc.',
          vendorSub: '',
        };

        accept = {
          header: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          encodingHTTP: 'gzip, deflate',
          encodingHTTPS: 'br, gzip, deflate',
        };
      } else {
        ua = `Mozilla/5.0 (Linux; ${os.uaPlatform}; ${device.build}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${versions.android} Safari/537.36`;

        navigator = {
          appMinorVersion: null,
          appVersion: ua.split('Mozilla/')[1],
          buildID: null,
          cpuClass: null,
          deviceMemory: device.mem,
          hardwareConcurrency: device.hw,
          mimeTypes: [],
          maxTouchPoints: 5,
          oscpu: null,
          platform: 'Linux armv8l',
          plugins: [],
          productSub: '20030107',
          userAgent: ua,
          vendor: 'Google Inc.',
          vendorSub: '',
        };

        accept = {
          header: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
          encodingHTTP: 'gzip, deflate',
          encodingHTTPS: 'gzip, deflate, br',
        };
      }

      return {
        accept,
        osId: os.id,
        browser: 'chrome',
        navigator,
        screen: {
          width: screenRes[0],
          height: screenRes[1],
          availHeight: screenRes[1],
          deviceScaleFactor: device.deviceScaleFactor,
        },
      };
    },
    // internet explorer
    ie: (os): BrowserProfile => {
      let resolutions = DesktopResolutions.slice(0, 4);
      let screenRes = resolutions[Math.floor(Math.random() * resolutions.length)].split('x').map(Number);

      let availHeight: number;

      switch (os.id) {
        case 'win1':
          availHeight = screenRes[1] - 40;
          break;
        case 'win2':
        case 'win3':
          availHeight = screenRes[1] - 40;
          break;
        case 'win4':
          availHeight = screenRes[1] - 30;
          break;
        default:
          break;
      }

      return {
        accept: {
          header: 'text/html, application/xhtml+xml, */*',
          encodingHTTP: 'gzip',
          encodingHTTPS: 'gzip, deflate',
        },
        osId: os.id,
        browser: 'ie',
        navigator: {
          appMinorVersion: '0',
          appVersion: `5.0 (${os.nav.oscpu.split(';')[0]}; Trident/7.0; .NET4.0C; .NET4.0E; rv:11.0) like Gecko`,
          buildID: null,
          cpuClass: 'x64',
          deviceMemory: null,
          hardwareConcurrency: null,
          mimeTypes: null,
          maxTouchPoints: 0,
          oscpu: null,
          platform: 'Win32',
          plugins: null,
          productSub: null,
          userAgent: `Mozilla/5.0 (${os.nav.oscpu.split(';')[0]}; WOW64; Trident/7.0; rv:11.0) like Gecko`,
          vendor: '',
          vendorSub: null,
        },
        screen: {
          width: screenRes[0],
          height: screenRes[1],
          availHeight,
        },
      };
    },
    // safari
    sf: (os): BrowserProfile => {
      let version: string = BrowserVersions.sf.desktop;

      let ua = `Mozilla/5.0 (${os.uaPlatform}) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/${version} Safari/605.1.15`;
      let screenRes = MacResolutions[Math.floor(Math.random() * MacResolutions.length)].split('x').map(Number);

      let hardwareConcurrency: number = Math.random() > 0.5 ? 4 : 8;

      return {
        accept: {
          header: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          encodingHTTP: 'gzip, deflate',
          encodingHTTPS: 'br, gzip, deflate',
        },
        osId: os.id,
        browser: 'safari',
        navigator: {
          appMinorVersion: null,
          appVersion: ua.split('Mozilla/')[1],
          buildID: null,
          cpuClass: null,
          deviceMemory: null,
          hardwareConcurrency,
          mimeTypes: [
            { type: 'application/pdf', suffixes: 'pdf', description: 'Portable Document Format' },
            { type: 'text/pdf', suffixes: 'pdf', description: 'Portable Document Format' },
            { type: 'application/postscript', suffixes: 'ps', description: 'PostScript' },
          ],
          maxTouchPoints: 0,
          oscpu: null,
          platform: 'MacIntel',
          plugins: [{ name: 'WebKit built-in PDF', filename: '', description: '', __mimeTypes: ['application/pdf', 'text/pdf', 'application/postscript'] }],
          productSub: '20030107',
          userAgent: ua,
          vendor: 'Apple Computer, Inc.',
          vendorSub: '',
        },
        screen: {
          width: screenRes[0],
          height: screenRes[1],
          availHeight: screenRes[1] + os.screenOffset,
        },
      };
    },
    // safari (mobile)
    sfm: (os): BrowserProfile => {
      let version: string = BrowserVersions.sf[os.id];

      const device = devices.getDevice('mobile', os.id);
      let screenRes: number[] = device.viewport.split('x').map(Number);

      let ua = `Mozilla/5.0 (iPhone; CPU iPhone OS ${os.uaPlatform} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/${version} Mobile/15E148 Safari/604.1`;

      return {
        accept: {
          header: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          encodingHTTP: 'gzip, deflate',
          encodingHTTPS: 'br, gzip, deflate',
        },
        osId: os.id,
        browser: 'safari',
        navigator: {
          appMinorVersion: null,
          appVersion: ua.split('Mozilla/')[1],
          buildID: null,
          cpuClass: null,
          deviceMemory: null,
          hardwareConcurrency: null,
          mimeTypes: [],
          maxTouchPoints: 5,
          oscpu: null,
          platform: 'iPhone',
          plugins: [],
          productSub: '20030107',
          userAgent: ua,
          vendor: 'Apple Computer, Inc.',
          vendorSub: '',
        },
        screen: {
          width: screenRes[0],
          height: screenRes[1],
          availHeight: screenRes[1],
          deviceScaleFactor: device.deviceScaleFactor,
        },
      };
    },
    // safari (tablet)
    sft: (os): BrowserProfile => {
      let version: string = BrowserVersions.sf[os.id];

      const device = devices.getDevice('tablet', os.id);
      let screenRes: number[] = device.viewport.split('x').map(Number);

      let ua = `Mozilla/5.0 (iPad; CPU OS ${os.uaPlatform} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/${version} Mobile/15E148 Safari/604.1`;

      return {
        accept: {
          header: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          encodingHTTP: 'gzip, deflate',
          encodingHTTPS: 'br, gzip, deflate',
        },
        osId: os.id,
        browser: 'safari',
        navigator: {
          appMinorVersion: null,
          appVersion: ua.split('Mozilla/')[1],
          buildID: null,
          cpuClass: null,
          deviceMemory: null,
          hardwareConcurrency: null,
          mimeTypes: [],
          maxTouchPoints: 5,
          oscpu: null,
          platform: 'iPad',
          plugins: [],
          productSub: '20030107',
          userAgent: ua,
          vendor: 'Apple Computer, Inc.',
          vendorSub: '',
        },
        screen: {
          width: screenRes[0],
          height: screenRes[1],
          availHeight: screenRes[1],
          deviceScaleFactor: device.deviceScaleFactor,
        },
      };
    },
  };

  private profiles = {
    windows: [
      {
        id: 'win1',
        name: 'Win 7',
        nav: {
          version: '5.0 (Windows)',
          oscpu: 'Windows NT 6.1; Win64; x64',
          platform: 'Win32',
        },
        screenOffset: -40,
        browsers: ['edg', 'esr', 'esr2', 'ff', 'gcr', 'ie'],
      },
      {
        id: 'win2',
        name: 'Win 8',
        nav: {
          version: '5.0 (Windows)',
          oscpu: 'Windows NT 6.2; Win64; x64',
          platform: 'Win32',
        },
        screenOffset: -40,
        browsers: ['edg', 'esr', 'esr2', 'ff', 'gcr', 'ie'],
      },
      {
        id: 'win3',
        name: 'Win 8.1',
        nav: {
          version: '5.0 (Windows)',
          oscpu: 'Windows NT 6.3; Win64; x64',
          platform: 'Win32',
        },
        screenOffset: -40,
        browsers: ['edg', 'esr', 'esr2', 'ff', 'gcr', 'ie'],
      },
      {
        id: 'win4',
        name: 'Win 10',
        nav: {
          version: '5.0 (Windows)',
          oscpu: 'Windows NT 10.0; Win64; x64',
          platform: 'Win32',
        },
        screenOffset: -30,
        browsers: ['edg', 'esr', 'esr2', 'ff', 'gcr', 'ie'],
      },
    ],
    macOS: [
      //  Use last 3 versions of macOS
      {
        id: 'mac1',
        name: 'macOS 10.14',
        browsers: ['edg', 'esr', 'esr2', 'ff', 'gcr', 'sf'],
        nav: {
          version: '',
          oscpu: 'Intel Mac OS X 10.13',
          platform: 'MacIntel',
        },
        screenOffset: -23,
        uaPlatform: 'Macintosh; Intel Mac OS X 10_13_6',
      },
      {
        id: 'mac2',
        name: 'macOS 10.15',
        browsers: ['edg', 'esr', 'esr2', 'ff', 'gcr', 'sf'],
        nav: {
          version: '',
          oscpu: 'Intel Mac OS X 10.14',
          platform: 'MacIntel',
        },
        screenOffset: -23,
        uaPlatform: 'Macintosh; Intel Mac OS X 10_14_6',
      },
      {
        id: 'mac3',
        name: 'macOS 11',
        browsers: ['edg', 'esr', 'esr2', 'ff', 'gcr', 'sf'],
        nav: {
          version: '',
          oscpu: 'Intel Mac OS X 11.1',
          platform: 'MacIntel',
        },
        screenOffset: -23,
        uaPlatform: 'Macintosh; Intel Mac OS X 11_1',
      },
    ],
    linux: [
      {
        id: 'lin1',
        name: 'Linux',
        browsers: ['esr', 'esr2', 'ff', 'gcr'],
        nav: {
          version: '5.0 (X11)',
          oscpu: 'Linux x86_64',
          platform: 'Linux x86_64',
        },
        screenOffset: -45, // kde + maia panel
        uaPlatform: 'X11; Linux x86_64',
      },
      {
        id: 'lin2',
        name: 'Fedora Linux',
        browsers: ['esr', 'esr2', 'ff', 'gcr'],
        nav: {
          version: '5.0 (X11)',
          oscpu: 'Linux x86_64',
          platform: 'Linux x86_64',
        },
        screenOffset: -27, // gnome
        uaPlatform: 'X11; Fedora; Linux x86_64',
      },
      {
        id: 'lin3',
        name: 'Ubuntu Linux',
        browsers: ['esr', 'esr2', 'ff', 'gcr'],
        nav: {
          version: '5.0 (X11)',
          oscpu: 'Linux x86_64',
          platform: 'Linux x86_64',
        },
        screenOffset: -27, // gnome
        uaPlatform: 'X11; Linux x86_64',
      },
    ],
    iOS: [
      {
        id: 'ios1',
        name: 'iOS 12',
        browsers: ['gcrm', 'gcrt', 'sfm', 'sft'],
        uaPlatform: '12_4_7',
      },
      {
        id: 'ios2',
        name: 'iOS 13',
        browsers: ['gcrm', 'gcrt', 'sfm', 'sft'],
        uaPlatform: '13_7',
      },
      {
        id: 'ios3',
        name: 'iOS 14',
        browsers: ['gcrm', 'gcrt', 'sfm', 'sft'],
        uaPlatform: '14_7',
      },
    ],
    android: [
      {
        id: 'and1',
        name: 'Android 8',
        browsers: ['edgm', 'ffm', 'fft', 'gcrm', 'gcrt'],
        uaPlatform: 'Android 8.1.0',
      },
      {
        id: 'and2',
        name: 'Android 9',
        browsers: ['edgm', 'ffm', 'fft', 'gcrm', 'gcrt'],
        uaPlatform: 'Android 9',
      },
      {
        id: 'and3',
        name: 'Android 10',
        browsers: ['edgm', 'ffm', 'fft', 'gcrm', 'gcrt'],
        uaPlatform: 'Android 10',
      },
      {
        id: 'and4',
        name: 'Android 11',
        browsers: ['edgm', 'ffm', 'fft', 'gcrm', 'gcrt'],
        uaPlatform: 'Android 11',
      },
    ],
  };

  private allProfiles = {
    windows: [],
    macOS: [],
    linux: [],
    iOS: [],
    android: [],
  };

  private profileIds = {
    desktop: [],
    mobile: [],
  };

  private excludedProfiles: string[];

  private generateProfiles(key: string): any {
    let profiles = [];

    let target = this.profiles[key];
    for (let i = 0; i < target.length; i++) {
      for (let j = 0; j < target[i].browsers.length; j++) {
        let id = `${target[i].id}-${target[i].browsers[j]}`;
        profiles.push({
          id,
          badge: getBadge(target[i].browsers[j]),
          name: getName(target[i].name, target[i].browsers[j]),
        });
      }
    }

    return profiles;
  }

  constructor(excludedProfiles: string[] = []) {
    this.excludedProfiles = excludedProfiles;

    for (let p of Object.keys(this.profiles)) {
      this.allProfiles[p] = this.generateProfiles(p);
    }

    this.profileIds.desktop = this.profileIds.desktop.concat(
      this.allProfiles.windows.map(p => p.id),
      this.allProfiles.macOS.map(p => p.id),
      this.allProfiles.linux.map(p => p.id)
    );

    this.profileIds.mobile = this.profileIds.mobile.concat(
      this.allProfiles.iOS.map(p => p.id),
      this.allProfiles.android.map(p => p.id)
    );
  }

  getAllProfiles(): any {
    return this.allProfiles;
  }

  getProfile(profile: string): BrowserProfile {
    let profileData = profile.split('-');

    let platform: string;

    if (profileData[0].includes('win')) {
      platform = 'windows';
    } else if (profileData[0].includes('mac')) {
      platform = 'macOS';
    } else if (profileData[0].includes('lin')) {
      platform = 'linux';
    } else if (profileData[0].includes('ios')) {
      platform = 'iOS';
    } else if (profileData[0].includes('and')) {
      platform = 'android';
    }

    return this.browsers[profileData[1]](this.profiles[platform].find(p => p.id === profileData[0]));
  }

  getRandomByDevice(device: string): string {
    let profilesCanUse: string[];

    if (device === 'random') {
      profilesCanUse = this.profileIds.desktop.concat(this.profileIds.mobile).filter(p => !this.excludedProfiles.includes(p));
    } else if (device === 'randomDesktop') {
      profilesCanUse = this.profileIds.desktop.filter(p => !this.excludedProfiles.includes(p));
    } else {
      profilesCanUse = this.profileIds.mobile.filter(p => !this.excludedProfiles.includes(p));
    }

    if (profilesCanUse.length > 0) {
      return profilesCanUse[Math.floor(Math.random() * profilesCanUse.length)];
    }

    return 'none';
  }

  getRandomByOS(os: string): string {
    let profilesCanUse: string[];

    if (os === 'windows') {
      profilesCanUse = this.profileIds.desktop.filter(p => p.includes('win') && !this.excludedProfiles.includes(p));
    } else if (os === 'macOS') {
      profilesCanUse = this.profileIds.desktop.filter(p => p.includes('mac') && !this.excludedProfiles.includes(p));
    } else if (os === 'linux') {
      profilesCanUse = this.profileIds.desktop.filter(p => p.includes('lin') && !this.excludedProfiles.includes(p));
    } else if (os === 'iOS') {
      profilesCanUse = this.profileIds.mobile.filter(p => p.includes('ios') && !this.excludedProfiles.includes(p));
    } else if (os === 'android') {
      profilesCanUse = this.profileIds.mobile.filter(p => p.includes('and') && !this.excludedProfiles.includes(p));
    }

    if (profilesCanUse.length > 0) {
      return profilesCanUse[Math.floor(Math.random() * profilesCanUse.length)];
    }

    return 'none';
  }
}
