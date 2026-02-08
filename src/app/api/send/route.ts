import { NextResponse } from "next/server";

export const runtime = "edge";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || "me@olivermorrow.ca";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL = 254;
const MAX_SUBJECT = 200;
const MAX_MESSAGE = 5000;

/* ── Simple in-memory rate limiter (5 req / 60s per IP) ───── */
const rateMap = new Map<string, { count: number; reset: number }>();
const RATE_WINDOW = 60_000;
const RATE_LIMIT = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + RATE_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

export async function POST(req: Request) {
  try {
    if (!RESEND_API_KEY) {
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
    }

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    const body = await req.json();
    const { email, subject, message } = body;

    if (!email || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields: email, subject, message" },
        { status: 400 },
      );
    }

    if (typeof email !== "string" || email.length > MAX_EMAIL || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }
    if (typeof subject !== "string" || subject.length > MAX_SUBJECT) {
      return NextResponse.json({ error: "Subject too long" }, { status: 400 });
    }
    if (typeof message !== "string" || message.length > MAX_MESSAGE) {
      return NextResponse.json({ error: "Message too long" }, { status: 400 });
    }

    // Sanitize subject — strip newlines to prevent header injection
    const safeSubject = subject.replace(/[\r\n]/g, "");

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Contact Form <noreply@olivermorrow.ca>",
        to: CONTACT_EMAIL,
        reply_to: email,
        subject: `[Portfolio] ${safeSubject}`,
        text: `From: ${email}\n\n${message}`,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      console.error("[/api/send] Resend error:", data);
      return NextResponse.json(
        { error: data.message || "Failed to send email" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[/api/send] Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
