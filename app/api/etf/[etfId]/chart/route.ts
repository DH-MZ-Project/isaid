import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { etfId: string } }
) {
  const etfId = params.etfId;
  const etfIdNum = Number(etfId);
  if (isNaN(etfIdNum)) {
    return NextResponse.json({ error: 'Invalid ETF ID' }, { status: 400 });
  }
  const range = req.nextUrl.searchParams.get('range');

  if (!range || !['1w', '1m', '3m', '1y', '3y'].includes(range)) {
    return NextResponse.json({ error: 'Invalid range' }, { status: 400 });
  }

  const now = new Date();
  const fromDate = new Date();
  switch (range) {
    case '1w':
      fromDate.setDate(now.getDate() - 7);
      break;
    case '1m':
      fromDate.setMonth(now.getMonth() - 1);
      break;
    case '3m':
      fromDate.setMonth(now.getMonth() - 3);
      break;
    case '1y':
      fromDate.setFullYear(now.getFullYear() - 1);
      break;
    case '3y':
      fromDate.setFullYear(now.getFullYear() - 3);
      break;
  }

  try {
    const data = await prisma.EtfDailyTrading.findMany({
      where: {
        etfId: etfIdNum,
        baseDate: { gte: fromDate },
      },
      orderBy: { baseDate: 'asc' },
      select: {
        baseDate: true,
        tddClosePrice: true,
      },
    });

    return NextResponse.json(
      data.map((d) => ({
        date: d.baseDate.toISOString().split('T')[0],
        closePrice: Number(d.tddClosePrice),
      }))
    );
  } catch (e) {
    console.error('DB error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
