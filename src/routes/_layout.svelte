<script>
	import Nav from '../components/Nav.svelte';

	export let segment;
</script>

<main>
	<div class="flex flex-col h-screen overflow-y-auto">
		<Nav {segment}/>
		<slot></slot>
	</div>
</main>