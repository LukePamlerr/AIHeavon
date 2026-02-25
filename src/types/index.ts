export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: number;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  model: string;
}

export interface Model {
  id: string;
  name: string;
  provider: 'openrouter' | 'huggingface';
  contextLength?: number;
}

export interface Settings {
  openRouterKey: string;
  huggingFaceKey: string;
  systemPrompt: string;
}

export const DEFAULT_SETTINGS: Settings = {
  openRouterKey: '',
  huggingFaceKey: '',
  systemPrompt: 'You are a helpful AI assistant.',
};
