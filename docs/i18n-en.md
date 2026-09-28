# 英語版サイト（/en/）の実装メモ

作業中の記録。自動圧縮で文脈が消えても再開できるように、方針と進捗をここに残す。

## 方針

- Astro組み込みのi18nルーティングを使う。`defaultLocale: 'ja'`、`locales: ['ja', 'en']`、`prefixDefaultLocale: false`。
  - 日本語はこれまで通り `/`、`/about` など。英語は `/en/`、`/en/about` など。
  - `Astro.currentLocale` で現在の言語を判定し、共通コンポーネントの文言を切り替える。
- 文言辞書は `src/i18n/ui.ts` に集約（ナビ、フッター、フローティングメニュー、ブランドメニュー、メタ情報のデフォルト）。
- `Layout.astro` が `<html lang>`、`og:site_name`、`og:locale`、hreflang（ja / en / x-default→ja）を言語ごとに出し分ける。
- 言語切替とダークモード切替は `SiteControls.astro` にまとめ、`GlobalHeader.astro` のロゴ行の右端に置く（画面追従なし）。スマホ幅（sm未満）ではロゴ→メニュー→切替ボタンの順に縦積み（`order` で並び替え）。言語切替は「JP / EN」のテキスト表記で、現在の言語は太字、もう一方だけリンク。翻訳がない記事は `NewsPostLayout` が `alternatePath` を `GlobalHeader` に渡す。対応ページ同士を行き来し、翻訳がないお知らせ記事は `/en/news` にフォールバック。
- お知らせは別コレクション `newsEn`（`src/content/news-en/`）。日本語と同じファイル名にしてスラッグを一致させる。
- サイトマップは `@astrojs/sitemap` の `i18n` オプションで hreflang の alternate を出力。
- 英語ページのタイトル末尾は `| Lumilinks inc.`。

## 注意点

- お問い合わせフォーム（SSGForm）の送信後リダイレクト先は SSGForm 管理画面の設定で決まる。英語フォームからの送信でも日本語の `/contact/thanks` に飛ぶ可能性があるため、`/en/contact/thanks` を作った上で管理画面側の確認が必要。
- お問い合わせフォームの `name` 属性は SSGForm 側の設定（必須項目・自動返信のメール欄など）と紐づくため、英語版でも日本語版と同じ値（`お名前` など）にしている。表示ラベルだけ英語。
- hreflang は `Layout.astro` もサイトマップも `ja` / `en` で揃えている（`ja-JP` にすると両者が食い違う）。
- 翻訳がないお知らせ記事では、自分自身の言語の hreflang は現在のURL、もう一方の言語だけ `/news` または `/en/news` に向く（`alternatePath`）。
- reCAPTCHA は英語ページで `api.js?hl=en` を読み込む。
- プライバシーポリシーの英訳は参考訳。日本語版が正文である旨を明記する。
- 会社概要の社名・住所は各言語ページに自分の言語だけを表示する（日本語ページに英語表記、英語ページに日本語表記は併記しない）。言語切替で行き来する前提。
- `src/pages/about/index.astro` には未コミットの変更（インボイス番号の追加）が含まれている。

## 進捗

- [x] astro.config.mjs（i18n・sitemap）
- [x] src/i18n/ui.ts
- [x] Layout / GlobalHeader / GlobalFooter / FloatingMenu / NewsPostLayout の多言語対応
- [x] content.config.ts に newsEn 追加
- [x] src/pages/en/（index, about, contact, contact/thanks, privacy, news/index, news/[slug]）
- [x] src/content/news-en/ の12記事
- [x] AGENTS.md 更新（README.md は見出しのみのため変更なし）
- [x] npm run lint / build / typecheck（36ページ生成、hreflang・サイトマップ確認済み）

## 残タスク（こぎそ側）

- SSGForm 管理画面で送信後のリダイレクト先を確認する（英語フォームからも日本語の `/contact/thanks` に飛ぶ可能性がある）。
- 英訳（会社概要・プライバシーポリシー・お知らせ12件）の内容を確認する。
- 変更をコミットする（会社概要ページの未コミット変更も含まれる）。
