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
  }
  `,
};
