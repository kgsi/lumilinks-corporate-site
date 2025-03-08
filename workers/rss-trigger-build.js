// Cloudflare Workerスクリプト
// noteのRSSフィードを監視し、更新があればCloudflare Pagesのビルドをトリガーする

export default {
  // スケジュールされたイベントで実行（例：1時間ごと）
  async scheduled(event, env, ctx) {
    return await checkRSSAndTriggerBuild(env);
  },

  // HTTPリクエストでも手動実行できるようにする
  async fetch(request, env, ctx) {
    return await checkRSSAndTriggerBuild(env)
      .then(() => new Response('Build triggered successfully', { status: 200 }))
      .catch(
        (error) => new Response(`Error: ${error.message}`, { status: 500 })
      );
  },
};

async function checkRSSAndTriggerBuild(env) {
  try {
    // 前回のRSSフィードのデータを取得
    const kvKey = 'last_rss_data';
    const lastRSSData = await env.RSS_MONITOR.get(kvKey);

    // noteのRSSフィードを取得
    const rssUrl = 'https://note.com/kgsi/rss';
    const response = await fetch(rssUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.status}`);
    }

    const currentRSSData = await response.text();

    // 初回実行時またはRSSフィードが更新されている場合
    if (!lastRSSData || lastRSSData !== currentRSSData) {
      console.log('RSS feed has been updated. Triggering build...');

      // デプロイフックを使用してビルドをトリガー
      const deployHookUrl = env.DEPLOY_HOOK_URL;

      const deployResponse = await fetch(deployHookUrl, {
        method: 'POST',
      });

      if (!deployResponse.ok) {
        const errorText = await deployResponse.text();
        throw new Error(`Failed to trigger build: ${errorText}`);
      }

      // 最新のRSSデータをKVに保存
      await env.RSS_MONITOR.put(kvKey, currentRSSData);
      console.log('Build triggered successfully and RSS data updated');
    } else {
      console.log('No changes in RSS feed. Skipping build.');
    }
  } catch (error) {
    console.error('Error in RSS monitor:', error);
    throw error;
  }
}
