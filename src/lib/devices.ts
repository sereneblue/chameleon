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
        name: 'Google Pixel 5',
        build: 'Pixel 5',
        viewport: '393x851',
        deviceScaleFactor: 2.75,
        memory: 8,
        hw: 8,
      },
      {
        name: 'Moto G9 Play',
        build: 'moto g(9) play',
        viewport: '412x915',
        deviceScaleFactor: 1.75,
        memory: 4,
        hw: 8,
      },
      {
        name: 'OnePlus 8',
        build: 'IN2013',
        viewport: '412x915',
        deviceScaleFactor: 2.625,
        memory: 8,
        hw: 8,
      },
      {
        name: 'Samsung Galaxy A52',
        build: 'SM-A525F',
        viewport: '412x915',
        deviceScaleFactor: 2.625,
        memory: 4,
        hw: 8,
      },
      {
        name: 'Samsung Galaxy S21',
        build: 'SM-G991B',
        viewport: '360x800',
        deviceScaleFactor: 3,
        memory: 8,
        hw: 8,
      },
    ],
    and2: [
      {
        name: 'Google Pixel 6',
        build: 'Pixel 6',
        viewport: '412x915',
        deviceScaleFactor: 2.625,
        memory: 8,
        hw: 8,
      },
      {
        name: 'Redmi Note 12 Pro',
        build: '22101316I',
        viewport: '393x873',
        deviceScaleFactor: 2.75,
        memory: 8,
        hw: 8,
      },
      {
        name: 'Moto G71 5G',
        build: 'moto g71 5G',
        viewport: '412x915',
        deviceScaleFactor: 2.625,
        memory: 4,
        hw: 8,
      },
      {
        name: 'OnePlus 9',
        build: 'LE2113',
        viewport: '384x854',
        deviceScaleFactor: 2.8125,
        memory: 8,
        hw: 8,
      },
      {
        name: 'Samsung Galaxy S22',
        build: 'SM-S901U',
        viewport: '360x780',
        deviceScaleFactor: 3,
        memory: 8,
        hw: 8,
      },
    ],
    and3: [
      {
        name: 'Google Pixel 7',
        build: 'Pixel 7',
        viewport: '412x915',
        deviceScaleFactor: 2.625,
        memory: 8,
        hw: 8,
      },
      {
        name: 'Google Pixel 7 Pro',
        build: 'Pixel 7 Pro',
        viewport: '412x892',
        deviceScaleFactor: 2.625,
        memory: 8,
        hw: 8,
      },
      {
        name: 'Redmi Note 12 4G',
        build: '23027RAD4I',
        viewport: '393x783',
        deviceScaleFactor: 2.75,
        memory: 4,
        hw: 8,
      },
      {
        name: 'Samsung Galaxy S23',
        build: 'SM-S911B',
        viewport: '360x780',
        deviceScaleFactor: 3,
        memory: 8,
        hw: 8,
      },
      {
        name: 'OnePlus 11',
        build: 'CPH2487',
        viewport: '355x793',
        deviceScaleFactor: 3.5,
        memory: 8,
        hw: 8,
      },
    ],
    and4: [
      {
        name: 'Google Pixel 8',
        build: 'Pixel 8',
        viewport: '412x915',
        deviceScaleFactor: 2.625,
        memory: 8,
        hw: 9,
      },
      {
        name: 'Google Pixel 8 Pro',
        build: 'Pixel 8 Pro',
        viewport: '448x998',
        deviceScaleFactor: 2.25,
        memory: 8,
        hw: 9,
      },
      {
        name: 'OnePlus 11',
        build: 'CPH2487',
        viewport: '355x793',
        deviceScaleFactor: 3.5,
        memory: 8,
        hw: 8,
      },
      {
        name: 'Samsung Galaxy S23',
        build: 'SM-S911B',
        viewport: '360x780',
        deviceScaleFactor: 3,
        memory: 8,
        hw: 8,
      },
      {
        name: 'Samsung Galaxy S23 Ultra',
        build: 'SM-S918B',
        viewport: '384x824',
        deviceScaleFactor: 2.8125,
        memory: 8,
        hw: 8,
      },
    ],
    ios1: [
      {
        name: 'iPhone 6S',
        build: '19H370',
        viewport: '375x667',
        deviceScaleFactor: 2,
      },
      {
        name: 'iPhone 6S Plus',
        build: '19H370',
        viewport: '414x736',
        deviceScaleFactor: 3,
      },
      {
        name: 'iPhone SE',
        build: '19H370',
        viewport: '320x568',
        deviceScaleFactor: 2,
      },
      {
        name: 'iPhone 7',
        build: '19H370',
        viewport: '375x667',
        deviceScaleFactor: 2,
      },
      {
        name: 'iPhone 7 Plus',
        build: '19H370',
        viewport: '414x736',
        deviceScaleFactor: 3,
      },
      {
        name: 'iPhone 8',
        build: '19H370',
        viewport: '375x667',
        deviceScaleFactor: 2,
      },
      {
        name: 'iPhone 8 Plus',
        build: '19H370',
        viewport: '414x736',
        deviceScaleFactor: 3,
      },
      {
        name: 'iPhone X',
        build: '19H370',
        viewport: '375x812',
        deviceScaleFactor: 3,
      },
      {
        name: 'iPhone XS',
        build: '19H370',
        viewport: '375x812',
        deviceScaleFactor: 3,
      },
      {
        name: 'iPhone XS Max',
        build: '19H370',
        viewport: '414x896',
        deviceScaleFactor: 3,
      },
      {
        name: 'iPhone XR',
        build: '19H370',
        viewport: '414x896',
        deviceScaleFactor: 3,
      },
      {
        name: 'iPhone 11',
        build: '19H370',
        viewport: '414x896',
        deviceScaleFactor: 3,
      },
      {
        name: 'iPhone 11 Pro',
        build: '19H370',
        viewport: '375x812',
        deviceScaleFactor: 3,
      },
      {
        name: 'iPhone 11 Pro Max',
        build: '19H370',
        viewport: '414x896',
        deviceScaleFactor: 3,
      },
      {
        name: 'iPhone 12',
        build: '19H370',
        viewport: '360x780',
        deviceScaleFactor: 3,
      },
      {
        name: 'iPhone 12 Pro',
        build: '19H370',
        viewport: '390x844',
        deviceScaleFactor: 3,
      },
      {
        name: 'iPhone 12 Pro Max',
        build: '19H370',
        viewport: '428x926',
        deviceScaleFactor: 3,
      },
      {
        name: 'iPhone 13',
        build: '19H370',
        viewport: '390x844',
        deviceScaleFactor: 3,
      },
      {
        name: 'iPhone 13 Pro',
        build: '19H370',
        viewport: '390x844',
        deviceScaleFactor: 3,
      },
      {
        name: 'iPhone 13 Pro Max',
        build: '19H370',
        viewport: '428x926',
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
        device: 'iPad Air 2',
        build: '19H370',
        viewport: '768x1024',
        deviceScaleFactor: 2,
      },
      {
        device: 'iPad (2017)',
        build: '19H370',
        viewport: '768x1024',
        deviceScaleFactor: 2,
      },
      {
        device: 'iPad (2018)',
        build: '19H370',
        viewport: '768x1024',
        deviceScaleFactor: 2,
      },
      {
        device: 'iPad Mini 4',
        build: '19H370',
        viewport: '768x1024',
        deviceScaleFactor: 2,
      },
      {
        device: 'iPad Pro (9.7in)',
        build: '19H370',
        viewport: '768x1024',
        deviceScaleFactor: 2,
      },
      {
        device: 'iPad Pro (10.5in)',
        build: '19H370',
        viewport: '834x1112',
        deviceScaleFactor: 2,
      },
      {
        device: 'iPad Pro (12.9in, 1st gen)',
        build: '19H370',
        viewport: '1024x1366',
        deviceScaleFactor: 2,
      },
    ],
  },
};

