const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

export type ChatMessage = { role: "user" | "assistant"; content: string };

export async function streamChat(
  messages: ChatMessage[],
  onChunk: (chunk: string) => void
): Promise<void> {
  const res = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  if (!res.ok || !res.body) {
    throw new Error(`Request failed: ${res.status}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    onChunk(decoder.decode(value, { stream: true }));
  }
}