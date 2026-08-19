import { NextResponse } from "next/server";
import { db, ensureDb } from "@/lib/db";

export async function GET() {
  try {
    await ensureDb();
    const result = await db.execute("SELECT * FROM blogs");
    const blogs = result.rows.map((row: any) => ({
      id: row.id,
      title: row.title,
      category: row.category,
      tagline: row.tagline,
      readTime: row.readTime,
      body: JSON.parse(row.body || "[]"),
      createdAt: row.createdAt
    }));
    return NextResponse.json(blogs);
  } catch (error: any) {
    console.error("GET /api/blogs error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await ensureDb();
    const bl = await req.json();

    if (!bl.id || !bl.title || !bl.body) {
      return NextResponse.json({ error: "Missing required blog fields" }, { status: 400 });
    }

    // Upsert using INSERT OR REPLACE
    await db.execute({
      sql: `INSERT OR REPLACE INTO blogs (id, title, category, tagline, readTime, body, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [
        bl.id,
        bl.title,
        bl.category || "General",
        bl.tagline || "",
        bl.readTime || "5 min read",
        JSON.stringify(bl.body || []),
        bl.createdAt || new Date().toISOString()
      ]
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("POST /api/blogs error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await ensureDb();
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing blog ID" }, { status: 400 });
    }

    await db.execute({
      sql: "DELETE FROM blogs WHERE id = ?",
      args: [id]
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE /api/blogs error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
