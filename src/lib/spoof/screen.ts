export default {
  type: 'custom',
  data: `
  let screenData = CHAMELEON_SPOOF.get(window).screen;

  if (screenData.usingProfileRes === false) {
    screenData.availHeight = screenData.height - (screen.height - screen.availHeight);
  }

  ['top', 'left', 'availTop', 'availLeft'].forEach((k) => {
    Object.defineProperty(window.screen, k, {
      value: 0
    });
  });

  ['colorDepth', 'pixelDepth'].forEach((k) => {
    Object.defineProperty(window.screen, k, {
      value: 24
    });
  });

  ['availWidth', 'width'].forEach((k) => {
    Object.defineProperty(window.screen, k, {
      value: screenData.width
    });
  });

  ['innerWidth', 'outerWidth'].forEach((k) => {
    Object.defineProperty(window, k, {
      value: screenData.width
    });
  });

  ['innerHeight', 'outerHeight'].forEach((k) => {
    Object.defineProperty(window, k, {
      value: screenData.height
    });
  });

  Object.defineProperty(window.screen, 'availHeight', {
    value: screenData.availHeight
  });

  Object.defineProperty(window.screen, 'height', {
    value: screenData.height
  });
  `,
};
