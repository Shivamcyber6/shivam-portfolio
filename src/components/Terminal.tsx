"use client";

import { useEffect, useRef, useState } from "react";
import { toggleTheme } from "./ThemeToggle";

type Line = { text: string; tone?: "dim" | "acc" };

const COMMANDS: Record<string, string[]> = {
  help: [
    "commands:",
    "  whoami       who I am",
    "  stack        what I work with",
    "  projects     things I built",
    "  experience   where I worked",
    "  research     my paper",
    "  contact      how to reach me",
    "  theme        switch light / dark",
    "  clear        clear the screen",
    "anything else goes to the AI assistant, e.g. \"has he used aws?\"",
  ],
  whoami: ["Shivam Singh: Full Stack Developer · GenAI", "Web Developer at COER University, Roorkee.", "~2 yr 10 mo experience. Open to work, 30 days' notice."],
  stack: ["languages  JavaScript, TypeScript, Python, SQL", "frontend   React, Next.js, Tailwind", "backend    Node.js, Express, FastAPI", "genai      LangChain, RAG, embeddings, agents, MCP", "data       PostgreSQL, MongoDB, Pinecone, ChromaDB", "cloud      AWS, Docker, Vercel"],
  projects: ["1. AI Document Intelligence Platform   RAG + agents", "2. This portfolio                      Next.js + Gemini", "3. AuraStream                          video platform", "4. ClearFeed                           Chrome extension"],
  experience: ["2025–now   Web Developer, COER University", "2024–25    Frontend & AI Integration, Freelance", "2024       Software Engineer Trainee, KPIT"],
  research: ['"A study of NLP for the Global Energy Sector…"', "ICSSCS 2026 · peer-reviewed and presented"],
  contact: ["email     19410121143.k.shivamsingh@gmail.com", "linkedin  linkedin.com/in/shivam-singh-663320197", "github    github.com/Shivamcyber6"],
  ls: ["about  stack  experience  projects  research  contact"],
  sudo: ["nice try. permission denied."],
};

export default function Terminal() {
  const [lines, setLines] = useState<Line[]>([{ text: "Welcome. Type help to see what I can do.", tone: "acc" }]);
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const out = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const history = useRef<string[]>([]);
  const hIndex = useRef(-1);

  useEffect(() => {
    out.current?.scrollTo({ top: out.current.scrollHeight });
  }, [lines]);

  const push = (...l: Line[]) => setLines((prev) => [...prev, ...l]);

  async function run(raw: string) {
    const cmd = raw.trim();
    push({ text: `shivam@dev:~$ ${raw}`, tone: "dim" });
    if (!cmd) return;
    history.current.unshift(cmd);
    hIndex.current = -1;
    const key = cmd.toLowerCase().split(/\s+/)[0];
    if (key === "clear") return setLines([]);
    if (key === "theme") { toggleTheme(); return push({ text: "theme switched." }); }
    if (COMMANDS[key]) return push(...COMMANDS[key].map((text) => ({ text })));

    // Not a command: ask the AI assistant.
    setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: cmd.slice(0, 500) }] }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? "assistant unavailable");
      const text = await res.text();
      let sources: { label: string }[] = [];
      try { sources = JSON.parse(decodeURIComponent(res.headers.get("X-Sources") ?? "%5B%5D")); } catch {}
      push({ text: text.trim() });
      if (sources.length) push({ text: `source: ${sources.map((s) => s.label).join(", ")}`, tone: "acc" });
    } catch (e) {
      push({ text: `error: ${e instanceof Error ? e.message : "assistant unavailable"}` });
    } finally {
      setBusy(false);
    }
  }

  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const h = history.current;
      hIndex.current = Math.max(-1, Math.min(h.length - 1, hIndex.current + (e.key === "ArrowUp" ? 1 : -1)));
      setValue(hIndex.current === -1 ? "" : h[hIndex.current]);
    }
  }

  return (
    <div className="term" onClick={(e) => { if ((e.target as HTMLElement).tagName !== "A") input.current?.focus({ preventScroll: true }); }}>
      <div className="bar" aria-hidden="true"><i /><i /><i /></div>
      <div className="out" ref={out} aria-live="polite">
        {lines.map((l, i) => (
          <p key={i} className={l.tone}>{l.text}</p>
        ))}
        {busy && <p className="dim">thinking…</p>}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); if (!busy) { run(value); setValue(""); } }}>
        <span aria-hidden="true">shivam@dev:~$</span>
        <label htmlFor="term-in" className="sr-only">Terminal command</label>
        <input id="term-in" ref={input} value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={onKey} autoComplete="off" spellCheck={false} placeholder="type help" />
      </form>
    </div>
  );
}
