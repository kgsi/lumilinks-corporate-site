# 書体・組版まわりのメモ

## 書体: Gen Interface JP

- 配布元: https://gen.typesetting.jp/ （Inter + Noto Sans JP ベース、SIL OFL 1.1）
- jsDelivr の `cdn/` 版 CSS を `Layout.astro` で読み込む。バージョンは `@0.8.0` に固定
  - 読み込むウェイトは 300（本文）/ 400（`font-normal`）/ 600（`font-semibold`）のみ
  - `font-bold`（700）は未読み込みなので 600 で表示される
- `cdn.jsdelivr.net` への preconnect は crossorigin あり／なしの 2 本
  （CSS は通常接続、woff2 は CORS 接続で取りに行くため）

## フォント読み込み時のちらつき対策

- 原因: CDN の CSS が `font-display: swap` で、しかも文字範囲ごとに分割配信（unicode-range）
  されているため、代替フォントで一度描画 → 文字ごとにバラバラに差し替わる
- 対策: 読み込みが終わるまで本文を隠し、終わったらフェードイン（配布元サイトと同じ方式）
  - `Layout.astro` の head にあるインラインスクリプトが `<html>` に `fonts-loading` を付け外し
  - `global.css` の `html.fonts-loading body { opacity: 0 }` で隠す。背景色は残るので白／黒画面のまま
  - 最大 2 秒で強制表示（CDN が遅いときは従来どおり差し替えが見える）
  - JS 無効・Font Loading API 非対応ブラウザでは何もしない（普通に表示）
- 注意点
  - `document.fonts.ready` は「読み込み開始前」に呼ぶと即解決する。DOMContentLoaded で
    `getBoundingClientRect()` を呼んでレイアウトを確定させ、読み込みを始めさせてから待つ
  - フェードは body の `duration-300` を流用。global.css で body に `transition` を書くと
    テーマ切替の背景色アニメーションが消えるので書かない
  - トレードオフ: 本文が見えるまでの時間（LCP）がフォント読み込み分だけ遅れる。
    ページ遷移ごとに短いフェードインが入る

## 組版

- TOP の h1: 親に `@container` を付け、`text-[length:min(14cqi,4.75rem)]` + `break-keep` + `<wbr />`。
  PC（幅 1024px 以上）で 76px・日本語 4 行、英語 3 行になる
  - `cqi` は親要素（コンテナ）の幅の 1%。一番長い行「テクノロジーと、」（6.94em）が
    幅の 97% になるように決めている。スマホ（幅 390px）で 47px（以前は 40px 固定）
  - `vw` だと左右の余白や 16px 単位の切り捨てを計算に入れる必要があるが、
    `cqi` なら h1 が置かれる幅そのものを基準にできる
  - 英語は一番長い行「and community.」（7.55em）に合わせて `12.8cqi`（390px で 43px）。
    `and&nbsp;community.` にして、and だけが 1 行に残らないようにしている
  - `wrap-break-word` は保険。Webフォントが間に合わず代替フォント（かなが全角幅で広い）で
    表示されたときに、はみ出して横スクロールが出るのを防ぐ
- 日本語の流しテキスト（`<p>`）は両端揃え（`global.css` の `@layer base` の `p:lang(ja)`）
  - base レイヤーなので `text-left` などのユーティリティで個別に戻せる
  - 英語は左揃えのまま。両端揃えにすると単語間のすき間がムラになり、
    `hyphens: auto` で均すとハイフンだらけになるため見送った
