import Parser from 'rss-parser';

// RSSの記事の型定義
export interface NoteArticle {
  title: string;
  link: string;
  pubDate: string;
  content: string;
  contentSnippet: string;
  categories?: string[];
  thumbnail?: string;
}

// RSSフィードからデータを取得する関数
export async function getNoteArticles(rssUrl: string): Promise<NoteArticle[]> {
  try {
    const parser = new Parser({
      customFields: {
        item: [
          ['media:thumbnail', 'mediaThumbnail'],
          ['enclosure', 'enclosure'],
        ],
      },
    });

    const feed = await parser.parseURL(rssUrl);
    console.log('RSSフィード取得成功:', feed.title);

    return feed.items.map((item) => {
      // サムネイル取得の方法を修正
      let thumbnail = undefined;

      // media:thumbnailから取得を試みる
      if (item.mediaThumbnail && typeof item.mediaThumbnail === 'object') {
        thumbnail = item.mediaThumbnail.$
          ? item.mediaThumbnail.$.url
          : undefined;
      }

      // enclosureから取得を試みる
      if (!thumbnail && item.enclosure && item.enclosure.url) {
        thumbnail = item.enclosure.url;
      }

      // contentから画像URLを抽出する試み
      if (!thumbnail && item.content) {
        const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/i);
        if (imgMatch && imgMatch[1]) {
          thumbnail = imgMatch[1];
        }
      }

      return {
        title: item.title || '',
        link: item.link || '',
        pubDate: item.pubDate || '',
        content: item.content || '',
        contentSnippet: item.contentSnippet || '',
        categories: item.categories,
        thumbnail: thumbnail,
      };
    }) as NoteArticle[];
  } catch (error) {
    console.error('RSSフィードの取得に失敗しました:', error);
    return [];
  }
}

// 日付をフォーマットする関数
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}年${month}月${day}日`;
}
