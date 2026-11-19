import { z } from "zod";
import { getDb, hasDb } from "@/lib/mongo";
import { rateLimit, clientIp } from "@/lib/rate-limit";

// POST /api/contact
// Validates the message, saves it to MongoDB (collection "messages") and emails it to you through
// Resend. Either one is enough: set MONGODB_URI, RESEND_API_KEY + CONTACT_TO_EMAIL, or both.

const Body = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(80),
  email: z.string().trim().email("Please enter a valid email."),
  message: z.string().trim().min(10, "Please write at least 10 characters.").max(2000),
  website: z.string().max(0).optional(), // honeypot: real people never fill this hidden field
});

export async function POST(req: Request) {
  const limit = rateLimit(`contact:${clientIp(req)}`, 3, 10 * 60_000);
  if (!limit.ok) return Response.json({ error: "You've sent a few messages already. Please try again later." }, { status: 429 });

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    // A filled honeypot means a bot: pretend it worked.
    if (first?.path[0] === "website") return Response.json({ ok: true });
    return Response.json({ error: first?.message ?? "Invalid message." }, { status: 400 });
  }
  const { name, email, message } = parsed.data;

  const canEmail = Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL);
  if (!hasDb() && !canEmail) {
    return Response.json(
      { error: "The contact form isn't connected yet. Please email 19410121143.k.shivamsingh@gmail.com directly." },
      { status: 503 },
    );
  }

  let saved = false;
  let emailed = false;

  if (hasDb()) {
    try {
      const db = await getDb();
      await db.collection("messages").insertOne({
        name,
        email,
        message,
        createdAt: new Date(),
        userAgent: req.headers.get("user-agent")?.slice(0, 200) ?? null,
      });
      saved = true;
    } catch (err) {
      console.error("contact: could not save to MongoDB", err);
    }
  }

  if (canEmail) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>",
          to: [process.env.CONTACT_TO_EMAIL],
          reply_to: email,
          subject: `Portfolio message from ${name}`,
          text: `${message}\n\n— ${name} <${email}>`,
        }),
      });
      emailed = res.ok;
      if (!res.ok) console.error("contact: Resend error", res.status, await res.text());
    } catch (err) {
      console.error("contact: could not send email", err);
    }
  }

  if (!saved && !emailed) {
    return Response.json(
      { error: "Something went wrong sending your message. Please email 19410121143.k.shivamsingh@gmail.com directly." },
      { status: 502 },
    );
  }
  return Response.json({ ok: true });
}
