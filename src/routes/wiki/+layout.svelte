<script>
	import { page } from '$app/stores';

  $: segment = $page.url.pathname.replace('/chameleon/wiki', '').replace(/\//g, '');

	import Nav from '$lib/components/Nav.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
</script>

<style lang="postcss">
	:global(p > a), :global(ol > li > a) {
		@apply text-primary underline;
	}

	:global(table) {
    @apply text-left w-full rounded border-2 shadow-sm my-4 text-sm;
  }

  :global(thead) {
    @apply bg-gray-800 text-white;
  }

  :global(thead th) {
		@apply w-1/3 text-left py-3 px-2 uppercase font-semibold text-sm;
  }

  :global(tbody) {
    @apply text-gray-700;
  }

  :global(td) {
		@apply p-2;
	}
	
  :global(tr:nth-child(even)) {
    @apply bg-gray-200;
  }
</style>

<main>
	<div class="flex bg-ligh h-full w-full px-2 lg:px-0 justify-center">
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