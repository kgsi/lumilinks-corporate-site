# Repository Guidelines

## Language
- このリポジトリ内のドキュメント、Issue、PR、コミットメッセージ、レビューコメントは原則「日本語」で記載してください（コードは英語）。

## Project Structure & Module Organization
- `src/pages/` Astro pages (routing), e.g., `src/pages/index.astro`.
- `src/components/` Reusable Astro components, PascalCase (e.g., `GlobalHeader.astro`).
- `src/layouts/` Shared page layouts.
- `src/utils/` TypeScript utilities (e.g., RSS parsing).
- `src/css/` Global styles (Tailwind v4 entry in `global.css`).
- `public/` Static assets served as-is.
- `workers/` Cloudflare Worker for RSS-triggered rebuilds (`wrangler.toml.example`).

## Build, Test, and Development Commands
- `npm run dev` Start local dev server with HMR.
- `npm run build` Production build (static output, Sharp image service, compression).
- `npm run preview` Preview the built site locally.
- `npm run lint` Check formatting with Prettier.
- `npm run format` Apply Prettier fixes.

## Coding Style & Naming Conventions
- Prettier enforced: 2 spaces, single quotes, semicolons, width 80, trailing commas (es5). See `.prettierrc`.
- Astro components: PascalCase (e.g., `NoteArticleList.astro`). Utility modules: camelCase exports.
- Pages and assets: kebab-case file names in `public/` when possible.
- Tailwind v4 via `@tailwindcss/vite`; prefer utility classes; use the `dark` custom variant defined in `global.css`.

## Testing Guidelines
- No test runner is configured. For logic-heavy utilities, add lightweight unit tests only after discussion; prefer keeping UI verified via `npm run preview`.
- If introducing tests, propose `vitest` with colocated `*.test.ts` next to sources.

## Commit & Pull Request Guidelines
- Commits in this repo are short, imperative Japanese messages (e.g., "スタイル修正", "タイトル修正"). Keep them focused and scoped. コミュニケーションは日本語で統一。
- Branch naming: `feature/short-description`, `fix/issue-123`, `chore/tooling`.
- PRs must include: purpose/summary, linked issues, screenshots for UI changes, and notes on SEO/perf impacts (sitemap, image changes).
- Ensure `npm run lint` passes and the site builds before requesting review.

## Security & Configuration Tips
- Copy `.env.example` to `.env` as needed; never commit secrets.
- For Workers, duplicate `workers/wrangler.toml.example` and configure `RSS_MONITOR` KV and `DEPLOY_HOOK_URL` before `wrangler deploy`.
- Keep `astro.config.mjs` `site` accurate for sitemap and URLs.
