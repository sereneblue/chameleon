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

let getDevice = (hardware: string, id: string): Device => {
  let len: number = devices[hardware][id].length;
  return devices[hardware][id][Math.floor(Math.random() * len)];
};

export { getDevice };
