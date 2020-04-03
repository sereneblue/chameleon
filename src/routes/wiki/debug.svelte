<svelte:head>
	<title>Debug | Chameleon</title>
</svelte:head>

<div class="mb-8 px-4 text-xl leading-snug">
  <div>
    <div class="mb-4">
      <h2 class="font-semibold text-3xl border-primary border-b-2 mb-4">Debugging issues with sites</h2>
    </div>
    <div class="mb-4">
      <img src="console.png" alt="Firefox Developer Console">
      <br>
      If you're having issues with a specific website, you may be able to identify the errors caused
      by Chameleon by opening the Developer Console (CTRL/COMMAND+SHIFT+K). Errors in red can give a clue as to
      what may be causing a site to break. For example, if you see "Date" in
      the console and you're using timezone spoofing, that may be the cause of the issue. You can also use
      the fingerprint panel on the Chameleon popup to quickly identify which features are being used on a web page.
      <div class="w-full my-4 flex flex-col items-center">
        <img class="max-w-md" src="panel.png" alt="Chameleon fingerprint panel">
        <p class="text-center mt-2 text-lg">From left to right, Audio Context, Client Rects, Date, Screen, WebSocket.</p>
      </div>
      Some sites use features that are not supported in Firefox. This results in issues when using a Chrome profile.
      For example, browsing Youtube with a Chrome user agent normally causes Youtube to break. Chameleon attempts to
      fix this issue by using a simpler version of Youtube instead.
      <br>
      <br>
      <div class="w-full my-4 flex flex-col items-center">
        <img class="max-w-md" src="toggle.png" alt="Chameleon enabled">
      </div>
      <p>
        You can toggle Chameleon by clicking the shield icon on the popup main page. This allows you to quickly
        disable Chameleon without disabling the extension.
      </p>
      <br>
      <p>
        If you come across a site that breaks and you're not sure why, you can whitelist it! This feature
        allows you to use a browser profile (or none) with a subset of spoofing features for a specific site/page.
        More info can be found in the <a href="wiki/whitelist">whitelist</a> guide.
      </p>
      <br>
      <p>
        If whitelisting a site does not work for you, please open an issue on Github <a href="https://github.com/sereneblue/chameleon/issues" target="_blank" rel="noopener noreferrer">here</a>.
      </p>
    </div>
    <div class="mb-4">
      <h2 class="font-semibold text-3xl border-primary border-b-2 mb-4">Report a bug</h2>
    </div>
    <div class="mb-4">
      If you've found a bug, please follow the steps below:
      <ol class="mt-2 list-decimal list-inside">
        <li>
          Check if you're using the latest version of Chameleon.
        </li>
        <li>
          Check if your bug has been reported already <a href="https://github.com/sereneblue/chameleon/issues" target="_blank" rel="noopener noreferrer">here</a>. This helps reduce the number of duplicate issues.
        </li>
        <li>
          Be detailed with your issue. Some useful information to include:
          <br>
          <ul class="ml-4 mb-2 list-disc list-inside">
            <li>What version of Chameleon and Firefox are you using?</li>
            <li>Can you reproduce your issue?</li>
            <li>What OS are you using?</li>
            <li>Anything else that may be useful</li>
          </ul>
          Export your settings (can be found on the options page) and post it in the GitHub issue.
        </li>
      </ol>
    </div>
  </div>
</div>