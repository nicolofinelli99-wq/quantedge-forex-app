import { NextResponse } from "next/server";
import { getPlanPrices } from "@/lib/data";

// Public endpoint — pricing is shown on the landing page to logged-out visitors,
// so there's nothing sensitive here. Client components poll this instead of the
// hardcoded constant so admin price changes show up without a redeploy.
//
// IMPORTANT: without `dynamic = "force-dynamic"`, Next.js treats this as a static
// route with no dynamic data sources and freezes its response at build time —
// admin price edits would silently never show up here. Forcing it dynamic makes
// every request hit the database.
export const dynamic = "force-dynamic";

export async function GET() {
  const prices = await getPlanPrices();
  return NextResponse.json({ prices }, { headers: { "Cache-Control": "no-store" } });
}
