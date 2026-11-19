import { getGitHubStats } from "@/lib/github";
import { profile } from "@/lib/data";

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6", JavaScript: "#e3b341", Python: "#3572a5", HTML: "#e34c26", CSS: "#663399",
  Java: "#b07219", "C++": "#f34b7d", C: "#6e6e77", Jupyter: "#da5b0b", Shell: "#89e051",
};

function monthYear(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { month: "short", year: "numeric", timeZone: "UTC" });
}

export default async function GitHubSection() {
  const s = await getGitHubStats(profile.githubUser);

  if (!s) {
    return (
      <div className="panel" style={{ padding: 16 }}>
        <p style={{ margin: 0, color: "var(--muted)" }}>
          GitHub stats are taking a break. See everything on <a href={profile.links.github}>github.com/{profile.githubUser}</a>.
        </p>
      </div>
    );
  }

  return (
    <div className="panel gh">
      <div className="gh-stats">
        <div><b>{s.repos}</b><span>public repos</span></div>
        <div><b>{s.stars}</b><span>stars</span></div>
        <div><b>{s.followers}</b><span>followers</span></div>
        {s.languages.length > 0 && (
          <div style={{ gridColumn: "1 / -1" }}>
            <span>languages</span>
            <div className="langbar" aria-hidden="true">
              {s.languages.map((l) => (
                <i key={l.name} style={{ width: `${l.share}%`, background: LANG_COLORS[l.name] ?? "var(--muted)" }} />
              ))}
            </div>
            <div className="tags">
              {s.languages.map((l) => (
                <span key={l.name} className="tag">{l.name} {l.share}%</span>
              ))}
            </div>
          </div>
        )}
      </div>
      <ul className="gh-repos">
        {s.recent.map((r) => (
          <li key={r.name}>
            <div className="row">
              <a href={r.url} target="_blank" rel="noreferrer">{r.name}</a>
              <span className="when">updated {monthYear(r.updated)}</span>
            </div>
            {r.description && <p>{r.description}</p>}
            <div className="tags">
              {r.language && <span className="tag">{r.language}</span>}
              {r.stars > 0 && <span className="tag">★ {r.stars}</span>}
            </div>
          </li>
        ))}
        {s.recent.length === 0 && <li style={{ color: "var(--muted)" }}>No public repositories yet.</li>}
      </ul>
    </div>
  );
}

export function GitHubSkeleton() {
  return (
    <div className="panel gh" aria-busy="true" aria-label="Loading GitHub stats">
      <div className="gh-stats">
        {[0, 1, 2].map((i) => <div key={i} className="skeleton" style={{ height: 44 }} />)}
      </div>
      <div style={{ padding: 16, display: "grid", gap: 12 }}>
        {[0, 1, 2].map((i) => <div key={i} className="skeleton" style={{ height: 48 }} />)}
      </div>
    </div>
  );
}
