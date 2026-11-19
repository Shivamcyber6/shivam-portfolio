"use client";

import { useEffect } from "react";

// The choice lives in <meta name="color-scheme">: "light dark" follows the system, "light" or "dark"
// pins it. CSS maps the meta to color-scheme, so light-dark() colors and native UI both follow it.
const meta = () => document.querySelector<HTMLMetaElement>('meta[name="color-scheme"]')!;
const systemTheme = () => (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
const setScheme = (value: string | null) => { meta().content = value === "light" || value === "dark" ? value : "light dark"; };

// Two states: follow the system, or the opposite of what's on screen. Toggling back to the system's
// theme clears the saved choice, so the site follows the OS again instead of staying pinned.
export function toggleTheme() {
  const current = meta().content;
  const rendered = current === "light" || current === "dark" ? current : systemTheme();
  const next = rendered === "dark" ? "light" : "dark";
  const stored = next === systemTheme() ? null : next;
  setScheme(stored);
  try {
    if (stored) localStorage.setItem("theme", stored);
    else localStorage.removeItem("theme");
  } catch {}
}

export default function ThemeToggle() {
  // Stay in sync when another tab changes the theme.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => { if (e.key === "theme" || e.key === null) setScheme(e.newValue); };
    addEventListener("storage", onStorage);
    return () => removeEventListener("storage", onStorage);
  }, []);

  return (
    <button type="button" className="icon-btn" onClick={toggleTheme} aria-label="Switch between light and dark theme" title="Light / dark">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="4.5" />
        <path d="M12 2v2.5M12 19.5V22M4.2 4.2 6 6M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8 6 18M18 6l1.8-1.8" />
      </svg>
    </button>
  );
}
