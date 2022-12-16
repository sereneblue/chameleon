export default {
  advanced: {
    "config": {
      "enabled": true,
      "notificationsEnabled": false,
      "theme": "light",
      "hasPrivacyPermission": false
    },
    "excluded": [],
    "headers": {
      "blockEtag": true,
      "enableDNT": false,
      "referer": {
        "disabled": false,
        "xorigin": 1,
        "trimming": 1
      },
      "spoofAcceptLang": {
        "enabled": false,
        "value": "default"
      },
      "spoofIP": {
        "enabled": false,
        "option": 0,
        "rangeFrom": "",
        "rangeTo": ""
      }
    },
    "ipRules": [],
    "options": {
      "cookieNotPersistent": false,
      "cookiePolicy": "reject_third_party",
      "blockMediaDevices": false,
      "blockCSSExfil": true,
      "disableWebRTC": false,
      "firstPartyIsolate": true,
      "limitHistory": true,
      "protectKBFingerprint": {
        "enabled": false,
        "delay": 1
      },
      "protectWinName": true,
      "resistFingerprinting": true,
      "screenSize": "profile",
      "spoofAudioContext": true,
      "spoofClientRects": true,
      "spoofFontFingerprint": false,
      "spoofMediaDevices": false,
      "timeZone": "default",
      "trackingProtectionMode": "always",
      "webRTCPolicy": "default_public_interface_only",
      "webSockets": "block_3rd_party"
    },
    "profile": {
      "selected": "randomDesktop",
      "interval": {
        "option": 10,
        "min": 1,
        "max": 1
      },
      "showProfileOnIcon": true
    },
    "version": "0.22.12.0",
    "whitelist": {
      "enabledContextMenu": true,
      "defaultProfile": "none",
      "rules": []
    }
  },
  casual: {
    "config": {
      "enabled": true,
      "notificationsEnabled": false,
      "theme": "light",
      "hasPrivacyPermission": false
    },
    "excluded": [],
    "headers": {
      "blockEtag": true,
      "enableDNT": false,
      "referer": {
        "disabled": false,
        "xorigin": 1,
        "trimming": 1
      },
      "spoofAcceptLang": {
        "enabled": false,
        "value": "default"
      },
      "spoofIP": {
        "enabled": false,
        "option": 0,
        "rangeFrom": "",
        "rangeTo": ""
      }
    },
    "ipRules": [],
    "options": {
      "cookieNotPersistent": false,
      "cookiePolicy": "reject_trackers",
      "blockMediaDevices": false,
      "blockCSSExfil": false,
      "disableWebRTC": false,
      "firstPartyIsolate": true,
      "limitHistory": true,
      "protectKBFingerprint": {
        "enabled": false,
        "delay": 1
      },
      "protectWinName": true,
      "resistFingerprinting": false,
      "screenSize": "default",
      "spoofAudioContext": false,
      "spoofClientRects": false,
      "spoofFontFingerprint": false,
      "spoofMediaDevices": false,
      "timeZone": "default",
      "trackingProtectionMode": "always",
      "webRTCPolicy": "default_public_interface_only",
      "webSockets": "allow_all"
    },
    "profile": {
      "selected": "randomDesktop",
      "interval": {
        "option": 10,
        "min": 1,
        "max": 1
      },
      "showProfileOnIcon": true
    },
    "version": "0.22.12.0",
    "whitelist": {
      "enabledContextMenu": true,
      "defaultProfile": "none",
      "rules": []
    }
  }
}