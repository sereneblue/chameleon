<script>
  import { base } from '$app/paths';
</script>

<svelte:head>
	<title>Debug | Chameleon</title>
</svelte:head>

<div class="mb-8 px-4 text-xl leading-snug">
  <div>
    <div class="mb-4">
      <h2 class="font-semibold text-3xl border-primary border-b-2 mb-4">Debugging issues with sites</h2>
    </div>
    <div class="mb-4">
      <img src="{base}/console.png" alt="Firefox Developer Console">
      <br>
      If you're having issues with a specific website, you may be able to identify the errors caused
      by Chameleon by opening the Developer Console (CTRL/COMMAND+SHIFT+K). Errors in red can give a clue as to
      what may be causing a site to break. For example, if you see "Date" in
      the console and you're using timezone spoofing, that may be the cause of the issue.
      Some sites use features that are not supported in Firefox or use the user agent to detect whether some features
      are supported or not. For example, Spotify does not work with IE11 profiles.
      <br>
      <br>
      <div class="w-full my-4 flex flex-col items-center">
        <img class="max-w-md" src="{base}/disabled.png" alt="Chameleon disabled">
      </div>
      <p>
        You can toggle Chameleon by clicking the shield icon on the popup main page. This allows you to quickly
        disable Chameleon without disabling the extension.
      </p>
      <br>
      <p>
        If you come across a site that breaks and you're not sure why, you can whitelist it! This feature
        allows you to use a browser profile (or none) with a subset of spoofing features for a specific site/page.
        More info can be found in the <a href="{base}/wiki/whitelist">whitelist</a> guide.
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