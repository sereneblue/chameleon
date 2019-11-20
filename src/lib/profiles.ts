const devices = require('./devices');

export interface BrowserProfile {
  accept: {
    header: string;
    encodingHTTP: string;
    encodingHTTPS: string;
  };
  navigator?: {
    appVersion: string;
    buildID: string;
    hardwareConcurrency: string;
    oscpu: string;
    platform: string;
    productSub: string;
    vendor: string;
    ua: string;
  };
  screen?: {
    width: string;
    height: string;
    offset: string;
  };
  useragent?: string;
}

export interface ProfileListItem {
  id: string;
  name: string;
}

const BrowserVersions: any = {
  esr: { desktop: '68' },
  ff: { all: '70' },
  gcr: { desktop: '78.0.3904.97', ios: '78.0.3904.84', android: '78.0.3904.96' },
  sf: { desktop: '13.0.3', mobile: '13.0.4' },
};

let getName = (os: string, browser: string) => {
  if (browser === 'esr') {
    return `${os} - Firefox ${BrowserVersions.esr.desktop} ESR`;
  } else if (browser === 'ff') {
    return `${os} - Firefox ${BrowserVersions.ff.all}`;
  } else if (browser === 'gcr') {
    return `${os} - Google Chrome ${BrowserVersions.gcr.desktop.split('.')[0]}`;
  } else if (browser === 'gcrm') {
    let key = os.charAt(0) === 'i' ? 'ios' : 'android';
    return `${os} - Google Chrome ${BrowserVersions.gcr[key].split('.')[0]} (Phone)`;
  } else if (browser === 'gcrt') {
    let key = os.charAt(0) === 'i' ? 'ios' : 'android';
    return `${os} - Google Chrome ${BrowserVersions.gcr[key].split('.')[0]} (Tablet)`;
  } else if (browser === 'ie') {
    return `${os} - Internet Explorer 11`;
  } else if (browser === 'sf') {
    return `${os} - Safari ${BrowserVersions.sf.desktop.split('.')[0]}`;
  } else if (browser === 'sfm') {
    return `${os} - Safari ${BrowserVersions.sf.mobile.split('.')[0]} (iPad)`;
  } else if (browser === 'sft') {
    return `${os} - Safari ${BrowserVersions.sf.mobile.split('.')[0]} (iPhone)`;
  }
};

export class Generator {
  private browsers = {
    // firefox esr
    esr: (os): BrowserProfile => {
      let version: string = BrowserVersions.esr.desktop;
      let platform: string;

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
          platform = `Macintosh; ${os.nav.oscpu}`;
          break;
        case 'lin1':
        case 'lin2':
        case 'lin3':
          platform = os.uaPlatform;
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
        useragent: ua,
      };
    },
    // firefox
    ff: (os): BrowserProfile => {
      let version: string = BrowserVersions.ff.desktop;
      let platform: string;
      let device: string;

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
          platform = `Macintosh; ${os.nav.oscpu}`;
          break;
        case 'lin1':
        case 'lin2':
        case 'lin3':
          platform = os.uaPlatform;
          break;
        case 'and1':
        case 'and2':
        case 'and3':
        case 'and4':
          platform = `${os.name}; Mobile`;
        default:
          break;
      }

      let ua = `Mozilla/5.0 (${platform}; rv:${version}.0) Gecko/${device ? version + '.0' : '20100101'} Firefox/${version}.0`;

