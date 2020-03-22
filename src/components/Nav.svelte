<script>
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

<nav class="flex px-4 bg-dark-green lg: px-0 py-2 w-full text-lg text-white justify-center z-10">
	<ul class="flex max-w-6xl w-full items-center">
		<div class="flex-0">
			<li>
				<a href='./'>
					<img class="h-6" src="icon.svg" alt="Chameleon Icon">
				</a>
			</li>
		</div>
		<div class="flex-1 inline-flex justify-end">
			<li class:active="{ segment === "faq" }"><a aria-current='{segment === "faq" ? "page" : undefined}' href='faq'>FAQ</a></li>
			<li class:active="{ segment === "wiki" }"><a aria-current='{segment === "wiki" ? "page" : undefined}' href='wiki'>Wiki</a></li>
			<li class:active="{ segment === "contact" }"><a aria-current='{segment === "contact" ? "page" : undefined}' href='contact'>Contact</a></li>
		</div>
	</ul>
</nav>
