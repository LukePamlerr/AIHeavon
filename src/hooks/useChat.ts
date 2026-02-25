import { useState, useEffect, useCallback, useRef } from 'react';
import { DEFAULT_SETTINGS } from '../types';
import type { Chat, Message, Settings } from '../types';
import { streamOpenRouterCompletion } from '../lib/openrouter';

const STORAGE_KEY = 'aiheavon-chats';
const SETTINGS_KEY = 'aiheavon-settings';

export function useChat() {
  const [chats, setChats] = useState<Chat[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });
  
  const chatsRef = useRef(chats);
  useEffect(() => {
    chatsRef.current = chats;
  }, [chats]);

  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<Settings>(() => {
    const stored = localStorage.getItem(SETTINGS_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
  });

  const activeChat = chats.find((c) => c.id === activeChatId) || null;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const createChat = useCallback((modelId: string = 'openai/gpt-3.5-turbo') => {
    const newChat: Chat = {
      id: crypto.randomUUID(),
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
      model: modelId,
    };
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    return newChat.id;
  }, []);

  const deleteChat = useCallback((id: string) => {
    setChats((prev) => prev.filter((c) => c.id !== id));
    if (activeChatId === id) {
      setActiveChatId(null);
    }
  }, [activeChatId]);

  const sendMessage = useCallback(async (content: string, modelId: string, chatId?: string) => {
    const targetChatId = chatId || activeChatId;
    if (!targetChatId) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      createdAt: Date.now(),
    };

    // Update state with user message
    setChats((prev) => prev.map((chat) => {
      if (chat.id === targetChatId) {
        return {
          ...chat,
          messages: [...chat.messages, userMessage],
          title: chat.messages.length === 0 ? content.slice(0, 30) : chat.title,
        };
      }
      return chat;
    }));

    setLoading(true);

    const assistantMessageId = crypto.randomUUID();
    
    // Optimistic update for assistant message
    setChats((prev) => prev.map((chat) => {
      if (chat.id === targetChatId) {
        return {
          ...chat,
          messages: [...chat.messages, {
            id: assistantMessageId,
            role: 'assistant',
            content: '',
            createdAt: Date.now(),
          }],
        };
      }
      return chat;
    }));

    // Get latest chats from ref to ensure we have the newly created chat if applicable
    // Note: The above setChats calls are async, so chatsRef.current MIGHT not have the userMessage yet 
    // if we read it immediately.
    // However, we can construct the context manually.
    
    // Find the chat in the ref (which has 'current' state before the above setChats if they haven't rendered yet)
    // If it's a new chat created in the same tick, it might NOT be in chatsRef yet because useEffect hasn't run!
    // This is the tricky part.
    // If we just created chat, chatsRef.current doesn't have it.
    
    // Solution: If we just created it, we know it's empty.
    // If it's existing, it's in Ref.
    
    let history: Message[] = [];
    const existingChat = chatsRef.current.find(c => c.id === targetChatId);
    
    if (existingChat) {
      history = existingChat.messages;
    } 
    // If not in Ref, it's brand new (created in this event loop).
    // So history is empty.
    
    // Now append the user message we just sent.
    const contextMessages = [
      { role: 'system', content: settings.systemPrompt },
      ...history.map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content },
    ];

    await streamOpenRouterCompletion(
      modelId,
      contextMessages,
      settings.openRouterKey,
      (chunk) => {
        setChats((prev) => prev.map((chat) => {
          if (chat.id === targetChatId) {
            const messages = chat.messages.map((msg) => {
              if (msg.id === assistantMessageId) {
                return { ...msg, content: msg.content + chunk };
              }
              return msg;
            });
            return { ...chat, messages };
          }
          return chat;
        }));
      },
      (error) => {
        console.error('Chat Error:', error);
        setChats((prev) => prev.map((chat) => {
            if (chat.id === targetChatId) {
              const messages = chat.messages.map((msg) => {
                if (msg.id === assistantMessageId) {
                  return { ...msg, content: msg.content + `\n\n**Error:** ${error}` };
                }
                return msg;
              });
              return { ...chat, messages };
            }
            return chat;
          }));
      },
      () => {
        setLoading(false);
      }
    );
  }, [activeChatId, settings]); // Removed chats from dependency to avoid recreation

  return {
    chats,
    activeChat,
    activeChatId,
    loading,
    settings,
    createChat,
    deleteChat,
    setActiveChatId,
    sendMessage,
    setSettings,
  };
}