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
        memory: 4,
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
    and2: [
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
        memory: 4,
        hw: 8,
      },
      {
        name: 'OnePlus 7',
        build: 'GM1903',
        viewport: '412x892',
        deviceScaleFactor: 2.625,
        memory: 4,
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
    and3: [
      {
        name: 'Google Pixel 4',
        build: 'Pixel 4',
        viewport: '393x830',
        deviceScaleFactor: 2.75,
        memory: 4,
        hw: 8,
      },
      {
        name: 'Google Pixel 4a',
        build: 'Pixel 4a',
        viewport: '393x851',
        deviceScaleFactor: 2.75,
        memory: 4,
        hw: 8,
      },
      {
        name: 'Huawei P30',
        build: 'ELE-L29',
        viewport: '360x780',
        deviceScaleFactor: 3,
        memory: 4,
        hw: 8,
      },
      {
        name: 'OnePlus 8',
        build: 'IN2015',
        viewport: '412x915',
        deviceScaleFactor: 2.625,
        memory: 8,
        hw: 8,
      },
      {
        name: 'Samsung Galaxy S20',
        build: 'SM-G981U',
        viewport: '360x800',
        deviceScaleFactor: 4,
        memory: 8,
        hw: 8,
      },
    ],
    and4: [
      {
        name: 'Google Pixel 5',
        build: 'Pixel 5',
        viewport: '393x851',
        deviceScaleFactor: 2.75,
        memory: 8,
        hw: 8,
      },
      {
        name: 'OnePlus 8T',
        build: 'KB2005',
        viewport: '412x914',
        deviceScaleFactor: 2.625,
        memory: 8,
        hw: 8,
      },
      {
        name: 'OnePlus 9',
        build: 'LE2115',
        viewport: '412x915',
        deviceScaleFactor: 2.625,
        memory: 8,
        hw: 8,
      },
      {
        name: 'Samsung Galaxy S20',
        build: 'SM-G981U',
        viewport: '360x800',
        deviceScaleFactor: 4,
        memory: 8,
        hw: 8,
      },
      {
        name: 'Samsung Galaxy S21',
        build: 'SM-G998U',
        viewport: '360x800',
        deviceScaleFactor: 3,
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
        memory: 2,
        hw: 8,
      },
      {
        name: 'Xiaomi Mi Pad 4',
        build: 'MI PAD 4',
        viewport: '600x960',
        deviceScaleFactor: 2,
        memory: 2,
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
    and2: [
      {
        name: 'Samsung Galaxy Tab S4 10.5',
        build: 'SM-T830',
        viewport: '800x1280',
        deviceScaleFactor: 2,
        memory: 4,
        hw: 8,
      },
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
        memory: 2,
        hw: 8,
      },
      {
        name: 'Samsung Galaxy Tab A7 10.4 (2020)',
        build: 'SM-T500',
        viewport: '600x1000',
        deviceScaleFactor: 2,
        memory: 2,
        hw: 8,
      },
    ],
    and4: [
      {
        name: 'Samsung Galaxy Tab S7+',
        build: 'SM-T970',
        viewport: '876x1400',
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
        name: 'Samsung Galaxy Tab A7 10.4 (2020)',
        build: 'SM-T500',
        viewport: '600x1000',
        deviceScaleFactor: 2,
        memory: 2,
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
