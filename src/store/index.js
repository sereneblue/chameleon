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
    headers: {
      blockEtag: false,
      disableAuth: false,
      disableRef: false,
      enableDNT: false,
      refererXorigin: 0,
      refererTrimming: 0,
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
      spoofSourceRef: false,
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
      kbDelay: 0,
      limitHistory: false,
      protectKeyboardFingerprint: false,
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
      defaultProfile: 'none',
      rules: [],
    },
  },
  mutations,
  actions,
});
