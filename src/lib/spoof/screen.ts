export default {
  type: 'custom',
  data: `
  let screenData = CHAMELEON_SPOOF.get(spoofContext).screen;

  if (screenData.usingProfileRes === false) {
    screenData.availHeight = screenData.height - (spoofContext.screen.height - spoofContext.screen.availHeight);
  }

  ['top', 'left', 'availTop', 'availLeft'].forEach((k) => {
    Object.defineProperty(spoofContext.screen, k, {
      value: 0
    });
  });

  ['colorDepth', 'pixelDepth'].forEach((k) => {
    Object.defineProperty(spoofContext.screen, k, {
      value: 24
    });
  });

  ['availWidth', 'width'].forEach((k) => {
    Object.defineProperty(spoofContext.screen, k, {
      value: screenData.width
    });
  });

  ['innerWidth', 'outerWidth'].forEach((k) => {
    Object.defineProperty(spoofContext, k, {
      value: screenData.width
    });
  });

  ['innerHeight', 'outerHeight'].forEach((k) => {
    Object.defineProperty(spoofContext, k, {
      value: screenData.height
    });
  });

  Object.defineProperty(spoofContext.screen, 'availHeight', {
    value: screenData.availHeight
  });

  Object.defineProperty(spoofContext.screen, 'height', {
    value: screenData.height
  });

  Object.defineProperty(spoofContext, 'devicePixelRatio', {
    value: screenData.deviceScaleFactor || 1
  });
  `,
};
