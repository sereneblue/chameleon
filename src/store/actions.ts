import * as mtypes from './mutation-types';
import * as util from './util';

export const changeProfile = ({ commit }, payload) => {
  commit(mtypes.CHANGE_PROFILE, payload);
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
