/**
 * Chat Types
 * Type definitions for AI Chat Widget
 */

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatState {
  messages: ChatMessage[];
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ChatWidgetProps {
  initialOpen?: boolean;
  maxMessages?: number;
}
