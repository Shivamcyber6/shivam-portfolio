// Everything about Shivam lives here. The page, the terminal and the AI chat all read from this file,
// so updating your portfolio means editing this one file.

export const profile = {
  name: "Shivam Singh",
  role: "Full Stack Developer · GenAI",
  email: "19410121143.k.shivamsingh@gmail.com",
  location: "Roorkee, Uttarakhand",
  openTo: "Remote, Dehradun, Delhi NCR, Lucknow",
  notice: "30 days",
  current: "Web Developer at COER University",
  githubUser: "Shivamcyber6",
  links: {
    github: "https://github.com/Shivamcyber6",
    linkedin: "https://www.linkedin.com/in/shivam-singh-663320197",
    leetcode: "https://leetcode.com/",
  },
  intro: [
    "I build full stack web products in Next.js, React, Node.js and Python, from the database to the deploy.",
    "I add AI where it earns its place: RAG pipelines, embeddings search, agents and chat interfaces.",
    "Right now I run COER University's web platform, used by 10,000+ people every month on AWS.",
  ],
};

export const stack = [
  { name: "Languages", items: ["JavaScript", "TypeScript", "Python", "SQL", "Java", "C/C++"] },
  { name: "Frontend", items: ["React", "Next.js", "Tailwind CSS", "Zustand", "shadcn/ui"] },
  { name: "Backend", items: ["Node.js", "Express.js", "FastAPI", "REST APIs", "WebSockets", "NextAuth.js"] },
  { name: "GenAI", items: ["LangChain", "OpenAI / Claude / Gemini APIs", "RAG", "Embeddings", "Function calling", "Agents", "MCP"] },
  { name: "Databases", items: ["PostgreSQL", "MongoDB", "MySQL", "Supabase", "Pinecone", "ChromaDB", "Prisma"] },
  { name: "Cloud & tools", items: ["AWS (EC2, S3, CloudFront, Lambda)", "Docker", "Vercel", "GitHub Actions", "Git"] },
];

export type Job = {
  id: string;
  short: string;
  title: string;
  company: string;
  where: string;
  from: string;
  to: string;
  duration: string;
  points: string[];
  tags: string[];
};

export const jobs: Job[] = [
  {
    id: "job-coer",
    short: "CU",
    title: "Web Developer",
    company: "COER University",
    where: "Roorkee, Uttarakhand · on-site",
    from: "Jan 2025",
    to: "now",
    duration: "1 yr 11 mo",
    points: [
      "Built and deployed the university's full stack platform on AWS (EC2, S3, CloudFront), serving 10,000+ monthly users with 99.9% uptime and sub-2s page loads.",
      "Added AI content recommendations with OpenAI embeddings and vector search, raising engagement on program pages by 50%.",
      "Connected a headless CMS with automated content pipelines, cutting manual updates by 60% across 200+ pages.",
      "Improved Core Web Vitals (LCP, INP, CLS), making pages 35% faster.",
    ],
    tags: ["Next.js", "AWS", "OpenAI", "Headless CMS", "Performance"],
  },
  {
    id: "job-freelance",
    short: "FL",
    title: "Frontend Developer & AI Integration",
    company: "Freelance",
    where: "Remote · clients included GD Goenka Public School, Gorakhpur",
    from: "Jul 2024",
    to: "Jan 2025",
    duration: "7 mo",
    points: [
      "Built an AI support chatbot with LangChain, GPT-4 and a RAG pipeline (ChromaDB), cutting a client's support tickets by 40%.",
      "Delivered React and Next.js interfaces for 3 client projects, raising engagement by 25%.",
      "Moved key pages to server-side rendering, cutting TTFB by 45% and reaching Lighthouse scores of 95+.",
    ],
    tags: ["React", "LangChain", "RAG", "SSR"],
  },
  {
    id: "job-kpit",
    short: "KP",
    title: "Software Engineer Trainee",
    company: "KPIT Technologies",
    where: "Pune · on-site",
    from: "Feb 2024",
    to: "May 2024",
    duration: "4 mo",
    points: [
      "Delivered 5 production modules in embedded C/C++ for automotive software in an Agile team.",
      "Resolved 100+ issues through root-cause analysis and code reviews.",
    ],
    tags: ["C/C++", "Automotive", "Agile"],
  },
];

export type Project = {
  id: string;
  name: string;
  year: string;
  summary: string;
  metrics: { value: string; label: string }[];
  tags: string[];
  code?: string;
  live?: string;
};

