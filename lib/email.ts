import nodemailer from "nodemailer";

/* ─────────────────────────────────────────────────
   Gmail SMTP Email System
   
   Setup required:
   1. Go to your Google Account → Security → App Passwords
   2. Generate an App Password for "Mail"
   3. Add to .env.local:
      GMAIL_USER=butanisneh25@gmail.com
      GMAIL_APP_PASSWORD=your_16_char_app_password
      STORE_EMAIL=butanisneh25@gmail.com
   ───────────────────────────────────────────────── */

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER || "butanisneh25@gmail.com",
    pass: process.env.GMAIL_APP_PASSWORD || "",
  },
});

const STORE_EMAIL = process.env.STORE_EMAIL || "butanisneh25@gmail.com";
const STORE_NAME = "AUREVIA SKIN";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

/* ─── Shared Email Shell ─── */
function emailShell(content: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${STORE_NAME}</title>
</head>
<body style="margin:0;padding:0;font-family:'Georgia',serif;background:#FBF8F4;">
  <div style="max-width:600px;margin:0 auto;background:#FFFFFF;">
    <!-- Header -->
    <div style="background:#342A24;padding:32px 40px;text-align:center;">
      <p style="margin:0 0 4px;font-family:'Georgia',serif;font-size:11px;letter-spacing:0.4em;text-transform:uppercase;color:#C7A064;">AUREVIA SKIN</p>
      <p style="margin:0;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(234,217,195,0.4);">Luxury Skincare</p>
    </div>
    <!-- Content -->
    <div style="padding:40px;">
      ${content}
    </div>
    <!-- Footer -->
    <div style="background:#F6EEE4;padding:24px 40px;text-align:center;border-top:1px solid #EAD9C3;">
      <p style="margin:0 0 8px;font-size:11px;color:#493E36;letter-spacing:0.1em;">Need help? <a href="mailto:${STORE_EMAIL}" style="color:#C7A064;">Contact Us</a></p>
      <p style="margin:0;font-size:10px;color:#493E36;opacity:0.5;">&copy; ${new Date().getFullYear()} ${STORE_NAME}. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
}

/* ─── Helper: send safely (won't crash if misconfigured) ─── */
async function sendMail(to: string, subject: string, html: string): Promise<boolean> {
  try {
    if (!process.env.GMAIL_APP_PASSWORD) {
      console.warn("[Email] GMAIL_APP_PASSWORD not set — skipping email send. Add it to .env.local to enable emails.");
      return false;
    }
    await transporter.sendMail({ from: `"${STORE_NAME}" <${STORE_EMAIL}>`, to, subject, html });
    return true;
  } catch (err) {
    console.error("[Email] Failed to send:", err);
    return false;
  }
}

/* ─────────────────────────────────────────────
   EMAIL TEMPLATES
   ───────────────────────────────────────────── */

