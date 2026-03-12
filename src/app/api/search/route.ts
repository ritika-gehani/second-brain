import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    // Mini-Step 1: Receive search query from frontend
    const body = await request.json();
    const { query } = body;

    // Mini-Step 2: Send query to OpenAI, get embedding back
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: query,
    });
    const queryEmbedding = embeddingResponse.data[0].embedding;

    // Mini-Step 3: Call match_notes() in Supabase to find similar notes
    const { data, error } = await supabase.rpc("match_notes", {
      query_embedding: queryEmbedding,
      match_count: 5,
    });

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to search notes" },
      { status: 500 }
    );
  }
}
