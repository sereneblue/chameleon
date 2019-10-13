import * as types from './mutation-types';

export const changeProfile = ({ commit }, payload) => {
  commit(types.CHANGE_PROFILE, payload);
};

export const toggleChameleon = ({ commit }, payload) => {
  commit(types.TOGGLE_CHAMELEON, payload);
  browser.runtime.getPlatformInfo().then(plat => {
    if (payload === false && plat.os != 'android') {
      browser.browserAction.setIcon({
        path: '../icons/icon_disabled_48.png',
      });
    } else {
      browser.browserAction.setIcon({
        path: '../icons/icon_48.png',
      });
    }
  });
};

export const toggleNotifications = ({ commit }, payload) => {
  commit(types.TOGGLE_NOTIFICATIONS);
};

export const toggleTheme = ({ commit }, payload) => {
  commit(types.TOGGLE_THEME);
};
