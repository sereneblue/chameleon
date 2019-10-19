import * as mtypes from './mutation-types';
import util from '../lib/util';

export const changeProfile = ({ commit }, payload) => {
  commit(mtypes.CHANGE_PROFILE, payload);
};

export const changeSetting = ({ commit, state }, payload) => {
  commit(mtypes.CHANGE_SETTING, payload);

  if (payload[0].name === 'whitelist.enabledContextMenu') {
    util.enableContextMenu(payload[0].value, state.whitelist.rules);
  } else if (
    [
      'options.cookiePolicy',
      'options.disableWebRTC',
      'options.firstPartyIsolate',
      'options.resistFingerprinting',
      'options.trackingProtectionMode',
      'options.webRTCPolicy',
    ].includes(payload[0].name)
  ) {
    util.setBrowserConfig(payload[0].name, payload[0].value);
  }
};

export const excludeProfile = ({ commit, state }, payload) => {
  if (typeof payload === 'string') {
    let profileIndex: number = state.excluded.indexOf(payload);
    if (profileIndex > -1) {
      state.excluded.splice(profileIndex, 1);
    } else {
      state.excluded.push(payload);
    }
  } else {
    // check if every profile is in excluded list
    let indexes = payload.map(p => state.excluded.indexOf(p));
    indexes.sort((a, b) => b - a);

    for (let i = 0; i < indexes.length; i++) {
      if (indexes[i] > -1) state.excluded.splice(indexes[i], 1);
    }

    if (indexes.includes(-1)) {
      state.excluded = state.excluded.concat(payload);
    }
  }

  commit(mtypes.UPDATE_EXCLUSIONS, state.excluded);
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
