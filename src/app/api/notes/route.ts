import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("notes")
      .select("id, title, content, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Mini-Step 1: Grab data from frontend
    const body = await request.json();
    const { title, content } = body;

    // Mini-Step 2: Send content to OpenAI, get embedding back
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: content,
    });
    const embedding = embeddingResponse.data[0].embedding;

    // Mini-Step 3: Save to Supabase
    const { data, error } = await supabase
      .from("notes")
      .insert({
        title,
        content,
        embedding,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, note: data });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save note" },
      { status: 500 }
    );
  }
}
