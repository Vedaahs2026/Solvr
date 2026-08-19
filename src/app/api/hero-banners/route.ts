import { NextResponse } from "next/server";
import { db, ensureDb } from "@/lib/db";

export async function GET() {
  try {
    await ensureDb();
    const result = await db.execute("SELECT * FROM hero_banners");
    const banners = result.rows.map((row: any) => ({
      id: row.id,
      titleLine1: row.titleLine1,
      titleLine2: row.titleLine2,
      badgeText: row.badgeText,
      description: row.description,
      bullets: JSON.parse(row.bullets || "[]"),
      image: row.image,
      productLabel: row.productLabel,
      productSubLabel: row.productSubLabel,
      priceText: row.priceText,
      originalPriceText: row.originalPriceText,
      buttons: JSON.parse(row.buttons || "[]")
    }));
    return NextResponse.json(banners);
  } catch (error: any) {
    console.error("GET /api/hero-banners error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await ensureDb();
    const b = await req.json();

    if (!b.id || !b.titleLine1 || !b.image) {
      return NextResponse.json({ error: "Missing required banner fields" }, { status: 400 });
    }

    // Upsert using INSERT OR REPLACE
    await db.execute({
      sql: `INSERT OR REPLACE INTO hero_banners (id, titleLine1, titleLine2, badgeText, description, bullets, image, productLabel, productSubLabel, priceText, originalPriceText, buttons) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        b.id,
        b.titleLine1,
        b.titleLine2 || "",
        b.badgeText || "",
        b.description || "",
        JSON.stringify(b.bullets || []),
        b.image,
        b.productLabel || null,
        b.productSubLabel || null,
        b.priceText || null,
        b.originalPriceText || null,
        JSON.stringify(b.buttons || [])
      ]
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("POST /api/hero-banners error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await ensureDb();
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing banner ID" }, { status: 400 });
    }

    await db.execute({
      sql: "DELETE FROM hero_banners WHERE id = ?",
      args: [id]
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE /api/hero-banners error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
