'use client';

import React from 'react';
import { Send, Sparkles, Paperclip } from 'lucide-react';

interface ChatInputProps {
  prompt: string;
  setPrompt: (val: string) => void;
  handleGenerate: () => void;
  isGenerating: boolean;
  compact?: boolean;
}

export default function ChatInput({ 
  prompt, 
  setPrompt, 
  handleGenerate, 
  isGenerating,
  compact = false 
}: ChatInputProps) {
  return (
    <div className={`flex flex-col gap-2 ${compact ? 'p-2' : 'p-4'}`}>
      <div className={`
        bg-slate-800/50 border border-slate-700 rounded-xl shadow-inner 
        focus-within:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all
        ${compact ? 'p-2' : 'p-3'}
      `}>
        <textarea 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask AI to build..."
          className="w-full bg-transparent resize-none outline-none text-slate-200 placeholder:text-slate-500 min-h-[60px] text-sm"
        />
        <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
          <div className="flex items-center gap-1">
            <button className="p-1.5 hover:bg-slate-100 rounded-md transition-colors text-slate-400">
              <Paperclip className="w-3.5 h-3.5" />
            </button>
            <button className="p-1.5 hover:bg-slate-100 rounded-md transition-colors text-slate-400">
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>
          <button 
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className={`
              p-1.5 rounded-lg transition-all
              ${prompt.trim() 
                ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95' 
                : 'bg-slate-100 text-slate-300 cursor-not-allowed'}
            `}
          >
            {isGenerating ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
