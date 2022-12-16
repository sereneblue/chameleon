import adapter from '@sveltejs/adapter-static';
import preprocess from "svelte-preprocess";

export default {
  kit: {
    adapter: adapter({
      pages: 'chameleon',
      assets: 'chameleon',
      fallback: null,
      precompress: false,
      strict: false
    }),
    paths: {
      base: "/chameleon"
    },
    prerender: {
      handleMissingId: "ignore"
    }
  },
  preprocess: [
    preprocess({
      postcss: true,
    }),
  ] 
};