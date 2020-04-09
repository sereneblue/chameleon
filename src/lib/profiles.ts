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
    width: number,
    height: number,
    clientWidth: number,
    innerHeight: number,
    outerHeight: number,
  };
  useragent?: string;
}

export interface ProfileListItem {
  id: string;
  name: string;
}

const BrowserVersions: any = {
  edg: { desktop: '80.0.361.109', desktopChrome: '81.0.4044.92', android: '45.2.2.4930', androidChrome: '81.0.4044.96' },
  esr: { desktop: '68' },
  ff: { all: '75' },
  gcr: { desktop: '81.0.4044.92', ios: '81.0.4044.62', android: '81.0.4044.96' },
  sf: { desktop: '13.0.4', mobile: '13.0.4' },
};

let getName = (os: string, browser: string) => {
  if (browser === 'edg') {
    return `${os} - Edge ${BrowserVersions.edg.desktop.split('.')[0]}`;
  } else if (browser === 'edgm') {
    return `${os} - Edge ${BrowserVersions.edg.desktop.split('.')[0]} (Phone)`;
  } else if (browser === 'esr') {
    return `${os} - Firefox ${BrowserVersions.esr.desktop} ESR`;
  } else if (browser === 'ff') {
    return `${os} - Firefox ${BrowserVersions.ff.all}`;
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
    return `${os} - Safari ${BrowserVersions.sf.mobile.split('.')[0]} (iPhone)`;
  } else if (browser === 'sft') {
    return `${os} - Safari ${BrowserVersions.sf.mobile.split('.')[0]} (iPad)`;
  }
};

export class Generator {
  private browsers = {
    // edge
    edg: (os): BrowserProfile => {
      let versions: any = BrowserVersions.edg;
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
          platform = os.uaPlatform;
          break;
        default:
          break;
      }

      let ua: string = `Mozilla/5.0 (${platform}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${versions.chromeVersion} Safari/537.36 Edg/${versions.desktop}`;

      return {
        accept: {
          header: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
          encodingHTTP: 'gzip, deflate',
          encodingHTTPS: 'gzip, deflate, br',
        },
        useragent: ua,
      };
    },
    // edge (mobile)
    edgm: (os): BrowserProfile => {
      let versions: any = BrowserVersions.edg;
      let platform: string;

      const device = devices.getDevice('mobile', os.id);

      switch (os.id) {
        case 'and1':
        case 'and2':
        case 'and3':
        case 'and4':
          platform = `Linux; ${os.uaPlatform}; ${device.build}`;
        default:
          break;
      }

      let ua: string = `Mozilla/5.0 (Linux; ${os.uaPlatform}; ${device.build}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${versions.androidChrome} Safari/537.36 EdgA/${versions.android}`;

      return {
        accept: {
          header: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
          encodingHTTP: 'gzip, deflate',
          encodingHTTPS: 'gzip, deflate, br',
        },
        useragent: ua,
      };
    },
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
      let version: string = BrowserVersions.ff.all;
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
          header: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
          encodingHTTP: 'gzip, deflate',
          encodingHTTPS: 'gzip, deflate, br',
        },
        useragent: ua,
      };
    },
    // google chrome (mobile)
    gcrm: (os): BrowserProfile => {
      let versions: any = BrowserVersions.gcr;
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
        ua = `Mozilla/5.0 (iPhone; CPU iPhone OS ${os.uaPlatform} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/${version} Mobile/${device.build} Safari/605.1`;
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
      let versions: any = BrowserVersions.gcr;
      let platform: string;
      let version: string;

      const device = devices.getDevice('tablet', os.id);

      switch (os.id) {
        case 'ios1':
        case 'ios2':
        case 'ios3':
          version = versions.ios;
          break;
        case 'and1':
        case 'and2':
        case 'and3':
        case 'and4':
          version = versions.android;
        default:
          break;
      }

      let ua: string;
      if (os.id.charAt(0) === 'i') {
        ua = `Mozilla/5.0 (iPad; CPU OS ${os.uaPlatform} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/${version} Mobile/${device.build} Safari/605.1`;
      } else {
        ua = `Mozilla/5.0 (Linux; ${os.uaPlatform}; ${device.build}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${version} Safari/537.36`;
      }

      return {
        accept: {
          header:
            os.id.charAt(0) === 'i'
              ? 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
              : 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
          encodingHTTP: 'gzip, deflate',
          encodingHTTPS: os.id.charAt(0) === 'i' ? 'br, gzip, deflate' : 'gzip, deflate, br',
        },
        useragent: ua,
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
          encodingHTTPS: 'br, gzip, deflate',
        },
        useragent: ua,
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
          encodingHTTPS: 'br, gzip, deflate',
        },
        useragent: ua,
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
          encodingHTTPS: 'br, gzip, deflate',
        },
        useragent: ua,
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
        browsers: ['edg', 'esr', 'ff', 'gcr', 'ie'],
      },
      {
        id: 'win2',
        name: 'Win 8',
        nav: {
          version: '5.0 (Windows)',
          oscpu: 'Windows NT 6.2; Win64; x64',
          platform: 'Win32',
        },
        browsers: ['edg', 'esr', 'ff', 'gcr', 'ie'],
      },
      {
        id: 'win3',
        name: 'Win 8.1',
        nav: {
          version: '5.0 (Windows)',
          oscpu: 'Windows NT 6.3; Win64; x64',
          platform: 'Win32',
        },
        browsers: ['edg', 'esr', 'ff', 'gcr', 'ie'],
      },
      {
        id: 'win4',
        name: 'Win 10',
        nav: {
          version: '5.0 (Windows)',
          oscpu: 'Windows NT 10.0; Win64; x64',
          platform: 'Win32',
        },
        browsers: ['edg', 'esr', 'ff', 'gcr', 'ie'],
      },
    ],
    macOS: [
      //  Use last 3 versions of macOS
      {
        id: 'mac1',
        name: 'macOS 10.13',
        browsers: ['edg', 'esr', 'ff', 'gcr', 'sf'],
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
        browsers: ['edg', 'esr', 'ff', 'gcr', 'sf'],
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
        browsers: ['edg', 'esr', 'ff', 'gcr', 'sf'],
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
        browsers: ['edgm', 'ff', 'gcrm', 'gcrt'],
        uaPlatform: 'Android 6.0.1',
      },
      {
        id: 'and2',
        name: 'Android 7',
        browsers: ['edgm', 'ff', 'gcrm', 'gcrt'],
        uaPlatform: 'Android 7.1.2',
      },
      {
        id: 'and3',
        name: 'Android 8',
        browsers: ['edgm', 'ff', 'gcrm', 'gcrt'],
        uaPlatform: 'Android 8.1.0',
      },
      {
        id: 'and4',
        name: 'Android 9',
        browsers: ['edgm', 'ff', 'gcrm', 'gcrt'],
        uaPlatform: 'Android 9',
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
