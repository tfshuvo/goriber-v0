'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings as SettingsIcon, X, Key, Save, Check } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  useEffect(() => {
    const savedKey = localStorage.getItem('openai_api_key');
    if (savedKey) setApiKey(savedKey);
  }, [isOpen]);

  const handleSaveApiKey = () => {
    setSaveStatus('saving');
    localStorage.setItem('openai_api_key', apiKey);
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => {
        setSaveStatus('idle');
        onClose();
      }, 1000);
    }, 500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6"
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
                onClick={onClose}
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
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none focus:border-blue-500 transition-all placeholder:text-slate-700 font-mono"
                />
                <p className="text-[10px] text-slate-500 leading-relaxed italic">
                  Your key is saved locally in your browser storage and never sent anywhere else except OpenAI's API.
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
  );
}
