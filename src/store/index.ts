import Vue from 'vue';
import Vuex from 'vuex';

import mutations from './mutations';
import * as actions from './actions';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    config: {
      enabled: true,
      notificationsEnabled: false,
      theme: 'light',
    },
    excluded: [],
    headers: {
      blockEtag: false,
      enableDNT: false,
      referer: {
        disabled: false,
        xorigin: 0,
        trimming: 0,
      },
      spoofAcceptLang: {
        enabled: false,
        value: 'default',
      },
      spoofIP: {
        enabled: false,
        option: 0,
        rangeFrom: '',
        rangeTo: '',
      },
    },
    ipRules: [],
    profile: {
      selected: 'none',
      interval: {
        option: 0,
        min: 1,
        max: 1,
      },
    },
    options: {
      cookiePolicy: 'allow_all',
      disableWebRTC: false,
      firstPartyIsolate: false,
      limitHistory: false,
      protectKBFingerprint: {
        enabled: false,
        delay: 1,
      },
      protectWinName: false,
      resistFingerprinting: false,
      screenSize: 'default',
      spoofAudioContext: false,
      spoofClientRects: false,
      timeZone: 'default',
      trackingProtectionMode: 'always',
      webRTCPolicy: 'default',
      webSockets: 'allow_all',
    },
    whitelist: {
      enabled: false,
      enabledContextMenu: false,
      defaultProfile: 'none',
      rules: [],
    },
  },
  mutations,
  actions,
});
