import { Resend } from 'resend';
import type { APIContext } from 'astro';

export async function POST({ request }: APIContext) {
  try {
    // リクエストボディからデータを取得
    const body = await request.json();
    const { name, email, subject, message } = body;

    // バリデーション
    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: '必須項目が入力されていません' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Resendの初期化（APIキーは環境変数から取得）
    const resend = new Resend(import.meta.env.RESEND_API_KEY);

    // 管理者向けメール送信
    const data = await resend.emails.send({
      from: 'お問い合わせフォーム <onboarding@resend.dev>', // 検証済みドメインに変更する必要があります
      to: import.meta.env.ADMIN_EMAIL, // 管理者のメールアドレス（環境変数に設定）
      subject: `【お問い合わせ】${subject}`,
      text: `
        名前: ${name}
        メールアドレス: ${email}
        件名: ${subject}
        
        メッセージ:
        ${message}
      `,
      // HTML形式のメールを送信したい場合は以下を追加
      html: `
        <h2>お問い合わせがありました</h2>
        <p><strong>名前:</strong> ${name}</p>
        <p><strong>メールアドレス:</strong> ${email}</p>
        <p><strong>件名:</strong> ${subject}</p>
        <p><strong>メッセージ:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    // 送信者向け自動返信メール
    await resend.emails.send({
      from: 'Lumilinks <onboarding@resend.dev>', // 検証済みドメインに変更する必要があります
      to: email,
      subject: '【自動返信】お問い合わせありがとうございます',
      text: `
        ${name} 様
        
        この度はお問い合わせいただき、誠にありがとうございます。
        以下の内容でお問い合わせを受け付けました。
        
        件名: ${subject}
        
        メッセージ:
        ${message}
        
        内容を確認の上、担当者より折り返しご連絡いたします。
        今しばらくお待ちくださいますようお願い申し上げます。
        
        ※このメールは自動送信されています。このメールに返信いただいても対応できない場合がございます。
        
        ------------------------------------
        Lumilinks inc.
        〒150-0043 
        東京都渋谷区道玄坂1丁目10番8号渋谷道玄坂東急ビル2F−C
        ------------------------------------
      `,
      // HTML形式のメールを送信したい場合は以下を追加
      html: `
        <p>${name} 様</p>
        <p>この度はお問い合わせいただき、誠にありがとうございます。<br>
        以下の内容でお問い合わせを受け付けました。</p>
        
        <p><strong>件名:</strong> ${subject}</p>
        
        <p><strong>メッセージ:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        
        <p>内容を確認の上、折り返しご連絡いたします。<br>
        今しばらくお待ちくださいますようお願い申し上げます。</p>
        
        <p><small>※このメールは自動送信されています。このメールに返信いただいても対応できない場合がございます。</small></p>
        
        <hr>
        <p>
          Lumilinks inc.<br>
          〒150-0043 <br>
          東京都渋谷区道玄坂1丁目10番8号渋谷道玄坂東急ビル2F−C
        </p>
      `,
    });

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(JSON.stringify({ error: 'メール送信に失敗しました' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
