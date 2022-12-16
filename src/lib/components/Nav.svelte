<script>
	import { base } from '$app/paths';

	export let segment;
</script>

<style lang="postcss">
	li {
		@apply bg-transparent font-bold mx-2 px-2 py-1 rounded opacity-50;
	}

	li.active {
		@apply opacity-100;
	}
</style>

<nav class="flex px-4 bg-dark-green lg:px-0 py-2 w-full text-lg text-white justify-center z-10">
	<ul class="flex max-w-6xl w-full items-center">
		<div class="grow-0">
			<li>
				<a href='{base}'>
					<img class="h-6" src="{base}/icon.svg" alt="Chameleon Icon">
				</a>
			</li>
		</div>
		<div class="grow inline-flex justify-end">
			<li class:active="{ segment === "about" }"><a aria-current='{segment === "about" ? "page" : undefined}' href='{base}/about'>About</a></li>
			<li class:active="{ segment === "wiki" }"><a aria-current='{segment === "wiki" ? "page" : undefined}' href='{base}/wiki'>Wiki</a></li>
			<li class:active="{ segment === "contact" }"><a aria-current='{segment === "contact" ? "page" : undefined}' href='{base}/contact'>Contact</a></li>
			<li class:active="{ segment === "donate" }"><a aria-current='{segment === "donate" ? "page" : undefined}' href='{base}/donate'>Donate</a></li>
			<li class:active="{ segment === "privacy" }"><a aria-current='{segment === "privacy" ? "page" : undefined}' href='{base}/privacy'>Privacy Policy</a></li>
		</div>
	</ul>
</nav>
