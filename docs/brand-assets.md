# ロゴ／ブランドアセットまわりのメモ

最終更新: 2026-08-23

## 概要

ヘッダーのロゴを**右クリック**すると、Vercel（vercel.com）のブランドメニューに似た
ポップオーバーが開き、ロゴの SVG コピーとファイルのダウンロードができる。
左クリックは従来どおりホーム（`/`）へのリンク。

## 関係するファイル

| ファイル                            | 役割                                                                           |
| ----------------------------------- | ------------------------------------------------------------------------------ |
| `src/components/GlobalHeader.astro` | ロゴのインライン SVG（**原本**）・ポップオーバーのマークアップ・制御スクリプト |
| `scripts/generate-brand-assets.mjs` | 原本の SVG から `public/brand/` の 4 ファイルを生成                            |
| `public/brand/*`                    | 配布用アセット（黒／白 × SVG／PNG。PNG は 1600×304）                           |

ロゴを差し替えたら `npm run brand:assets` を実行して `public/brand/` を再生成する
（手で編集しない）。スクリプトは `GlobalHeader.astro` 内の**最初の `<svg>`** を
原本として取り出すので、ロゴ SVG より前に別の `<svg>` を置かないこと。

## 実装上のポイント

- **右クリックで開く**: `trigger.addEventListener('contextmenu', …)` で
  `event.preventDefault()` し、ブラウザ標準のコンテキストメニューを抑止する。
  トリガーは `<a href="/">` のままなので、左クリックはリンクとして機能する。
- **閉じる操作**: Escape キー（フォーカスをトリガーへ戻す）／メニュー外のクリック／
  メニュー外の右クリック／トリガーの再右クリック（トグル）。
- **キーボード**: 上下キーで `role="menuitem"` を巡回。開いた直後は先頭にフォーカス。
- **テーマ追従**: `documentElement` の `class` を `MutationObserver` で監視し、
  ダウンロードリンクの参照先を黒／白で差し替える。`open()` でも毎回同期する。
- **クリップボード**: `navigator.clipboard.writeText()` はクリック直後に**同期的**に
  呼ぶ。`await fetch()` を挟むと transient activation が切れて Safari 等で失敗するため、
  ヘッダーの SVG を `cloneNode` して文字列を組み立ててから渡している。
- **プレビュー枠**: ヘッダーの SVG を複製して差し込む（初回オープン時のみ）。

## 既知の制約

- **タッチデバイス**: iOS Safari は `contextmenu` が発火しないため、実質デスクトップ専用。
  Android Chrome は長押しで発火するが、リンクの標準メニューではなくこのメニューが開く。
- **キーボードから開く手段がない**: macOS にはメニューキーがないため、
  キーボード操作だけではポップオーバーを開けない。
- **astro-compress が `public/brand/` の SVG も圧縮する**（パス統合・座標丸めが入る）。
  配布物として素の SVG を保ちたい場合は圧縮対象から除外する必要がある。

## 検証済み（2026-08-23）

`npm run build` / `npm run typecheck` / `npm run lint` すべてパス。
Chrome での実操作で、右クリック開閉・Escape・外側クリック・外側右クリック・トグル・
`defaultPrevented`・プレビュー複製・左クリックでのホーム遷移・ライト／ダークの見た目を確認。
**クリップボードのコピーだけは自動操作では検証できない**（ユーザージェスチャーが必要）ため、
実ブラウザでの確認が必要。

## 関連する未処理タスク

- Cloudflare 側の後片付け: Worker `rss-trigger-build` / デプロイフック「RSS Update Trigger」/
  KV `RSS_MONITOR` の削除（note RSS 機能の削除に伴うもの）。MCP コネクタが未認証のため保留中。
