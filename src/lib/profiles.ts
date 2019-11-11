export interface BrowserProfile {
  accept: {
    header: string;
    encodingHTTP: string;
    encodingHTTPS: string;
  };
  display: string;
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

export class Generator {
  private browsers = {
    // firefox esr
    esr: (os): BrowserProfile => {
      let version: string = '68';
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
          platform = 'X11; Linux x86_64';
          break;
        case 'lin2':
          platform = 'X11; Fedora; Linux x86_64';
          break;
        case 'lin3':
          platform = 'X11; Ubuntu; Linux x86_64';
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
        display: `${os.name} - Firefox ${version} ESR`,
        useragent: ua,
      };
    },
    // firefox
    ff: (os): BrowserProfile => {
      let version: string = '70';
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
          platform = 'X11; Linux x86_64';
          break;
        case 'lin2':
          platform = 'X11; Fedora; Linux x86_64';
          break;
        case 'lin3':
          platform = 'X11; Ubuntu; Linux x86_64';
          break;
        case 'and1':
        case 'and2':
        case 'and3':
        case 'and4':
          // Firefox for Android has two distinct UAs for phones and tablets
          device = Math.random() > 0.5 ? 'Mobile' : 'Tablet';
          platform = `${os.name}; ${device}`;
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
        display: `${os.name} - Firefox ${version}`,
        useragent: ua,
      };
    },
    // google chrome
    gcr: (os): BrowserProfile => {
      let version: string = '78.0.3904.97';
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
        case 'lin1':
        case 'lin3':
          platform = 'X11; Linux x86_64';
          break;
        case 'lin2':
          platform = 'X11; Fedora; Linux x86_64';
          break;
      }

      let ua: string = `Mozilla/5.0 (${platform}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${version} Safari/537.36`;

      return {
        accept: {
          header: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
          encodingHTTP: 'gzip, deflate',
          encodingHTTPS: 'gzip, deflate, br',
        },
        display: `${os.name} - Google Chrome ${version.split('.')[0]}`,
        useragent: ua,
      };
    },
    // google chrome (mobile)
    gcrm: (os): BrowserProfile => {
      let versions: any = { ios: '78.0.3904.84', android: '78.0.3904.96' };
      let platform: string;
      let version: string;

      switch (os.id) {
        case 'ios1':
        case 'ios2':
        case 'ios3':
          platform = '';
          version = versions.ios;
          break;
        case 'and1':
        case 'and2':
        case 'and3':
        case 'and4':
          platform = ``;
          version = versions.android;
        default:
          break;
      }

      return {
        accept: {
          header: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
          encodingHTTP: 'gzip, deflate',
          encodingHTTPS: 'gzip, deflate, br',
        },
        display: `${os.name} - Google Chrome ${version.split('.')[0]} (Phone)`,
        useragent: '',
      };
    },
    // google chrome (tablet)
    gcrt: (os): BrowserProfile => {
      let versions: any = { ios: '78.0.3904.84', android: '78.0.3904.96' };
      let platform: string;
      let version: string;

      switch (os.id) {
        case 'ios1':
        case 'ios2':
        case 'ios3':
          platform = '';
          version = versions.ios;
          break;
        case 'and1':
        case 'and2':
        case 'and3':
        case 'and4':
          platform = '';
          version = versions.android;
        default:
          break;
      }

      return {
        accept: {
          header: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
          encodingHTTP: 'gzip, deflate',
          encodingHTTPS: 'gzip, deflate, br',
        },
        display: `${os.name} - Google Chrome ${version.split('.')[0]} (Tablet)`,
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
        display: `${os.name} - Internet Explorer 11`,
        useragent: `Mozilla/5.0 (${os.nav.oscpu.split(';')[0]}; WOW64; Trident/7.0; rv:11.0) like Gecko`,
      };
    },
    // safari
    sf: (os): BrowserProfile => {
      let version: string = '13.0.2';

      let ua = `Mozilla/5.0 (${os.uaPlatform}) AppleWebKit/602.3.12 (KHTML, like Gecko) Version/${version} Safari/602.3.12`;

      return {
        accept: {
          header: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          encodingHTTP: 'gzip',
          encodingHTTPS: 'gzip, deflate',
        },
        display: `${os.name} - Safari ${version.split('.')[0]}`,
        useragent: ua,
      };
    },
    // safari (mobile)
    sfm: (os): BrowserProfile => {
      let version: string = '13';

      return {
        accept: {
          header: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          encodingHTTP: 'gzip',
          encodingHTTPS: 'gzip, deflate',
        },
        display: `${os.name} - Safari ${version.split('.')[0]} (iPhone)`,
        useragent: '',
      };
    },
    // safari (tablet)
    sft: (os): BrowserProfile => {
      let version: string = '13';

      return {
        accept: {
          header: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          encodingHTTP: 'gzip',
          encodingHTTPS: 'gzip, deflate',
        },
        display: `${os.name} - Safari ${version.split('.')[0]} (iPad)`,
        useragent: '',
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
      },
    ],
    iOS: [
      {
        id: 'ios1',
        name: 'iOS 11',
        browsers: ['gcrm', 'gcrt', 'sfm', 'sft'],
      },
      {
        id: 'ios2',
        name: 'iOS 12',
        browsers: ['gcrm', 'gcrt', 'sfm', 'sft'],
      },
      {
        id: 'ios3',
        name: 'iOS 13',
        browsers: ['gcrm', 'gcrt', 'sfm', 'sft'],
      },
    ],
    android: [
      {
        id: 'and1',
        name: 'Android 6',
        browsers: ['ff', 'gcrm', 'gcrt'],
      },
      {
        id: 'and2',
        name: 'Android 7',
        browsers: ['ff', 'gcrm', 'gcrt'],
      },
      {
        id: 'and3',
        name: 'Android 8',
        browsers: ['ff', 'gcrm', 'gcrt'],
      },
      {
        id: 'and4',
        name: 'Android 9',
        browsers: ['ff', 'gcrm', 'gcrt'],
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
          name: this.getProfile(id).display,
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
