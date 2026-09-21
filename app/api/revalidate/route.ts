import { revalidateTag } from 'next/cache';
import { NextRequest } from 'next/server';
import { parseBody } from 'next-sanity/webhook';
import { SANITY_TAG } from '../../../sanity/client';

export const runtime = 'nodejs';

export async function POST(req: NextRequest): Promise<Response> {
  const secret = process.env.SANITY_WEBHOOK_SECRET;
  if (!secret) {
    console.error('SANITY_WEBHOOK_SECRET is not set');
    return Response.json({ message: 'Server misconfigured' }, { status: 500 });
  }

  let isValidSignature: boolean | null;
  try {
    ({ isValidSignature } = await parseBody<{ _type?: string }>(req, secret, true));
  } catch {
    return Response.json({ message: 'Bad request' }, { status: 400 });
  }
  if (!isValidSignature) {
    return Response.json({ message: 'Nieprawidłowy podpis' }, { status: 401 });
  }

  revalidateTag(SANITY_TAG);
  return Response.json({ revalidated: true, tag: SANITY_TAG });
}
