import * as mtypes from './mutation-types';
import { stateMerge } from 'vue-object-merge';

export default {
  [mtypes.CHANGE_PROFILE](state, payload) {
    state.profile.selected = payload;
  },
  [mtypes.CHANGE_SETTING](state, payload) {
    for (let i = 0; i < payload.length; i++) {
      let keys = payload[i].name.split('.');
      let beforeLast = keys.slice(0, -1).reduce((o, i) => o[i], state);

      if (typeof payload[i].value != 'boolean') {
        if (!isNaN(Number(payload[i].value))) {
          payload[i].value = parseInt(payload[i].value, 10);
        }
      }

      beforeLast[keys.slice(-1).pop()] = payload[i].value;
    }
  },
  [mtypes.INITIALIZE](state, payload) {
    stateMerge(state, payload);
  },
  [mtypes.TOGGLE_CHAMELEON](state, payload) {
    state.config.enabled = payload;
  },
  [mtypes.TOGGLE_NOTIFICATIONS](state, payload) {
    state.config.notificationsEnabled = !state.config.notificationsEnabled;
  },
  [mtypes.TOGGLE_THEME](state, payload) {
    state.config.theme = state.config.theme == 'light' ? 'dark' : 'light';
  },
  [mtypes.SYNC](state, payload) {
    stateMerge(state, payload);
  },
  [mtypes.UPDATE_EXCLUSIONS](state, payload) {
    state.excluded = payload;
  },
};
