<script>
  export let segment;
  
  let capitalize = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }
</script>

<div class="font-semibold text-lg">
  {#if segment == undefined  }
    <span>Home</span>
  {:else}
    <a class="text-primary" href="wiki">Home</a>
    <span class="font-normal mx-1">/</span>
    <span>{ segment.split('-').map(capitalize).join(' ') }</span>
  {/if}
</div>