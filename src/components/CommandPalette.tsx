"use client";

import { useEffect, useMemo, useState } from "react";
import { toggleTheme } from "./ThemeToggle";
import { profile } from "@/lib/data";

type Item = { label: string; hint: string; run: () => void };

const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

export default function CommandPalette() {
  const [open, setOpen] = useState(false);

  const items: Item[] = useMemo(
    () => [
      { label: "Ask the AI assistant", hint: "section", run: () => { go("ask"); setTimeout(() => document.getElementById("ask")?.querySelector("input")?.focus(), 400); } },
      { label: "Experience", hint: "section", run: () => go("experience") },
      { label: "Projects", hint: "section", run: () => go("projects") },
      { label: "GitHub activity", hint: "section", run: () => go("github") },
      { label: "Terminal", hint: "section", run: () => go("terminal") },
      { label: "Research & recognition", hint: "section", run: () => go("research") },
      { label: "Send a message", hint: "section", run: () => go("contact") },
      { label: "Switch light / dark theme", hint: "action", run: toggleTheme },
      { label: "Copy email address", hint: "action", run: () => navigator.clipboard?.writeText(profile.email).catch(() => {}) },
      { label: "Open GitHub", hint: "link", run: () => window.open(profile.links.github, "_blank", "noopener") },
      { label: "Open LinkedIn", hint: "link", run: () => window.open(profile.links.linkedin, "_blank", "noopener") },
    ],
    [],
  );
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen((o) => !o); }
      if (e.key === "Escape") setOpen(false);
    };
    const onOpen = () => setOpen(true);
    addEventListener("keydown", onKey);
    addEventListener("open-palette", onOpen);
    return () => { removeEventListener("keydown", onKey); removeEventListener("open-palette", onOpen); };
  }, []);

  if (!open) return null;
  return <Dialog items={items} onClose={() => setOpen(false)} />;
}

function Dialog({ items, onClose }: { items: Item[]; onClose: () => void }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const shown = items.filter((i) => i.label.toLowerCase().includes(q.toLowerCase()));
  const choose = (i: Item | undefined) => { if (!i) return; onClose(); i.run(); };

  return (
    <div className="palette-bg" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="palette" role="dialog" aria-modal="true" aria-label="Command menu">
        <input
          autoFocus
          value={q}
          onChange={(e) => { setQ(e.target.value); setSel(0); }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(s + 1, shown.length - 1)); }
            if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
            if (e.key === "Enter") choose(shown[sel]);
          }}
          placeholder="Jump to a section or run an action…"
          aria-label="Search commands"
        />
        <ul role="listbox">
          {shown.map((i, idx) => (
            <li key={i.label}>
              <button type="button" role="option" aria-selected={idx === sel} onMouseEnter={() => setSel(idx)} onClick={() => choose(i)}>
                {i.label}
                <span>{i.hint}</span>
              </button>
            </li>
          ))}
          {shown.length === 0 && <li style={{ padding: "10px", color: "var(--muted)" }}>Nothing matches.</li>}
        </ul>
      </div>
    </div>
  );
}

export function PaletteButton() {
  return (
    <button type="button" className="icon-btn" onClick={() => dispatchEvent(new Event("open-palette"))} aria-label="Open command menu" title="Command menu (Ctrl / ⌘ + K)">
      ⌘K
    </button>
  );
}
