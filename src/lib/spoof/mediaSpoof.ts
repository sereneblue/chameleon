export default {
  type: 'custom',
  data: `
  const MEDIA_DEVICES = {
    win: [
      { audioinput: 'Microphone (Realtek High Definition Audio)', videoinput: 'USB2.0 HD UVC WebCam' },
      { audioinput: 'Logitech C170', videoinput: 'Logitech C170' }
    ],
    mac: [
      { audioinput: 'Internal Microphone', videoinput: 'FaceTime HD Camera (Built-in)' },
      { audioinput: 'Logitech Camera', videoinput: 'Logitech Camera' }
    ],
    lin: [
      { audioinput: 'Built-in Audio Analog Stereo', videoinput: 'USB2.0 HD UVC WebCam: USB2.0 HD' },
      { audioinput: 'HD Pro Webcam C920', videoinput: 'HD Pro Webcam C920' }
    ],
    ios: [{
      audioinput: 'iPhone Microphone',
      videoinput: [
        'Back Camera',
        'Front Camera'
      ]
    }, {
      audioinput: 'iPad Microphone',
      videoinput: [
        'Back Camera',
        'Front Camera'
      ]
    }],
    and: [{
      audioinput: 'Microphone 1',
      videoinput: [
        'Front facing camera',
        'Back facing camera'
      ]
    }, {
      audioinput: 'Microphone 1',
      videoinput: [
        'camera2 1, facing front',
        'camera2 0, facing back'
      ]
    }]
  };

  let platform = Object.keys(MEDIA_DEVICES).find(os => CHAMELEON_SPOOF.get(spoofContext).profileOS.includes(os));
  let mediaDevices  = MEDIA_DEVICES[platform];
  let isMobile = platform === 'ios' || platform === 'and';
  let deviceIndex = 0;

  if (spoofContext.navigator.mediaDevices) {
    _enumerateDevices = spoofContext.navigator.mediaDevices.enumerateDevices.bind(spoofContext.navigator.mediaDevices);

    if (isMobile) {
      if (platform == 'ios') {
        if (spoofContext.navigator.userAgent.includes('iPad')) {
          deviceIndex = 1;
        }
      } else {
        deviceIndex = Math.random() > 0.5 ? 0 : 1;
      }
    }
    Object.defineProperty(spoofContext.navigator.mediaDevices, 'enumerateDevices', {
      configurable: true,
      value: async () => {
        let devices = await _enumerateDevices();
        let known = {};

        let videoCount = 0; 
        let audioCount = 0;

        if (devices.length && devices[0].label == '') {
          return devices;
        }

        for (let i = 0; i < devices.length; i++) {
          let k = devices[i].groupId + devices[i].kind;
          
          if (k in known && devices[i].kind == 'audioinput') {
            let label = mediaDevices[known[k]][devices[i].kind];

            let isChrome = /Chrome/.test(navigator.userAgent);
            let isFirefox = /Firefox/.test(navigator.userAgent);

            if (platform == 'lin') {
              if (isChrome) {
                label = 'Default';
              } else if (isFirefox) {
                label = 'Monitor of ' + label;
              }
            } else if (platform == 'win' && isChrome) {
              label = 'Default - ' + label;
            }

            Object.defineProperty(devices[i], 'label', {
              configurable: false,
              value: label
            });
          } else {
            if (devices[i].kind === 'videoinput') {
              if (isMobile) {
                if (videoCount < 2) {
                  Object.defineProperty(devices[i], 'label', {
                    configurable: false,
                    value: mediaDevices[deviceIndex].videoinput[videoCount]
                  });
  
                  videoCount++;
                }
              } else {
                if (videoCount < 2) {
                  Object.defineProperty(devices[i], 'label', {
                    configurable: false,
                    value: mediaDevices[videoCount].videoinput
                  });
  
                  known[k] = videoCount;
                  videoCount++;
                }
              }
            } else if (devices[i].kind === 'audioinput') {
              if (isMobile) {
                Object.defineProperty(devices[i], 'label', {
                  configurable: false,
                  value: mediaDevices[deviceIndex].audioinput
                });
              } else {
                if (audioCount < 2) {
                  Object.defineProperty(devices[i], 'label', {
                    configurable: false,
                    value: mediaDevices[audioCount].audioinput
                  });
  
                  known[k] = audioCount;
                  audioCount++;
                }
              }
            }
          }
        };

        return devices;
      }
    });

    modifiedAPIs.push([
      spoofContext.navigator.mediaDevices.enumerateDevices, "enumerateDevices"
    ]);
  }
  `,
};
