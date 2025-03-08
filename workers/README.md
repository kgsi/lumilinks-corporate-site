# RSS監視自動ビルドトリガー

このCloudflare Workerは、noteのRSSフィードを定期的に監視し、更新があった場合にCloudflare Pagesのビルドを自動的にトリガーします。

## セットアップ手順

### 1. 必要なツールのインストール

```bash
npm install -g wrangler
```

### 2. Cloudflareにログイン

```bash
wrangler login
```

### 3. KVネームスペースの作成

```bash
wrangler kv:namespace create RSS_MONITOR
```

コマンド実行後、表示されたKVネームスペースIDを`wrangler.toml`の`YOUR_KV_NAMESPACE_ID`に置き換えてください。

### 4. Cloudflare Pagesのデプロイフックを作成

1. Cloudflareダッシュボード（https://dash.cloudflare.com/）にログインします
2. 「Workers & Pages」を選択します
3. 該当するPagesプロジェクトを選択します
4. 「設定」→「デプロイ」→「デプロイフック」を選択します
5. 「フックを作成」をクリックします
6. フックの名前（例：「RSS Update Trigger」）を入力します
7. 「保存」をクリックします
8. 生成されたデプロイフックURLをコピーします

コピーしたデプロイフックURLを`wrangler.toml`の`DEPLOY_HOOK_URL`に設定します：

```toml
[vars]
DEPLOY_HOOK_URL = "https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/YOUR_DEPLOY_HOOK_ID"
```

### 5. Workerのデプロイ

```bash
wrangler deploy
```

## 動作確認

Workerが正しくデプロイされたら、以下のコマンドで手動実行できます：

```bash
curl https://rss-trigger-build.{WORKER_SUBDOMAIN}.workers.dev
```

- `{WORKER_SUBDOMAIN}` はデプロイ後に表示される、あなたのWorkerのサブドメイン名です。通常はCloudflareアカウント名またはランダムな文字列になります。デプロイ後に表示されるURLを使用してください。-正常に動作すると、「Build triggered successfully」というメッセージが表示されます。

## 注意事項

- デフォルトでは毎週金曜日の午前9時にRSSフィードをチェックします。頻度を変更する場合は、`wrangler.toml`の`crons`設定を調整してください。
- Cloudflare Pagesのビルド回数には制限がある場合があります。必要に応じて監視頻度を調整してください。