      return {
        accept: {
          header: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          encodingHTTP: 'gzip, deflate',
          encodingHTTPS: 'gzip, deflate, br',
        },
        useragent: ua,
      };
    },
    // google chrome
    gcr: (os): BrowserProfile => {
      let version: string = BrowserVersions.gcr.desktop;
      let platform: string;

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
          platform = 'X11; Linux x86_64';
          break;
        default:
          break;
      }

      let ua: string = `Mozilla/5.0 (${platform}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${version} Safari/537.36`;

      return {
        accept: {
          header: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
          encodingHTTP: 'gzip, deflate',
          encodingHTTPS: 'gzip, deflate, br',
        },
        useragent: ua,
      };
    },
    // google chrome (mobile)
    gcrm: (os): BrowserProfile => {
      let versions: any = BrowserVersions.gcrm;
      let platform: string;
      let version: string;

      const device = devices.getDevice('mobile', os.id);

      switch (os.id) {
        case 'ios1':
        case 'ios2':
        case 'ios3':
          platform = os.uaPlatform;
          version = versions.ios;
          break;
        case 'and1':
        case 'and2':
        case 'and3':
        case 'and4':
          platform = `Linux; ${os.uaPlatform}; ${device.build}`;
          version = versions.android;
        default:
          break;
      }

      let ua: string;
      if (os.id.charAt(0) === 'i') {
        ua = `Mozilla/5.0 (iPhone; CPU iPhone OS ${os.uaPlatform} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/${version} Mobile/${device.builld} Safari/605.1`;
      } else {
        ua = `Mozilla/5.0 (Linux; ${os.uaPlatform}; ${device.build}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${version} Mobile Safari/537.36`;
      }

      return {
        accept: {
          header: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
          encodingHTTP: 'gzip, deflate',
          encodingHTTPS: 'gzip, deflate, br',
        },
        useragent: ua,
      };
    },
    // google chrome (tablet)
    gcrt: (os): BrowserProfile => {
      let versions: any = BrowserVersions.gcrm;
      let platform: string;
      let version: string;

      // const device = devices.getDevice('tablet', os.id);

      switch (os.id) {
        case 'ios1':
        case 'ios2':
        case 'ios3':
          platform = os.uaPlatform;
          version = versions.ios;
          break;
        case 'and1':
        case 'and2':
        case 'and3':
        case 'and4':
          // platform = `Linux; ${os.uaPlatform}; ${device.build}`;
          version = versions.android;
        default:
          break;
      }

      // let ua: string;
      // if (os.id.charAt(0) === 'i') {
      //   ua = `Mozilla/5.0 (iPad; CPU OS ${os.uaPlatform} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/${version} Mobile/${device.builld} Safari/605.1`;
      // } else {
      //   ua = `Mozilla/5.0 (Linux; ${os.uaPlatform}; ${device.build}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${version} Safari/537.36`;
      // }exc

      return {
        accept: {
          header: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
          encodingHTTP: 'gzip, deflate',
          encodingHTTPS: 'gzip, deflate, br',
        },
        useragent: '',
      };
    },
    // internet explorer
    ie: (os): BrowserProfile => {
      return {
        accept: {
          header: 'text/html, application/xhtml+xml, */*',
          encodingHTTP: 'gzip',
          encodingHTTPS: 'gzip, deflate',
        },
        useragent: `Mozilla/5.0 (${os.nav.oscpu.split(';')[0]}; WOW64; Trident/7.0; rv:11.0) like Gecko`,
      };
    },
    // safari
    sf: (os): BrowserProfile => {
      let version: string = BrowserVersions.sf.desktop;

      let ua = `Mozilla/5.0 (${os.uaPlatform}) AppleWebKit/602.3.12 (KHTML, like Gecko) Version/${version} Safari/602.3.12`;

      return {
        accept: {
          header: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          encodingHTTP: 'gzip, deflate',
          encodingHTTPS: 'br, gzip, deflate'
        },
        useragent: ua
      };
    },
    // safari (mobile)
    sfm: (os): BrowserProfile => {
      let version: string = BrowserVersions.sf.mobile;

      const device = devices.getDevice('mobile', os.id);

      let ua = `Mozilla/5.0 (iPhone; CPU iPhone OS ${os.uaPlatform} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/${version} Mobile/${device.build} Safari/604.1`;
      
      return {
        accept: {
          header: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          encodingHTTP: 'gzip, deflate',
          encodingHTTPS: 'br, gzip, deflate'
        },
        useragent: ua
      };
    },
    // safari (tablet)
    sft: (os): BrowserProfile => {
      let version: string = BrowserVersions.sf.mobile;

      const device = devices.getDevice('tablet', os.id);

      let ua = `Mozilla/5.0 (iPad; CPU OS ${os.uaPlatform} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/${version} Mobile/${device.build} Safari/604.1`;

      return {
        accept: {
          header: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          encodingHTTP: 'gzip, deflate',
          encodingHTTPS: 'br, gzip, deflate'
        },
        useragent: ua
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
        browsers: ['esr', 'ff', 'gcr', 'ie'],
      },
      {
        id: 'win2',
        name: 'Win 8',
        nav: {
          version: '5.0 (Windows)',
          oscpu: 'Windows NT 6.2; Win64; x64',
          platform: 'Win32',
        },
        browsers: ['esr', 'ff', 'gcr', 'ie'],
      },
      {
        id: 'win3',
        name: 'Win 8.1',
        nav: {
          version: '5.0 (Windows)',
          oscpu: 'Windows NT 6.3; Win64; x64',
          platform: 'Win32',
        },
        browsers: ['esr', 'ff', 'gcr', 'ie'],
      },
      {
        id: 'win4',
        name: 'Win 10',
        nav: {
          version: '5.0 (Windows)',
          oscpu: 'Windows NT 10.0; Win64; x64',
          platform: 'Win32',
        },
        browsers: ['esr', 'ff', 'gcr', 'ie'],
      },
    ],
    macOS: [
      //  Use last 3 versions of macOS
      {
        id: 'mac1',
        name: 'macOS 10.13',
        browsers: ['esr', 'ff', 'gcr', 'sf'],
        nav: {
          version: '',
          oscpu: 'Intel Mac OS X 10.13',
          platform: 'MacIntel',
        },
        uaPlatform: 'Macintosh; Intel Mac OS X 10_13_5',
      },
      {
        id: 'mac2',
        name: 'macOS 10.14',
        browsers: ['esr', 'ff', 'gcr', 'sf'],
        nav: {
          version: '',
          oscpu: 'Intel Mac OS X 10.14',
          platform: 'MacIntel',
        },
        uaPlatform: 'Macintosh; Intel Mac OS X 10_14_4',
      },
      {
        id: 'mac3',
        name: 'macOS 10.15',
        browsers: ['esr', 'ff', 'gcr', 'sf'],
        nav: {
          version: '',
          oscpu: 'Intel Mac OS X 10.15',
          platform: 'MacIntel',
        },
        uaPlatform: 'Macintosh; Intel Mac OS X 10_15_1',
      },
    ],
    linux: [
      {
        id: 'lin1',
        name: 'Linux',
        browsers: ['esr', 'ff', 'gcr'],
        nav: {
          version: '5.0 (X11)',
          oscpu: 'Linux x86_64',
          platform: 'Linux x86_64',
        },
        uaPlatform: 'X11; Linux x86_64',
      },
      {
        id: 'lin2',
        name: 'Fedora Linux',
        browsers: ['esr', 'ff', 'gcr'],
        nav: {
          version: '5.0 (X11)',
          oscpu: 'Linux x86_64',
          platform: 'Linux x86_64',
        },
        uaPlatform: 'X11; Fedora; Linux x86_64',
      },
      {
        id: 'lin3',
        name: 'Ubuntu Linux',
        browsers: ['esr', 'ff', 'gcr'],
        nav: {
          version: '5.0 (X11)',
          oscpu: 'Linux x86_64',
          platform: 'Linux x86_64',
        },
        uaPlatform: 'X11; Ubuntu; Linux x86_64',
      },
    ],
    iOS: [
      {
        id: 'ios1',
        name: 'iOS 11',
        browsers: ['gcrm', 'gcrt', 'sfm', 'sft'],
        uaPlatform: '11_4_1',
      },
      {
        id: 'ios2',
        name: 'iOS 12',
        browsers: ['gcrm', 'gcrt', 'sfm', 'sft'],
        uaPlatform: '12_4_3',
      },
      {
        id: 'ios3',
        name: 'iOS 13',
        browsers: ['gcrm', 'gcrt', 'sfm', 'sft'],
        uaPlatform: '13_2',
      },
    ],
    android: [
      {
        id: 'and1',
        name: 'Android 6',
        browsers: ['ff', 'gcrm', 'gcrt'],
        uaPlatform: 'Android 6.0.1',
      },
      {
        id: 'and2',
        name: 'Android 7',
        browsers: ['ff', 'gcrm', 'gcrt'],
        uaPlatform: 'Android 7.1.2',
      },
      {
        id: 'and3',
        name: 'Android 8',
        browsers: ['ff', 'gcrm', 'gcrt'],
        uaPlatform: 'Android 8.1.0',
      },
      {
        id: 'and4',
        name: 'Android 9',
        browsers: ['ff', 'gcrm', 'gcrt'],
        uaPlatform: 'Android 9',
      },
    ],
  };

  private generateProfiles(key: string): any {
    let profiles = [];

    let target = this.profiles[key];
    for (let i = 0; i < target.length; i++) {
      for (let j = 0; j < target[i].browsers.length; j++) {
        let id = `${target[i].id}-${target[i].browsers[j]}`;
        profiles.push({
          id,
          name: getName(target[i].name, target[i].browsers[j]),
        });
      }
    }

    return profiles;
  }

  getAllProfiles(): any {
    let profiles = {};

    let osFamilies = Object.keys(this.profiles);
    osFamilies.map(k => {
      profiles[k] = this.generateProfiles(k);
    });

    return profiles;
  }

  getProfile(profile: string): BrowserProfile {
    let profileData = profile.split('-');

    let key: string;

    if (profileData[0].indexOf('win') > -1) {
      key = 'windows';
    } else if (profileData[0].indexOf('mac') > -1) {
      key = 'macOS';
    } else if (profileData[0].indexOf('lin') > -1) {
      key = 'linux';
    } else if (profileData[0].indexOf('ios') > -1) {
      key = 'iOS';
    } else if (profileData[0].indexOf('and') > -1) {
      key = 'android';
    }

    return this.browsers[profileData[1]](this.profiles[key].find(p => p.id === profileData[0]));
  }

  getRandom(device: string, osType: string): string {
    device = device ? device : Math.random() > 0.5 ? 'desktop' : 'mobile';

    let os = device === 'desktop' ? ['windows', 'macOS', 'linux'] : ['iOS', 'android'];
    let osFamily = this.profiles[osType ? osType : os[Math.floor(Math.random() * os.length)]];
    let selectedOS = osFamily[Math.floor(Math.random() * osFamily.length)];
    let selectedBrowser = selectedOS.browsers[Math.floor(Math.random() * selectedOS.browsers.length)];

    return `${selectedOS.id}-${selectedBrowser}`;
  }
}
