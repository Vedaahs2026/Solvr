import { NextResponse } from "next/server";
import { db, ensureDb } from "@/lib/db";

export async function GET() {
  try {
    await ensureDb();
    const result = await db.execute("SELECT * FROM products");
    const products = result.rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      price: Number(row.price),
      originalPrice: row.originalPrice ? Number(row.originalPrice) : undefined,
      image: row.image,
      images: JSON.parse(row.images || "[]"),
      stock: Number(row.stock),
      customAttributes: JSON.parse(row.customAttributes || "[]"),
      richSections: JSON.parse(row.richSections || "[]"),
      faqs: JSON.parse(row.faqs || "[]"),
      isFeatured: row.isFeatured === 1
    }));
    return NextResponse.json(products);
  } catch (error: any) {
    console.error("GET /api/products error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await ensureDb();
    const p = await req.json();

    if (!p.id || !p.name || p.price === undefined || p.stock === undefined) {
      return NextResponse.json({ error: "Missing required product fields" }, { status: 400 });
    }

    // Upsert using INSERT OR REPLACE
    await db.execute({
      sql: `INSERT OR REPLACE INTO products (id, name, description, price, originalPrice, image, images, stock, customAttributes, richSections, faqs, isFeatured) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        p.id, 
        p.name, 
        p.description || "", 
        Number(p.price), 
        p.originalPrice ? Number(p.originalPrice) : null, 
        p.image || "", 
        JSON.stringify(p.images || []), 
        Number(p.stock), 
        JSON.stringify(p.customAttributes || []), 
        JSON.stringify(p.richSections || []), 
        JSON.stringify(p.faqs || []), 
        p.isFeatured ? 1 : 0
      ]
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("POST /api/products error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await ensureDb();
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing product ID" }, { status: 400 });
    }

    await db.execute({
      sql: "DELETE FROM products WHERE id = ?",
      args: [id]
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE /api/products error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
