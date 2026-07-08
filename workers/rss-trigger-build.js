// Cloudflare Workerスクリプト
// noteのRSSフィードを監視し、更新があればCloudflare Pagesのビルドをトリガーする

export default {
  // スケジュールされたイベントで実行（例：1時間ごと）
  async scheduled(event, env, ctx) {
    return await checkRSSAndTriggerBuild(env);
  },

  // HTTPリクエストでも手動実行できるようにする
  async fetch(request, env, ctx) {
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', {
        status: 405,
        headers: { Allow: 'POST' },
      });
    }

    if (!isAuthorized(request, env)) {
      return new Response('Unauthorized', { status: 401 });
    }

    return await checkRSSAndTriggerBuild(env)
      .then(() => new Response('Build triggered successfully', { status: 200 }))
      .catch((error) => {
        console.error('Manual build trigger failed:', error);
        return new Response('Internal Server Error', { status: 500 });
      });
  },
};

function isAuthorized(request, env) {
  const token = env.MANUAL_TRIGGER_TOKEN;
  if (!token) return false;

  const authorization = request.headers.get('Authorization');
  return authorization === `Bearer ${token}`;
}

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
      if (!deployHookUrl) {
        throw new Error('DEPLOY_HOOK_URL is not configured');
      }

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
