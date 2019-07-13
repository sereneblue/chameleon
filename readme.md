# Chameleon

![Chameleon version](https://img.shields.io/badge/version-0.12.10-brightgreen.svg)
![GPL v3 License](https://img.shields.io/badge/license-GPL%20v3-blue.svg)
[![Crowdin](https://d322cqt584bo4o.cloudfront.net/chameleon/localized.svg)](https://crowdin.com/project/chameleon)

Chameleon is a WebExtension port of the popular Firefox addon [Random Agent Spoofer](https://github.com/dillbyrne/random-agent-spoofer).

The UI is near identical and contains most of the features found in the original extension.

![chameleon screenshot](https://user-images.githubusercontent.com/14242625/56843333-85907080-6832-11e9-941d-d7b2db6d9982.png)


## Features

### Useragents

- Randomly select from a preset list of user agents.
- Choose between different platforms or device types.
- Use a custom user agent.
- Change user agent at interval.

### Headers

- Prevent malicious authorization.
- Modify referer options.
- Enable Do Not Track.
- Prevent Etag tracking.
- Spoof accept headers. 

### Options

- Enable script injection.
- Disable WebSockets.
- Limit tab history.
- Protect window.name.
- Protect keyboard fingerprint.
- Spoof audio context
- Spoof client rects.
- Spoof screen size.
- Spoof timezone.
- Set timezone to IP location.
- Enable first party isolation.
- Enable resist fingerprinting.
- Enable tracking protection.
- Prevent WebRTC leak.
- Modify cookie options.
- about:config checklist to enhance your privacy.

WebExtensions are unable to modify about:config entries. A workaround for this is to use the checklists that can be found under certain menu options. Right click the option and select "Copy Link Location". Paste this link into your address bar and you'll be presented with the option in about:config.

### Whitelist

- Use your real or spoofed profile for whitelisted sites.
- Manage a list of whitelist rules.
- Supports regular expressions
- Use a custom profile per whitelist rule.

## Installation

Chameleon is available on the [Firefox Add-ons website](https://addons.mozilla.org/firefox/addon/chameleon-ext).

## Contribute

Want to help improve Chameleon? Send a pull request or open an issue. Keep in mind that some functionality isn't technically possible.

You can help translate Chameleon by visiting [Crowdin](https://crowdin.com/project/chameleon).

## Wiki

Don't know where to start? Check out the [wiki](https://github.com/sereneblue/chameleon/wiki). If you're having issues with a website, please read the whitelist [guide](https://github.com/sereneblue/chameleon/wiki/Whitelist#recommended-sites-to-add-to-the-whitelist).

## Credits

Chameleon icon made by [Freepik](http://www.freepik.com) from [www.flaticon.com](https://www.flaticon.com/) is licensed by [CC 3.0 BY](http://creativecommons.org/licenses/by/3.0/")

dillbyrne for creating [Random Agent Spoofer](https://github.com/dillbyrne/random-agent-spoofer)

Joue Quroi for the timezone spoofing code [Spoof Timezone](https://github.com/joue-quroi/spoof-timezone)

ilGur for the audio context spoofing code [AudioContext Defender](https://mybrowseraddon.com/audiocontext-defender.html)

Princeton Web Transparency & Accountability Project for the audio context fingerprinting code [AudioContext Fingerprint](https://audiofingerprint.openwpm.com/)

## Special Thanks

- melegeti for the French translation
- 3ibsand and Alexey for the Russian translation
- Shitennouji for the Japanese translation