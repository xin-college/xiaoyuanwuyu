import React, { useState, useEffect } from 'react';
import { Settings, Key, Globe, Cpu, CheckCircle2, XCircle, Loader2, ChevronLeft, Sparkles, Wand2, Box, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import OpenAI from 'openai';
import { GameSettings } from '../types';

interface ConfigScreenProps {
  settings: GameSettings;
  onSave: (settings: GameSettings) => void;
  onBack: () => void;
}

export const ConfigScreen: React.FC<ConfigScreenProps> = ({ settings, onSave, onBack }) => {
  const [localSettings, setLocalSettings] = useState<GameSettings>(settings);
  const [testStatus, setTestStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleTestConnection = async () => {
    if (!localSettings.apiKey.trim()) {
      setTestStatus('error');
      setErrorMessage('请输入 API 密钥');
      return;
    }

    setTestStatus('loading');
    setErrorMessage('');

    try {
      if (localSettings.provider === 'gemini') {
        const ai = new GoogleGenAI({ apiKey: localSettings.apiKey });
        const response = await ai.models.generateContent({
          model: localSettings.modelName || "gemini-3-flash-preview",
          contents: [{ role: 'user', parts: [{ text: "Hello, are you connected?" }] }],
        });
        if (response.text) {
          setTestStatus('success');
        } else {
          throw new Error('未收到有效响应');
        }
      } else {
        const openai = new OpenAI({
          apiKey: localSettings.apiKey,
          baseURL: localSettings.baseUrl,
          dangerouslyAllowBrowser: true
        });
        const response = await openai.chat.completions.create({
          model: localSettings.modelName,
          messages: [{ role: 'user', content: "Hello, are you connected?" }],
          max_tokens: 10
        });
        if (response.choices[0]?.message?.content) {
          setTestStatus('success');
        } else {
          throw new Error('未收到有效响应');
        }
      }
    } catch (error: any) {
      console.error("Connection Test Error:", error);
      setTestStatus('error');
      setErrorMessage(error.message || '连接失败，请检查配置');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-brand-bg p-4 py-12 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-white/80 backdrop-blur-xl rounded-[40px] shadow-2xl border border-white/60 overflow-hidden"
      >
        <div className="p-8 md:p-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <button 
                onClick={onBack}
                className="p-3 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-colors text-slate-500"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div>
                <h2 className="text-2xl font-black text-slate-800">API 配置</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Model & Connection Settings</p>
              </div>
            </div>
            <div className="w-12 h-12 bg-brand-purple rounded-2xl flex items-center justify-center shadow-lg shadow-brand-purple/20">
              <Settings className="w-6 h-6 text-white" />
            </div>
          </div>

          <div className="space-y-8">
            {/* Main Key Input */}
            <div className="space-y-4">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-black text-slate-700 flex items-center gap-2">
                  <Key className="w-4 h-4 text-brand-pink" /> 粘贴你的 API 密钥
                </label>
                <a 
                  href={localSettings.provider === 'gemini' ? "https://aistudio.google.com/app/apikey" : "https://platform.openai.com/api-keys"} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-[10px] font-bold text-brand-purple flex items-center gap-1 hover:underline"
                >
                  获取密钥 <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
              <input 
                type="password" 
                value={localSettings.apiKey}
                onChange={e => setLocalSettings(prev => ({ ...prev, apiKey: e.target.value }))}
                placeholder={localSettings.provider === 'gemini' ? "在此粘贴 Gemini API Key..." : "在此粘贴 OpenAI API Key..."}
                className="w-full px-6 py-5 bg-white border-2 border-slate-100 rounded-[24px] focus:outline-none focus:ring-4 focus:ring-brand-pink/10 focus:border-brand-pink/40 transition-all font-bold text-slate-700 shadow-sm text-center tracking-widest"
              />
              <p className="text-[10px] text-slate-400 font-bold text-center px-4">
                密钥将仅保存在你的浏览器和云存档中，不会被泄露给第三方。
              </p>
            </div>

            {/* Advanced Settings Toggle */}
            <div className="pt-2 border-t border-slate-50">
              <button 
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-50 rounded-2xl transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-slate-400 group-hover:text-brand-purple transition-colors" />
                  <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">高级设置 (可选)</span>
                </div>
                {showAdvanced ? <ChevronUp className="w-4 h-4 text-slate-300" /> : <ChevronDown className="w-4 h-4 text-slate-300" />}
              </button>

              <AnimatePresence>
                {showAdvanced && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 space-y-6 pt-6">
                      {/* Provider Selection */}
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 ml-1 flex items-center gap-2">
                          <Box className="w-3 h-3" /> 服务商 (PROVIDER)
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => setLocalSettings(prev => ({ 
                              ...prev, 
                              provider: 'gemini',
                              baseUrl: 'https://generativelanguage.googleapis.com',
                              modelName: 'gemini-1.5-flash-latest'
                            }))}
                            className={`py-3 rounded-xl text-xs font-bold transition-all border-2 ${
                              localSettings.provider === 'gemini' 
                                ? 'bg-brand-purple border-brand-purple text-white shadow-md' 
                                : 'bg-white border-slate-100 text-slate-400 hover:border-brand-purple/30'
                            }`}
                          >
                            Google Gemini
                          </button>
                          <button
                            onClick={() => setLocalSettings(prev => ({ 
                              ...prev, 
                              provider: 'openai',
                              baseUrl: 'https://api.openai.com/v1',
                              modelName: 'gpt-4o-mini'
                            }))}
                            className={`py-3 rounded-xl text-xs font-bold transition-all border-2 ${
                              localSettings.provider === 'openai' 
                                ? 'bg-brand-pink border-brand-pink text-white shadow-md' 
                                : 'bg-white border-slate-100 text-slate-400 hover:border-brand-pink/30'
                            }`}
                          >
                            OpenAI / Other
                          </button>
                        </div>
                      </div>

                      {/* API Endpoint & Model */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 ml-1 flex items-center gap-2">
                            <Globe className="w-3 h-3" /> 端点 (ENDPOINT)
                          </label>
                          <input 
                            type="text" 
                            value={localSettings.baseUrl}
                            onChange={e => setLocalSettings(prev => ({ ...prev, baseUrl: e.target.value }))}
                            className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl focus:outline-none focus:border-brand-purple/40 font-bold text-[11px] text-slate-600"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 ml-1 flex items-center gap-2">
                            <Cpu className="w-3 h-3" /> 模型 (MODEL)
                          </label>
                          <input 
                            type="text" 
                            value={localSettings.modelName}
                            onChange={e => setLocalSettings(prev => ({ ...prev, modelName: e.target.value }))}
                            className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl focus:outline-none focus:border-brand-purple/40 font-bold text-[11px] text-slate-600"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Test Status */}
            <AnimatePresence mode="wait">
              {testStatus !== 'idle' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`p-5 rounded-3xl border flex items-center gap-4 ${
                    testStatus === 'loading' ? 'bg-slate-50 border-slate-100 text-slate-500' :
                    testStatus === 'success' ? 'bg-green-50 border-green-100 text-green-600' :
                    'bg-red-50 border-red-100 text-red-600'
                  }`}
                >
                  {testStatus === 'loading' ? <Loader2 className="w-6 h-6 animate-spin" /> :
                   testStatus === 'success' ? <CheckCircle2 className="w-6 h-6" /> :
                   <XCircle className="w-6 h-6" />}
                  <div className="flex-1">
                    <p className="text-sm font-black">
                      {testStatus === 'loading' ? '正在测试连接...' :
                       testStatus === 'success' ? '连接成功！API 已就绪' :
                       '连接失败'}
                    </p>
                    {errorMessage && <p className="text-[10px] font-bold opacity-80 mt-0.5">{errorMessage}</p>}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <button 
                onClick={handleTestConnection}
                disabled={testStatus === 'loading'}
                className="flex-1 py-5 bg-white border-2 border-brand-purple text-brand-purple rounded-3xl font-black hover:bg-brand-purple/5 transition-all flex items-center justify-center gap-2"
              >
                {testStatus === 'loading' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
                测试连接
              </button>
              <button 
                onClick={() => onSave(localSettings)}
                className="flex-[1.5] py-5 bg-brand-pink text-white rounded-3xl font-black shadow-xl shadow-brand-pink/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                保存并应用
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
