import React, { useState, useEffect } from 'react';
import { X, Save, Key, User, Settings } from 'lucide-react';
import type { Settings as SettingsType } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: SettingsType) => void;
  initialSettings: SettingsType;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialSettings,
}) => {
  const [settings, setSettings] = useState<SettingsType>(initialSettings);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSettings(initialSettings);
    }
  }, [isOpen, initialSettings]);

  const handleSave = () => {
    setLoading(true);
    // Simulate async save
    setTimeout(() => {
      onSave(settings);
      setLoading(false);
      onClose();
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-800 w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-lime-400 flex items-center gap-2">
          <Settings className="w-6 h-6" />
          Settings
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center gap-2">
              <Key className="w-4 h-4 text-lime-400" />
              OpenRouter API Key
            </label>
            <input
              type="password"
              value={settings.openRouterKey}
              onChange={(e) => setSettings({ ...settings, openRouterKey: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-500/50 transition-all"
              placeholder="sk-or-..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Required for accessing most models.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center gap-2">
              <Key className="w-4 h-4 text-purple-400" />
              Hugging Face API Key
            </label>
            <input
              type="password"
              value={settings.huggingFaceKey}
              onChange={(e) => setSettings({ ...settings, huggingFaceKey: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              placeholder="hf_..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Optional for some specialized models.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-400" />
              System Prompt
            </label>
            <textarea
              value={settings.systemPrompt}
              onChange={(e) => setSettings({ ...settings, systemPrompt: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all min-h-[100px]"
              placeholder="You are a helpful AI assistant..."
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-2 bg-lime-500 text-black rounded-lg font-medium hover:bg-lime-400 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
