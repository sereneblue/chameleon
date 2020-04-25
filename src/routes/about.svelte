<svelte:head>
	<title>About | Chameleon</title>
</svelte:head>

<div class="flex bg-light w-full px-2 lg:	px-0 justify-center">
	<div class="flex lg:max-w-5xl mt-8 md:mt-8 w-full">
		<div class="flex flex-col w-full">
			<h2 class="font-bold text-5xl mb-5 text-center">About</h2>
			<div class="w-full px-4">
				<div id="q1" class="mb-8 leading-tight">
					<h2 class="font-bold text-2xl mb-4">What is Chameleon?</h2>
					<p class="text-xl mb-4 leading-relaxed md:w-4/5">
						Chameleon is a Mozilla Firefox addon that spoofs your browser profile and includes a few privacy enhancing options.
						It is the spiritual successor to the popular addon
						<a href="https://github.com/dillbyrne/random-agent-spoofer" target="_blank" rel="noopener noreferrer">Random Agent Spoofer</a>.
					</p>
				</div>
				<div id="q2" class="mb-8 leading-tight">
					<h2 class="font-bold text-2xl mb-4">What is a browser fingeprint?</h2>
					<div class="text-xl mb-4 leading-relaxed md:w-4/5">
						<p>
							Every time you visit a page on the Internet, your web browser reveals several pieces of information to the website you're visiting.
							Ads and trackers can follow you across the web by creating a unique ID from your browser fingerprint. A browser fingerprint is a collection of data 
							that may include some of the following items below: 
						</p>
						<ol class="mt-4">
							<li class="mb-4">
								<span class="font-semibold text-primary">IP (Internet Protocol) Address</span>
								<div class="mt-1">
									An IP address is a string of numbers that are like a street address for the Internet. For example, 
									<strong>74.125.65.91</strong> is an IP address that belongs to Google. A website can use these numbers to
									get a rough estimate of your geographic location. 
								</div>
							</li>
							<li class="mb-4">
								<span class="font-semibold text-primary">User Agent</span>
								<div class="mt-1">
									A user agent is a string of text that lets a website know what device is making a request. For example, 
									<strong>Mozilla/5.0 (Linux; Android 8.1.0; SM-T580) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36</strong>
									is a user agent that tells a website that the page is being loaded from a "Samsung Galaxy Tab A"
									tablet running Chrome 74 on Android 8.1. A website can use this to redirect you to a mobile version of their site.
								</div>
							</li>
							<li class="mb-4">
								<span class="font-semibold text-primary">Fonts</span>
								<div class="mt-1">
									Windows, macOS, Android, etc are bundled with different fonts. A website can check to see which fonts are installed on your computer.
									This information can contribute to a fingerprint that may be used to identify devices and people in a shared location.
								</div>
							</li>
							<li class="mb-4">
								<span class="font-semibold text-primary">Screen Resolution</span>
								<div class="mt-1">
									Your device/monitor screen data leaks the screen resolution that you're using and if you're using multiple monitors. This information
									can contribute to a fingerprint that may be used to identify devices and people in a shared location.
								</div>
							</li>
						</ol>
					</div>
				</div>
				<div id="q3" class="mb-8 leading-tight">
					<h2 class="font-bold text-2xl mb-4">Why is Chameleon not available for Chrome/Chrome-based browsers?</h2>
					<p class="text-xl mb-4 leading-relaxed md:w-4/5">
						Chameleon uses some features that are only available in Firefox. If you care about your privacy you
						<strong>should not</strong> use Google Chrome. If you can, please use Firefox or Safari as your primary
						browser. Yes, there are some websites that only work in Chrome. Fortunately, there are Chrome-based alternatives
						that you can use: <a href="https://brave.com/" target="_blank" rel="noopener noreferrer">Brave</a> and <a href="https://github.com/Eloston/ungoogled-chromium" target="_blank" rel="noopener noreferrer">Ungoogled Chromium</a>. 
					</p>
				</div>
				<div id="q4" class="mb-8 leading-tight">
					<h2 class="font-bold text-2xl mb-4">Is Chameleon enough to protect my privacy online?</h2>
					<p class="text-xl mb-4 leading-relaxed md:w-4/5">
						No.
						<br><br>
						There are several other Firefox extensions that you should use in addition to
						Chameleon and privacy practices you should follow.
						For a list of recommened extensions, check the <a href="./wiki/recommended-extensions">Recommended Extensions</a> page.
					</p>
				</div>
				<div id="q5" class="mb-8 leading-tight">
					<h2 class="font-bold text-2xl mb-4">Does Chameleon make me anonymous online?</h2>
					<p class="text-xl mb-4 leading-relaxed md:w-4/5">
						No.
						<br><br>
						Spoofing your browser profile does not make you anonymous online. 
						In case you're wondering, "private" windows do not make you anonymous either.
						Chameleon's purpose is to minimize the effectiveness of tracking on the web. If you're worried about
						alphabet agencies, you should be using <a href="https://www.torproject.org/" target="_blank" rel="noopener noreffere">Tor Browser</a>.
					</p>
				</div>
				<div id="q6" class="mb-24 leading-tight">
					<h2 class="font-bold text-2xl mb-4">I'd like to contribute to Chameleon! How can I help?</h2>
					<p class="text-xl mb-4 leading-relaxed">
						Want to help translate? Visit <a href="https://crowdin.com/project/chameleon" target="_blank" rel="noopener noreferrer">Crowdin</a>.
						<br>
						Suggestion or bug? Visit <a href="https://github.com/sereneblue/chameleon/issues" target="_blank" rel="noopener noreferrer">Github</a>.
						<br>
						Anything else? Contact me <a href="./contact">here</a>.
					</p>
				</div>
			</div>
		</div>
	</div>
</div>