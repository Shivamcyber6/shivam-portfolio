import { knowledge, type Chunk } from "./data";

// A small BM25 retriever over the resume chunks. The knowledge base is tiny, so this runs in
// memory on every request and needs no vector database.

const STOP = new Set(
  "a an the is are was were be has have had he his him does do did can could what which who with of in on to for and or how any ever been worked work used use me you your about tell give list does is there please".split(" "),
);

const ALIASES: Record<string, string> = {
  nextjs: "next.js", next: "next.js", node: "node.js", nodejs: "node.js", js: "javascript", ts: "typescript",
  postgres: "postgresql", mongo: "mongodb", gen: "genai", llm: "llm", wfh: "remote", remotely: "remote", relocation: "relocate", relocating: "relocate", salary: "salary",
};

export function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/next\.js/g, "nextjs")
    .replace(/node\.js/g, "nodejs")
    .replace(/[^a-z0-9+#]+/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP.has(w))
    .map((w) => ALIASES[w]?.replace(/\./g, "") ?? w);
}

const docs = knowledge.map((c) => {
  const toks = tokenize(`${c.keywords} ${c.keywords} ${c.text}`); // keywords weighted twice
  const tf = new Map<string, number>();
  toks.forEach((t) => tf.set(t, (tf.get(t) ?? 0) + 1));
  return { chunk: c, tf, len: toks.length };
});
const avgLen = docs.reduce((s, d) => s + d.len, 0) / docs.length;
const df = new Map<string, number>();
docs.forEach((d) => d.tf.forEach((_, t) => df.set(t, (df.get(t) ?? 0) + 1)));

export function retrieve(query: string, k = 4): Chunk[] {
  const q = [...new Set(tokenize(query))];
  if (!q.length) return [];
  const N = docs.length, k1 = 1.4, b = 0.75;
  return docs
    .map((d) => {
      let score = 0;
      for (const t of q) {
        const f = d.tf.get(t);
        if (!f) continue;
        const idf = Math.log(1 + (N - (df.get(t) ?? 0) + 0.5) / ((df.get(t) ?? 0) + 0.5));
        score += idf * ((f * (k1 + 1)) / (f + k1 * (1 - b + (b * d.len) / avgLen)));
      }
      return { chunk: d.chunk, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map((r) => r.chunk);
}
