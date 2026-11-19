// Scroll to a section and briefly highlight it, so a cited source is easy to spot.
export function flashTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
  el.classList.remove("flash");
  void el.offsetWidth;
  el.classList.add("flash");
}
