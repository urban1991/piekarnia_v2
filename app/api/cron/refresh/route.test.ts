import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const { revalidatePath } = vi.hoisted(() => ({ revalidatePath: vi.fn() }));
vi.mock('next/cache', () => ({ revalidatePath }));

import { DATE_DRIVEN_ROUTES } from '../../../../lib/site';
import { GET } from './route';

const request = (authorization?: string) =>
  new NextRequest(
    new Request('http://localhost/api/cron/refresh', { headers: authorization ? { authorization } : {} }),
  );

describe('GET /api/cron/refresh', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.CRON_SECRET = 'cron-sekret';
  });

  it('returns 500 when CRON_SECRET is not configured, instead of running for anyone', async () => {
    delete process.env.CRON_SECRET;
    const res = await GET(request('Bearer undefined'));
    expect(res.status).toBe(500);
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it.each([undefined, 'Bearer zly-sekret', 'cron-sekret', 'Bearer cron-sekret-dluzszy'])(
    'rejects authorization %j',
    async (authorization) => {
      const res = await GET(request(authorization));
      expect(res.status).toBe(401);
      expect(revalidatePath).not.toHaveBeenCalled();
    },
  );

  it('re-renders every date-driven page when called by Vercel Cron', async () => {
    const res = await GET(request('Bearer cron-sekret'));
    expect(res.status).toBe(200);
    expect(revalidatePath.mock.calls.map(([path]) => path)).toEqual(DATE_DRIVEN_ROUTES);
  });
});

describe('cron schedule and coverage', () => {
  const root = join(__dirname, '..', '..', '..', '..');

  it('runs once a day at every hour, which the Hobby plan allows (one run per job per day)', () => {
    const { crons } = JSON.parse(readFileSync(join(root, 'vercel.json'), 'utf8')) as {
      crons: { path: string; schedule: string }[];
    };
    const hours = crons.map(({ path, schedule }) => {
      expect(path).toBe('/api/cron/refresh');
      const match = /^0 (\d{1,2}) \* \* \*$/.exec(schedule);
      expect(match, `"${schedule}" must run once a day at a whole hour`).not.toBeNull();
      return Number(match![1]);
    });
    // every UTC hour, so both 22:00 (Warsaw midnight in summer) and 23:00 (in winter) are there
    expect([...hours].sort((a, b) => a - b)).toEqual(Array.from({ length: 24 }, (_, h) => h));
  });

  it('refreshes every page that revalidates on a timer', () => {
    const siteDir = join(root, 'app', '(site)');
    const pages = [
      ['/', join(siteDir, 'page.tsx')],
      ...readdirSync(siteDir, { withFileTypes: true })
        .filter((d) => d.isDirectory() && existsSync(join(siteDir, d.name, 'page.tsx')))
        .map((d) => [`/${d.name}`, join(siteDir, d.name, 'page.tsx')]),
    ];
    const timed = pages.filter(([, file]) => /export const revalidate = \d+/.test(readFileSync(file, 'utf8'))).map(([route]) => route);
    expect([...DATE_DRIVEN_ROUTES].sort()).toEqual(timed.sort());
  });
});
