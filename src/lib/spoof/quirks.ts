export default {
  type: 'custom',
  data: `
  let data = CHAMELEON_SPOOF.get(spoofContext);
  let uniqId = Math.floor(Math.random() * (1000) + 1000);
  let startTime = new Date().getTime();
  let randLoadTime = Math.floor(Math.random() * 1000);

  if (data.browser !== "firefox") {
    delete window.InstallTrigger;
    delete window.InstallTriggerImpl;
  }

  if (data.browser === "edge" || data.browser === "chrome") {
    spoofContext.chrome = {
      app: {
        InstallState: {
          DISABLED: "disabled",
          INSTALLED: "installed",
          NOT_INSTALLED: "not_installed"
        },
        RunningState: {
          CANNOT_RUN: "cannot_run",
          READY_TO_RUN: "ready_to_run",
          RUNNING: "running"
        },
        getDetails() {
          return null;
        },
        getIsInstalled() {
          return false;
        },
        installState() {
          return "not_installed";
        },
        isInstalled: false,
        runningState() {
          return "cannot_run";
        }
      },
      csi() {
        return {
          onloadT: startTime + randLoadTime,
          pageT: new Date().getTime() - startTime,
          startE: startTime,
          tran: 15
        }
      },
      loadTimes() {
        return {
          commitLoadTime: startTime,
          connectionInfo: "http/1.0",
          finishDocumentLoadTime: 0,
          finishLoadTime: 0,
          firstPaintAfterLoadTime: 0,
          firstPaintTime: 0,
          navigationType: "Reload",
          npnNegotiatedProtocol: "unknown",
          requestTime: startTime,
          startLoadTime: startTime,
          wasAlternateProtocolAvailable: false,
          wasFetchedViaSpdy: false,
          wasNpnNegotiated: false
        }
      },
      runtime: {
        OnInstalledReason: {
          CHROME_UPDATE: "chrome_update",
          INSTALL: "install",
          SHARED_MODULE_UPDATE: "shared_module_update",
          UPDATE: "update"
        },
        OnRestartRequiredReason: {
          APP_UPDATE: "app_update",
          OS_UPDATE: "os_update",
          PERIODIC: "periodic"
        },
        PlatformArch: {
          ARM: "arm",
          ARM64: "arm64",
          MIPS: "mips",
          MIPS64: "mips64",
          X86_32: "x86-32",
          X86_64: "x86-64"
        },
        PlatformNaclArch: {
          ARM: "arm",
          ARM64: "arm64",
          MIPS: "mips",
          MIPS64: "mips64",
          X86_32: "x86-32",
          X86_64: "x86-64"
        },
        PlatformOs: {
          ANDROID: "android",
          CROS: "cros",
          LINUX: "linux",
          MAC: "mac",
          OPENBSD: "openbsd",
          WIN: "win"
        },
        RequestUpdateCheckStatus: {
          NO_UPDATE: "no_update",
          THROTTLED: "throttled",
          UPDATE_AVAILABLE: "update_available"
        },
        connect() {
          // do nothing
        },
        id: undefined,
        sendMessage() {
          // do nothing
        }
      }
    };
  }

  if (data.browser === "safari") {
    const SafariRemoteNotification = {
      async requestPermission(url, websitePushID, userInfo, callback) {
        callback({
          permission: 'denied'
        })
      },
      permission() {
        return {
          permission: 'denied'
        }
      },
      toString: () => {
        return "[object SafariRemoteNotification]";
      }
    };

    spoofContext.safari = {
      pushNotification: SafariRemoteNotification
    };
  }

  if (data.browser === "ie") {
    spoofContext.document.documentMode = 11;

    Object.defineProperty(spoofContext.document, 'uniqueID', {
      get() {
        ++uniqId;
        return 'ms__id' + uniqId;
      }
    });

    // stub for MSInputMethodContext
    spoofContext.MSInputMethodContext = {
      compositionEndOffset: 0,
      compositionStartOffset: 0,
      target: null,
      oncandidatewindowhide: () => {},
      oncandidatewindowhide: () => {},
      oncandidatewindowhide: () => {},
      getCandidateWindowClientRect: () => {},
      getCompositionAlternatives: () => {},
      hasComposition: () => {},
      isCandidateWindowVisible: () => {}
    };

    Object.setPrototypeOf(spoofContext.MSInputMethodContext, EventTarget.prototype);

    spoofContext.ActiveXObject = undefined;
    spoofContext.msCrypto = spoofContext.crypto;
  }
  `,
};
