export const enableChameleon = (enabled: boolean): void => {
  browser.runtime.getPlatformInfo().then(plat => {
    if (enabled === false && plat.os != 'android') {
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
