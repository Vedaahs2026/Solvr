import { NextResponse } from "next/server";
import { db, ensureDb } from "@/lib/db";

export async function GET() {
  try {
    await ensureDb();
    const result = await db.execute("SELECT * FROM customers");
    const customers = result.rows.map((row: any) => ({
      email: row.email,
      phone: row.phone,
      name: row.name,
      createdAt: row.createdAt,
      addresses: JSON.parse(row.addresses || "[]")
    }));
    return NextResponse.json(customers);
  } catch (error: any) {
    console.error("GET /api/customers error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await ensureDb();
    const c = await req.json();

    if (!c.email || !c.name || !c.phone) {
      return NextResponse.json({ error: "Missing required customer fields" }, { status: 400 });
    }

    // Upsert using INSERT OR REPLACE
    await db.execute({
      sql: `INSERT OR REPLACE INTO customers (email, phone, name, createdAt, addresses) VALUES (?, ?, ?, ?, ?)`,
      args: [
        c.email.trim().toLowerCase(), 
        c.phone.trim().replace(/\D/g, ""), 
        c.name.trim(), 
        c.createdAt || new Date().toISOString(), 
        JSON.stringify(c.addresses || [])
      ]
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("POST /api/customers error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
