import { NextRequest } from "next/server";

const ZAI_API_URL =
  "https://api.z.ai/api/coding/paas/v4/chat/completions";

const modeInstructions: Record<string, string> = {
  explain:
    "Explain concepts clearly and accessibly. Define terms when needed. Help the reader understand the text deeply.",
  summarize:
    "Provide concise, insightful summaries. Extract key takeaways and central arguments. Be direct.",
  argue:
    "Play devil's advocate. Challenge the text's assumptions, arguments, and conclusions. Be intellectually provocative but fair.",
  counterpoints:
    "Offer alternative perspectives and counterarguments from other thinkers, schools of thought, or critical traditions.",
};

export async function POST(req: NextRequest) {
  const apiKey = process.env.ZAI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "AI service not configured" },
      { status: 503 }
    );
  }

  let body: {
    messages: { role: string; content: string }[];
    bookTitle: string;
    bookAuthor: string;
    mode: string;
    selectedText?: string;
  };

  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { messages, bookTitle, bookAuthor, mode, selectedText } = body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: "Messages required" }, { status: 400 });
  }

  // Keep only the last 20 messages to stay within reasonable context
  const trimmedMessages = messages.slice(-20);

  const selectedTextBlock = selectedText
    ? [
        ``,
        `The reader has selected the following passage from the text:`,
        `---`,
        `"${selectedText}"`,
        `---`,
        `When they refer to "this passage", "this", "the text", etc., they mean the above.`,
      ].join("\n")
    : "";

  const systemMessage = [
    `You are Xandria AI, an intelligent reading companion embedded in a digital book reader.`,
    `The reader is currently reading "${bookTitle}" by ${bookAuthor}.`,
    ``,
    `Your role: ${modeInstructions[mode] || modeInstructions.explain}`,
    ``,
    `Guidelines:`,
    `- Be concise but substantive. Aim for 2-4 paragraphs unless the question warrants more.`,
    `- Reference the specific text and its ideas when relevant.`,
    `- Be intellectually honest — acknowledge complexity and ambiguity.`,
    `- Never be sycophantic or vague. Provide genuine insight.`,
    `- Format with plain text. Use line breaks for paragraph separation.`,
    selectedTextBlock,
  ].join("\n");

  try {
    const response = await fetch(ZAI_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "glm-4.7",
        messages: [
          { role: "system", content: systemMessage },
          ...trimmedMessages,
        ],
        stream: true,
        temperature: 0.6,
        max_tokens: 1024,
        thinking: { type: "disabled" },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");
      console.error("[Chat API] Upstream error:", response.status, errorText);
      return Response.json(
        { error: "AI service error" },
        { status: 502 }
      );
    }

    const upstream = response.body;
    if (!upstream) {
      return Response.json({ error: "No response from AI" }, { status: 502 });
    }

    // Parse SSE from GLM and stream plain text to the client
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        const reader = upstream.getReader();
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (!line.startsWith("data: ")) continue;
              const data = line.slice(6).trim();
              if (data === "[DONE]") continue;

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  controller.enqueue(encoder.encode(content));
                }
              } catch {
                // Skip malformed chunks
              }
            }
          }
        } catch (err) {
          console.error("[Chat API] Stream error:", err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err) {
    console.error("[Chat API] Request error:", err);
    return Response.json({ error: "Failed to reach AI service" }, { status: 502 });
  }
}
