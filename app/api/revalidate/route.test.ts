import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const { revalidateTag } = vi.hoisted(() => ({ revalidateTag: vi.fn() }));
vi.mock('next/cache', () => ({ revalidateTag }));

const { parseBody } = vi.hoisted(() => ({ parseBody: vi.fn() }));
vi.mock('next-sanity/webhook', () => ({ parseBody }));

vi.mock('../../../sanity/client', () => ({ SANITY_TAG: 'sanity' }));

import { POST } from './route';

const request = () =>
  new NextRequest(new Request('http://localhost/api/revalidate', { method: 'POST', body: '{}' }));

describe('POST /api/revalidate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.SANITY_WEBHOOK_SECRET = 'sekret';
  });

  it('returns 500 when the secret is not configured', async () => {
    delete process.env.SANITY_WEBHOOK_SECRET;
    const res = await POST(request());
    expect(res.status).toBe(500);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('returns 401 on invalid signature and does not revalidate', async () => {
    parseBody.mockResolvedValue({ isValidSignature: false, body: null });
    const res = await POST(request());
    expect(res.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('revalidates the sanity tag on a valid signature', async () => {
    parseBody.mockResolvedValue({ isValidSignature: true, body: { _type: 'product' } });
    const res = await POST(request());
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ revalidated: true, tag: 'sanity' });
    expect(revalidateTag).toHaveBeenCalledWith('sanity');
    expect(parseBody).toHaveBeenCalledWith(expect.anything(), 'sekret', true);
  });
});
