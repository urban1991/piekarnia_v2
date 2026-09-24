import { timingSafeEqual } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { NextRequest } from 'next/server';
import { DATE_DRIVEN_ROUTES } from '../../../../lib/site';

export const runtime = 'nodejs';

function authorized(header: string | null, secret: string): boolean {
  const expected = Buffer.from(`Bearer ${secret}`);
  const given = Buffer.from(header ?? '');
  return given.length === expected.length && timingSafeEqual(given, expected);
}

/**
 * Called by Vercel Cron every hour (vercel.json) to re-render the date-driven pages; see
 * DATE_DRIVEN_ROUTES in lib/site.ts for why their own `revalidate` is not enough.
 */
export async function GET(req: NextRequest): Promise<Response> {
  // Vercel sends "Authorization: Bearer <CRON_SECRET>" when the variable is set on the project
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    console.error('CRON_SECRET is not set');
    return Response.json({ message: 'Server misconfigured' }, { status: 500 });
  }
  if (!authorized(req.headers.get('authorization'), secret)) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  for (const path of DATE_DRIVEN_ROUTES) revalidatePath(path);
  return Response.json({ revalidated: DATE_DRIVEN_ROUTES });
}
