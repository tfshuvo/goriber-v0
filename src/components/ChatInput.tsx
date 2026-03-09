'use client';

import React from 'react';
import { Send, Sparkles, Paperclip, Command } from 'lucide-react';

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
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleGenerate();
    }
  };

  return (
    <div className={`relative flex flex-col w-full transition-all duration-300 ${compact ? 'p-2' : 'p-3'}`}>
      <textarea 
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Describe the application you want to build..."
        className={`
          w-full bg-transparent resize-none outline-none 
          text-slate-200 placeholder:text-slate-500 
          transition-all duration-300
          ${compact ? 'min-h-[44px] text-sm' : 'min-h-[100px] text-base'}
        `}
      />
      
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/50">
        <div className="flex items-center gap-1.5">
          <button className="p-2 hover:bg-slate-800 rounded-xl transition-all text-slate-500 hover:text-slate-300 group">
            <Paperclip className="w-4 h-4 group-hover:rotate-12 transition-transform" />
          </button>
          <button className="p-2 hover:bg-slate-800 rounded-xl transition-all text-slate-500 hover:text-slate-300 group">
            <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </button>
          {!compact && (
            <div className="hidden sm:flex items-center gap-1.5 ml-2 px-2 py-1 bg-slate-800/50 rounded-lg border border-slate-700/50">
              <Command className="w-3 h-3 text-slate-500" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Enter</span>
            </div>
          )}
        </div>
        
        <button 
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all duration-300
            ${prompt.trim() 
              ? 'bg-blue-600 text-white hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] active:scale-95' 
              : 'bg-slate-800 text-slate-600 cursor-not-allowed'}
          `}
        >
          {isGenerating ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span className={compact ? 'hidden' : 'inline'}>Generate</span>
              <Send className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
