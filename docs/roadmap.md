# AI Second Brain — Roadmap

This document outlines possible future directions for the AI Second Brain project.

These are **ideas I currently have for how the project could evolve**, but they are not fixed plans. As I build and learn more about the system, these ideas may change or expand.

---

# Version 1 — Capture + Retrieval (Current)

Goal:

Build a simple system that allows users to **save knowledge and retrieve it later using semantic search**.

Features:

- save notes or articles
- store text in a database
- generate embeddings
- store embeddings using pgvector
- semantic search over saved content

Example:

User query:

"Find the article I saved about vector databases."

The system retrieves the most relevant saved content.

---

# Version 2 — Content Ingestion

Goal:

Let users **ingest content from multiple sources** instead of only manual copy-paste.

Features:

- paste an article URL → scrape text and save as a note
- paste a YouTube URL → extract transcript and save as a note
- upload a PDF → parse text and save as a note
- connect Notion → import pages as notes
- connect Google Docs → import documents as notes
- connect Twitter/X → import bookmarked tweets and threads as notes

All ingestion methods follow the same pattern:

Source → Extract text → Generate embedding → Store in Supabase → Searchable

Example:

User pastes: `https://www.youtube.com/watch?v=abc123`

The system extracts the video transcript, generates an embedding, and saves it as a searchable note.

---

# Version 3 — Knowledge Connections

Another possible direction is connecting related concepts together.

Example:

Embeddings  
↳ vector databases  
↳ semantic search  
↳ RAG pipelines  

This could help surface relationships between ideas stored in the system.

---

# Future Exploration

Other ideas that could be explored later:

- browser extension for saving content
- automatic article ingestion
- knowledge graphs
- AI agents that process saved knowledge

These are exploratory ideas and may change as the project evolves.