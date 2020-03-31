<svelte:head>
	<title>IP Rules | Chameleon</title>
</svelte:head>

<div class="mb-8 px-4 text-xl leading-snug">
  <div class="text-lg mb-4 w-full flex justify-center">
    <img src="ip_rules.png" alt="Chameleon IP Rules">
  </div>
  <div>
    <div class="mb-4">
      The IP Rule Editor can be used to automatically assign a language and timezone
      to an IP address when Firefox is started when you select "IP" as the option
      for timezone or language spoofing.
      <br>
      <br>
      After you've added rules, you may want to click the "Reload IP info" button to update your spoofed profile.
      <br>
      <br>
      In v0.20.0, the format for IP ranges was changed. Instead of CIDR notation, the IP range is now specified
      as [Start IP Range]-[End IP Range]. For example, <strong>1.1.1.1-2.2.2.2</strong> is valid input for an IP range. 
    </div>
  </div>
</div>