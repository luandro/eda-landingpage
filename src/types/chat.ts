export type MessageType = "user" | "agent";

export interface Message {
  id: string;
  type: MessageType;
  content: string;
  timestamp: string;
  steps?: string[];
}

export interface Conversation {
  id: number;
  messages: Message[];
}

export interface ChatContent {
  conversations: Conversation[];
}
