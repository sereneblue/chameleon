<script>
	import { page } from '$app/stores';

	$: segment = $page.url.pathname.replace('/chameleon/', '');

	import Nav from '$lib/components/Nav.svelte';
	import "../app.css";
</script>

<style lang="postcss">
	:global(p > a) {
		@apply text-primary underline;
	}
</style>

<main>
	<div class="flex flex-col h-screen overflow-y-auto">
		<Nav {segment} />
		<slot></slot>
	</div>
</main>