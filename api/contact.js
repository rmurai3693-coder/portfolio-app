import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, company, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: '必須項目を入力してください。' });
  }

  try {
    await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: 'imuraa.ryo@gmail.com',
      replyTo: email,
      subject: `[お問い合わせ] ${subject || 'その他'} - ${name}`,
      html: `
        <h2>ポートフォリオサイトからのお問い合わせ</h2>
        <table style="border-collapse:collapse;width:100%;max-width:600px;">
          <tr><td style="padding:8px 12px;border:1px solid #ddd;font-weight:bold;width:120px;">お名前</td><td style="padding:8px 12px;border:1px solid #ddd;">${name}</td></tr>
          <tr><td style="padding:8px 12px;border:1px solid #ddd;font-weight:bold;">メール</td><td style="padding:8px 12px;border:1px solid #ddd;">${email}</td></tr>
          <tr><td style="padding:8px 12px;border:1px solid #ddd;font-weight:bold;">会社名</td><td style="padding:8px 12px;border:1px solid #ddd;">${company || '未記入'}</td></tr>
          <tr><td style="padding:8px 12px;border:1px solid #ddd;font-weight:bold;">ご相談内容</td><td style="padding:8px 12px;border:1px solid #ddd;">${subject || '未選択'}</td></tr>
        </table>
        <h3 style="margin-top:20px;">詳細</h3>
        <p style="white-space:pre-wrap;background:#f5f5f5;padding:16px;border-radius:8px;">${message}</p>
      `,
    });

    return res.status(200).json({ message: 'ok' });
  } catch (error) {
    console.error('Email send error:', error);
    return res.status(500).json({ message: '送信に失敗しました。時間をおいて再度お試しください。' });
  }
}
