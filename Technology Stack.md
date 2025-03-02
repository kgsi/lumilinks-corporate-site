# 技術スタック

## コア技術

- TypeScript: ^5.7.3
- Node.js
- Astro: ^5.3.0

## フロントエンド

- Astro: ^5.3.0
- Tailwind CSS: ^4.0.9
- Cloudflare: ^12.2.1 (デプロイ先)

## バックエンド

- Cloudflare: ^12.2.1 (@astrojs/cloudflare)

## 開発ツール

- Prettier: ^3.0.3
- prettier-plugin-astro: ^0.12.0
- TypeScript: ^5.7.3
- Autoprefixer: ^10.4.20
- PostCSS: ^8.5.3

## その他

- RSS-Parser: ^3.13.0

---

## 実装規則

- **機能ごとの分割:**
  各機能は独立したディレクトリに整理し、その中にコンポーネント、フック、操作（mutation/query）、バリデーション、ルーティング等を配置する。
- **責務の分離:**
  UI層（表示）とロジック層（データ取得・処理）を明確に分離し、コンポーネントをシンプルに保つ。
- **共通処理の抽出:**
  複数機能で利用される処理は、`components`、`utils` ディレクトリなどにまとめ、再利用性を高める。
