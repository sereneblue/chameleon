<a name="v0.20.1-rc"></a>

## [v0.20.1-rc](https://github.com/sereneblue/chameleon/compare/v0.20.0-rc...v0.20.1-rc) (2020-05-02)

### Bug Fixes

- **fp panel:** remove fp panel support for mobile Firefox; [#330](https://github.com/sereneblue/chameleon/issues/330)
- **settings:** always load current firefox preferences; [#333](https://github.com/sereneblue/chameleon/issues/333)
- **settings:** preserve firefox preferences on initial import; [#334](https://github.com/sereneblue/chameleon/issues/334)
- **settings:** import legacy settings, profile issue; [#323](https://github.com/sereneblue/chameleon/issues/323)

<a name="v0.20.0-rc1"></a>

## [v0.20.0-rc1](https://github.com/sereneblue/chameleon/compare/v0.20.0-beta...v0.20.0-rc1) (2020-04-30)

### Bug Fixes

- **injection:** catch error if iframe is cross origin; [#312](https://github.com/sereneblue/chameleon/issues/312)
- **profiles:** resolve issue with custom timer; [#312](https://github.com/sereneblue/chameleon/issues/312)
- **settings:** add font fingerprint to settings validation

<a name="v0.20.0-beta"></a>

## [v0.20.0-beta](https://github.com/sereneblue/chameleon/compare/v0.20.0-alpha3...v0.20.0-beta) (2020-04-25)

### Bug Fixes

- **injection:** whitelist google domains for window.name; fixes [#308](https://github.com/sereneblue/chameleon/issues/308)
- **injection:** check if mediaDevices exists before overwriting
- **injection:** reload injection script if block media devices option is changed
- **profiles:** update edge user agent
- **settings:** add default value for legacy settings import

### Features

- **injection:** add spoof font fingerprint; close [#55](https://github.com/sereneblue/chameleon/issues/55), close [#71](https://github.com/sereneblue/chameleon/issues/71)

<a name="v0.20.0-alpha3"></a>

## [v0.20.0-alpha3](https://github.com/sereneblue/chameleon/compare/v0.20.0-alpha2...v0.20.0-alpha3) (2020-04-15)

### Bug Fixes

- initial settings load
- disable polymer for Youtube
- load browser config settings on extension load
- **import:** add missing interval options for validation
- **localiation:** update string
- **localization:** update localization keys in ui
- **localization:** replace text values on popup with localized version

### Features

- add navigator spoofing
- add option to block media devices
- **injection:** add screen size spoofing
- **localization:** add german localization
- **localization:** add localization support to popup
- **localization:** add chinese localization
- **localization:** add english locale and update notifications to use localization
- **localization:** add localization support to options page
- **profiles:** add edge profile for desktop and android
- **screen spoofing:** add resolutions
- **settings:** import legacy settings

<a name="v0.20.0-alpha2"></a>

## [v0.20.0-alpha2](https://github.com/sereneblue/chameleon/compare/v0.20.0-alpha1...v0.20.0-alpha2) (2020-03-01)

### Bug Fixes

- **UI:** update poup ui profile list display
- **injection:** use postMessage to notify when fingerprinting is detected
- **interceptor:** add fallback url for network request matching
- **ip rules:** improve ip rules handling
- **profiles:** remove excluded profiles from profile generator
- **profiles:** show change button on popup if any random profile option is selected
- **profiles:** add fallback to real profile
- **whitelist:** reload injection script when whitelist rule is changed
- **whitelist:** check if whitelist rule is found in interceptor
- **whitelist:** show context menu item on load if enabled

### Features

- **spoofing:** use original profile for recaptcha

<a name="v0.20.0-alpha1"></a>

## [v0.20.0-alpha1](https://github.com/sereneblue/chameleon/compare/v0.20.0-alpha0...v0.20.0-alpha1) (2020-02-28)

### Features

- **Options Page:** add close button to modal
- **Settings:** implement import settings
- **Settings:** implement reset settings
- **Settings:** implement export settings

<a name="v0.20.0-alpha0"></a>

## v0.20.0-alpha0 (2020-02-20)
