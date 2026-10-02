// サイト共通の文言辞書と、言語（ロケール）に関するヘルパー。
// 日本語が既定で `/`、英語は `/en/` 配下に置かれる（astro.config.mjs の i18n 設定を参照）。

export const locales = ['ja', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'ja';

export const ui = {
  ja: {
    siteName: '株式会社Lumilinks',
    titleSuffix: '株式会社Lumilinks',
    defaultTitle:
      '株式会社Lumilinks | デザインと、テクノロジーと、コミュニティの会社',
    defaultDescription:
      'Lumilinksはデザインとエンジニアリングを軸に、AIなどのテクノロジーを駆使し、人と人をつなぎ、新しい価値をつくります。',
    ogLocale: 'ja_JP',
    nav: {
      label: 'メインナビゲーション',
      home: 'ホーム',
      about: '会社概要',
      news: 'お知らせ',
      contact: 'お問い合わせ',
      menu: 'メニュー',
      privacy: 'プライバシーポリシー',
    },
    newsPost: {
      backToList: 'お知らせ一覧に戻る',
    },
    dialog: {
      close: '閉じる',
    },
    languageSwitch: {
      label: '言語切替',
      switchToAria: 'Switch to English',
    },
    brand: {
      logoAria:
        'Lumilinks — ホーム（右クリックでロゴアセットのメニューを開く）',
      menuLabel: 'ロゴアセット',
      copy: 'ロゴをコピー',
      copied: 'コピーしました',
      copyFailed: 'コピーできませんでした',
      downloadSvg: 'SVGをダウンロード',
      downloadPng: 'PNGをダウンロード',
      themeNote:
        '現在のテーマに合わせた配色（ライト＝黒／ダーク＝白）で書き出します。',
    },
    footer: {
      copyright: 'Copyright&copy; Lumilinks inc. ALL Rights Reserved.',
    },
  },
  en: {
    siteName: 'Lumilinks inc.',
    titleSuffix: 'Lumilinks inc.',
    defaultTitle:
      'Lumilinks inc. | A company of design, technology, and community',
    defaultDescription:
      'Lumilinks builds on design and engineering, harnesses technologies such as AI, and connects people to create new value.',
    ogLocale: 'en_US',
    nav: {
      label: 'Main navigation',
      home: 'Home',
      about: 'About',
      news: 'News',
      contact: 'Contact',
      menu: 'Menu',
      privacy: 'Privacy Policy',
    },
    newsPost: {
      backToList: 'Back to News',
    },
    dialog: {
      close: 'Close',
    },
    languageSwitch: {
      label: 'Language',
      switchToAria: '日本語に切り替える',
    },
    brand: {
      logoAria: 'Lumilinks — Home (right-click to open the logo assets menu)',
      menuLabel: 'Logo assets',
      copy: 'Copy logo',
      copied: 'Copied',
      copyFailed: 'Could not copy',
      downloadSvg: 'Download SVG',
      downloadPng: 'Download PNG',
      themeNote:
        'Exported in the color of the current theme (light = black, dark = white).',
    },
    footer: {
      copyright: 'Copyright&copy; Lumilinks inc. ALL Rights Reserved.',
    },
  },
} as const;

/** Astro.currentLocale（undefined になりうる）を安全に Locale へ寄せる */
export function resolveLocale(locale: string | undefined): Locale {
  return locale === 'en' ? 'en' : defaultLocale;
}

export function t(locale: string | undefined) {
  return ui[resolveLocale(locale)];
}

/** 末尾のスラッシュを落として比較しやすくする（"/" はそのまま） */
export function normalizePath(path: string): string {
  if (!path) return '/';
  if (path !== '/' && path.endsWith('/')) return path.slice(0, -1);
  return path;
}

/** ロケール接頭辞を除いた、言語に依存しないパスを返す（例: /en/about → /about） */
export function stripLocale(path: string): string {
  const normalized = normalizePath(path);
  if (normalized === '/en') return '/';
  if (normalized.startsWith('/en/')) return normalized.slice(3);
  return normalized;
}

/** 言語に依存しないパスに、指定ロケールの接頭辞を付ける（例: /about → /en/about） */
export function localizePath(locale: string | undefined, path: string): string {
  const base = stripLocale(path);
  if (resolveLocale(locale) === 'en') {
    return base === '/' ? '/en/' : `/en${base}`;
  }
  return base;
}

/** 現在のページに対応する、もう一方の言語のURL */
export function alternateUrl(locale: string | undefined, path: string): string {
  const other: Locale = resolveLocale(locale) === 'en' ? 'ja' : 'en';
  return localizePath(other, path);
}

/** お知らせ記事のスラッグをidから作る（"foo.md" → "foo"） */
export function newsSlug(id: string): string {
  return id.replace(/\.md$/, '');
}

/** ファイル名先頭の日付（YYYY-MM-DD）で新しい順に並べる比較関数 */
export function compareByDateInId(
  a: { id: string },
  b: { id: string }
): number {
  const ad = a.id.match(/(\d{4}-\d{2}-\d{2})/);
  const bd = b.id.match(/(\d{4}-\d{2}-\d{2})/);
  if (!ad && !bd) return 0;
  if (!ad) return 1;
  if (!bd) return -1;
  return ad[1] > bd[1] ? -1 : 1;
}
