<script>
	import Nav from '../../components/Nav.svelte';
	import Breadcrumbs from '../../components/Breadcrumbs.svelte';

	export let segment;
</script>

<style lang="postcss">
	:global(p > a), :global(ol > li > a) {
		@apply text-primary underline;
	}
</style>

<main>
	<div class="flex bg-ligh h-full w-full px-2 lg:	px-0 justify-center">
		<div class="flex lg:max-w-5xl mt-8 w-full">
			<div class="flex flex-col w-full">
				<div class="w-full">
					<div class="mb-5 text-center">
						<h2 class="font-bold text-5xl">Wiki</h2>
						<Breadcrumbs {segment} />
					</div>
					<slot></slot>
				</div>
			</div>
		</div>
	</div>
</main>