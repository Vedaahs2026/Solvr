import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const order = await request.json();

    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const adminEmail = process.env.ADMIN_EMAIL || smtpUser;

    if (!smtpUser || !smtpPass) {
      console.error("Missing SMTP configuration in environment variables");
      return NextResponse.json({ error: "SMTP configuration not configured" }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });

    const itemsText = order.items
      ?.map((item: any) => `- ${item.name} (x${item.quantity}) - ₹${item.price.toLocaleString()}`)
      .join("\n") || "No items";

    const mailOptions = {
      from: `"SOLVR Store" <${smtpUser}>`,
      to: adminEmail,
      subject: `[SOLVR] New Order Received - ${order.id}`,
      text: `Hello Admin,

You have received a new order!

Order Details:
------------------------------------------
Order ID: ${order.id}
Customer Name: ${order.customerName}
Customer Phone: ${order.customerPhone}
Total Amount: ₹${order.totalPrice?.toLocaleString()}
Date: ${new Date(order.date).toLocaleString()}

Items Ordered:
${itemsText}

------------------------------------------
Please login to the Admin Panel to view full order details and update the order status.

Best regards,
SOLVR System
`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h2 style="color: #064e3b; border-bottom: 2px solid #064e3b; padding-bottom: 10px;">New Order Alert!</h2>
          <p>Hello Admin,</p>
          <p>You have received a new order on <strong>SOLVR</strong>.</p>
          
          <div style="background-color: #f5ebe0; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Order ID:</strong> ${order.id}</p>
            <p style="margin: 5px 0;"><strong>Customer:</strong> ${order.customerName} (${order.customerPhone})</p>
            <p style="margin: 5px 0;"><strong>Total Amount:</strong> ₹${order.totalPrice?.toLocaleString()}</p>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date(order.date).toLocaleString()}</p>
          </div>

          <h3 style="color: #064e3b;">Items Ordered:</h3>
          <ul style="padding-left: 20px;">
            ${order.items
              ?.map(
                (item: any) =>
                  `<li style="margin-bottom: 8px;">${item.name} <strong>(x${item.quantity})</strong> - ₹${item.price.toLocaleString()}</li>`
              )
              .join("") || "<li>No items</li>"}
          </ul>

          <div style="margin-top: 30px; text-align: center;">
            <a href="http://localhost:3000/admin" style="background-color: #064e3b; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Login to Admin Panel to View Full Order
            </a>
          </div>
          
          <p style="margin-top: 30px; font-size: 0.85em; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 15px;">
            This is an automated notification from the SOLVR platform.
          </p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully: ", info.messageId);

    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error: any) {
    console.error("Error sending order email:", error);
    return NextResponse.json({ error: "Failed to send email", details: error.message }, { status: 500 });
  }
}
