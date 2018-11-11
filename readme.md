# Chameleon

![Chameleon version](https://img.shields.io/badge/version-0.9.19-brightgreen.svg)
![GPL v3 License](https://img.shields.io/badge/license-GPL%20v3-blue.svg)

Chameleon is a WebExtension port of the popular Firefox addon [Random Agent Spoofer](https://github.com/dillbyrne/random-agent-spoofer).

The UI is near identical and contains most of the features found in the original extension.

![chameleon screenshot](https://raw.githubusercontent.com/sereneblue/chameleon/master/screenshot.png)

## Features

### Useragents

- Randomly select from a preset list of user agents.
- Choose between different platforms or device types.
- Use a custom user agent.
- Change user agent at interval.

### Headers

- Spoof some header values.
- Modify referer options.
- Enable Do Not Track.

### Options

- Enable script injection.
- Enable tracking protection/etc.
- Disable WebSockets.
- Spoof client rects.
- Spoof screen size.
- Spoof timezone.
- Modify cookie options.
- Prevent WebRTC leak
- about:config checklist to enhance your privacy.

WebExtensions are unable to modify about:config entries. A workaround for this is to use the checklists that can be found under certain menu options. Right click the option and select "Copy Link Location". Paste this link into your address bar and you'll be presented with the option in about:config.

### Whitelist

- Create a whitelsit profile
- Use your real profile as the whitelist profile.
- Manage a list of whitelist rules.
- Supports regular expressions

## Installation

Chameleon is available on the [Firefox Add-ons website](https://addons.mozilla.org/firefox/addon/chameleon-ext).

## Contribute

Want to help improve Chameleon? Send a pull request or open an issue. Keep in mind that some functionality isn't technically possible.

## Wiki

Don't know where to start? Check out the [wiki](https://github.com/sereneblue/chameleon/wiki). If you're having issues with a website, please read the whitelist [guide](https://github.com/sereneblue/chameleon/wiki/Whitelist#recommended-sites-to-add-to-the-whitelist).

## Credits

<div>Chameleon icon made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>

dillbyrne for creating [Random Agent Spoofer](https://github.com/dillbyrne/random-agent-spoofer)

Joue Quroi for the timezone spoofing code [Spoof Timezone](https://github.com/joue-quroi/spoof-timezone)

Pencil and trashbin icon made by Keyamoon from [IcoMoon](https://icomoon.io/#preview-free).
