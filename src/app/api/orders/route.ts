import { NextResponse } from "next/server";
import { db, ensureDb } from "@/lib/db";

export async function GET() {
  try {
    await ensureDb();
    const result = await db.execute("SELECT * FROM orders");
    const orders = result.rows.map((row: any) => ({
      id: row.id,
      customerPhone: row.customerPhone,
      customerName: row.customerName,
      customerEmail: row.customerEmail,
      date: row.date,
      status: row.status,
      items: JSON.parse(row.items || "[]"),
      totalPrice: Number(row.totalPrice),
      shippingAddress: JSON.parse(row.shippingAddress || "null")
    }));
    return NextResponse.json(orders);
  } catch (error: any) {
    console.error("GET /api/orders error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await ensureDb();
    const o = await req.json();

    if (!o.id || !o.customerPhone || !o.customerName || !o.items || o.totalPrice === undefined) {
      return NextResponse.json({ error: "Missing required order fields" }, { status: 400 });
    }

    // Insert order into SQLite
    await db.execute({
      sql: `INSERT INTO orders (id, customerPhone, customerName, customerEmail, date, status, items, totalPrice, shippingAddress) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        o.id, 
        o.customerPhone, 
        o.customerName, 
        o.customerEmail || null, 
        o.date || new Date().toISOString(), 
        o.status || "Pending", 
        JSON.stringify(o.items || []), 
        Number(o.totalPrice), 
        JSON.stringify(o.shippingAddress || null)
      ]
    });

    // Deduct stock for each purchased item
    for (const item of o.items) {
      if (item.productId && item.quantity) {
        await db.execute({
          sql: "UPDATE products SET stock = MAX(0, stock - ?) WHERE id = ?",
          args: [Number(item.quantity), item.productId]
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("POST /api/orders error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await ensureDb();
    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ error: "Missing order ID or status" }, { status: 400 });
    }

    await db.execute({
      sql: "UPDATE orders SET status = ? WHERE id = ?",
      args: [status, id]
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("PUT /api/orders error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
