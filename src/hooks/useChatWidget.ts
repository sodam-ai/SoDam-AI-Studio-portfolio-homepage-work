'use client';

import { useState, useCallback } from 'react';
import type { ChatState, ChatMessage } from '@/types/chat';

const MAX_MESSAGES = 50;

export function useChatWidget(initialOpen = false) {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isOpen: initialOpen,
    isLoading: false,
    error: null
  });

  const toggleWidget = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: !prev.isOpen }));
  }, []);

  const closeWidget = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const openWidget = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: true }));
  }, []);

  const addMessage = useCallback((role: 'user' | 'assistant', content: string) => {
    const newMessage: ChatMessage = {
      id: `${Date.now()}-${Math.random()}`,
      role,
      content,
      timestamp: Date.now()
    };

    setState((prev) => {
      const updatedMessages = [...prev.messages, newMessage];

      // Keep only last MAX_MESSAGES
      if (updatedMessages.length > MAX_MESSAGES) {
        updatedMessages.shift();
      }

      return {
        ...prev,
        messages: updatedMessages,
        error: null
      };
    });
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    // Add user message
    addMessage('user', content);

    // Set loading state
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // TODO: Replace with actual API call in TASK-032
      // Simulate API call for now
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockResponse = `I received your message: "${content}". The Gemini API integration will be implemented in TASK-032 by Codex. For now, this is a placeholder response.`;

      addMessage('assistant', mockResponse);
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to send message'
      }));
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [addMessage]);

  const clearMessages = useCallback(() => {
    setState((prev) => ({ ...prev, messages: [], error: null }));
  }, []);

  return {
    ...state,
    toggleWidget,
    closeWidget,
    openWidget,
    sendMessage,
    clearMessages
  };
}
