<svelte:head>
	<title>Options | Chameleon</title>
</svelte:head>

<div class="mb-8 px-4 text-xl leading-snug">
  <div class="text-lg mb-4 w-full flex justify-center">
    <img src="ui4.png" alt="Chameleon Headers tab">
  </div>
  <div>
    <div>
      <h2 class="font-semibold text-3xl border-primary border-b-2 mb-4">about:config checklist</h2>
      <div class="mt-4">
        Random Agent Spoofer has a feature that allows you to toggle about:config options. Unforunately,
        that is no longer possible with WebExtensions. For your convenience, Chameleon contains a 
        checklist of some preferences that you may want to change. <strong>Please read the options carefully
        before changing anything.</strong> A short summary of each preference can be also found in the checklist. 
      </div>
    </div>
    <div class="mt-2">
      <h2 class="font-semibold text-3xl border-primary border-b-2 my-4">Injection</h2>
      <div class="mt-4">
        <h3 class="font-bold">Block media devices</h3>
        <p>
          Prevents media devices from being enumerated. If this option is enabled, websites will not be able to 
          detect if you have a webcam or microphone.
        </p>
      </div>
      <div class="mt-4">
        <h3 class="font-bold">Limit tab history</h3>
        <p>
          Spoof tab history number in the window History API.
        </p>
      </div>
      <div class="mt-4">
        <h3 class="font-bold">Protect keyboard fingerprint</h3>
        <p>
          The way you type can be used to fingerprint you. This option adds a small delay between each keystroke you make 
          to mask your keyboard fingerprint.
        </p>
      </div>
      <div class="mt-4">
        <h3 class="font-bold">Protect window.name</h3>
        <p>
          Can be used to track you across domains. Enabling this options clears this value.
          More info can be found <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/name" target="_blank" rel="noopener noreferrer">here</a>.
        </p>
      </div>
      <div class="mt-4">
        <h3 class="font-bold">Spoof Audio Context</h3>
        <p>
          Can be used to track you across browsers on the same device. Enabling this options spoofs your audio context fingerprint.
          More info can be found <a href="https://iq.opengenus.org/audio-fingerprinting/" target="_blank" rel="noopener noreferrer">here</a>.
        </p>
      </div>
      <div class="mt-4">
        <h3 class="font-bold">Spoof client rects</h3>
        <div class="font-semibold my-2 text-sm text-red-600">
          If you're using CanvasBlocker, please make sure that the dom rects option is disabled.
          It can cause issues with some websites.
        </div>
        <p>
          Can be used to track you across the web. Enabling this option spoofs your client rectangle fingerprint.
          More info can be found <a href="https://browserleaks.com/rects" target="_blank" rel="noopener noreferrer">here</a>.
        </p>
      </div>
      <div class="mt-4">
        <h3 class="font-bold">Spoof font fingerprint</h3>
        <p>
          Can be used to track you across browsers on the same device. Enabling this options spoofs your font fingerprint when you use a browser profile.
          More info can be found <a href="https://browserleaks.com/fonts/" target="_blank" rel="noopener noreferrer">here</a>.
        </p>
      </div>
      <div class="mt-4">
        <h3 class="font-bold">Spoof Screen Size</h3>
        <table>
          <thead>
            <tr>
              <th>Option</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Default</td>
              <td>Don't spoof screen resolution</td>
            </tr>
            <tr>
              <td>Profile</td>
              <td>If a profile is used, the screen resolution will be set to a random resolution for that profile. Takes into account OS and browser differences.</td>
            </tr>
            <tr>
              <td>Everything else</td>
              <td>Uses the resolution taking into account your browser's specific UI settings</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="mt-4">
        <h3 class="font-bold">Spoof Timezone</h3>
        <div class="font-semibold my-2 text-sm text-red-600">Note: Timezone spoofing is only supported with browsers that use an English locale.</div>
        <p>
          <strong> This option is not perfect. If you really need to consistently spoof
          your timezone use a virtual machine or change your machine's time settings</strong> You should use this option
          if you're using a proxy with an IP in a different timezone.
        </p>
        <p class="my-2">
          If <strong>IP</strong> is selected, Chameleon will make a request to <a href="https://ipapi.co" target="_blank" rel="noopener noreferrer">https://ipapi.co</a> to get the correct timezone based on
          the IP address of the browser. If the timezone can not be found the language will be set to <strong>English (US)</strong> and
          timezone to  <strong>UTC</strong>. This request is made when starting Firefox and when selecting the IP option. Chameleon 
          <strong>will not</strong> periodically check your IP to update your browser.
        </p>
        <p class="my-2">
          You can create IP rules that will set a language/timezone for an IP address.
          More info can be found in the <a href="wiki/ip-rules">IP rules</a> guide.
        </p>
      </div>
    </div>
    <div class="mt-2">
      <h2 class="font-semibold text-3xl border-primary border-b-2 my-4">Standard Options</h2>
      <div class="mt-4">
        <h3 class="font-bold">Enable first party isolation</h3>
        <div class="font-semibold my-2 text-sm text-red-600">This option will break some sites!</div>
        <p>
          First party isolation isolates third party cookies to the domain in the address bar. Used to prevent 
          third party cookies from tracking you across domains. This is one of Tor Browser's features that was introduced
          in Firefox 52. More info can be found <a href="https://www.torproject.org/projects/torbrowser/design/#identifier-linkability" target="_blank" rel="noopener noreferrer">here</a>.
        </p>
      </div>
      <div class="mt-4">
        <h3 class="font-bold">Enable resist fingerprinting</h3>
        <div class="font-semibold my-2 text-sm text-red-600">This option will break some sites!</div>
        <p>
          Resist fingerprinting makes the browser report generic information. It will disable some features
          that can be used to uniquely identify you (WebSpeech, Navigator, local time, etc).
          More info can be found <a href="https://wiki.mozilla.org/Security/Fingerprinting" target="_blank" rel="noopener noreferrer">here</a>.
        </p>
      </div>
      <div class="mt-4">
        <h3 class="font-bold">Disable WebRTC</h3>
        <div class="font-semibold my-2 text-sm text-red-600">This option will break some sites!</div>
        <p>
          Disables WebRTC support.
        </p>
      </div>
      <div class="mt-4">
        <h3 class="font-bold">WebRTC Policy</h3>
        <div class="font-semibold my-2 text-sm text-red-600">This option will break some sites!</div>
        <p>You can disable WebRTC completely, or you can change the WebRTC policy to prevent WebRTC from leaking your IP address.</p>
        <table>
          <thead>
            <tr>
              <th>Option</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Default</td>
              <td>Show all interfaces</td>
            </tr>
            <tr>
              <td>Use Public and Private interface</td>
              <td>Use default route, exposes private associated private address</td>
            </tr>
            <tr>
              <td>Only use Public interface</td>
              <td>Hide private IP address</td>
            </tr>
            <tr>
              <td>Disable non-proxified UDP</td>
              <td>Disable WebRTC unless using UDP proxy</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="mt-4">
        <h3 class="font-bold mb-2">Tracking protection mode</h3>
        <table>
          <thead>
            <tr>
              <th>Option</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>On</td>
              <td>Enable tracking protection</td>
            </tr>
            <tr>
              <td>Off</td>
              <td>Disable tracking protection</td>
            </tr>
            <tr>
              <td>Enabled in private browsing</td>
              <td>Only enabled in private windows</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="mt-4">
        <h3 class="font-bold mb-2">WebSockets</h3>
        <ul class="list-disc list-inside">
          <li>Allow all websockets</li>
          <li>Block all 3rd party websocket connections. (different domains)</li>
          <li>Block all websockets</li>
        </ul>
      </div>
    </div>
    <div class="mt-2">
      <h2 class="font-semibold text-3xl border-primary border-b-2 my-4">Cookie Options</h2>
      <div class="mt-4">
        <h3 class="font-bold mb-2">Cookie Policy</h3>
        <table>
          <thead>
            <tr>
              <th>Option</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Allow all</td>
              <td>Allow all cookies</td>
            </tr>
            <tr>
              <td>Block all</td>
              <td>Block all cookies</td>
            </tr>
            <tr>
              <td>Block 3rd party</td>
              <td>Block all 3rd party cookies</td>
            </tr>
            <tr>
              <td>Allow 3rd party from visited</td>
              <td>Allow 3rd party cookies only if the cookie's top-level domain already has at least one cookie</td>
            </tr>
            <tr>
              <td>Reject trackers</td>
              <td>Reject cookies from trackers</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>