/* Order Confirmation */
export async function sendOrderConfirmation(order: {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: { name: string; qty: number; price: number }[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  shippingAddress: string;
}) {
  const itemRows = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #EAD9C3;font-size:13px;color:#342A24;">${item.name}</td>
        <td style="padding:10px 0;border-bottom:1px solid #EAD9C3;font-size:13px;color:#342A24;text-align:center;">×${item.qty}</td>
        <td style="padding:10px 0;border-bottom:1px solid #EAD9C3;font-size:13px;color:#342A24;text-align:right;">$${(item.price * item.qty).toFixed(2)}</td>
      </tr>`
    )
    .join("");

  const html = emailShell(`
    <h1 style="margin:0 0 8px;font-size:24px;color:#342A24;font-weight:normal;">Order Confirmed</h1>
    <p style="margin:0 0 24px;font-size:13px;color:#493E36;opacity:0.7;">Thank you, ${order.customerName}. We've received your order.</p>
    
    <div style="background:#F6EEE4;border-radius:12px;padding:20px;margin-bottom:24px;">
      <p style="margin:0;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#493E36;opacity:0.5;">Order Number</p>
      <p style="margin:4px 0 0;font-size:22px;color:#342A24;">${order.orderNumber}</p>
    </div>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      ${itemRows}
      <tr>
        <td colspan="2" style="padding:10px 0;font-size:12px;color:#493E36;opacity:0.6;">Subtotal</td>
        <td style="padding:10px 0;font-size:12px;color:#342A24;text-align:right;">$${order.subtotal.toFixed(2)}</td>
      </tr>
      ${order.discount > 0 ? `<tr><td colspan="2" style="padding:4px 0;font-size:12px;color:#16a34a;">Discount</td><td style="padding:4px 0;font-size:12px;color:#16a34a;text-align:right;">-$${order.discount.toFixed(2)}</td></tr>` : ""}
      <tr>
        <td colspan="2" style="padding:4px 0;font-size:12px;color:#493E36;opacity:0.6;">Shipping</td>
        <td style="padding:4px 0;font-size:12px;color:#342A24;text-align:right;">${order.shipping === 0 ? "FREE" : `$${order.shipping.toFixed(2)}`}</td>
      </tr>
      <tr>
        <td colspan="2" style="padding:12px 0 0;font-size:15px;color:#342A24;font-weight:bold;border-top:1px solid #EAD9C3;">Total</td>
        <td style="padding:12px 0 0;font-size:18px;color:#342A24;text-align:right;border-top:1px solid #EAD9C3;">$${order.total.toFixed(2)}</td>
      </tr>
    </table>

    <div style="margin-bottom:24px;">
      <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#493E36;opacity:0.5;">Shipping To</p>
      <p style="margin:0;font-size:13px;color:#342A24;">${order.shippingAddress}</p>
    </div>

    <a href="${BASE_URL}/account/orders" style="display:inline-block;background:#342A24;color:#FFFFFF;text-decoration:none;padding:14px 32px;border-radius:100px;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;">
      Track Your Order
    </a>
  `);

  await sendMail(order.customerEmail, `Order Confirmed — ${order.orderNumber} | ${STORE_NAME}`, html);
  // Also send admin notification
  await sendMail(STORE_EMAIL, `🛍 New Order — ${order.orderNumber} from ${order.customerName}`, html);
}

/* Order Status Update */
export async function sendOrderStatusUpdate(data: {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  status: string;
  trackingNumber?: string;
}) {
  const statusMessages: Record<string, { title: string; body: string }> = {
    confirmed: { title: "Order Confirmed", body: "We've confirmed your order and it's being prepared." },
    processing: { title: "Order Processing", body: "Your order is being carefully packed by our team." },
    packed: { title: "Order Packed", body: "Your order has been packed and is ready for pickup." },
    shipped: { title: "Order Shipped! 🚚", body: "Your order is on its way to you." },
    delivered: { title: "Order Delivered! ✨", body: "Your AUREVIA SKIN order has been delivered. We hope you love it!" },
    cancelled: { title: "Order Cancelled", body: "Your order has been cancelled. Any payment will be refunded within 5–7 business days." },
  };

  const msg = statusMessages[data.status] || { title: `Order Update: ${data.status}`, body: "Your order status has been updated." };

  const html = emailShell(`
    <h1 style="margin:0 0 8px;font-size:24px;color:#342A24;font-weight:normal;">${msg.title}</h1>
    <p style="margin:0 0 24px;font-size:13px;color:#493E36;opacity:0.7;">Hi ${data.customerName}, ${msg.body}</p>

    <div style="background:#F6EEE4;border-radius:12px;padding:20px;margin-bottom:24px;">
      <p style="margin:0;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#493E36;opacity:0.5;">Order Number</p>
      <p style="margin:4px 0 16px;font-size:20px;color:#342A24;">${data.orderNumber}</p>
      ${
        data.trackingNumber
          ? `<p style="margin:0;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#493E36;opacity:0.5;">Tracking Number</p>
             <p style="margin:4px 0 0;font-size:14px;color:#C7A064;font-family:monospace;">${data.trackingNumber}</p>`
          : ""
      }
    </div>

    <a href="${BASE_URL}/account/orders" style="display:inline-block;background:#342A24;color:#FFFFFF;text-decoration:none;padding:14px 32px;border-radius:100px;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;">
      View Order Details
    </a>
  `);

  await sendMail(data.customerEmail, `${msg.title} — ${data.orderNumber} | ${STORE_NAME}`, html);
}

/* Welcome / Registration */
export async function sendWelcomeEmail(name: string, email: string) {
  const html = emailShell(`
    <h1 style="margin:0 0 8px;font-size:28px;color:#342A24;font-weight:normal;">Welcome to AUREVIA SKIN</h1>
    <p style="margin:0 0 24px;font-size:13px;color:#493E36;opacity:0.7;">
      Hello ${name}, your account has been created. Begin your journey to naturally radiant skin.
    </p>
    <a href="${BASE_URL}/shop" style="display:inline-block;background:#342A24;color:#FFFFFF;text-decoration:none;padding:14px 32px;border-radius:100px;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;margin-bottom:24px;">
      Shop Now
    </a>
    <p style="margin:24px 0 0;font-size:12px;color:#493E36;opacity:0.5;border-top:1px solid #EAD9C3;padding-top:16px;">
      As a welcome gift, use code <strong style="color:#C7A064;">WELCOME10</strong> for 10% off your first order.
    </p>
  `);
  await sendMail(email, `Welcome to ${STORE_NAME}`, html);
}

/* Password Reset */
export async function sendPasswordReset(email: string, resetLink: string) {
  const html = emailShell(`
    <h1 style="margin:0 0 8px;font-size:24px;color:#342A24;font-weight:normal;">Reset Your Password</h1>
    <p style="margin:0 0 24px;font-size:13px;color:#493E36;opacity:0.7;">
      Click the button below to reset your password. This link expires in 1 hour.
    </p>
    <a href="${resetLink}" style="display:inline-block;background:#342A24;color:#FFFFFF;text-decoration:none;padding:14px 32px;border-radius:100px;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;margin-bottom:24px;">
      Reset Password
    </a>
    <p style="margin:16px 0 0;font-size:12px;color:#493E36;opacity:0.5;">
      If you didn't request this, please ignore this email. Your password will not change.
    </p>
  `);
  await sendMail(email, `Reset Your Password — ${STORE_NAME}`, html);
}

/* Contact Form Acknowledgement */
export async function sendContactAck(name: string, email: string, message: string) {
  const html = emailShell(`
    <h1 style="margin:0 0 8px;font-size:24px;color:#342A24;font-weight:normal;">We've received your message</h1>
    <p style="margin:0 0 16px;font-size:13px;color:#493E36;opacity:0.7;">
      Thank you, ${name}. Our team will get back to you within 24–48 hours.
    </p>
    <div style="background:#F6EEE4;border-radius:12px;padding:20px;margin-bottom:24px;">
      <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#493E36;opacity:0.5;">Your Message</p>
      <p style="margin:0;font-size:13px;color:#342A24;line-height:1.6;">${message}</p>
    </div>
  `);
  await sendMail(email, `We received your message — ${STORE_NAME}`, html);
  // Admin notification
  await sendMail(
    STORE_EMAIL,
    `📬 New Contact Message from ${name}`,
    emailShell(`
      <h2 style="margin:0 0 8px;font-size:20px;color:#342A24;">New Contact Form Submission</h2>
      <p><strong>From:</strong> ${name} (${email})</p>
      <p><strong>Message:</strong><br>${message}</p>
    `)
  );
}

/* Newsletter Subscription */
export async function sendNewsletterWelcome(email: string) {
  const html = emailShell(`
    <h1 style="margin:0 0 8px;font-size:24px;color:#342A24;font-weight:normal;">You're on the list ✨</h1>
    <p style="margin:0 0 24px;font-size:13px;color:#493E36;opacity:0.7;">
      Welcome to the AUREVIA inner circle. Expect skincare insight, new launches, and exclusive offers delivered to your inbox.
    </p>
    <p style="margin:0;font-size:12px;color:#493E36;opacity:0.5;">
      Use code <strong style="color:#C7A064;">GLOW15</strong> for 15% off your next order as a thank you.
    </p>
  `);
  await sendMail(email, `Welcome to the AUREVIA inner circle`, html);
}
