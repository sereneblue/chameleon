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

    window.Intl.PluralRules = function PluralRules() {
      let args = [...arguments];

      if (arguments.length == 0 || !arguments[0]) {
        args[0] = navigator.language || "en-US";
      }

      return new (Function.prototype.bind.apply(ORIGINAL_INTL_PR, [null, ...args]));
    };

    modifiedAPIs.push([
      window.Intl.PluralRules, "PluralRules"
    ]);

    if (window.Intl.ListFormat) {
      var ORIGINAL_INTL_LF = window.Intl.ListFormat;

      window.Intl.ListFormat = function ListFormat() {
        let args = [...arguments];

        if (arguments.length == 0 || !arguments[0]) {
          args[0] = navigator.language || "en-US";
        }

        return new (Function.prototype.bind.apply(ORIGINAL_INTL_LF, [null, ...args]));
      };

      modifiedAPIs.push([
        window.Intl.ListFormat, "ListFormat"
      ]);
    }

    if (window.Intl.RelativeTimeFormat) {
      var ORIGINAL_INTL_RTF = window.Intl.RelativeTimeFormat;

      window.Intl.RelativeTimeFormat = function RelativeTimeFormat() {
        let args = [...arguments];

        if (arguments.length == 0 || !arguments[0]) {
          args[0] = navigator.language || "en-US";
        }

        return new (Function.prototype.bind.apply(ORIGINAL_INTL_RTF, [null, ...args]));
      };

      modifiedAPIs.push([
        window.Intl.RelativeTimeFormat, "RelativeTimeFormat"
      ]);
    }

    if (window.Intl.NumberFormat) {
      var ORIGINAL_INTL_NF = window.Intl.NumberFormat;

      window.Intl.NumberFormat = function NumberFormat() {
        let args = [...arguments];

        if (arguments.length == 0 || !arguments[0]) {
          args[0] = navigator.language || "en-US";
        }

        return new (Function.prototype.bind.apply(ORIGINAL_INTL_NF, [null, ...args]));
      };

      modifiedAPIs.push([
        window.Intl.NumberFormat, "NumberFormat"
      ]);
    }

    if (window.Intl.Collator) {
      var ORIGINAL_INTL_C = window.Intl.Collator;

      window.Intl.Collator = function Collator() {
        let args = [...arguments];

        if (arguments.length == 0 || !arguments[0]) {
          args[0] = navigator.language || "en-US";
        }

        return new (Function.prototype.bind.apply(ORIGINAL_INTL_C, [null, ...args]));
      };

      modifiedAPIs.push([
        window.Intl.Collator, "Collator"
      ]);
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
    )
    .replace(
      /ORIGINAL_INTL_RTF/g,
      String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
        Math.random()
          .toString(36)
          .substring(Math.floor(Math.random() * 5) + 5)
    )
    .replace(
      /ORIGINAL_INTL_NF/g,
      String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
        Math.random()
          .toString(36)
          .substring(Math.floor(Math.random() * 5) + 5)
    )
    .replace(
      /ORIGINAL_INTL_C/g,
      String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
        Math.random()
          .toString(36)
          .substring(Math.floor(Math.random() * 5) + 5)
    ),
};
