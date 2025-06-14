import { NextResponse } from 'next/server';
import { sendSMS } from '@/lib/aligo';

export async function POST(req: Request) {
  try {
    const { phone, code } = await req.json();

    if (!phone || !code) {
      return NextResponse.json(
        { success: false, message: 'Invalid input' },
        { status: 400 }
      );
    }

    await sendSMS(phone, code);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('문자 전송 실패:', err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
