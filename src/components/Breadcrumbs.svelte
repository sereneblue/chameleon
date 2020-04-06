<script>
  export let segment;
  
  let edit = `https://github.com/sereneblue/chameleon/blob/wiki/src/routes/wiki/${segment}.svelte`;

  let capitalize = (word) => {
    if (word == 'ip') {
      return "IP";
    }
    
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
{#if segment != undefined}
  <div>
    <p>
      <a href={edit}>Edit this page</a>
    </p>
  </div>
{/if}