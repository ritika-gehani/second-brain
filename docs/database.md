# AI Second Brain — Database Setup

This document contains the SQL required to create the database schema for the AI Second Brain project. We will be adding to this during development.

The database is hosted using **Supabase**, which runs **PostgreSQL**.

We use the **pgvector extension** to store embeddings and perform semantic similarity search.

---

# Step 1 — Enable pgvector

pgvector allows PostgreSQL to store and search vector embeddings.

Run this command in the Supabase SQL editor:

```sql
create extension if not exists vector;
```

---

# Step 2 — Create the notes table

This table stores all saved notes and their embeddings.

```sql
create table notes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  embedding vector(1536),
  created_at timestamp with time zone default now()
);
```

---

# Step 3 — Create the similarity search function

This function takes a query embedding and returns the most similar notes.

```sql
create or replace function match_notes (
  query_embedding vector(1536),
  match_count int default 5
)
returns table (
  id uuid,
  title text,
  content text,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    notes.id,
    notes.title,
    notes.content,
    1 - (notes.embedding <=> query_embedding) as similarity
  from notes
  order by notes.embedding <=> query_embedding
  limit match_count;
end;
$$;