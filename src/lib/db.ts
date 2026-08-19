import { createClient } from "@libsql/client";
import { 
  DEFAULT_PRODUCTS, 
  DEFAULT_CUSTOMERS, 
  DEFAULT_ORDERS, 
  DEFAULT_HERO_BANNERS, 
  DEFAULT_BLOGS 
} from "./defaultData";

export const db = createClient({
  url: "file:local.db"
});

let isInitialized = false;
let initPromise: Promise<void> | null = null;

export async function ensureDb() {
  if (isInitialized) return;

  // Prevent concurrent initializations by caching the promise
  if (!initPromise) {
    initPromise = (async () => {
      // Create tables if they do not exist
      await db.execute(`
        CREATE TABLE IF NOT EXISTS products (
          id TEXT PRIMARY KEY,
          name TEXT,
          description TEXT,
          price REAL,
          originalPrice REAL,
          image TEXT,
          images TEXT,
          stock INTEGER,
          customAttributes TEXT,
          richSections TEXT,
          faqs TEXT,
          isFeatured INTEGER
        )
      `);

      await db.execute(`
        CREATE TABLE IF NOT EXISTS customers (
          email TEXT PRIMARY KEY,
          phone TEXT,
          name TEXT,
          createdAt TEXT,
          addresses TEXT
        )
      `);

      await db.execute(`
        CREATE TABLE IF NOT EXISTS orders (
          id TEXT PRIMARY KEY,
          customerPhone TEXT,
          customerName TEXT,
          customerEmail TEXT,
          date TEXT,
          status TEXT,
          items TEXT,
          totalPrice REAL,
          shippingAddress TEXT
        )
      `);

      await db.execute(`
        CREATE TABLE IF NOT EXISTS hero_banners (
          id TEXT PRIMARY KEY,
          titleLine1 TEXT,
          titleLine2 TEXT,
          badgeText TEXT,
          description TEXT,
          bullets TEXT,
          image TEXT,
          productLabel TEXT,
          productSubLabel TEXT,
          priceText TEXT,
          originalPriceText TEXT,
          buttons TEXT
        )
      `);

      await db.execute(`
        CREATE TABLE IF NOT EXISTS blogs (
          id TEXT PRIMARY KEY,
          title TEXT,
          category TEXT,
          tagline TEXT,
          readTime TEXT,
          body TEXT,
          createdAt TEXT
        )
      `);

      // Seed default data if tables are empty, using OR IGNORE to prevent unique key violations
      const prodCheck = await db.execute("SELECT count(*) as count FROM products");
      if (prodCheck.rows[0] && Number(prodCheck.rows[0].count) === 0) {
        for (const p of DEFAULT_PRODUCTS) {
          await db.execute({
            sql: `INSERT OR IGNORE INTO products (id, name, description, price, originalPrice, image, images, stock, customAttributes, richSections, faqs, isFeatured) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [
              p.id, 
              p.name, 
              p.description, 
              p.price, 
              p.originalPrice || null, 
              p.image, 
              JSON.stringify([]), 
              p.stock, 
              JSON.stringify(p.customAttributes || []), 
              JSON.stringify(p.richSections || []), 
              JSON.stringify([]), 
              p.isFeatured ? 1 : 0
            ]
          });
        }
      }

      const custCheck = await db.execute("SELECT count(*) as count FROM customers");
      if (custCheck.rows[0] && Number(custCheck.rows[0].count) === 0) {
        for (const c of DEFAULT_CUSTOMERS) {
          await db.execute({
            sql: `INSERT OR IGNORE INTO customers (email, phone, name, createdAt, addresses) VALUES (?, ?, ?, ?, ?)`,
            args: [c.email, c.phone, c.name, c.createdAt, JSON.stringify(c.addresses || [])]
          });
        }
      }

      const orderCheck = await db.execute("SELECT count(*) as count FROM orders");
      if (orderCheck.rows[0] && Number(orderCheck.rows[0].count) === 0) {
        for (const o of DEFAULT_ORDERS) {
          await db.execute({
            sql: `INSERT OR IGNORE INTO orders (id, customerPhone, customerName, customerEmail, date, status, items, totalPrice, shippingAddress) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [
              o.id, 
              o.customerPhone, 
              o.customerName, 
              o.customerEmail || null, 
              o.date, 
              o.status, 
              JSON.stringify(o.items || []), 
              o.totalPrice, 
              JSON.stringify(o.shippingAddress || null)
            ]
          });
        }
      }

      const bannerCheck = await db.execute("SELECT count(*) as count FROM hero_banners");
      if (bannerCheck.rows[0] && Number(bannerCheck.rows[0].count) === 0) {
        for (const b of DEFAULT_HERO_BANNERS) {
          await db.execute({
            sql: `INSERT OR IGNORE INTO hero_banners (id, titleLine1, titleLine2, badgeText, description, bullets, image, productLabel, productSubLabel, priceText, originalPriceText, buttons) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [
              b.id,
              b.titleLine1,
              b.titleLine2,
              b.badgeText,
              b.description,
              JSON.stringify(b.bullets || []),
              b.image,
              b.productLabel || null,
              b.productSubLabel || null,
              b.priceText || null,
              b.originalPriceText || null,
              JSON.stringify(b.buttons || [])
            ]
          });
        }
      }

      const blogCheck = await db.execute("SELECT count(*) as count FROM blogs");
      if (blogCheck.rows[0] && Number(blogCheck.rows[0].count) === 0) {
        for (const bl of DEFAULT_BLOGS) {
          await db.execute({
            sql: `INSERT OR IGNORE INTO blogs (id, title, category, tagline, readTime, body, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            args: [bl.id, bl.title, bl.category, bl.tagline, bl.readTime, JSON.stringify(bl.body || []), bl.createdAt]
          });
        }
      }

      isInitialized = true;
    })();
  }

  return initPromise;
}
