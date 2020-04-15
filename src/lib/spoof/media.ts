export default {
  type: 'custom',
  data: `
  Object.defineProperty(navigator.mediaDevices, 'enumerateDevices', {
    configurable: true,
    value: async () => {
      return [];
    }
  });
  `,
};
