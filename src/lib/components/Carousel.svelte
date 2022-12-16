<script>
  import { base } from '$app/paths';

  let carouselIndex = 0;
  let screenshots = [
    "ui1.png",
    "ui2.png",
    "ui3.png",
    "ui4.png",
    "ui5.png"
  ];
  
  $: src = base + "/" + screenshots[carouselIndex];
  
  let interval = setInterval(() => {
    if (carouselIndex < screenshots.length - 1) {
      carouselIndex++;
    } else {
      carouselIndex = 0;
    }
  }, 3000);
 
  let selectImage = (index) => {
    carouselIndex = index;

    clearInterval(interval);

    interval = setInterval(() => {
      if (carouselIndex < screenshots.length - 1) {
        carouselIndex++;
      } else {
        carouselIndex = 0;
      }
    }, 3000);
  }
</script>

<style lang="postcss">
  button {
    @apply block w-4 h-4 p-0 border-none rounded-full bg-black;
    opacity: 15%;
  }

  button.active {
    @apply bg-primary opacity-100;
  }
</style>

<div>
  <img {src} class="shadow-lg rounded-lg border border-primary b-1" alt="Chameleon screenshot">
  <div class="flex justify-center mt-6">
    {#each screenshots as s, i}
      <button class="mr-2" class:active="{ carouselIndex == i }" on:click={e => selectImage(i) }></button>
    {/each}
  </div>
</div>