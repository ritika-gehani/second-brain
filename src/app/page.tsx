"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

interface SearchResult {
  id: string;
  title: string;
  content: string;
  similarity: number;
}

export default function Home() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [noteType, setNoteType] = useState("text");
  const [url, setUrl] = useState("");

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    try {
      const response = await fetch("/api/notes");
      const data = await response.json();
      if (Array.isArray(data)) {
        setNotes(data);
      }
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    }
  }

  async function handleSaveNote() {
    if (!title.trim() || !content.trim()) {
      setMessage("Please fill in both title and content.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        throw new Error("Failed to save note");
      }

      setTitle("");
      setContent("");
      setMessage("Note saved successfully!");
      fetchNotes();
    } catch (error) {
      setMessage("Failed to save note. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleImportUrl() {
    if (!url.trim()) {
      setMessage("Please enter a URL.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/ingest/url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to import URL");
      }

      setUrl("");
      setMessage("Article imported successfully!");
      fetchNotes();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to import article. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch() {
    if (!query.trim()) {
      return;
    }

    setSearching(true);
    setSearchResults([]);

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error("Failed to search");
      }

      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setSearching(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          AI Second Brain
        </h1>
        <p className="mb-6 text-zinc-500 dark:text-zinc-400">
          Save knowledge and retrieve it later using semantic search.
        </p>

        <div className="mb-8 flex gap-2">
          <Input
            placeholder="Search your notes by meaning..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="max-w-xl"
          />
          <Button onClick={handleSearch} disabled={searching}>
            {searching ? "Searching..." : "Search"}
          </Button>
          {searchResults.length > 0 && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchResults([]);
                setQuery("");
              }}
            >
              Clear
            </Button>
          )}
        </div>

        {searchResults.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Top {searchResults.length} results
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {searchResults.map((result) => (
                <Card key={result.id}>
                  <CardHeader>
                    <CardTitle>{result.title}</CardTitle>
                    <CardDescription>
                      {Math.round(result.similarity * 100)}% match
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap text-sm text-zinc-600 dark:text-zinc-400">
                      {result.content}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Add Note</CardTitle>
                  <CardDescription>
                    Save a note or article to your second brain.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Note Type
                    </label>
                    <Select value={noteType} onValueChange={setNoteType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="url">URL Link</SelectItem>
                        <SelectItem value="import">Import from App</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {noteType === "text" && (
                    <>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          Title
                        </label>
                        <Input
                          placeholder="Note title..."
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          Content
                        </label>
                        <Textarea
                          placeholder="Write your note or paste an article..."
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          rows={6}
                        />
                      </div>
                    </>
                  )}

                  {noteType === "url" && (
                    <div>
                      <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        URL
                      </label>
                      <Input
                        placeholder="https://example.com/article..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                      />
                    </div>
                  )}

                  {noteType === "import" && (
                    <p className="text-sm text-zinc-500">
                      Import notes from Notion, Google Docs, or Twitter.
                    </p>
                  )}
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                  {noteType === "text" && (
                    <Button onClick={handleSaveNote} disabled={loading}>
                      {loading ? "Saving..." : "Save Note"}
                    </Button>
                  )}
                  {noteType === "url" && (
                    <Button onClick={handleImportUrl} disabled={loading || !url.trim()}>
                      {loading ? "Importing..." : "Import from URL"}
                    </Button>
                  )}
                  {noteType === "import" && (
                    <Button disabled>
                      Import
                    </Button>
                  )}
                  {message && (
                    <p
                      className={`text-sm ${
                        message.includes("successfully")
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {message}
                    </p>
                  )}
                </CardFooter>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                Saved Notes
              </h2>
              {notes.length === 0 ? (
                <p className="text-zinc-400">No notes saved yet.</p>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {notes.map((note) => (
                    <Card key={note.id}>
                      <CardHeader>
                        <CardTitle>{note.title}</CardTitle>
                        <CardDescription>
                          {new Date(note.created_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="whitespace-pre-wrap text-sm text-zinc-600 dark:text-zinc-400">
                          {note.content}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
        </div>
      </div>
    </div>
  );
}
