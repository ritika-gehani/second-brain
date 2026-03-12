# AI Second Brain — Architecture

This document describes the Version 1 architecture of the AI Second Brain.

Version 1 focuses on the core functionality:

**Capture knowledge and retrieve it using semantic search.**

---

# System Components

## Frontend

Next.js will be used to build the user interface.

Responsibilities:

- Add Note form
- Notes list
- Search interface

---

## Backend

Next.js API routes will handle backend logic.

Responsibilities:

- process note ingestion
- generate embeddings
- query the database
- perform semantic search

---

## Database

Supabase will host a PostgreSQL database.

Responsibilities:

- store notes
- store embeddings

---

## Vector Search

The database will use the **pgvector** extension.

pgvector allows PostgreSQL to store embeddings and perform similarity search.

This enables the system to find notes based on meaning rather than exact keyword matches.

---

## Embeddings

An embedding model from OpenAI or Gemini will convert text into numerical vectors.

These embeddings allow semantic similarity comparisons between queries and stored content.

---

# Architecture Flow
