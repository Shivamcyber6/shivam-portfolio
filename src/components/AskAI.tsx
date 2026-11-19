"use client";

import { useRef, useState } from "react";
import { flashTo } from "./flash";

type Source = { id: string; label: string };
type Msg = { role: "user" | "assistant"; content: string; sources?: Source[] };

const SUGGESTIONS = ["What has he built with AI?", "Has he worked with AWS?", "How much experience does he have?", "Tell me about his research"];

export default function AskAI() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const log = useRef<HTMLDivElement>(null);

  const scroll = () => requestAnimationFrame(() => log.current?.scrollTo({ top: log.current.scrollHeight }));

  async function ask(text: string) {
    const q = text.trim();
    if (!q || busy) return;
    const history: Msg[] = [...msgs, { role: "user", content: q }];
    setMsgs([...history, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);
    scroll();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.map(({ role, content }) => ({ role, content })) }),
      });
      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Something went wrong.");
      }
      let sources: Source[] = [];
      try { sources = JSON.parse(decodeURIComponent(res.headers.get("X-Sources") ?? "%5B%5D")); } catch {}

      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let answer = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        answer += dec.decode(value, { stream: true });
        setMsgs([...history, { role: "assistant", content: answer }]);
        scroll();
      }
      setMsgs([...history, { role: "assistant", content: answer.trim() || "I couldn't answer that one.", sources }]);
    } catch (e) {
      setMsgs([...history, { role: "assistant", content: e instanceof Error ? e.message : "Something went wrong." }]);
    } finally {
      setBusy(false);
      scroll();
    }
  }

  return (
    <div className="panel chat">
      <div className="chat-log" ref={log} aria-live="polite">
        {msgs.length === 0 && (
          <p className="msg bot empty">
            I answer from Shivam&apos;s resume, and every answer shows where it came from. Ask anything about his work.
          </p>
        )}
        {msgs.map((m, i) => (
          <div key={i} className={`msg ${m.role === "user" ? "user" : "bot"}`}>
            <span className={busy && i === msgs.length - 1 && m.role === "assistant" ? "typing" : undefined}>{m.content}</span>
            {m.sources && m.sources.length > 0 && (
              <div className="sources">
                {m.sources.map((s) => (
                  <button key={s.label} type="button" className="cite" onClick={() => flashTo(s.id)}>
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      {msgs.length === 0 && (
        <div className="chips">
          {SUGGESTIONS.map((s) => (
            <button key={s} type="button" className="chip" onClick={() => ask(s)}>
              {s}
            </button>
          ))}
        </div>
      )}
      <form className="chat-form" onSubmit={(e) => { e.preventDefault(); ask(input); }}>
        <label htmlFor="ask" className="sr-only">Ask about Shivam</label>
        <input id="ask" className="input" value={input} onChange={(e) => setInput(e.target.value)} maxLength={500} autoComplete="off" placeholder="e.g. Can he work remotely?" />
        <button className="btn" type="submit" disabled={busy || !input.trim()}>
          {busy ? "Thinking…" : "Ask"}
        </button>
      </form>
    </div>
  );
}
