import { cookies } from "next/headers";
import { getDb, hasDb } from "@/lib/mongo";

// POST /api/views
// Counts a visit once per browser per day (using a cookie) and returns the total.
// The count lives in MongoDB, in the "stats" collection.

type Stat = { _id: string; count: number };

export async function POST() {
  if (!hasDb()) return Response.json({ count: null });

  const jar = await cookies();
  const seen = jar.has("sv_seen");

  try {
    const stats = (await getDb()).collection<Stat>("stats");
    let count: number;
    if (seen) {
      count = (await stats.findOne({ _id: "home" }))?.count ?? 0;
    } else {
      const doc = await stats.findOneAndUpdate(
        { _id: "home" },
        { $inc: { count: 1 } },
        { upsert: true, returnDocument: "after" },
      );
      count = doc?.count ?? 1;
      jar.set("sv_seen", "1", { maxAge: 60 * 60 * 24, httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production" });
    }
    return Response.json({ count }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("views: database error", err);
    return Response.json({ count: null });
  }
}
