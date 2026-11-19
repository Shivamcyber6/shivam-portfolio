"use client";

import { useState } from "react";

export default function CopyEmail({ email }: { email: string }) {
  const [label, setLabel] = useState("Copy");
  return (
    <button
      type="button"
      className="copy"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(email);
          setLabel("Copied");
        } catch {
          setLabel("Select & copy");
        }
        setTimeout(() => setLabel("Copy"), 1800);
      }}
    >
      {label}
    </button>
  );
}
