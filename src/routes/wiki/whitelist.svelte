<svelte:head>
	<title>Whitelist | Chameleon</title>
</svelte:head>

<div class="mb-8 px-4 text-xl leading-snug">
  <div class="text-lg mb-4 w-full flex justify-center">
    <img src="ui5.png" alt="Chameleon Whitelist tab">
  </div>
  <div class="mb-4">
    <div class="mt-4">
      <div class="mb-4">
        The whitelist enables you to use a specific profile for a url. This is very useful for some Google websites
        that seem to not to be compatible with Firefox.
      </div>
      <div class="mb-2">
        <div class="w-full my-4 flex flex-col items-center">
          <img class="max-w-md" src="context-menu.png" alt="Chameleon context menu item">
        </div>
        <div class="mt-1">
          <h3 class="font-bold">Context Menu</h3>
          <p>
            Enabling the context menu option allows you to quickly add/edit a whitelist rule for a specific domain.
          </p>
        </div>
      </div>
      <div class="my-2">
        <h3 class="font-bold">Default Whitelist Profile</h3>
        <p>
          You can select a default whitelist profile for all whitelist rules that use "Default Whitelist Profile". This provides
          some convenience for you to quickly change multiple whitelist rule profiles at once. You also have the flexibility to specify
          a profile for each whitelist rule. 
        </p>
      </div>
      <div class="mt-2">
        <h2 class="font-semibold text-3xl border-primary border-b-2 mb-4">Whitelist Rule Editor</h2>
        <div class="w-full my-4 flex flex-col items-center">
          <img src="whitelist-editor.png" alt="Chameleon whitelist rule editor">
        </div>
        <div class="mt-2">
          <p>
            To add a new rule to the whitelist, you can use the context menu item, use the button on the whitelist tab, or navigate directly
            to the whitelist tab on the options page (the gear icon on the popup page).
          </p>
        </div>
        <div class="mt-4">
          <p>
            Using a specific browser profile will spoof the user agent and related browser properties
            (screen resolution, headers, navigator properties) for that profile.
          </p>
          <p class="mt-2">
            Enter the domain that you would like to whitelist, for example, docs.google.com. 
            Any requests made from a tab with the domain <strong>docs.google.com</strong> will use the specified whitelist profile.
          </p>
        </div>
        <div class="mt-4">
          <h3 class="font-bold">Whitelist Rule Options</h3>
          <p>
            Each whitelist profile requires a name, language, and profile and a few additional options:
          </p>
          <ul class="list-disc list-inside mt-2">
            <li>Disable referer</li>
            <li>Disable WebSocket</li>
            <li>Enable protect window name</li>
            <li>Enable timezone spoofing</li>
          </ul>
        </div>
        <div class="mt-4">
          <h3 class="font-bold text-2xl">Regular Expressions</h3>
          <p>
            Although it is possible to use regular expressions, it's not recommended if you have a lot of rules. To improve performance,
            a domain pattern is required. The regular expression will only be evaluated if the tab url matches the domain you
            specified for that rule.
          </p>
          <br>
          <p>
            For example, if your rule is "reddit.com@@(r/webdev|popular)", your whitelist profile will only be used for those subreddits.
          </p>
          <br>
          <p>
            You should try to be as specific as you can with the domain pattern. For example, instead of using "google.com", you may
            only want to use a specific profile for Google Docs (docs.google.com). 
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
