"use client";

import { useEffect, useState } from "react";

// Shows the visitor count in the hero strip. Renders nothing when no database is configured.
export default function ViewCounter() {
  const [count, setCount] = useState<number | null | undefined>(undefined);

  useEffect(() => {
    fetch("/api/views", { method: "POST" })
      .then((r) => r.json())
      .then((d) => setCount(typeof d.count === "number" ? d.count : null))
      .catch(() => setCount(null));
  }, []);

  if (count === null) return null;
  return (
    <div>
      <dt>visitors</dt>
      <dd>{count === undefined ? "…" : count.toLocaleString("en-IN")}</dd>
    </div>
  );
}
