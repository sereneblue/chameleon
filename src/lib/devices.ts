interface Device {
  name: string;
  build: string;
}

let devices: any = {
  mobile: {
    and1: [
      {
        name: 'HTC 10',
        build: 'HTC_M10h Build/MMB29M',
      },
      {
        name: 'Motorola Moto G4',
        build: 'Moto G (4)',
      },
      {
        name: 'OnePlus 3',
        build: 'ONEPLUS A3000',
      },
      {
        name: 'Samsung Galaxy S7',
        build: 'SM-G930U',
      },
      {
        name: 'Xiaomi Mi 5',
        build: 'MI 5',
      },
    ],
    and2: [
      {
        name: 'Google Pixel',
        build: 'Pixel',
      },
      {
        name: 'Motorola Moto G5',
        build: 'Moto G (5)',
      },
      {
        name: 'OnePlus 5',
        build: 'ONEPLUS A5000',
      },
      {
        name: 'Samsung Galaxy S8',
        build: 'SM-G950U',
      },
      {
        name: 'Xiaomi Mi 6',
        build: 'MI 6',
      },
    ],
    and3: [
      {
        name: 'Google Pixel 2',
        build: 'Pixel 2',
      },
      {
        name: 'Huawei P20',
        build: 'EML-L09',
      },
      {
        name: 'Motorola Moto G6',
        build: 'Moto G (6)',
      },
      {
        name: 'OnePlus 6',
        build: 'ONEPLUS A6003',
      },
      {
        name: 'Samsung Galaxy S9',
        build: 'SM-G960U',
      },
    ],
    and4: [
      {
        name: 'Google Pixel 3',
        build: 'Pixel 3',
      },
      {
        name: 'Huawei P30',
        build: 'ELE-L09',
      },
      {
        name: 'Motorola Moto G7',
        build: 'Moto G (7)',
      },
      {
        name: 'Lenovo Tab v7',
        build: 'Lenovo PB-6505M',
      },
      {
        name: 'Samsung Galaxy Tab S6',
        build: 'SM-T860',
      },
    ],
    ios1: [
      {
        name: 'iPhone 5S',
        build: '15G77',
      },
      {
        name: 'iPhone 6',
        build: '15G77',
      },
      {
        name: 'iPhone 6 Plus',
        build: '15G77',
      },
      {
        name: 'iPhone 6S',
        build: '15G77',
      },
      {
        name: 'iPhone 6S Plus',
        build: '15G77',
      },
      {
        name: 'iPhone SE',
        build: '15G77',
      },
      {
        name: 'iPhone 7',
        build: '15G77',
      },
      {
        name: 'iPhone 7 Plus',
        build: '15G77',
      },
      {
        name: 'iPhone 8',
        build: '15G77',
      },
      {
        name: 'iPhone 8 Plus',
        build: '15G77',
      },
      {
        name: 'iPhone X',
        build: '15G77',
      },
    ],
  },
  tablet: {
    and1: [
      {
        name: 'Google Pixel C',
        build: 'Pixel C',
      },
      {
        name: 'Nexus 9',
        build: 'Nexus 9',
      },
      {
        name: 'Samsung Galaxy Tab S2 8.0',
        build: 'SM-T710',
      },
      {
        name: 'Samsung Galaxy Tab S2 9.7',
        build: 'SM-T810',
      },
      {
        name: 'Samsung Galaxy Tab A 10.1',
        build: 'SM-T580',
      },
    ],
    and2: [
      {
        name: 'Huawei MediaPad T3 10',
        build: 'AGS-W09',
      },
      {
        name: 'Lenovo Tab 4 8',
        build: 'Lenovo TB-8504F',
      },
      {
        name: 'Lenovo Tab 7 Essential',
        build: 'Lenovo TB-7304F',
      },
      {
        name: 'Samsung Galaxy Tab S3 9.7',
        build: 'SM-T820',
      },
      {
        name: 'Samsung Galaxy Tab A 8.0',
        build: 'SM-T380',
      },
    ],
    and3: [
      {
        name: 'Samsung Galaxy Tab S4 10.5',
        build: 'SM-T830',
      },
      {
        name: 'Samsung Galaxy Tab A 10.5',
        build: 'SM-T590',
      },
      {
        name: 'Xiaomi Mi Pad 4',
        build: 'MI PAD 4',
      },
      {
        name: 'Xiaomi Mi Pad 4 Plus',
        build: 'MI PAD 4 PLUS',
      },
    ],
    and4: [
      {
        name: 'Google Pixel 3',
        build: 'Pixel 3',
      },
      {
        name: 'Huawei P30',
        build: 'ELE-L09',
      },
      {
        name: 'Motorola Moto G7',
        build: 'Moto G (7)',
      },
      {
        name: 'OnePlus 7',
        build: 'GM1903',
      },
      {
        name: 'Samsung Galaxy S10',
        build: 'SM-G973U',
      },
    ],
    ios1: [
      {
        device: 'iPad Air',
        build: '15G77',
      },
      {
        device: 'iPad Air 2',
        build: '15G77',
      },
      {
        device: 'iPad (2017)',
        build: '15G77',
      },
      {
        device: 'iPad (2018)',
        build: '15G77',
      },
      {
        device: 'iPad Mini 2',
        build: '15G77',
      },
      {
        device: 'iPad Mini 3',
        build: '15G77',
      },
      {
        device: 'iPad Mini 4',
        build: '15G77',
      },
      {
        device: 'iPad Pro (9.7in)',
        build: '15G77',
      },
      {
        device: 'iPad Pro (10.5in)',
        build: '15G77',
      },
      {
        device: 'iPad Pro (12.9in, 1st gen)',
        build: '15G77',
      },
    ],
  },
};

devices.mobile.ios2 = (devices.mobile.ios1.map((d: Device) => {
  return { build: '16G130', name: d.name };
}) as any).concat([
  {
    name: 'iPhone XS',
    build: '16G130',
  },
  {
    name: 'iPhone XS Max',
    build: '16G130',
  },
  {
    name: 'iPhone XR',
    build: '16G130',
  },
]);

devices.mobile.ios3 = (devices.mobile.ios2.map((d: Device) => {
  return { build: '17B102', name: d.name };
}) as any).concat([
  {
    name: 'iPhone 11',
    build: '17B102',
  },
  {
    name: 'iPhone 11 Pro',
    build: '17B102',
  },
  {
    name: 'iPhone 11 Pro Max',
    build: '17B102',
  },
]);

devices.tablet.ios2 = (devices.tablet.ios1.map((d: Device) => {
  return { build: '16G130', name: d.name };
}) as any).concat([
  {
    name: 'iPad Air (2019)',
    build: '16G102',
  },
  {
    name: 'iPad Mini (5th gen)',
    build: '16G102',
  },
  {
    name: 'iPad Pro (12.9-inch 2nd gen)',
    build: '16G102',
  },
  {
    name: 'iPad Pro (12.9-inch 3rg gen)',
    build: '16G102',
  },
]);

devices.tablet.ios3 = devices.tablet.ios2.map((d: Device) => {
  return { build: '17B102', name: d.name };
}) as any;

let getDevice = (hardware: string, id: string): Device => {
  let len: number = devices[hardware][id].length;
  return devices[hardware][id][Math.floor(Math.random() * len)];
};

export { getDevice };
