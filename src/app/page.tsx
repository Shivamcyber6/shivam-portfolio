import { Suspense } from "react";
import { profile, stack, jobs, projects, publication, recognition, education } from "@/lib/data";
import ThemeToggle from "@/components/ThemeToggle";
import DotField from "@/components/DotField";
import AskAI from "@/components/AskAI";
import ContactForm from "@/components/ContactForm";
import ViewCounter from "@/components/ViewCounter";
import CopyEmail from "@/components/CopyEmail";
import Terminal from "@/components/Terminal";
import CommandPalette, { PaletteButton } from "@/components/CommandPalette";
import GitHubSection, { GitHubSkeleton } from "@/components/GitHubSection";

function Section({ id, cmd, title, lead, children }: { id: string; cmd: string; title: string; lead?: string; children: React.ReactNode }) {
  return (
    <section className="section" id={id} aria-labelledby={`${id}-h`}>
      <p className="prompt">{cmd}</p>
      <h2 className="h2" id={`${id}-h`}>{title}</h2>
      {lead && <p className="lead">{lead}</p>}
      {children}
    </section>
  );
}

export default function Home() {
  return (
    <>
      <div className="boot" aria-hidden="true">
        <div>
          <p style={{ margin: "2px 0" }}>$ <b>booting</b> shivam.dev</p>
          <p className="l2" style={{ margin: "2px 0" }}>loading projects… ready.</p>
        </div>
      </div>

      <nav className="nav" aria-label="Main">
        <div className="wrap">
          <a className="home" href="#top">~/shivam</a>
          <ul>
            <li><a href="#ask">Ask AI</a></li>
            <li><a href="#experience">Experience</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
          <div className="right">
            <PaletteButton />
            <ThemeToggle />
          </div>
        </div>
      </nav>
      <CommandPalette />

      <main className="wrap" id="top">
        <header className="hero" id="about">
          <div className="name">
            <h1 className="h1">{profile.name}</h1>
            <span className="badge" title="Paper peer-reviewed and presented at ICSSCS 2026">
              <svg width="13" height="13" viewBox="0 0 16 16" aria-hidden="true">
                <path fill="currentColor" d="M8 0l2 1.6 2.5-.2.8 2.4 2.1 1.4-.8 2.4.8 2.4-2.1 1.4-.8 2.4-2.5-.2L8 16l-2-1.6-2.5.2-.8-2.4L.6 10.8l.8-2.4-.8-2.4 2.1-1.4.8-2.4 2.5.2z" />
                <path fill="var(--paper)" d="M7 11.2L4.2 8.4l1.1-1.1L7 9l3.7-3.7 1.1 1.1z" />
              </svg>
              Published researcher
            </span>
          </div>
          <p className="role">{profile.role}</p>

          <div className="panel" style={{ marginTop: 30, overflow: "hidden" }}>
            <DotField />
            <dl className="strip" style={{ margin: 0 }}>
              <div><dt>status</dt><dd className="status live"><span className="dot" />open to work</dd></div>
              <ViewCounter />
              <div><dt>notice</dt><dd>{profile.notice}</dd></div>
            </dl>
          </div>
          <p className="fig"><b>Fig. 1</b> — Every dot is a user request. Move your cursor to pull traffic in, click to send a burst.</p>

          <ul className="intro">
            {profile.intro.map((t) => <li key={t}>{t}</li>)}
          </ul>
          <div className="cta">
            <a className="btn" href="#ask">Ask my AI assistant</a>
            <a className="btn ghost" href="#contact">Get in touch</a>
            <span className="fig kbd-hint" style={{ alignSelf: "center", margin: 0 }}>or press <span className="kbd">Ctrl</span> <span className="kbd">K</span></span>
          </div>
        </header>

        <Section id="ask" cmd="ask --about shivam" title="Ask my AI assistant" lead="It reads my resume, finds the facts that match your question and answers from them, with links to the source. Built with retrieval and the Gemini API.">
          <AskAI />
          <p className="fig"><b>Fig. 2</b> — Retrieval-augmented answers. Click a source to jump to it.</p>
        </Section>

        <Section id="stack" cmd="ls ~/stack" title="Stack">
          <div className="panel stack">
            {stack.map((s, i) => (
              <div key={s.name}>
                <h3>{String(i + 1).padStart(2, "0")} <span>{s.name}</span></h3>
                <div className="tags">{s.items.map((t) => <span key={t} className="tag">{t}</span>)}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section id="experience" cmd="git log --author=shivam" title="Experience">
          {jobs.map((j) => (
            <article className="job" id={j.id} key={j.id}>
              <div className="logo" aria-hidden="true">{j.short}</div>
              <div>
                <div className="row">
                  <h3 className="h3">{j.title} · {j.company}</h3>
                  <span className="when">{j.from} – {j.to} · {j.duration}</span>
                </div>
                <p className="sub">{j.where}</p>
                <ul>{j.points.map((p) => <li key={p}>{p}</li>)}</ul>
                <div className="tags">{j.tags.map((t) => <span key={t} className="tag">{t}</span>)}</div>
              </div>
            </article>
          ))}
        </Section>

        <Section id="projects" cmd="ls ~/projects" title="Projects">
          <div className="projects">
            {projects.map((p, i) => (
              <article className={`panel proj${i === 0 || (i === projects.length - 1 && projects.length % 2 === 0) ? " wide" : ""}`} id={p.id} key={p.id}>
                <div className="row">
                  <h3 className="h3">{p.name}</h3>
                  <span className="when">{p.year}</span>
                </div>
                <p>{p.summary}</p>
                <div className="metrics">
                  {p.metrics.map((m) => <div className="metric" key={m.label}><b>{m.value}</b><span>{m.label}</span></div>)}
                </div>
                <div className="foot">
                  <div className="tags">{p.tags.map((t) => <span key={t} className="tag">{t}</span>)}</div>
                  <div style={{ display: "flex", gap: 14 }}>
                    {p.live && <a href={p.live} target="_blank" rel="noreferrer">Live ↗</a>}
                    {p.code && <a href={p.code} target="_blank" rel="noreferrer">Code ↗</a>}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Section>

        <Section id="github" cmd={`curl api.github.com/users/${profile.githubUser}`} title="GitHub activity" lead="Live from the GitHub API, refreshed every hour.">
          <Suspense fallback={<GitHubSkeleton />}>
            <GitHubSection />
          </Suspense>
        </Section>

        <Section id="terminal" cmd="./terminal" title="Try the terminal">
          <Terminal />
          <p className="fig"><b>Fig. 3</b> — Type <span className="mono">help</span>, or ask it something in plain English and the AI assistant answers.</p>
        </Section>

        <Section id="research" cmd="cat recognition.md" title="Research & recognition">
          <div className="pub">
            <q>{publication.title}</q>
            <p>{publication.authors} · {publication.venue} · {publication.date}</p>
          </div>
          <ul className="list">
            {recognition.map((r) => <li key={r.text}><span>{r.text}</span><span className="when">{r.year}</span></li>)}
          </ul>
        </Section>

        <Section id="education" cmd="cat education.md" title="Education">
          <ul className="list">
            <li>
              <span><b style={{ fontWeight: 600 }}>{education.degree}</b><br /><span style={{ color: "var(--muted)" }}>{education.school} · {education.detail}</span></span>
              <span className="when">{education.years}</span>
            </li>
          </ul>
        </Section>

        <Section id="contact" cmd="cat contact.json" title="Get in touch" lead="Hiring for a Full Stack or GenAI role? Send a message here or email me directly.">
          <div className="panel card" style={{ marginBottom: 14 }}>
            <dl style={{ margin: 0 }}>
              <div className="r"><dt>status</dt><dd><span className="status live"><span className="dot" />Available · {profile.notice} notice</span></dd></div>
              <div className="r"><dt>currently</dt><dd>{profile.current}</dd></div>
              <div className="r"><dt>location</dt><dd>{profile.location} · open to {profile.openTo}</dd></div>
              <div className="r"><dt>email</dt><dd><span>{profile.email}</span><CopyEmail email={profile.email} /></dd></div>
              <div className="r"><dt>elsewhere</dt><dd><a href={profile.links.linkedin}>LinkedIn</a><a href={profile.links.github}>GitHub</a><a href={profile.links.leetcode}>LeetCode</a></dd></div>
            </dl>
          </div>
          <ContactForm />
        </Section>
      </main>

      <footer className="footer">
        <div className="wrap">
          <div className="links">
            <a href={profile.links.github}>GitHub</a>
            <a href={profile.links.linkedin}>LinkedIn</a>
            <a href="#contact">Email</a>
          </div>
          <p style={{ margin: "6px 0 0" }}>© 2026 {profile.name} · Next.js, TypeScript, MongoDB and the Gemini API, deployed on Vercel.</p>
        </div>
      </footer>
    </>
  );
}
