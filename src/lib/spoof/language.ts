export default {
  type: 'custom',
  data: `
    var ORIGINAL_INTL_PR = window.Intl.PluralRules;

    Object.defineProperty(window.navigator, 'language', {
      configurable: true,
      value: CHAMELEON_SPOOF.get(window).language.code
    });

    Object.defineProperty(window.navigator, 'languages', {
      configurable: true,
      value: CHAMELEON_SPOOF.get(window).language.nav
    });

    window.Intl.PluralRules = function(...args) {
      if (args.length == 0) {
        args.push(navigator.language || "en-US");
      }

      return new ORIGINAL_INTL_PR(args);
    };

    if (window.Intl.ListFormat) {
      var ORIGINAL_INTL_LF = window.Intl.ListFormat;

      window.Intl.ListFormat = function(...args) {
        if (args.length == 0) {
          args.push(navigator.language || "en-US");
        } else if (!args[0]) {
          args[0] = navigator.language || "en-US";
        }

        return new (Function.prototype.bind.apply(ORIGINAL_INTL_LF, [null].concat(args)));
      };
    }
  `
    .replace(
      /ORIGINAL_INTL_PR/g,
      String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
        Math.random()
          .toString(36)
          .substring(Math.floor(Math.random() * 5) + 5)
    )
    .replace(
      /ORIGINAL_INTL_LF/g,
      String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
        Math.random()
          .toString(36)
          .substring(Math.floor(Math.random() * 5) + 5)
    ),
};
