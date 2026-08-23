// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import partytown from '@astrojs/partytown';
import sitemap from '@astrojs/sitemap';
import compress from 'astro-compress';

// https://astro.build/config
export default defineConfig({
  site: 'https://lumilinks.jp',
  integrations: [
    icon(),
    partytown({
      config: {
        forward: ['dataLayer.push'],
      },
    }),
    sitemap(),
    compress({
      // Adjusted to match astro-compress option names per typings
      // CSSはfalse固定。astro-compressが内部で使うcssoは
      // Tailwind v4が出力する @media (width >= 40rem) 形式
      // （Media Queries Level 4のレンジ構文）をパースできず、
      // メディアクエリブロックを丸ごと削除してしまうため。
      // 有効にするとsm:/lg:などのレスポンシブスタイルが本番で全て失われる。
      // CSSはVite側のminifyで既に圧縮済み。
      CSS: false,
      HTML: true,
      Image: true,
      JavaScript: true,
      SVG: true,
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    build: {
      cssCodeSplit: true,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
        },
      },
    },
  },
  output: 'static',
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
});
