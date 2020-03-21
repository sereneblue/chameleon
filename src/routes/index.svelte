<script>
	import Carousel from '../components/Carousel.svelte';

	let downloadExtension = () => {
		window.location.href = 'https://addons.mozilla.org/firefox/downloads/latest/chameleon-ext';
	}

	let goToAbout = () => {
		window.location.href = '/about';
	}
</script>

<style>
	.animated {
		background: linear-gradient(45deg, #6666ff, #0099ff , #00ff00, #ff3399, #6666ff);
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
		animation: rainbow 12s ease infinite;
		background-size: 400% 100%;
	}

	@keyframes rainbow {
    0% {
        background-position: 0 0;
    }

		100% {
			background-position: 100% 0;
		}
}
</style>

<svelte:head>
	<title>Chameleon</title>
</svelte:head>

<div class="flex h-screen bg-light w-full justify-center">
	<div class="flex max-w-6xl w-full">
		<div class="flex w-full items-center justify-between">
			<div class="w-full lg:max-w-md">
				<div class="mb-8 text-center lg:text-left leading-tight">
					<h1 class="font-bold text-6xl animated">Chameleon</h1>
					<h2 class="text-3xl opacity-50">Spoof your browser profile.</h2>
				</div>
				<div class="w-full flex justify-center lg:justify-start">
					<button on:click={downloadExtension} class="flex items-center bg-primary hover:bg-primary-soft text-white font-bold py-2 px-4 text-xl rounded shadow-md">
						<svg fill="currentColor" viewBox="0 0 20 20" class="w-8 h-8"><path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
						<span class="ml-2">Install</span>
					</button>
					<button on:click={goToAbout} class="flex items-center bg-transparent hover:bg-primary text-primary hover:text-white font-bold py-2 px-4 text-xl rounded shadow-md border border-primary hover:border-transparent  ml-4">
						Learn more
					</button>
				</div>
			</div>
			<div class="hidden lg:block">
				<Carousel />
			</div>
		</div>
	</div>
</div>