import * as types from './mutation-types';

export default {
  [types.CHANGE_PROFILE](state, payload) {
    state.profile.selected = payload;
  },
  [types.TOGGLE_CHAMELEON](state, payload) {
    state.config.enabled = payload;
  },
  [types.TOGGLE_NOTIFICATIONS](state, payload) {
    state.config.notificationsEnabled = !state.config.notificationsEnabled;
  },
  [types.TOGGLE_THEME](state, payload) {
    state.config.theme = state.config.theme == 'light' ? 'dark' : 'light';
  },
};
