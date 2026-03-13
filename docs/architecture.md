# AI Second Brain — Architecture

This document describes the current architecture of the AI Second Brain.

**Capture knowledge and retrieve it using semantic search.**

---

# Languages and Runtimes

- **TypeScript** — primary language for all frontend and backend code
- **Node.js** — runtime environment for the Next.js server

---

# Frameworks and Libraries

## Web Framework

- **Next.js 16** (App Router) — handles both the frontend UI and backend API routes in a single project
  - File-based routing: folders in `src/app/` map directly to URLs
  - API routes live in `src/app/api/*/route.ts`
  - Frontend pages live in `src/app/page.tsx`

## UI

- **React 19** — component-based UI library, used inside Next.js
- **Tailwind CSS** — utility-first CSS framework for styling
- **shadcn/ui** — pre-built component library built on Tailwind (Button, Card, Input, Textarea)

## Database Client

- **@supabase/supabase-js** — official Supabase JavaScript client, used to query the database and call stored functions

## AI / Embeddings

- **openai (npm package)** — official OpenAI JavaScript SDK, used to call the embeddings API
- **Model**: `text-embedding-3-small` — converts text into a 1536-dimensional vector

---

# Infrastructure

## Database

- **Supabase** — hosted PostgreSQL database
- **pgvector** — PostgreSQL extension that adds a `vector` data type and cosine distance operator (`<=>`) for similarity search

### Database Schema

```sql
notes table:
  id          uuid (primary key, auto-generated)
  title       text
  content     text
  embedding   vector(1536)
  created_at  timestamp with time zone
```

### Stored Function

```sql
match_notes(query_embedding vector, match_count int)
  → returns top N notes ranked by cosine similarity
  → similarity = 1 - (embedding <=> query_embedding)
```

## External APIs

- **OpenAI API** — called server-side to generate embeddings
  - Endpoint: `POST https://api.openai.com/v1/embeddings`
  - Model: `text-embedding-3-small`
  - Output: array of 1536 floats

---

# API Routes

| Route | Method | Purpose |
|---|---|---|
| `/api/notes` | GET | Fetch all saved notes, ordered newest first |
| `/api/notes` | POST | Save a new note — embeds content and inserts into Supabase |
| `/api/search` | POST | Search notes by meaning — embeds query, calls `match_notes()`, filters results above 30% similarity |

---

# Architecture Flow

## Save Note

```
User fills form → POST /api/notes
  → OpenAI embeds note content → 1536 numbers
  → Supabase inserts { title, content, embedding }
  → Note is now searchable
```

## Search Notes

```
User types query → POST /api/search
  → OpenAI embeds query → 1536 numbers
  → Supabase.rpc("match_notes") compares against all stored embeddings
  → Returns top 5 results ranked by cosine similarity
  → Filter: only return results above 30% match
  → Frontend displays results with similarity percentage
```

---

# Environment Variables

Stored in `.env.local` (not committed to GitHub):

```
NEXT_PUBLIC_SUPABASE_URL      — Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY — Supabase public API key
OPENAI_API_KEY                — OpenAI secret key
```

---

# Project Structure

```
src/
  app/
    api/
      notes/route.ts    → Save + fetch notes API
      search/route.ts   → Semantic search API
    page.tsx            → Main dashboard UI
    layout.tsx          → Root layout
  lib/
    supabase.ts         → Supabase client instance
    openai.ts           → OpenAI client instance
  components/ui/        → shadcn/ui components
docs/
  architecture.md       → This file
  roadmap.md            → Version roadmap
  philosophy.md         → Design philosophy (CODE framework)
  database.md           → Database schema and SQL
scripts/
  seed-notes.ts         → Script to populate DB with 12 test notes
