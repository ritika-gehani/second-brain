import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    // Mini-Step 1: Receive the URL from the frontend
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    // Mini-Step 2: Call Jina Reader to extract article text
    const jinaResponse = await fetch(`https://r.jina.ai/${url}`, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!jinaResponse.ok) {
      throw new Error("Failed to fetch article from Jina Reader");
    }

    const jinaData = await jinaResponse.json();

    // Mini-Step 3: Extract title and content from Jina's response
    const articleTitle = jinaData.data?.title || "Untitled Article";
    const articleContent = jinaData.data?.content || "";

    if (!articleContent) {
      return NextResponse.json(
        { error: "Could not extract content from URL" },
        { status: 400 }
      );
    }

    // Detect bot protection / paywall pages
    const blockedPhrases = [
      "security verification",
      "just a moment",
      "checking your browser",
      "enable javascript",
      "access denied",
    ];
    const lowerContent = articleContent.toLowerCase();
    const isBlocked = blockedPhrases.some((phrase) => lowerContent.includes(phrase));

    if (isBlocked || articleContent.length < 100) {
      return NextResponse.json(
        { error: "This website blocked the article extraction. Try a different URL." },
        { status: 400 }
      );
    }

    // Mini-Step 4: Embed content and save to Supabase
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: articleContent,
    });
    const embedding = embeddingResponse.data[0].embedding;

    const { data, error } = await supabase
      .from("notes")
      .insert({
        title: articleTitle,
        content: articleContent,
        embedding,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, note: data });
  } catch (error) {
    console.error("URL ingestion error:", error);
    return NextResponse.json(
      { error: "Failed to ingest URL" },
      { status: 500 }
    );
  }
}
