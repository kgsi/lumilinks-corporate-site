// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [],
  vite: {
    plugins: [tailwindcss()],
  },
  output: 'static',
  // adapter: cloudflare(), // 静的サイトの場合はアダプターは不要です
});
