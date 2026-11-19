"use client";

import { useState } from "react";

type State = { kind: "idle" | "sending" | "sent" | "error"; text?: string };

export default function ContactForm() {
  const [state, setState] = useState<State>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    setState({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? "Couldn't send your message.");
      form.reset();
      setState({ kind: "sent", text: "Message sent. I'll reply by email, usually within a day." });
    } catch (err) {
      setState({ kind: "error", text: err instanceof Error ? err.message : "Couldn't send your message." });
    }
  }

  return (
    <form className="panel form" onSubmit={onSubmit} noValidate>
      <div className="two">
        <label>
          name
          <input className="input" name="name" required minLength={2} maxLength={80} autoComplete="name" />
        </label>
        <label>
          email
          <input className="input" name="email" type="email" required autoComplete="email" />
        </label>
      </div>
      <label>
        message
        <textarea className="input" name="message" required minLength={10} maxLength={2000} placeholder="Tell me about the role or project." />
      </label>
      {/* Honeypot: hidden from people, bots tend to fill it. */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px" }}>
        <label>
          website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="row" style={{ alignItems: "center" }}>
        <p className={`note ${state.kind === "error" ? "err" : state.kind === "sent" ? "ok" : ""}`} role="status">
          {state.text ?? ""}
        </p>
        <button className="btn" type="submit" disabled={state.kind === "sending"}>
          {state.kind === "sending" ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  );
}
