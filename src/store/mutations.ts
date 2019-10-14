import * as mtypes from './mutation-types';

export default {
  [mtypes.CHANGE_PROFILE](state, payload) {
    state.profile.selected = payload;
  },
  [mtypes.CHANGE_SETTING](state, payload) {
    for (let i = 0; i < payload.length; i++) {
      let keys = payload[i].name.split('.');
      let beforeLast = keys.slice(0, -1).reduce((o, i) => o[i], state);

      beforeLast[keys.slice(-1).pop()] = payload[i].value;
    }
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
};