// Add your repo and live links here once the projects are on GitHub.
export const projects: Project[] = [
  {
    id: "proj-docai",
    name: "AI Document Intelligence Platform",
    year: "2026",
    summary:
      "Upload PDFs or web pages and ask questions about them. Answers come back with the exact source passages, and agents handle questions that need several steps across documents.",
    metrics: [
      { value: "RAG", label: "answers with source citations" },
      { value: "Streaming", label: "chat with RSC + AI SDK" },
      { value: "Serverless", label: "AWS Lambda + Docker" },
    ],
    tags: ["Next.js", "FastAPI", "LangChain", "Pinecone", "AWS"],
    code: "https://github.com/Shivamcyber6",
  },
  {
    id: "proj-portfolio",
    name: "This portfolio",
    year: "2026",
    summary:
      "A Next.js site with its own backend: a streaming AI assistant that answers from my resume with retrieval and citations, a visitor counter and live GitHub stats.",
    metrics: [
      { value: "4", label: "API routes" },
      { value: "RAG", label: "grounded AI answers" },
      { value: "ISR", label: "GitHub stats cached hourly" },
    ],
    tags: ["Next.js", "TypeScript", "MongoDB", "Gemini API"],
    code: "https://github.com/Shivamcyber6",
  },
  {
    id: "proj-aurastream",
    name: "AuraStream",
    year: "2026",
    summary:
      "A video streaming platform with adaptive bitrate playback and AI-based content tagging, on a PostgreSQL data layer locked down with Row Level Security.",
    metrics: [
      { value: "45%", label: "faster queries after indexing" },
      { value: "OAuth", label: "NextAuth + token rotation" },
    ],
    tags: ["Next.js", "PostgreSQL", "Supabase", "NextAuth.js"],
    code: "https://github.com/Shivamcyber6",
  },
  {
    id: "proj-clearfeed",
    name: "ClearFeed",
    year: "2026",
    summary:
      "A Chrome extension, published on the Chrome Web Store, that hides distracting feeds. A MutationObserver engine keeps it working as single-page apps change, with a Pomodoro timer and task list built in.",
    metrics: [
      { value: "Live", label: "on the Chrome Web Store" },
      { value: "~0 ms", label: "overhead, CSS injection" },
    ],
    tags: ["JavaScript", "Chrome Extension APIs"],
    code: "https://github.com/Shivamcyber6",
  },
];

export const publication = {
  title:
    "A study of Natural Language Processing for the Global Energy Sector: Evolution, Operational Impact, and Challenge of Sustainable LLM Deployment",
  authors: "With Dr. Bhupendra Singh Rawat and Hemendra Shankar Sharma",
  venue:
    "Peer-reviewed and presented at ICSSCS 2026, International Conference on Smart and Sustainable Computing Systems, COER University",
  date: "April 2026",
};

export const recognition = [
  { text: "Anthropic AI Engineering: Claude Code, AI agents, sub-agents, MCP", year: "2026" },
  { text: "Hacktoberfest open-source contributor, 20+ merged pull requests", year: "2019–22" },
  { text: "Salesforce Developer virtual internship: LWC, Apex", year: "2023" },
  { text: "HackerRank 5-star in Java", year: "2022" },
];

export const education = {
  degree: "B.Tech, Computer Science & Engineering",
  school: "Siksha 'O' Anusandhan University, Bhubaneswar",
  detail: "CGPA 7.41",
  years: "2019–23",
};

// Small, self-contained facts the AI assistant retrieves from. Each one points at the section it came from.
export type Chunk = { id: string; label: string; text: string; keywords: string };

export const knowledge: Chunk[] = [
  { id: "about", label: "About", text: "Shivam Singh is a Full Stack Developer working in Next.js, React, Node.js and Python, with GenAI experience (RAG, embeddings, agents). He currently works as a Web Developer at COER University, Roorkee.", keywords: "who about summary role current job intro" },
  { id: "about", label: "About", text: "He has about 2 years 10 months of experience: almost 2 years at COER University (Jan 2025 to now), 7 months freelancing (Jul 2024 to Jan 2025) and 4 months at KPIT Technologies (Feb to May 2024).", keywords: "experience years how long total seniority" },
  { id: "contact", label: "Contact", text: "He is open to full-time Full Stack or GenAI roles, remote first, or on-site in Dehradun, Delhi NCR or Lucknow. His notice period is 30 days. Email: 19410121143.k.shivamsingh@gmail.com.", keywords: "remote location relocate notice period join available hire onsite hybrid where email contact reach" },
  ...jobs.flatMap((j) =>
    j.points.map((p) => ({
      id: j.id,
      label: `Experience · ${j.company}`,
      text: `As ${j.title} at ${j.company} (${j.from} – ${j.to}): ${p}`,
      keywords: `${j.company} ${j.title} ${j.tags.join(" ")} work job experience`,
    })),
  ),
  ...projects.map((p) => ({
    id: p.id,
    label: `Project · ${p.name}`,
    text: `${p.name}: ${p.summary} Built with ${p.tags.join(", ")}.`,
    keywords: `project built ${p.tags.join(" ")}`,
  })),
  ...stack.map((s) => ({
    id: "stack",
    label: `Stack · ${s.name}`,
    text: `${s.name}: ${s.items.join(", ")}.`,
    keywords: `skills stack technologies ${s.name}`,
  })),
  { id: "research", label: "Research", text: `He co-authored the paper "${publication.title}" with Dr. Bhupendra Singh Rawat and Hemendra Shankar Sharma. It was peer-reviewed and presented at ICSSCS 2026 (International Conference on Smart and Sustainable Computing Systems) at COER University in ${publication.date}.`, keywords: "research paper publication published conference icsscs nlp llm sustainable energy academic" },
  { id: "research", label: "Recognition", text: `Certifications and achievements: ${recognition.map((r) => `${r.text} (${r.year})`).join("; ")}.`, keywords: "certification certificate achievement award hacktoberfest hackerrank salesforce anthropic open source" },
  { id: "education", label: "Education", text: `${education.degree}, ${education.school}, ${education.years}, ${education.detail}.`, keywords: "education degree college university btech cgpa study" },
];
