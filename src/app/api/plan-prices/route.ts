import { NextResponse } from "next/server";
import { getPlanPrices } from "@/lib/data";

// Public endpoint — pricing is shown on the landing page to logged-out visitors,
// so there's nothing sensitive here. Client components poll this instead of the
// hardcoded constant so admin price changes show up without a redeploy.
export async function GET() {
  const prices = await getPlanPrices();
  return NextResponse.json({ prices }, { headers: { "Cache-Control": "no-store" } });
}
