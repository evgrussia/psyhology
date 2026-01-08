import { NextResponse } from 'next/server';

/**
 * Healthcheck endpoint для админ-панели
 * GET /api/health
 */
export async function GET() {
  return NextResponse.json({
    ok: true,
    service: 'admin',
    timestamp: new Date().toISOString(),
  });
}
