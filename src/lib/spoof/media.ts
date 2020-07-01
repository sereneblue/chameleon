export default {
  type: 'custom',
  data: `
  if (navigator.mediaDevices) {
    Object.defineProperty(navigator.mediaDevices, 'enumerateDevices', {
      configurable: true,
      value: async () => {
        return [];
      }
    });

    modifiedAPIs.push([
      navigator.mediaDevices.enumerateDevices, "enumerateDevices"
    ]);

    Object.defineProperty(navigator.mediaDevices, 'getUserMedia', {
      configurable: true,
      value: async () => {
        return [];
      }
    });

    modifiedAPIs.push([
      navigator.mediaDevices.getUserMedia, "getUserMedia"
    ]);
  }
  `,
};
