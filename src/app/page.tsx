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
      
      {!hasStarted ? (
        <main className="h-screen bg-slate-950 flex flex-col items-center justify-center p-6 overflow-hidden relative">
          <button 
            onClick={() => setShowSettings(true)}
            className="absolute top-6 right-6 p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors"
          >
            <SettingsIcon className="w-5 h-5" />
          </button>

          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl text-center space-y-8 z-10"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="bg-blue-600 p-4 rounded-3xl shadow-2xl shadow-blue-500/20">
                <Layout className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-5xl font-black text-white tracking-tight">
                What can I build for you?
              </h1>
              <p className="text-slate-400 text-lg max-w-md mx-auto">
                Generate full-stack React applications with AI. Components, logic, and styles in seconds.
              </p>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-2 rounded-3xl shadow-2xl focus-within:border-blue-500/50 transition-all">
              <ChatInput 
                prompt={prompt}
                setPrompt={setPrompt}
                handleGenerate={handleGenerate}
                isGenerating={isGenerating}
              />
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <SuggestionCard icon={<Globe className="w-4 h-4" />} label="SaaS Landing Page" onClick={() => handleGenerate("Create a modern SaaS landing page with hero, features, and pricing sections.")} />
              <SuggestionCard icon={<Terminal className="w-4 h-4" />} label="Admin Dashboard" onClick={() => handleGenerate("Build a dark mode admin dashboard with recharts for analytics.")} />
              <SuggestionCard icon={<Cpu className="w-4 h-4" />} label="AI Chat App" onClick={() => handleGenerate("Design a clean AI chat interface with message history and animations.")} />
            </div>
          </motion.div>
          
          <p className="absolute bottom-8 text-slate-500 text-xs font-medium uppercase tracking-[0.2em]">
            Powered by Gemini & OpenAI
          </p>
        </main>
      ) : (
        <main className="flex h-screen bg-white overflow-hidden text-slate-900">
          <Sidebar 
            files={files}
            messages={messages}
            prompt={prompt}
            setPrompt={setPrompt}
            handleGenerate={handleGenerate}
            isGenerating={isGenerating}
            onOpenSettings={() => setShowSettings(true)}
          />
          <div className="flex-1 h-full min-w-0 relative group">
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
          </div>
        </main>
      )}
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
