export interface BrowserProfile {
  accept: string;
  acceptEncoding: string;
  navigator: {
    appVersion: string;
    buildID: string;
    hardwareConcurrency: string;
    oscpu: string;
    platform: string;
    productSub: string;
    vendor: string;
    ua: string;
  };
  screen: {
    width: string;
    height: string;
    offset: string;
  };
  useragent: string;
}

export interface ProfileListItem {
  id: string;
  name: string;
}

export class Generator {
  private browserData = {
    cr: (isDesktop, nameOnly, os): string | BrowserProfile => {
      let version = '77.0.3865.120';

      if (nameOnly) {
        return `${os.name} - Chromium ${version.split('.')[0]}`;
      }
    },
    esr: (isDesktop, nameOnly, os): string | BrowserProfile => {
      let version = '68';

      if (nameOnly) {
        return `${os.name} - Firefox ${version} ESR`;
      }
    },
    ff: (isDesktop, nameOnly, os): string | BrowserProfile => {
      let version = '70';

      if (nameOnly) {
        return `${os.name} - Firefox ${version}`;
      }
    },
    gcr: (isDesktop, nameOnly, os): string | BrowserProfile => {
      let versions = { desktop: '77.0.3865.120', ios: '77.0.3865.103', android: '77.0.3865.116' };

      let version = isDesktop ? versions.desktop : os.id.charAt(0) === 'i' ? versions.ios : versions.android;

      if (nameOnly) {
        return `${os.name} - Google Chrome ${version.split('.')[0]}`;
      }
    },
    ie: (isDesktop, nameOnly, os): string | BrowserProfile => {
      let version = '11';

      if (nameOnly) {
        return `${os.name} - Internet Explorer ${version}`;
      }
    },
    sf: (isDesktop, nameOnly, os): string | BrowserProfile => {
      let version = '13';

      if (nameOnly) {
        return `${os.name} - Safari ${version}`;
      }
    },
    sm: (isDesktop, nameOnly, os): string | BrowserProfile => {
      let version = '10.1';

      if (nameOnly) {
        return `${os.name} - Samsung Internet ${version}`;
      }
    },
  };

  private profiles = {
    windows: [
      {
        id: 'win1',
        name: 'Win 7',
        browsers: ['ff', 'esr', 'gcr', 'ie'],
      },
      {
        id: 'win2',
        name: 'Win 8',
        browsers: ['ff', 'esr', 'gcr', 'ie'],
      },
      {
        id: 'win3',
        name: 'Win 8.1',
        browsers: ['ff', 'esr', 'gcr', 'ie'],
      },
      {
        id: 'win4',
        name: 'Win 10',
        browsers: ['ff', 'esr', 'gcr', 'ie'],
      },
    ],
    macOS: [
      //  Use last 3 version of macOS
      {
        id: 'mac1',
        name: 'macOS 10.13',
        browsers: ['ff', 'esr', 'gcr', 'sf'],
      },
      {
        id: 'mac2',
        name: 'macOS 10.14',
        browsers: ['ff', 'esr', 'gcr', 'sf'],
      },
      {
        id: 'mac3',
        name: 'macOS 10.15',
        browsers: ['ff', 'esr', 'gcr', 'sf'],
      },
    ],
    linux: [
      {
        id: 'lin1',
        name: 'Linux',
        browsers: ['cr', 'ff', 'esr', 'gcr'],
      },
      {
        id: 'lin2',
        name: 'Fedora',
        browsers: ['cr', 'ff', 'esr', 'gcr'],
      },
      {
        id: 'lin3',
        name: 'Ubuntu',
        browsers: ['cr', 'ff', 'esr', 'gcr'],
      },
    ],
    iOS: [
      {
        id: 'ios1',
        name: 'iOS 11',
        browsers: ['gcr', 'sf'],
      },
      {
        id: 'ios2',
        name: 'iOS 12',
        browsers: ['gcr', 'sf'],
      },
      {
        id: 'ios3',
        name: 'iOS 13',
        browsers: ['gcr', 'sf'],
      },
    ],
    android: [
      {
        id: 'and1',
        name: 'Android 6',
        browsers: ['ff', 'gcr', 'sm'],
      },
      {
        id: 'and2',
        name: 'Android 7',
        browsers: ['ff', 'gcr', 'sm'],
      },
      {
        id: 'and3',
        name: 'Android 8',
        browsers: ['ff', 'gcr', 'sm'],
      },
      {
        id: 'and4',
        name: 'Android 9',
        browsers: ['ff', 'gcr', 'sm'],
      },
    ],
  };

  private generateProfiles(key: string): any {
    let profiles = [];
    let isDesktop = ['windows', 'macOS', 'linux'].includes(key);

    let target = this.profiles[key];
    for (let i = 0; i < target.length; i++) {
      for (let j = 0; j < target[i].browsers.length; j++) {
        profiles.push({
          id: `${target[i].id}-${target[i].browsers[j]}`,
          name: this.browserData[target[i].browsers[j]](isDesktop, true, target[i]),
        });
      }
    }

    return profiles;
  }

  public getAllProfiles(): any {
    let profiles = {};

    let osFamilies = Object.keys(this.profiles);
    osFamilies.map(k => {
      profiles[k] = this.generateProfiles(k);
    });

    return profiles;
  }
}
