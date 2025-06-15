import crypto from 'crypto';

const API_KEY = process.env.SOLAPI_API_KEY!;
const API_SECRET = process.env.SOLAPI_API_SECRET!;
const SENDER = process.env.SOLAPI_SENDER!;

function generateAuthorization() {
  const date = new Date().toISOString().split('.')[0] + 'Z'; // 밀리초 제거
  const salt = crypto.randomBytes(16).toString('hex');
  const hmacData = date + salt;

  const signature = crypto
    .createHmac('sha256', API_SECRET)
    .update(hmacData)
    .digest('base64');

  const authorization = `HMAC-SHA256 apiKey=${API_KEY}, date=${date}, salt=${salt}, signature=${signature}`;

  // Debug logs for clarity and visibility
  console.log('[DEBUG] date:', date);
  console.log('[DEBUG] salt:', salt);
  console.log('[DEBUG] hmacData:', hmacData);
  console.log('[DEBUG] apiSecret:', API_SECRET);
  console.log('[DEBUG] signature:', signature);
  console.log('[DEBUG] authorization:', authorization);

  return { authorization };
}

export async function sendSMS(phone: string, code: string) {
  const { authorization } = generateAuthorization();

  const payload = {
    messages: [
      {
        to: phone,
        from: SENDER,
        text: `[인증번호] ${code} 를 입력해주세요.`,
      },
    ],
  };

  const response = await fetch('https://api.solapi.com/messages/v4/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authorization,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('❌ 문자 전송 실패:', error);
    throw new Error('Solapi 문자 전송 실패');
  }

  return await response.json();
}
