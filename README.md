# Shivam Singh — Portfolio

A personal portfolio built with **Next.js 16 (App Router)** and **TypeScript**, with its own backend.

## Features

- **AI assistant (RAG):** visitors ask questions about my work. A BM25 retriever finds the matching resume facts, and the **Gemini API** answers from only those facts, streamed token by token, with clickable sources.
- **Contact form:** validated with **zod**, saved to **MongoDB**, and emailed to me through **Resend**. Includes rate limiting and a honeypot against spam.
- **Visitor counter:** counted once per browser per day (cookie) and stored in MongoDB.
- **Live GitHub stats:** repos, stars, languages and recent repos from the GitHub API, cached for an hour with Next.js `"use cache"`.
- **Interactive terminal:** built-in commands (`help`, `whoami`, `projects`…); anything else goes to the AI assistant.
- **Command menu** (`Ctrl/⌘ + K`), **dark mode** without a flash on load, and a canvas dot field in the hero.

## Tech

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · MongoDB · Gemini API · Resend · zod · Vercel

## Project structure

```
src/
  app/
    page.tsx              the page
    api/chat/route.ts     AI assistant: retrieval + Gemini streaming
    api/contact/route.ts  contact form: validation, MongoDB, email
    api/views/route.ts    visitor counter
  components/             AskAI, Terminal, ContactForm, GitHubSection, DotField, …
  lib/
    data.ts               ALL portfolio content — edit this file to update the site
    retrieve.ts           BM25 retriever over the resume facts
    github.ts             cached GitHub stats
    mongo.ts              MongoDB connection
    rate-limit.ts         simple in-memory rate limiter
```

## Run locally

```bash
npm install
cp .env.example .env.local   # fill in the keys you have
npm run dev                  # http://localhost:3000
```

Every key is optional: without `GEMINI_API_KEY` the assistant answers with the matching resume facts, without `MONGODB_URI` the counter is hidden and the form asks people to email you.

## Deploy on Vercel (free)

1. Push this folder to a GitHub repo.
2. On vercel.com → **Add New → Project** → import the repo. Next.js is detected automatically.
3. Add the environment variables from `.env.example`.
4. Deploy. Add a custom domain later under **Settings → Domains**.

### Getting the keys

- **Gemini:** https://aistudio.google.com/apikey → Create API key.
- **MongoDB Atlas:** create a free M0 cluster → Database Access (add a user) → Network Access (allow `0.0.0.0/0` for Vercel) → Connect → Drivers → copy the connection string into `MONGODB_URI`.
- **Resend:** sign up → API Keys → create one. Without your own domain, Resend can only send to the email you signed up with, so use that as `CONTACT_TO_EMAIL`.
