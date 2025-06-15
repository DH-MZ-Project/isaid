import { NextResponse } from 'next/server';
import { verifyCode } from '@/lib/verifyStore';

export async function POST(req: Request) {
  const { phone, code } = await req.json();

  const success = verifyCode(phone, code);
  return NextResponse.json({ success });
}
