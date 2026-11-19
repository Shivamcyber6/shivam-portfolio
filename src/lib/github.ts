import { cacheLife } from "next/cache";

// Live GitHub stats, cached for an hour so the page stays fast and well under GitHub's rate limit.
// Set GITHUB_TOKEN (a read-only token is enough) to raise the limit from 60 to 5,000 requests an hour.

export type GitHubStats = {
  repos: number;
  stars: number;
  followers: number;
  languages: { name: string; share: number }[];
  recent: { name: string; description: string | null; url: string; language: string | null; stars: number; updated: string }[];
};

type Repo = {
  name: string; description: string | null; html_url: string; language: string | null;
  stargazers_count: number; fork: boolean; pushed_at: string; size: number;
};

export async function getGitHubStats(user: string): Promise<GitHubStats | null> {
  "use cache";

  const headers: Record<string, string> = { Accept: "application/vnd.github+json", "User-Agent": "shivam-portfolio" };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  try {
    const [uRes, rRes] = await Promise.all([
      fetch(`https://api.github.com/users/${user}`, { headers }),
      fetch(`https://api.github.com/users/${user}/repos?per_page=100&sort=pushed`, { headers }),
    ]);
    if (!uRes.ok || !rRes.ok) {
      cacheLife("minutes"); // retry soon instead of hiding stats for an hour
      return null;
    }
    const u = await uRes.json();
    const repos: Repo[] = (await rRes.json()).filter((r: Repo) => !r.fork);

    const bytes = new Map<string, number>();
    repos.forEach((r) => r.language && bytes.set(r.language, (bytes.get(r.language) ?? 0) + Math.max(r.size, 1)));
    const total = [...bytes.values()].reduce((a, b) => a + b, 0) || 1;

    cacheLife("hours");
    return {
      repos: u.public_repos ?? repos.length,
      followers: u.followers ?? 0,
      stars: repos.reduce((s, r) => s + r.stargazers_count, 0),
      languages: [...bytes.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, v]) => ({ name, share: Math.round((v / total) * 100) })),
      recent: repos.slice(0, 4).map((r) => ({
        name: r.name,
        description: r.description,
        url: r.html_url,
        language: r.language,
        stars: r.stargazers_count,
        updated: r.pushed_at,
      })),
    };
  } catch {
    cacheLife("minutes");
    return null;
  }
}