devices.mobile.ios2 = (devices.mobile.ios1.map((d: Device) => {
  return { build: '20H115', name: d.name, viewport: d.viewport };
}) as any).concat([
  {
    name: 'iPhone 14',
    build: '20H115',
    viewport: '390x844',
    deviceScaleFactor: 3,
  },
  {
    name: 'iPhone 14 Pro',
    build: '20H115',
    viewport: '393x852',
    deviceScaleFactor: 3,
  },
  {
    name: 'iPhone 14 Pro Max',
    build: '20H115',
    viewport: '430x932',
    deviceScaleFactor: 3,
  },
]);

devices.mobile.ios3 = (devices.mobile.ios2.map((d: Device) => {
  return { build: '21B74', name: d.name, viewport: d.viewport };
}) as any).concat([
  {
    name: 'iPhone 15',
    build: '21B80',
    viewport: '393x852',
    deviceScaleFactor: 3,
  },
  {
    name: 'iPhone 15 Pro',
    build: '21B80',
    viewport: '393x852',
    deviceScaleFactor: 3,
  },
  {
    name: 'iPhone 15 Pro Max',
    build: '21B74',
    viewport: '430x932',
    deviceScaleFactor: 3,
  },
]);

devices.tablet.ios2 = (devices.tablet.ios1.map((d: Device) => {
  return { build: '20H115', name: d.name, viewport: d.viewport, deviceScaleFactor: d.deviceScaleFactor };
}) as any).concat([
  {
    name: 'iPad Air (2019)',
    build: '20H115',
    viewport: '834x1112',
    deviceScaleFactor: 2,
  },
  {
    name: 'iPad Mini (5th gen)',
    build: '20H115',
    viewport: '768x1024',
    deviceScaleFactor: 2,
  },
  {
    name: 'iPad Pro (12.9-inch 2nd gen)',
    build: '20H115',
    viewport: '1024x1366',
    deviceScaleFactor: 2,
  },
  {
    name: 'iPad Pro (12.9-inch 3rd gen)',
    build: '20H115',
    viewport: '1024x1366',
    deviceScaleFactor: 2,
  },
]);

devices.tablet.ios3 = devices.tablet.ios2.map((d: Device) => {
  return { build: '21B74', name: d.name, viewport: d.viewport, deviceScaleFactor: d.deviceScaleFactor };
}) as any;

let getDevice = (hardware: string, id: string): Device => {
  return devices[hardware][id][Math.floor(Math.random() * devices[hardware][id].length)];
};

export { getDevice };
