<a name="v0.20.7-rc"></a>

## [v0.20.7-rc1](https://github.com/sereneblue/chameleon/compare/v0.20.7-rc...v0.20.7-rc1) (2020-05-14)

### Bug Fixes

- add update url

<a name="v0.20.7-rc"></a>

## [v0.20.7-rc](https://github.com/sereneblue/chameleon/compare/v0.20.6-rc...v0.20.7-rc) (2020-05-14)

### Bug Fixes

- **localization:** import russian locale
- **spoofing:** update timezone spoofing and language handling

### Features

- show current profile in tooltip

<a name="v0.20.6-rc"></a>

## [v0.20.6-rc](https://github.com/sereneblue/chameleon/compare/v0.20.5-rc...v0.20.6-rc) (2020-05-11)

### Bug Fixes

- update event listener to handle scope; [#301](https://github.com/sereneblue/chameleon/issues/301)
- **injection:** improve plugin spoofing; [#366](https://github.com/sereneblue/chameleon/issues/366)

<a name="v0.20.5-rc"></a>

## [v0.20.5-rc](https://github.com/sereneblue/chameleon/compare/v0.20.4-rc1...v0.20.5-rc) (2020-05-10)

### Bug Fixes

- **injection:** add google drive/docs to whitelist; [#356](https://github.com/sereneblue/chameleon/issues/356)
- **whitelist:** use top level frame for whitelist match; [#356](https://github.com/sereneblue/chameleon/issues/356)

### Features

- **localization:** add russian localization

<a name="v0.20.4-rc1"></a>

## [v0.20.4-rc1](https://github.com/sereneblue/chameleon/compare/v0.20.4-rc...v0.20.4-rc1) (2020-05-09)

### Features

- **profiles:** update browser profiles

<a name="v0.20.4-rc"></a>

## [v0.20.4-rc](https://github.com/sereneblue/chameleon/compare/v0.20.3-rc...v0.20.4-rc) (2020-05-08)

### Bug Fixes

- only call contextmenu if platform is not android
- listener for external connections
- **font spoofing:** add support for loaded fonts; [#360](https://github.com/sereneblue/chameleon/issues/360)
- **popup:** prevent multiple clicks for profile change
- **profiles:** add viewport to iOS devices; [#347](https://github.com/sereneblue/chameleon/issues/347)

<a name="v0.20.3-rc"></a>

## [v0.20.3-rc](https://github.com/sereneblue/chameleon/compare/v0.20.2-rc...v0.20.3-rc) (2020-05-04)

### Bug Fixes

- check if android before toggling Chameleon
- **font spoofing:** add support for web fonts; [#360](https://github.com/sereneblue/chameleon/issues/360)
- **injection:** use parent client rect functions in iframes; [#341](https://github.com/sereneblue/chameleon/issues/341)
- **injection:** overwrite navigator.userAgent if profile is used while RFP is enabled; [#340](https://github.com/sereneblue/chameleon/issues/340)
- **spoofing:** exempt accounts.google from spoofing; [#339](https://github.com/sereneblue/chameleon/issues/339)

  ### Features

- **cookies:** add option to toggle cookie persistence; [#346](https://github.com/sereneblue/chameleon/issues/346)
- **options:** add link to known site issues page on wiki
- **options page:** add confirmation before resetting settings; [#348](https://github.com/sereneblue/chameleon/issues/348)

<a name="v0.20.2-rc"></a>

## [v0.20.2-rc](https://github.com/sereneblue/chameleon/compare/v0.20.1-rc...v0.20.2-rc) (2020-05-02)

### Bug Fixes

- **fp panel:** check if web audio is enabled before creating proxy; [#332](https://github.com/sereneblue/chameleon/issues/332)
- **injection:** handle NaN values for Date; [#332](https://github.com/sereneblue/chameleon/issues/332)
- **injection:** remove Youtube polymer handling; [#336](https://github.com/sereneblue/chameleon/issues/336)
- **popup:** add condition to check if localization object is empty
- **popup:** add fallback if localstorage is disabled; [#338](https://github.com/sereneblue/chameleon/issues/338)
- **settings:** update version validation when importing settings
- **settings:** add font fingerprint to store
- **timezone:** improve timezone spoofing; [#325](https://github.com/sereneblue/chameleon/issues/325)

### Features

- **localization:** add french translation

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
