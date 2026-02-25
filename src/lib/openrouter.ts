import type { Model } from '../types';

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

export async function fetchOpenRouterModels(apiKey: string): Promise<Model[]> {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'AIHeavon',
    };
    
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const response = await fetch(`${OPENROUTER_BASE_URL}/models`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      console.error('Failed to fetch OpenRouter models:', response.statusText);
      return [];
    }

    const data = await response.json();
    return data.data.map((m: any) => ({
      id: m.id,
      name: m.name,
      provider: 'openrouter',
      contextLength: m.context_length,
    }));
  } catch (error) {
    console.error('Error fetching OpenRouter models:', error);
    return [];
  }
}

export async function streamOpenRouterCompletion(
  modelId: string,
  messages: { role: string; content: string }[],
  apiKey: string,
  onChunk: (chunk: string) => void,
  onError: (error: string) => void,
  onFinish: () => void
) {
  try {
    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'AIHeavon',
      },
      body: JSON.stringify({
        model: modelId,
        messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      onError(errorData.error?.message || `Failed to generate response: ${response.statusText}`);
      onFinish();
      return;
    }

    const reader = response.body?.getReader();
    if (!reader) {
      onError('Response body is empty');
      onFinish();
      return;
    }

    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter((line) => line.trim() !== '');

      for (const line of lines) {
        if (line === 'data: [DONE]') return;
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            const content = data.choices[0]?.delta?.content || '';
            if (content) onChunk(content);
          } catch (e) {
            console.error('Error parsing chunk:', e);
          }
        }
      }
    }
  } catch (error) {
    onError(error instanceof Error ? error.message : 'Unknown error');
  } finally {
    onFinish();
  }
}
