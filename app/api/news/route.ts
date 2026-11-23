import { NextResponse } from "next/server";
import { getNews, isDesk, FEEDS, NEWS_REVALIDATE } from "@/lib/news";

/**
 * GET /api/news?desk=tech|world&source=BBC%20World&limit=30&images=1
 *
 * Public JSON endpoint for the Wire. Used by the live-refreshing sidebar on the
 * homepage, and handy for anything else that wants the same feed.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const deskParam = searchParams.get("desk");
  const source = searchParams.get("source") ?? undefined;
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 30));
  const withImage = searchParams.get("images") === "1";

  if (deskParam && !isDesk(deskParam)) {
    return NextResponse.json({ error: "desk must be 'tech' or 'world'" }, { status: 400 });
  }
  if (source && !FEEDS.some((f) => f.source === source)) {
    return NextResponse.json({ error: "unknown source", sources: FEEDS.map((f) => f.source) }, { status: 400 });
  }

  const desk = isDesk(deskParam) ? deskParam : undefined;
  const items = await getNews({ desk, source, limit, withImage });

  return NextResponse.json(
    { updatedAt: new Date().toISOString(), count: items.length, items },
    {
      headers: {
        "Cache-Control": `public, s-maxage=${NEWS_REVALIDATE}, stale-while-revalidate=${NEWS_REVALIDATE * 2}`,
      },
    }
  );
}
