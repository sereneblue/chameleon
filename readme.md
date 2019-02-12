# Chameleon

![Chameleon version](https://img.shields.io/badge/version-0.11.1-brightgreen.svg)
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
- Prevent Etag tracking.
- Modify referer (use source url or disable).

### Options

- Enable script injection.
- Disable WebSockets.
- Limit tab history.
- Protect window.name.
- Spoof audio context
- Spoof client rects.
- Spoof screen size.
- Spoof timezone.
- Prevent WebRTC leak.
- Enable tracking protection.
- Enable resist fingerprinting.
- Enable first party isolation.
- Modify cookie options.
- about:config checklist to enhance your privacy.

WebExtensions are unable to modify about:config entries. A workaround for this is to use the checklists that can be found under certain menu options. Right click the option and select "Copy Link Location". Paste this link into your address bar and you'll be presented with the option in about:config.

### Whitelist

- Use your real or spoofed profile for whitelisted sites.
- Manage a list of whitelist rules.
- Supports regular expressions
- Option to use a spoofed profile per whitelist rule.

## Installation

Chameleon is available on the [Firefox Add-ons website](https://addons.mozilla.org/firefox/addon/chameleon-ext).

## Contribute

Want to help improve Chameleon? Send a pull request or open an issue. Keep in mind that some functionality isn't technically possible.

## Wiki

Don't know where to start? Check out the [wiki](https://github.com/sereneblue/chameleon/wiki). If you're having issues with a website, please read the whitelist [guide](https://github.com/sereneblue/chameleon/wiki/Whitelist#recommended-sites-to-add-to-the-whitelist).

## Credits

Chameleon icon made by [Freepik](http://www.freepik.com) from [www.flaticon.com](https://www.flaticon.com/) is licensed by [CC 3.0 BY](http://creativecommons.org/licenses/by/3.0/")

dillbyrne for creating [Random Agent Spoofer](https://github.com/dillbyrne/random-agent-spoofer)

Joue Quroi for the timezone spoofing code [Spoof Timezone](https://github.com/joue-quroi/spoof-timezone)

ilGur for the audio context spoofing code [AudioContext Defender](https://mybrowseraddon.com/audiocontext-defender.html)

Princeton Web Transparency & Accountability Project for the audio context fingerprinting code [AudioContext Fingerprint](https://audiofingerprint.openwpm.com/)