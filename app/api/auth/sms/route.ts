import { NextResponse } from 'next/server';
import { sendSMS } from '@/lib/solapi';
import { saveCode } from '@/lib/verifyStore';

export async function POST(req: Request) {
  const { phone } = await req.json();
  const code = Math.floor(100000 + Math.random() * 900).toString(); //3자리인증번호

  try {
    await sendSMS(phone, code);
    saveCode(phone, code);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
