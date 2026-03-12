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

# Version 2 — Content Review

One idea is to help users revisit saved knowledge instead of forgetting it.

Possible features:

- mark notes as reviewed
- review queue
- reminders for saved content that hasn't been reviewed
- store chunked text for longer content
- store review metadata

Example:

"You saved this article two weeks ago but haven't reviewed it yet."

---

# Version 3 — Learning Tools

Another idea is to generate learning tools from saved content.

Possible features:

- summaries
- quiz questions
- reflection prompts

Example output:

Summary  
Vector embeddings convert text into numerical vectors used for semantic similarity search.

Question  
Why are embeddings required for vector search?

---

# Version 4 — Idea Generation

The system could analyze stored knowledge and suggest new ideas.

Possible features:

- project ideas
- writing prompts
- research connections

Example:

"You have saved several notes about RAG systems and developer tooling. You could build a tool that helps debug AI pipelines."

---

# Version 5 — Knowledge Connections

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