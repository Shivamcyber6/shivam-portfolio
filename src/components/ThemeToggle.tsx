"use client";

export function toggleTheme() {
  const el = document.documentElement;
  const next = el.getAttribute("data-theme") === "dark" ? "light" : "dark";
  el.setAttribute("data-theme", next);
  try {
    localStorage.setItem("theme", next);
  } catch {}
}

export default function ThemeToggle() {
  return (
    <button type="button" className="icon-btn" onClick={toggleTheme} aria-label="Switch between light and dark theme" title="Light / dark">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="4.5" />
        <path d="M12 2v2.5M12 19.5V22M4.2 4.2 6 6M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8 6 18M18 6l1.8-1.8" />
      </svg>
    </button>
  );
}
