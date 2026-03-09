'use client';

import React, { useRef, useEffect } from 'react';
import { 
  Layout, 
  User,
  Bot,
  Sparkles,
  Settings as SettingsIcon,
} from 'lucide-react';
import ChatInput from './ChatInput';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface SidebarProps {
  files: Record<string, string>;
  messages: Message[];
  prompt: string;
  setPrompt: (val: string) => void;
  handleGenerate: () => void;
  isGenerating: boolean;
  onOpenSettings: () => void;
}

export default function Sidebar({ 
  messages, 
  prompt, 
  setPrompt, 
  handleGenerate, 
  isGenerating,
  onOpenSettings
}: SidebarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isGenerating]);

  return (
    <aside className="w-[350px] h-full bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shadow-xl z-20 overflow-hidden relative shrink-0">
      {/* Sidebar Header */}
      <div className="p-4 flex items-center justify-between border-b border-slate-800 shrink-0 bg-slate-900/50 backdrop-blur-md">
        <div className="flex items-center gap-2.5 font-bold text-white">
          <div className="bg-blue-600 p-1.5 rounded-lg shadow-lg shadow-blue-900/20">
            <Layout className="w-5 h-5 text-white" />
          </div>
          <span className="tracking-tight text-lg">v0 Clone</span>
        </div>
        <button 
          onClick={onOpenSettings}
          className="p-1.5 hover:bg-slate-800 rounded-md transition-colors text-slate-500 hover:text-white"
        >
          <SettingsIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`
                shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                ${msg.role === 'assistant' 
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
                  : 'bg-slate-700 text-slate-300 border border-slate-600'}
              `}>
                {msg.role === 'assistant' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>
              <div className={`
                max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed
                ${msg.role === 'assistant' 
                  ? 'bg-slate-800/50 text-slate-200 rounded-tl-none border border-slate-700/50' 
                  : 'bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-900/10'}
              `}>
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isGenerating && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="shrink-0 w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center animate-pulse">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="bg-slate-800/50 p-3 rounded-2xl rounded-tl-none border border-slate-700/50 flex gap-1">
              <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Section */}
      <div className="p-4 bg-slate-900/50 backdrop-blur-2xl border-t border-slate-800/50 relative">
        <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
        
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition-opacity duration-500" />
          <div className="relative bg-slate-950/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl focus-within:border-blue-500/40 transition-all duration-300 ring-1 ring-white/5">
            <ChatInput 
              prompt={prompt}
              setPrompt={setPrompt}
              handleGenerate={handleGenerate}
              isGenerating={isGenerating}
              compact
            />
          </div>
        </div>
        
        <p className="text-[10px] text-slate-500 text-center mt-3 font-bold uppercase tracking-[0.2em] opacity-30">
          Powered by Sitepins
        </p>
      </div>
    </aside>
  );
}
