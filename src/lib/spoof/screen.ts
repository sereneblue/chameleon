export default {
  type: 'custom',
  data: `
  let screenData = CHAMELEON_SPOOF.get(spoofContext).screen;

  if (screenData.width != null) {
    if (screenData.usingProfileRes === false) {
      screenData.availHeight = screenData.height - (spoofContext.screen.height - spoofContext.screen.availHeight);
    }

    ['top', 'left', 'availTop', 'availLeft'].forEach((k) => {
      Object.defineProperty(spoofContext.Screen.prototype, k, {
        get: (() => 0).bind(null)
      });
    });

    ['colorDepth', 'pixelDepth'].forEach((k) => {
      Object.defineProperty(spoofContext.Screen.prototype, k, {
        get: (() => screenData.pixelDepth ).bind(null)
      });
    });

    ['availWidth', 'width'].forEach((k) => {
      Object.defineProperty(spoofContext.Screen.prototype, k, {
        get: (() => screenData.width).bind(null)
      });
    });

    ['innerWidth', 'outerWidth'].forEach((k) => {
      Object.defineProperty(spoofContext, k, {
        get: (() => screenData.width).bind(null)
      });
    });

    ['innerHeight'].forEach((k) => {
      Object.defineProperty(spoofContext, k, {
        get: (() => screenData.availHeight).bind(null)
      });
    });

    ['outerHeight'].forEach((k) => {
      Object.defineProperty(spoofContext, k, {
        get: (() => screenData.height).bind(null)
      });
    });

    Object.defineProperty(spoofContext.Screen.prototype, 'availHeight', {
      get: (() => screenData.availHeight).bind(null)
    });

    Object.defineProperty(spoofContext.Screen.prototype, 'height', {
      get: (() => screenData.height).bind(null)
    });

    Object.defineProperty(spoofContext, 'devicePixelRatio', {
      get: (() => screenData.deviceScaleFactor || 1).bind(null)
    });
  }
  `,
};
