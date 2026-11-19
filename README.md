# Shivam Singh — Portfolio

A personal portfolio built with **Next.js 16 (App Router)** and **TypeScript**, with its own backend.

## Features

- **AI assistant (RAG):** visitors ask questions about my work. A BM25 retriever finds the matching resume facts, and the **Gemini API** answers from only those facts, streamed token by token, with clickable sources.
- **Live GitHub stats:** repos, stars, languages and recent repos from the GitHub API, cached for an hour with Next.js `"use cache"`.
- **Interactive terminal:** built-in commands (`help`, `whoami`, `projects`…); anything else goes to the AI assistant.
- **Command menu** (`Ctrl/⌘ + K`), **dark mode** without a flash on load, and a canvas dot field in the hero.

## Tech

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Gemini API · zod · Vercel

## Project structure

```
src/
  app/
    page.tsx              the page
    api/chat/route.ts     AI assistant: retrieval + Gemini streaming
  components/             AskAI, Terminal, GitHubSection, DotField, …
  lib/
    data.ts               ALL portfolio content — edit this file to update the site
    retrieve.ts           BM25 retriever over the resume facts
    github.ts             cached GitHub stats
    rate-limit.ts         simple in-memory rate limiter
```

## Run locally

```bash
npm install
cp .env.example .env.local   # fill in the keys you have
npm run dev                  # http://localhost:3000
```

Every key is optional: without `GEMINI_API_KEY` the assistant answers with the matching resume facts.

## Deploy on Vercel (free)

1. Push this folder to a GitHub repo.
2. On vercel.com → **Add New → Project** → import the repo. Next.js is detected automatically.
3. Add the environment variables from `.env.example`.
4. Deploy. Add a custom domain later under **Settings → Domains**.

### Getting the keys

- **Gemini:** https://aistudio.google.com/apikey → Create API key.
