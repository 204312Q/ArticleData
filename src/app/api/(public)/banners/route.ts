import type { NextRequest } from 'next/server';

import { assertRequestGuards } from '@/lib/guard/assert';
import { BCRequestError, listCPNRBannerLines, type CPNRBannerLineRecord } from '@/lib/bcClient';

export const runtime = 'nodejs';

interface BannerImage {
  id: number | null;
  sequence: number | null;
  desktopImageUrl: string | null;
  mobileImageUrl: string | null;
  targetUrl: string | null;
  targetLabel: string | null;
  openInNewTab: boolean | null;
  blocked: boolean | null;
}

interface BannerGroup {
  bannerNo: number | null;
  bannerName: string | null;
  images: BannerImage[];
}

function normalizeString(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function normalizeBoolean(value: unknown): boolean | null {
  return typeof value === 'boolean' ? value : null;
}

function toBannerImage(line: CPNRBannerLineRecord): BannerImage {
  return {
    id: normalizeNumber(line.id),
    sequence: normalizeNumber(line.sequence),
    desktopImageUrl: normalizeString(line.desktopImageUrl),
    mobileImageUrl: normalizeString(line.mobileImageUrl),
    targetUrl: normalizeString(line.targetUrl),
    targetLabel: normalizeString(line.targetLabel),
    openInNewTab: normalizeBoolean(line.openInNewTab),
    blocked: normalizeBoolean(line.blocked),
  };
}

function groupBannerLines(lines: CPNRBannerLineRecord[]): BannerGroup[] {
  const groups = new Map<string, BannerGroup>();

  for (const line of lines) {
    const bannerNo = normalizeNumber(line.bannerNo);
    const bannerName = normalizeString(line.bannerName);
    const key = bannerNo === null ? `name:${bannerName ?? ''}` : `no:${bannerNo}`;

    let group = groups.get(key);
    if (!group) {
      group = {
        bannerNo,
        bannerName,
        images: [],
      };
      groups.set(key, group);
    }

    group.images.push(toBannerImage(line));
  }

  return [...groups.values()]
    .map((group) => ({
      ...group,
      images: group.images.sort(
        (a, b) =>
          (a.sequence ?? Number.MAX_SAFE_INTEGER) - (b.sequence ?? Number.MAX_SAFE_INTEGER) ||
          (a.id ?? Number.MAX_SAFE_INTEGER) - (b.id ?? Number.MAX_SAFE_INTEGER)
      ),
    }))
    .sort(
      (a, b) =>
        (a.bannerNo ?? Number.MAX_SAFE_INTEGER) - (b.bannerNo ?? Number.MAX_SAFE_INTEGER) ||
        (a.bannerName ?? '').localeCompare(b.bannerName ?? '')
    );
}

export async function GET(request: NextRequest): Promise<Response> {
  const guardResponse = await assertRequestGuards(request);
  if (guardResponse) return guardResponse;

  try {
    const url = new URL(request.url);
    const topRaw = url.searchParams.get('top');
    const top = topRaw ? Number.parseInt(topRaw, 10) : 200;
    const safeTop = Number.isFinite(top) && top > 0 ? Math.min(top, 1000) : 200;

    const bannerNoRaw = url.searchParams.get('bannerNo');
    let bannerNo: number | undefined;
    if (bannerNoRaw) {
      const parsedBannerNo = Number.parseInt(bannerNoRaw, 10);
      if (!Number.isInteger(parsedBannerNo) || parsedBannerNo <= 0) {
        return Response.json({ error: 'bannerNo must be a positive integer' }, { status: 400 });
      }
      bannerNo = parsedBannerNo;
    }

    const lines = await listCPNRBannerLines(safeTop, bannerNo);
    const activeLines = lines.filter((line) => line.blocked !== true);
    const sortedLines = [...activeLines].sort(
      (a, b) =>
        (normalizeNumber(a.bannerNo) ?? Number.MAX_SAFE_INTEGER) -
          (normalizeNumber(b.bannerNo) ?? Number.MAX_SAFE_INTEGER) ||
        (normalizeNumber(a.sequence) ?? Number.MAX_SAFE_INTEGER) -
          (normalizeNumber(b.sequence) ?? Number.MAX_SAFE_INTEGER) ||
        (normalizeNumber(a.id) ?? Number.MAX_SAFE_INTEGER) -
          (normalizeNumber(b.id) ?? Number.MAX_SAFE_INTEGER)
    );

    return Response.json({
      success: true,
      count: sortedLines.length,
      banners: groupBannerLines(sortedLines),
      items: sortedLines.map((line) => ({
        id: normalizeNumber(line.id),
        bannerNo: normalizeNumber(line.bannerNo),
        bannerName: normalizeString(line.bannerName),
        sequence: normalizeNumber(line.sequence),
        desktopImageUrl: normalizeString(line.desktopImageUrl),
        mobileImageUrl: normalizeString(line.mobileImageUrl),
        targetUrl: normalizeString(line.targetUrl),
        targetLabel: normalizeString(line.targetLabel),
        openInNewTab: normalizeBoolean(line.openInNewTab),
        blocked: normalizeBoolean(line.blocked),
      })),
    });
  } catch (error) {
    if (error instanceof BCRequestError) {
      return Response.json(
        {
          error: 'BC request failed',
          status: error.status,
          details: error.body,
        },
        { status: error.status }
      );
    }

    const message = error instanceof Error ? error.message : 'Failed to load CPNR banners';
    return Response.json({ error: message }, { status: 500 });
  }
}