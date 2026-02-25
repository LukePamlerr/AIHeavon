import React, { useState, useRef, useEffect } from 'react';
import { Send, Upload } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || disabled) return;
    onSend(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  return (
    <form 
      onSubmit={handleSubmit} 
      className="max-w-4xl mx-auto w-full p-4 relative"
    >
      <div className="relative bg-gray-900 border border-gray-800 rounded-2xl flex items-end p-2 focus-within:ring-2 focus-within:ring-lime-500/50 transition-all">
        <button
          type="button"
          className="p-3 text-gray-500 hover:text-lime-400 transition-colors"
          title="Upload file (coming soon)"
          disabled
        >
          <Upload className="w-5 h-5" />
        </button>
        
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything..."
          className="w-full bg-transparent border-0 focus:ring-0 text-gray-100 placeholder-gray-500 resize-none py-3 max-h-[200px] overflow-y-auto"
          rows={1}
          disabled={disabled}
        />
        
        <button
          type="submit"
          disabled={!input.trim() || disabled}
          className={`p-3 rounded-xl transition-all ${
            input.trim() && !disabled
              ? 'bg-lime-500 text-black hover:bg-lime-400 shadow-[0_0_15px_rgba(132,204,22,0.3)]' 
              : 'bg-gray-800 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
      <div className="text-center text-xs text-gray-600 mt-2">
        AIHeavon can make mistakes. Consider checking important information.
      </div>
    </form>
  );
};

export default ChatInput;
