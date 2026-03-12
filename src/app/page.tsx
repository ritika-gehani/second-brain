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

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

export default function Home() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          AI Second Brain
        </h1>
        <p className="mb-8 text-zinc-500 dark:text-zinc-400">
          Save knowledge and retrieve it later using semantic search.
        </p>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add Note</CardTitle>
            <CardDescription>
              Save a note or article to your second brain.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
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
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <Button onClick={handleSaveNote} disabled={loading}>
              {loading ? "Saving..." : "Save Note"}
            </Button>
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

        <div>
          <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Saved Notes
          </h2>
          {notes.length === 0 ? (
            <p className="text-zinc-400">No notes saved yet.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {notes.map((note) => (
                <Card key={note.id}>
                  <CardHeader>
                    <CardTitle>{note.title}</CardTitle>
                    <CardDescription>
                      {new Date(note.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap text-zinc-600 dark:text-zinc-400">
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
  );
}
