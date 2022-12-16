<script>
  import { base } from '$app/paths';
  import settings from './defaultSettings';

  let download = (k) => {
    let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settings[k]));
    var el = document.getElementById('dl');
    el.setAttribute("href", dataStr );
    el.setAttribute("download", "settings.json");
    el.click();
  };
</script>

<svelte:head>
	<title>Getting Started | Chameleon</title>
</svelte:head>

<div class="mb-8 px-4 text-xl leading-snug">
  <div>
    <div class="mb-4">
      <div class="mt-4">
        <p class="mb-3">
          Chameleon is an extension to spoof your browser profile. Your browser profile contains information 
          such as your user agent, screen resolution, accept encoding, and various other bits of information
          that can be used to track you across the web. To learn more the features Chameleon offers, visit 
          the guides below.
        </p>
        <div class="flex flex-col justify-around mb-4">
          <a class="mx-0 bg-white shadow hover:text-primary hover:shadow-lg px-6 py-4 rounded mb-3" href="{base}/wiki/profile">
            <span class="font-semibold text-2xl">Profile</span>
            <p class="text-lg mt-1">Learn more about the features on the Profile tab</p>
          </a>
          <a class="mx-0 bg-white shadow hover:text-primary hover:shadow-lg px-6 py-4 rounded mb-3" href="{base}/wiki/headers">
            <span class="font-semibold text-2xl">Headers</span>
            <p class="text-lg mt-1">Learn more about the features on the Headers tab</p>
          </a>
          <a class="mx-0 bg-white shadow hover:text-primary hover:shadow-lg px-6 py-4 rounded mb-3" href="{base}/wiki/options">
            <span class="font-semibold text-2xl">Options</span>
            <p class="text-lg mt-1">Learn more about the features on the Options tab</p>
          </a>
          <a class="mx-0 bg-white shadow hover:text-primary hover:shadow-lg px-6 py-4 rounded mb-3" href="{base}/wiki/whitelist">
            <span class="font-semibold text-2xl">Whitelist</span>
            <p class="text-lg mt-1">Learn more about the features on the Whitelist tab</p>
          </a>
        </div>
        <p class="py-2">
          Chameleon has a lot of options that you can toggle. For your convenience, here are a few settings 
          files that you can import into Chameleon to quickly get started.
        </p>
        <div class="flex justify-around py-2">
          <a class="hidden" href="##" id="dl">Download</a>
          <button class="mx-0 flex items-center w-2/5 bg-white shadow hover:text-primary hover:shadow-lg px-6 py-4 rounded mb-3" on:click={e => download('casual')}>
            <div class="flex flex-col text-left flex-1">
              <span class="font-semibold text-2xl">Casual</span>
              <p class="text-lg mt-1">For new users</p>
            </div>
            <svg fill="currentColor" viewBox="0 0 20 20" class="w-12 h-12"><path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
          </button>
          <button class="mx-0 flex items-center w-2/5 bg-white shadow hover:text-primary hover:shadow-lg px-6 py-4 rounded mb-3" on:click={e => download('advanced')}>
            <div class="flex flex-col text-left flex-1">
              <span class="font-semibold text-2xl">Advanced</span>
              <p class="text-lg mt-1">For intermediate users</p>
            </div>
            <svg fill="currentColor" viewBox="0 0 20 20" class="w-12 h-12"><path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
          </button>
        </div>
        <h2 class="font-semibold text-3xl border-primary border-b-2 mb-4">Dashboard</h2>
        <div class="text-lg mb-4 w-full flex justify-center">
          <img src="{base}/dashboard.png" alt="Chameleon IP Rules">
        </div>
        <p class="py-2">
          The dashboard can be accessed by clicking the gear icon on the Chameleon popup. You can export, import,
          and reset your settings here. It also provides quick access to helpful resources for the Chameleon community. 
        </p>
        <p class="py-2">
          v0.21.0 allows users to request the privacy permission to toggle certain options. Click "Request privacy permissions",
          and then grant Chameleon the privacy permission.
        </p>
      </div>
    </div>
  </div>
</div>