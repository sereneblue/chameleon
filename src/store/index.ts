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
      disableAuth: false,
      enableDNT: false,
      referer: {
        disabled: false,
        spoofSource: false,
        xorigin: 0,
        trimming: 0,
      },
      spoofAcceptLang: {
        enabled: false,
        lang: '',
      },
      spoofIP: {
        enabled: false,
        option: 0,
        rangeFrom: '',
        rangeTo: '',
      },
      upgradeInsecureRequests: false,
    },
    ipRules: [],
    profile: {
      selected: 'none',
      interval: {
        option: 0,
        min: 0,
        max: 0,
      },
    },
    options: {
      enableScriptInjection: false,
      limitHistory: false,
      protectKBFingerprint: {
        enable: false,
        delay: 0,
      },
      protectWinName: false,
      screenSize: 'default',
      spoofAudioContext: false,
      spoofClientRects: false,
      timeZone: 'default',
      webSockets: 'allow_all',
    },
    whitelist: {
      enabled: false,
      enabledContextMenu: false,
      defaultProfile: 'default',
      rules: [],
    },
  },
  mutations,
  actions,
});
