<script>
  import Highlight from 'svelte-highlight';
  import { python, javascript } from 'svelte-highlight/languages';
  import { github } from 'svelte-highlight/styles';

  let languages = {
    javascript,
    python
  };

  $: activeIndex = 0;
  $: code = data[activeIndex].code;
  $: language = languages[data[activeIndex].lang];

  let changeLanguage = (index, language) => {
    activeIndex = index;
  }

  export let data;
  export let title;
</script>

<style lang="postcss">
  li {
    @apply font-semibold px-2 py-1 mx-1 opacity-25 rounded;
  }

  li:hover {
    @apply cursor-pointer opacity-50;
  }

  li.active {
    @apply opacity-100 text-white bg-primary;
  }
</style>

<svelte:head>
  {@html github}
</svelte:head>

<div class="w-full">
  <div class="flex justify-between border-primary items-center border-b-2 mb-4">
    <h2 class="font-semibold text-xl">{title}</h2>
    <ul class="flex justify-center py-1">
      {#each data as l, i}
        <li on:click={ e => changeLanguage(i, l.lang)} class:active={activeIndex == i}>{ l.title }</li>
      {/each}
    </ul>
  </div>
  {#each data as l, i}
    {#if activeIndex == i}
      <Highlight class="hljs" {language}>{l.code.trim()}</Highlight>
    {/if}
  {/each}
</div>