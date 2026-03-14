import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { message: 'Agent trigger endpoint — not yet implemented' },
    { status: 501 }
  );
}
