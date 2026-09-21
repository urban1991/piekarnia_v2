import { revalidateTag } from 'next/cache';
import { NextRequest } from 'next/server';
import { parseBody } from 'next-sanity/webhook';
import { SANITY_TAG } from '../../../sanity/client';

export const runtime = 'nodejs';

export async function POST(req: NextRequest): Promise<Response> {
  const secret = process.env.SANITY_WEBHOOK_SECRET;
  if (!secret) {
    return Response.json({ message: 'Brak SANITY_WEBHOOK_SECRET' }, { status: 500 });
  }

  const { isValidSignature } = await parseBody<{ _type?: string }>(req, secret, true);
  if (!isValidSignature) {
    return Response.json({ message: 'Nieprawidłowy podpis' }, { status: 401 });
  }

  revalidateTag(SANITY_TAG);
  return Response.json({ revalidated: true, tag: SANITY_TAG });
}
