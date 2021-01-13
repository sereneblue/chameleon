interface Device {
  name: string;
  build: string;
  viewport: string;
  deviceScaleFactor: number;
  memory?: number;
  hw?: number;
}

let devices: any = {
  mobile: {
    and1: [
      {
        name: 'Motorola Moto G4',
        build: 'Moto G (4)',
        viewport: '360x640',
        deviceScaleFactor: 3,
        memory: 2,
        hw: 4,
      },
      {
        name: 'OnePlus 3',
        build: 'ONEPLUS A3000',
        viewport: '412x732',
        deviceScaleFactor: 2.625,
        memory: 6,
        hw: 8,
      },
      {
        name: 'Huawei Nexus 6P',
        build: 'Nexus 6P',
        viewport: '411x731',
        deviceScaleFactor: 3.5,
        memory: 3,
        hw: 8,
      },
      {
        name: 'Samsung Galaxy S7',
        build: 'SM-G930U',
        viewport: '360x640',
        deviceScaleFactor: 4,
        memory: 4,
        hw: 8,
      },
      {
        name: 'Xiaomi Mi 5',
        build: 'MI 5',
        viewport: '360x640',
        deviceScaleFactor: 3,
        memory: 3,
        hw: 8,
      },
    ],
    and2: [
      {
        name: 'Google Pixel',
        build: 'Pixel',
        viewport: '411x731',
        deviceScaleFactor: 2.6,
        memory: 4,
        hw: 8,
      },
      {
        name: 'Motorola Moto G5',
        build: 'Moto G (5)',
        viewport: '360x640',
        deviceScaleFactor: 3,
        memory: 2,
        hw: 4,
      },
      {
        name: 'OnePlus 5',
        build: 'ONEPLUS A5000',
        viewport: '455x809',
        deviceScaleFactor: 2.375,
        memory: 6,
        hw: 8,
      },
      {
        name: 'Samsung Galaxy S8',
        build: 'SM-G950U',
        viewport: '360x740',
        deviceScaleFactor: 4,
        memory: 4,
        hw: 8,
      },
      {
        name: 'Xiaomi Mi 6',
        build: 'MI 6',
        viewport: '360x640',
        deviceScaleFactor: 3,
        memory: 4,
        hw: 8,
      },
    ],
    and3: [
      {
        name: 'Google Pixel 2',
        build: 'Pixel 2',
        viewport: '411x731',
        deviceScaleFactor: 2.625,
        memory: 4,
        hw: 8,
      },
      {
        name: 'Huawei P20',
        build: 'EML-L09',
        viewport: '360x748',
        deviceScaleFactor: 3,
        memory: 4,
        hw: 8,
      },
      {
        name: 'Motorola Moto G6',
        build: 'Moto G (6)',
        viewport: '424x848',
        deviceScaleFactor: 3,
        memory: 3,
        hw: 8,
      },
      {
        name: 'OnePlus 6',
        build: 'ONEPLUS A6003',
        viewport: '412x869',
        deviceScaleFactor: 2.625,
        memory: 6,
        hw: 8,
      },
      {
        name: 'Samsung Galaxy S9',
        build: 'SM-G960U',
        viewport: '360x740',
        deviceScaleFactor: 4,
        memory: 4,
        hw: 8,
      },
    ],
    and4: [
      {
        name: 'Google Pixel 3',
        build: 'Pixel 3',
        viewport: '411x823',
        deviceScaleFactor: 2.625,
        memory: 4,
        hw: 8,
      },
      {
        name: 'Google Pixel 3a',
        build: 'Pixel 3a',
        viewport: '411x846',
        deviceScaleFactor: 2.625,
        memory: 4,
        hw: 8,
      },
      {
        name: 'Huawei Mate 20 Pro',
        build: 'LYA-L09',
        viewport: '360x780',
        deviceScaleFactor: 4,
        memory: 6,
        hw: 8,
      },
      {
        name: 'OnePlus 7',
        build: 'GM1903',
        viewport: '412x892',
        deviceScaleFactor: 2.625,
        memory: 6,
        hw: 8,
      },
      {
        name: 'Samsung Galaxy S10',
        build: 'SM-G973U',
        viewport: '360x740',
        deviceScaleFactor: 4,
        memory: 8,
        hw: 8,
      },
    ],
    ios1: [
      {
        name: 'iPhone 6S',
        build: '16G102',
        viewport: '375x667',
        deviceScaleFactor: 2,
      },
      {
        name: 'iPhone 6S Plus',
        build: '16G102',
        viewport: '414x736',
        deviceScaleFactor: 3,
      },
      {
        name: 'iPhone SE',
        build: '16G102',
        viewport: '320x568',
        deviceScaleFactor: 2,
      },
      {
        name: 'iPhone 7',
        build: '16G102',
        viewport: '375x667',
        deviceScaleFactor: 2,
      },
      {
        name: 'iPhone 7 Plus',
        build: '16G102',
        viewport: '414x736',
        deviceScaleFactor: 3,
      },
      {
        name: 'iPhone 8',
        build: '16G102',
        viewport: '375x667',
        deviceScaleFactor: 2,
      },
      {
        name: 'iPhone 8 Plus',
        build: '16G102',
        viewport: '414x736',
        deviceScaleFactor: 3,
      },
      {
        name: 'iPhone X',
        build: '16G102',
        viewport: '375x812',
        deviceScaleFactor: 3,
      },
      {
        name: 'iPhone XS',
        build: '16G102',
        viewport: '375x812',
        deviceScaleFactor: 3,
      },
      {
        name: 'iPhone XS Max',
        build: '16G102',
        viewport: '414x896',
        deviceScaleFactor: 3,
      },
      {
        name: 'iPhone XR',
        build: '16G102',
        viewport: '414x896',
        deviceScaleFactor: 3,
      },
    ],
  },
  tablet: {
    and1: [
      {
        name: 'Google Pixel C',
        build: 'Pixel C',
        viewport: '900x1280',
        deviceScaleFactor: 2,
        memory: 3,
        hw: 8,
      },
      {
        name: 'Nexus 9',
        build: 'Nexus 9',
        viewport: '768x1024',
        deviceScaleFactor: 2,
        memory: 2,
        hw: 8,
      },
      {
        name: 'Samsung Galaxy Tab S2 8.0',
        build: 'SM-T710',
        viewport: '768x1024',
        deviceScaleFactor: 2,
        memory: 3,
        hw: 8,
      },
      {
        name: 'Samsung Galaxy Tab S2 9.7',
        build: 'SM-T810',
        viewport: '768x1024',
        deviceScaleFactor: 2,
        memory: 3,
        hw: 8,
      },
      {
        name: 'Samsung Galaxy Tab A 10.1',
        build: 'SM-T580',
        viewport: '800x1280',
        deviceScaleFactor: 1.5,
        memory: 2,
        hw: 8,
      },
    ],
    and2: [
      {
        name: 'Huawei MediaPad T3 10',
        build: 'AGS-W09',
        deviceScaleFactor: 1,
        viewport: '800x1280',
        memory: 2,
        hw: 8,
      },
      {
        name: 'Lenovo Tab 4 8',
        build: 'Lenovo TB-8504F',
        viewport: '800x1280',
        deviceScaleFactor: 1,
        memory: 2,
        hw: 8,
      },
      {
        name: 'Lenovo Tab 7 Essential',
        build: 'Lenovo TB-7304F',
        viewport: '600x1024',
        deviceScaleFactor: 1,
        memory: 1,
        hw: 4,
      },
      {
        name: 'Samsung Galaxy Tab S3 9.7',
        build: 'SM-T820',
        viewport: '768x1024',
        deviceScaleFactor: 2,
        memory: 4,
        hw: 8,
      },
      {
        name: 'Samsung Galaxy Tab A 8.0',
        build: 'SM-T380',
        viewport: '800x1280',
        deviceScaleFactor: 1,
        memory: 2,
        hw: 8,
      },
    ],
    and3: [
      {
        name: 'Samsung Galaxy Tab S4 10.5',
        build: 'SM-T830',
        viewport: '800x1280',
        deviceScaleFactor: 2,
        memory: 4,
        hw: 8,
      },
      {
        name: 'Samsung Galaxy Tab A 10.5',
        build: 'SM-T590',
        viewport: '600x960',
        deviceScaleFactor: 2,
        memory: 3,
        hw: 8,
      },
      {
        name: 'Xiaomi Mi Pad 4',
        build: 'MI PAD 4',
        viewport: '600x960',
        deviceScaleFactor: 2,
        memory: 3,
        hw: 8,
      },
      {
        name: 'Xiaomi Mi Pad 4 Plus',
        build: 'MI PAD 4 PLUS',
        viewport: '600x960',
        deviceScaleFactor: 2,
        memory: 4,
        hw: 8,
      },
    ],
    and4: [
      {
        name: 'ASUS ZenPad 3S 10',
        build: 'P027',
        viewport: '748x1024',
        deviceScaleFactor: 2,
        memory: 4,
        hw: 8,
      },
      {
        name: 'Samsung Galaxy Tab S5e',
        build: 'SM-T720',
        viewport: '800x1280',
        deviceScaleFactor: 2,
        memory: 4,
        hw: 8,
      },
      {
        name: 'Samsung Galaxy Tab A 10.1 (2019)',
        build: 'SM-T510',
        viewport: '600x960',
        deviceScaleFactor: 1.5,
        memory: 3,
        hw: 8,
      },
    ],
    ios1: [
      {
        device: 'iPad Air',
        build: '16G102',
        viewport: '768x1024',
        deviceScaleFactor: 2,
      },
      {
        device: 'iPad Air 2',
        build: '16G102',
        viewport: '768x1024',
        deviceScaleFactor: 2,
      },
      {
        device: 'iPad (2017)',
        build: '16G102',
        viewport: '768x1024',
        deviceScaleFactor: 2,
      },
      {
        device: 'iPad (2018)',
        build: '16G102',
        viewport: '768x1024',
        deviceScaleFactor: 2,
      },
      {
        device: 'iPad Mini 2',
        build: '16G102',
        viewport: '768x1024',
        deviceScaleFactor: 2,
      },
      {
        device: 'iPad Mini 3',
        build: '16G102',
        viewport: '768x1024',
        deviceScaleFactor: 2,
      },
      {
        device: 'iPad Mini 4',
        build: '16G102',
        viewport: '768x1024',
        deviceScaleFactor: 2,
      },
      {
        device: 'iPad Pro (9.7in)',
        build: '16G102',
        viewport: '768x1024',
        deviceScaleFactor: 2,
      },
      {
        device: 'iPad Pro (10.5in)',
        build: '16G102',
        viewport: '834x1112',
        deviceScaleFactor: 2,
      },
      {
        device: 'iPad Pro (12.9in, 1st gen)',
        build: '16G102',
        viewport: '1024x1366',
        deviceScaleFactor: 2,
      },
    ],
  },
};

