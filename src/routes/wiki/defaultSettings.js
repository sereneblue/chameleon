export default {
  advanced: {
    "config": {
      "enabled": true,
      "notificationsEnabled": false,
      "theme": "light"
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
      "cookiePolicy": "reject_third_party",
      "blockMediaDevices": true,
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
      }
    },
    "version": "0.20.0.5",
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
      "theme": "light"
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
      "cookiePolicy": "reject_trackers",
      "blockMediaDevices": false,
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
      }
    },
    "version": "0.20.0.5",
    "whitelist": {
      "enabledContextMenu": true,
      "defaultProfile": "none",
      "rules": []
    }
  }
}