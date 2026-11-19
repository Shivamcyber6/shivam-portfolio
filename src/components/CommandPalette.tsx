"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toggleTheme } from "./ThemeToggle";
import { profile } from "@/lib/data";

type Item = { label: string; hint: string; run: () => void };

const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

// Light dismiss for browsers without <dialog closedby> (Safari): close only when the press and release
// both land outside the dialog box, so a text-selection drag that ends on the backdrop doesn't close it.
function addLightDismissFallback(dialog: HTMLDialogElement) {
  if ("closedBy" in HTMLDialogElement.prototype) return () => {};
  const outside = (e: PointerEvent) => {
    const r = dialog.getBoundingClientRect();
    return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
  };
  let pressedOutside = false;
  const down = (e: PointerEvent) => { pressedOutside = outside(e); };
  const up = (e: PointerEvent) => { if (pressedOutside && outside(e)) dialog.close(); };
  dialog.addEventListener("pointerdown", down);
  dialog.addEventListener("pointerup", up);
  return () => { dialog.removeEventListener("pointerdown", down); dialog.removeEventListener("pointerup", up); };
}

export default function CommandPalette() {
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);

  const items: Item[] = useMemo(
    () => [
      { label: "Ask the AI assistant", hint: "section", run: () => { go("ask"); setTimeout(() => document.getElementById("ask")?.querySelector("input")?.focus(), 400); } },
      { label: "Experience", hint: "section", run: () => go("experience") },
      { label: "Projects", hint: "section", run: () => go("projects") },
      { label: "GitHub activity", hint: "section", run: () => go("github") },
      { label: "Terminal", hint: "section", run: () => go("terminal") },
      { label: "Research & recognition", hint: "section", run: () => go("research") },
      { label: "Contact", hint: "section", run: () => go("contact") },
      { label: "Switch light / dark theme", hint: "action", run: toggleTheme },
      { label: "Copy email address", hint: "action", run: () => navigator.clipboard?.writeText(profile.email).catch(() => {}) },
      { label: "Open GitHub", hint: "link", run: () => window.open(profile.links.github, "_blank", "noopener") },
      { label: "Open LinkedIn", hint: "link", run: () => window.open(profile.links.linkedin, "_blank", "noopener") },
      { label: "Download resume (PDF)", hint: "link", run: () => window.open(profile.links.resume, "_blank", "noopener") },
    ],
    [],
  );

  // Open with showModal(): the browser makes the page inert, traps focus, handles Esc and the back
  // gesture, and returns focus to whatever opened the menu when it closes.
  useEffect(() => {
    const dialog = ref.current!;
    const show = () => { if (!dialog.open) { setQ(""); setSel(0); dialog.showModal(); setOpen(true); } };
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (dialog.open) dialog.close(); else show();
      }
    };
    const onClose = () => setOpen(false);
    const removeFallback = addLightDismissFallback(dialog);
    addEventListener("keydown", onKey);
    addEventListener("open-palette", show);
    dialog.addEventListener("close", onClose);
    return () => {
      removeFallback();
      removeEventListener("keydown", onKey);
      removeEventListener("open-palette", show);
      dialog.removeEventListener("close", onClose);
    };
  }, []);

  const shown = items.filter((i) => i.label.toLowerCase().includes(q.toLowerCase()));
  const choose = (i: Item | undefined) => { if (!i) return; ref.current?.close(); i.run(); };

  return (
    <dialog ref={ref} className="palette" aria-label="Command menu" {...({ closedby: "any" } as object)}>
      {open && (
        <>
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
        </>
      )}
    </dialog>
  );
}

export function PaletteButton() {
  return (
    <button type="button" className="icon-btn" onClick={() => dispatchEvent(new Event("open-palette"))} aria-label="Open command menu" title="Command menu (Ctrl / ⌘ + K)">
      ⌘K
    </button>
  );
}
