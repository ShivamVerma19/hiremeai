export type ChatMessage = { role: "user" | "assistant"; content: string };

export type Conversation = {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: number;
};

const STORAGE_KEY = "hiremeai:conversations";

export function loadConversations(): Conversation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Conversation[];
  } catch {
    return [];
  }
}

export function saveConversations(conversations: Conversation[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  } catch {
    // storage unavailable — fail silently
  }
}

export function makeTitle(question: string): string {
  const trimmed = question.trim();
  return trimmed.length > 42 ? trimmed.slice(0, 42) + "…" : trimmed;
}