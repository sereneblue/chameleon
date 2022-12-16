<script>
  import { base } from '$app/paths';
</script>

<svelte:head>
	<title>Profile | Chameleon</title>
</svelte:head>

<div class="mb-8 px-4 text-xl leading-snug">
  <div class="mb-4 w-full flex justify-center">
    <img src="{base}/ui2.png" alt="Chameleon Profile tab">
  </div>
  <div class="mb-4">
    <div class="mt-4">
      <div class="mb-6">
        By selecting a specific browser (ex Win 10 - Firefox 74), your browser will use that browser's user agent, accept-encoding headers,
        navigation properties and if selected, screen resolution properties.
      </div>
      <div>
        <h3 class="font-bold mb-2">Exclusions</h3>
        <p>
          If a certain profile causes issues for you, you can exclude it from being used with a random profile option. If there are no
          profiles that can be used (you excluded everything), your browser profile will not be spoofed.
        </p>
      </div>
      <h3 class="font-bold text-2xl my-3">Random Profiles</h3>
      <div>
        <p class="mb-2">
          You can select a specific profile to use with all sites, or use the random profile options (desktop, profile, either).
        </p>
        <p class="mb-2">
          When using a random browser profile, you can choose how often to change your profile. There is a custom interval opton so that
          you can specify the interval range.
        </p>
        <p>
          For example, if you want to use <strong>Random Profile (Desktop)</strong>, your profile will be a browser on Windows, macOS, 
          or Linux and the screen resolution (if you select the "profile" option) will be a desktop resolution.
        </p>
      </div>
      <h3 class="font-bold my-2">Whitelist</h3>
      <p>
        If you'd like to use a profile with a specific website, check out the <a href="{base}/wiki/whitelist">whitelist</a> section.
      </p>
    </div>
  </div>
</div>