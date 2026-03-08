'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Layout, 
  ChevronLeft,
  User,
  Bot,
  Sparkles,
  Settings as SettingsIcon,
  X,
  Key,
  Save,
  Check
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
}

export default function Sidebar({ 
  files, 
  messages, 
  prompt, 
  setPrompt, 
  handleGenerate, 
  isGenerating 
}: SidebarProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedKey = localStorage.getItem('openai_api_key');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (savedKey) setApiKey(savedKey);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isGenerating]);

  const handleSaveApiKey = () => {
    setSaveStatus('saving');
    localStorage.setItem('openai_api_key', apiKey);
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => {
        setSaveStatus('idle');
        setShowSettings(false);
      }, 1000);
    }, 500);
  };

  return (
    <aside className="w-[350px] bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shadow-xl z-20 overflow-hidden relative shrink-0">
      {/* Sidebar Header */}
      <div className="p-4 flex items-center justify-between border-b border-slate-800 shrink-0 bg-slate-900/50 backdrop-blur-md">
        <div className="flex items-center gap-2.5 font-bold text-white">
          <div className="bg-blue-600 p-1.5 rounded-lg shadow-lg shadow-blue-900/20">
            <Layout className="w-5 h-5 text-white" />
          </div>
          <span className="tracking-tight text-lg">v0 Clone</span>
        </div>
        <button 
          onClick={() => setShowSettings(true)}
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
      <div className="p-4 bg-slate-900/80 backdrop-blur-xl border-t border-slate-800">
        <ChatInput 
          prompt={prompt}
          setPrompt={setPrompt}
          handleGenerate={handleGenerate}
          isGenerating={isGenerating}
          compact
        />
        <p className="text-[10px] text-slate-500 text-center mt-3 font-medium uppercase tracking-widest opacity-50">
          Agentic AI powered by OpenAI
        </p>
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-30 flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl"
            >
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <SettingsIcon className="w-4 h-4 text-blue-400" />
                  Settings
                </h3>
                <button 
                  onClick={() => setShowSettings(false)}
                  className="p-1 hover:bg-slate-800 rounded-lg text-slate-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Key className="w-3 h-3" />
                    OpenAI API Key
                  </label>
                  <input 
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none focus:border-blue-500 transition-all placeholder:text-slate-700"
                  />
                  <p className="text-[10px] text-slate-500 leading-relaxed italic">
                    Your key is saved locally in your browser storage and never sent anywhere else except OpenAI&apos;s API.
                  </p>
                </div>
                <button 
                  onClick={handleSaveApiKey}
                  disabled={saveStatus !== 'idle'}
                  className={`
                    w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all
                    ${saveStatus === 'saved' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20'}
                  `}
                >
                  {saveStatus === 'saving' ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : saveStatus === 'saved' ? (
                    <>
                      <Check className="w-5 h-5" />
                      Saved
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Configuration
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
}
