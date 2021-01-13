export default {
  type: 'custom',
  data: `
  if (spoofContext.navigator.mediaDevices) {
    Object.defineProperty(spoofContext.navigator.mediaDevices, 'enumerateDevices', {
      configurable: true,
      value: async () => {
        return Promise.resolve([]);
      }
    });

    modifiedAPIs.push([
      spoofContext.navigator.mediaDevices.enumerateDevices, "enumerateDevices"
    ]);

    Object.defineProperty(spoofContext.navigator.mediaDevices, 'getUserMedia', {
      configurable: true,
      value: async () => {
        return Promise.resolve([]);
      }
    });

    modifiedAPIs.push([
      spoofContext.navigator.mediaDevices.getUserMedia, "getUserMedia"
    ]);
  }
  `,
};
