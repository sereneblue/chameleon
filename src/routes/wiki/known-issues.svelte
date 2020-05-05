<svelte:head>
	<title>Known Issues | Chameleon</title>
</svelte:head>

<div class="mb-8 px-4 text-xl leading-snug">
  <div class="mb-4 border-b-2 border-priamry">
    <h4 class="mb-4 text-2xl font-semibold">
      URLs exempt from Chameleon spoofing
    </h4>
    <div class="text-base">
      <div class="mb-4">
        <h3 class="font-semibold text-lg">https://accounts.google.com</h3>
        Chameleon does not spoof anything when accessing a URL that starts with accounts.google.com.
        More details can be found <a href="https://github.com/sereneblue/chameleon/issues/339#issuecomment-623188593" class="text-primary">here</a>.
      </div>
      <div class="mb-4">
        <h3 class="font-semibold text-lg">https://www.google.com/recaptcha/api2</h3>
        Recaptcha is already inconvenient with regular Firefox, it becomes almost impossible when
        Chameleon is enabled.
      </div>
    </div>
  </div>
  <div>
    <h4 class="mb-4 text-2xl font-semibold">
      URLs known to have issues. You should whitelist them.
    </h4>
    <div class="text-base">
      <div class="mb-4">
        <h3 class="font-semibold text-lg">https://open.spotify.com</h3>
        Some profiles do not work with Spotify (IE11).
      </div>
      <div class="mb-4">
        <h3 class="font-semibold text-lg">https://twitter.com</h3>
        Twitter is known to have issues ("Something went wrong"). Using a non-Firefox user agent can cause issues.
      </div>
      <div class="mb-4">
        <h3 class="font-semibold text-lg">https://web.whatsapp.com</h3>
        WhatsApp checks for some features available in the browser depending on the user agent.
        This causes issues with some profiles.
      </div>
    </div>
  </div>
</div>