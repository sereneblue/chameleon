import * as mtypes from './mutation-types';
import util from './util';

export const changeProfile = ({ commit }, payload) => {
  commit(mtypes.CHANGE_PROFILE, payload);
};

export const changeSetting = ({ commit, state }, payload) => {
  commit(mtypes.CHANGE_SETTING, payload);

  if (payload[0].name == 'whitelist.enabledContextMenu') {
    util.enableContextMenu(payload[0].value, state.whitelist.rules);
  }
};

export const toggleChameleon = ({ commit }, payload) => {
  commit(mtypes.TOGGLE_CHAMELEON, payload);
  util.enableChameleon(payload);
};

export const toggleNotifications = ({ commit }, payload) => {
  commit(mtypes.TOGGLE_NOTIFICATIONS);
};

export const toggleTheme = ({ commit }, payload) => {
  commit(mtypes.TOGGLE_THEME);
};
