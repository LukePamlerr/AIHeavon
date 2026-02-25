import React, { useState, useEffect } from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';
import type { Model } from '../types';
import { fetchOpenRouterModels } from '../lib/openrouter';

interface ModelSelectorProps {
  currentModelId: string;
  onModelSelect: (modelId: string) => void;
  apiKey: string;
}

const DEFAULT_MODELS: Model[] = [
  { id: 'google/gemma-7b-it:free', name: 'Gemma 7B (Free)', provider: 'openrouter' },
  { id: 'mistralai/mistral-7b-instruct:free', name: 'Mistral 7B (Free)', provider: 'openrouter' },
  { id: 'huggingfaceh4/zephyr-7b-beta:free', name: 'Zephyr 7B (Free)', provider: 'openrouter' },
  { id: 'openai/gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'openrouter' },
  { id: 'openai/gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'openrouter' },
  { id: 'anthropic/claude-3-opus', name: 'Claude 3 Opus', provider: 'openrouter' },
  { id: 'anthropic/claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'openrouter' },
];

const ModelSelector: React.FC<ModelSelectorProps> = ({ currentModelId, onModelSelect, apiKey }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [models, setModels] = useState<Model[]>(DEFAULT_MODELS);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (apiKey && isOpen) {
      setLoading(true);
      fetchOpenRouterModels(apiKey).then((fetched) => {
        if (fetched.length > 0) {
            // Merge defaults with fetched, preferring fetched
            const merged = [...fetched];
            // Ensure defaults are there if fetch fails or is partial? No, fetch returns all.
            // But let's just use fetched if available.
            setModels(merged);
        }
        setLoading(false);
      });
    }
  }, [apiKey, isOpen]);

  const filteredModels = models.filter((m) => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    m.id.toLowerCase().includes(search.toLowerCase())
  );

  const currentModel = models.find((m) => m.id === currentModelId) || { name: currentModelId };

  return (
    <div className="relative z-20">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-lg text-sm text-gray-200 transition-colors"
      >
        <span className="truncate max-w-[150px] md:max-w-[200px]">{currentModel.name}</span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-2 w-72 max-h-96 bg-gray-950 border border-gray-800 rounded-xl shadow-2xl flex flex-col z-20 overflow-hidden">
            <div className="p-3 border-b border-gray-800">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search models..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-lime-500/50"
                  autoFocus
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-1">
              {loading ? (
                <div className="p-4 text-center text-gray-500 text-sm">Loading models...</div>
              ) : (
                filteredModels.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => {
                      onModelSelect(model.id);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between group ${
                      currentModelId === model.id 
                        ? 'bg-lime-900/20 text-lime-400' 
                        : 'text-gray-400 hover:bg-gray-900 hover:text-gray-200'
                    }`}
                  >
                    <div className="truncate">
                      <div className="font-medium text-gray-200 group-hover:text-white">{model.name}</div>
                      <div className="text-xs text-gray-600 truncate">{model.id}</div>
                    </div>
                    {currentModelId === model.id && <Check className="w-4 h-4" />}
                  </button>
                ))
              )}
              {filteredModels.length === 0 && !loading && (
                 <div className="p-4 text-center text-gray-500 text-sm">No models found</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ModelSelector;