devices.mobile.ios2 = (devices.mobile.ios1.map((d: Device) => {
  return { build: '17H35', name: d.name, viewport: d.viewport };
}) as any).concat([
  {
    name: 'iPhone 11',
    build: '17H35',
    viewport: '414x896',
    deviceScaleFactor: 3,
  },
  {
    name: 'iPhone 11 Pro',
    build: '17H35',
    viewport: '375x812',
    deviceScaleFactor: 3,
  },
  {
    name: 'iPhone 11 Pro Max',
    build: '17H35',
    viewport: '414x896',
    deviceScaleFactor: 3,
  },
]);

devices.mobile.ios3 = (devices.mobile.ios2.map((d: Device) => {
  return { build: '18C66', name: d.name, viewport: d.viewport };
}) as any).concat([
  {
    name: 'iPhone 12',
    build: '18C66',
    viewport: '360x780',
    deviceScaleFactor: 3,
  },
  {
    name: 'iPhone 12 Pro',
    build: '18C66',
    viewport: '390x844',
    deviceScaleFactor: 3,
  },
  {
    name: 'iPhone 12 Pro Max',
    build: '18C66',
    viewport: '428x926',
    deviceScaleFactor: 3,
  },
]);

devices.tablet.ios2 = (devices.tablet.ios1.map((d: Device) => {
  return { build: '17H35', name: d.name, viewport: d.viewport, deviceScaleFactor: d.deviceScaleFactor };
}) as any).concat([
  {
    name: 'iPad Air (2019)',
    build: '17H35',
    viewport: '834x1112',
    deviceScaleFactor: 2,
  },
  {
    name: 'iPad Mini (5th gen)',
    build: '17H35',
    viewport: '768x1024',
    deviceScaleFactor: 2,
  },
  {
    name: 'iPad Pro (12.9-inch 2nd gen)',
    build: '17H35',
    viewport: '1024x1366',
    deviceScaleFactor: 2,
  },
  {
    name: 'iPad Pro (12.9-inch 3rg gen)',
    build: '17H35',
    viewport: '1024x1366',
    deviceScaleFactor: 2,
  },
]);

devices.tablet.ios3 = devices.tablet.ios2.map((d: Device) => {
  return { build: '18C66', name: d.name, viewport: d.viewport, deviceScaleFactor: d.deviceScaleFactor };
}) as any;

let getDevice = (hardware: string, id: string): Device => {
  return devices[hardware][id][Math.floor(Math.random() * devices[hardware][id].length)];
};

export { getDevice };
