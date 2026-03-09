'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import SandpackPreviewComponent from '@/components/SandpackPreview';
import ChatInput from '@/components/ChatInput';
import SettingsModal from '@/components/SettingsModal';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout, Terminal, Cpu, Globe, Settings as SettingsIcon } from 'lucide-react';
import OpenAI from 'openai';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const initialFiles: Record<string, string> = {
  "/App.js": `export default function App() { return null; }`
};

export default function Home() {
  const [files, setFiles] = useState<Record<string, string>>(initialFiles);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      role: 'assistant', 
      content: "Hello! I'm ready to build your app. What should we create today?" 
    }
  ]);
  const [currentDependencies, setCurrentDependencies] = useState<Record<string, string>>({
    "react": "latest",
    "react-dom": "latest",
    "lucide-react": "latest",
    "framer-motion": "latest"
  });

  // Check for API key on mount
  useEffect(() => {
    const key = localStorage.getItem('openai_api_key');
    if (!key) {
      setTimeout(() => setShowSettings(true), 1000);
    }
  }, []);

  const handleUpdateApp = (newFiles: Record<string, string>, newDependencies: Record<string, string>) => {
    setFiles(prev => ({ ...prev, ...newFiles }));
    if (newDependencies && Object.keys(newDependencies).length > 0) {
      setCurrentDependencies(prev => ({ ...prev, ...newDependencies }));
    }
  };

  const handleGenerate = async (inputPrompt?: any) => {
    let activePrompt = "";
    if (typeof inputPrompt === 'string') {
      activePrompt = inputPrompt;
    } else {
      activePrompt = prompt;
    }

    if (!activePrompt || typeof activePrompt !== 'string' || !activePrompt.trim()) return;
    
    const key = localStorage.getItem('openai_api_key');
    if (!key) {
      setShowSettings(true);
      return;
    }

    const finalPrompt = activePrompt.trim();
    if (!hasStarted) setHasStarted(true);
    
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: finalPrompt };
    setMessages(prev => [...prev, userMsg]);
    setPrompt('');
    setIsGenerating(true);

    try {
      const openai = new OpenAI({ apiKey: key, dangerouslyAllowBrowser: true });
      
      const systemPrompt = `You are an expert React developer. Your task is to modify or create a multi-file React application using Tailwind CSS.
      
      CRITICAL: You MUST respond with a VALID JSON object in the following format:
      {
        "dependencies": { "dependency-name": "version", ... },
        "files": { "/filename.js": "content", ... }
      }

      Guidelines:
      1. Always include "/App.js" as the entry point.
      2. In "dependencies", ALWAYS include "react": "latest", "react-dom": "latest", and "lucide-react": "latest".
      3. For "recharts", also include "react-is": "latest" and "prop-types": "latest".
      4. Output ONLY the raw JSON object. No explanations.`;

      const apiMessages: any[] = [
        { role: "system", content: systemPrompt },
        { role: "system", content: `CURRENT PROJECT FILES:\n${JSON.stringify(files, null, 2)}` },
        ...messages.map(m => ({ role: m.role, content: m.content })),
        { role: "user", content: finalPrompt }
      ];

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: apiMessages,
        temperature: 0.7,
        response_format: { type: "json_object" }
      });

      const aiContent = response.choices[0]?.message?.content || "{}";
      const parsed = JSON.parse(aiContent);

      if (parsed.files) {
        handleUpdateApp(parsed.files, parsed.dependencies || {});
        const assistantMsg: Message = { 
          id: (Date.now() + 1).toString(), 
          role: 'assistant', 
          content: `Project updated! Modified: ${Object.keys(parsed.files).join(', ')}` 
        };
        setMessages(prev => [...prev, assistantMsg]);
      }
    } catch (error: any) {
      console.error(error);
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'assistant', 
        content: `Error: ${error.message}` 
      }]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      
      <AnimatePresence mode="wait">
        {!hasStarted ? (
          <motion.main 
            key="initial"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="h-screen bg-slate-950 flex flex-col items-center justify-center p-6 overflow-hidden relative"
          >
            <button 
              onClick={() => setShowSettings(true)}
              className="absolute top-6 right-6 p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors"
            >
              <SettingsIcon className="w-5 h-5" />
            </button>

            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-4xl text-center space-y-12 z-10"
            >
              <div className="flex flex-col items-center gap-6">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200" />
                  <div className="relative bg-slate-900 ring-1 ring-slate-800 p-6 rounded-3xl shadow-2xl">
                    <Layout className="w-16 h-16 text-blue-500" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h1 className="text-6xl sm:text-7xl font-black text-white tracking-tight">
                    Design. <span className="text-blue-500">Build.</span> Ship.
                  </h1>
                  <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed">
                    The fastest way to go from <span className="text-slate-200">idea to code.</span> 
                    Generate full-stack React applications instantly with AI.
                  </p>
                </div>
              </div>

              <div className="relative max-w-3xl mx-auto group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-[2.5rem] blur-xl opacity-20 group-focus-within:opacity-40 transition-opacity duration-500" />
                <div className="relative bg-slate-900/80 backdrop-blur-2xl border border-slate-700/50 p-3 rounded-[2rem] shadow-3xl shadow-blue-500/5 focus-within:border-blue-500/50 transition-all duration-500 ring-1 ring-white/5">
                  <ChatInput 
                    prompt={prompt}
                    setPrompt={setPrompt}
                    handleGenerate={handleGenerate}
                    isGenerating={isGenerating}
                  />
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <SuggestionCard icon={<Globe className="w-4 h-4" />} label="SaaS Platform" onClick={() => handleGenerate("Create a modern SaaS landing page with hero, features, and pricing sections.")} />
                <SuggestionCard icon={<Terminal className="w-4 h-4" />} label="Dashboard UI" onClick={() => handleGenerate("Build a dark mode admin dashboard with recharts for analytics.")} />
                <SuggestionCard icon={<Cpu className="w-4 h-4" />} label="AI Chat" onClick={() => handleGenerate("Design a clean AI chat interface with message history and animations.")} />
              </div>
            </motion.div>            
            <p className="absolute bottom-8 text-slate-500 text-xs font-medium uppercase tracking-[0.2em]">
              Powered by Sitepins
            </p>
          </motion.main>
        ) : (
          <motion.main 
            key="workspace"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="flex h-screen bg-slate-950 overflow-hidden text-slate-900"
          >
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
              className="flex-shrink-0 h-full"
            >
              <Sidebar 
                files={files}
                messages={messages}
                prompt={prompt}
                setPrompt={setPrompt}
                handleGenerate={handleGenerate}
                isGenerating={isGenerating}
                onOpenSettings={() => setShowSettings(true)}
              />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
              className="flex-1 h-full min-w-0 relative group"
            >
              <SandpackPreviewComponent files={files} dependencies={currentDependencies} />
              <AnimatePresence>
                {isGenerating && (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 z-50 pointer-events-none overflow-hidden bg-blue-500/5 backdrop-blur-[1px]"
                  >
                    <motion.div 
                      initial={{ top: "0%" }}
                      animate={{ top: "100%" }}
                      transition={{ 
                        duration: 2.5, 
                        repeat: Infinity, 
                        repeatType: "reverse",
                        ease: "easeInOut" 
                      }}
                      className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_20px_rgba(59,130,246,0.8)] opacity-70"
                    />
                    <div className="absolute top-4 right-6 flex items-center gap-2 bg-slate-900/80 text-white px-3 py-1.5 rounded-full border border-slate-700 backdrop-blur-md shadow-xl">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">AI Generating...</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.main>
        )}
      </AnimatePresence>
    </>
  );
}

function SuggestionCard({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-full text-slate-300 hover:text-white hover:border-slate-600 transition-all text-sm font-medium"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
