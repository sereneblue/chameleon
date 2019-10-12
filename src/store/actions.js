import * as types from './mutation-types';

export const toggleChameleon = ({ commit }, payload) => {
  commit(types.TOGGLE_CHAMELEON);
};

export const toggleNotifications = ({ commit }, payload) => {
  commit(types.TOGGLE_NOTIFICATIONS);
};

export const toggleTheme = ({ commit }, payload) => {
  commit(types.TOGGLE_THEME);
};
