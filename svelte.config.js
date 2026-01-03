import adapter from 'svelte/vite';

export default {
  kit: {
    adapter: adapter(),
    alias: {
      $lib: 'src/lib',
      $components: 'src/lib/components',
      $stores: 'src/lib/stores'
    }
  }
};
