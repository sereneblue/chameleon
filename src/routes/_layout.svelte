<script>
	import Nav from '../components/Nav.svelte';

	export let segment;
</script>

<style lang="postcss">
	:global(p > a) {
		@apply text-primary underline;
	}
</style>

<main>
	<div class="flex flex-col h-screen overflow-y-auto">
		<Nav {segment}/>
		<slot></slot>
	</div>
</main>