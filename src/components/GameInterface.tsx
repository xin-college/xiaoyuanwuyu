import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, Loader2, Sparkles, Save, LogOut, Heart, Users, ChevronDown, ChevronUp, Pencil, Menu, MessageSquare, PanelLeft, PanelRight, Sun, CloudRain, Cloud, Snowflake, Wind, CloudLightning, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { GameState, WeatherType } from '../types';

interface GameInterfaceProps {
  state: GameState;
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  onClosePopup: () => void;
  onMenu: () => void;
  onSave: () => void;
  onToggleLeft: () => void;
  onToggleRight: () => void;
  leftOpen: boolean;
  rightOpen: boolean;
}

export const GameInterface: React.FC<GameInterfaceProps> = ({ 
  state, 
  onSendMessage, 
  isLoading, 
  onClosePopup,
  onMenu,
  onSave,
  onToggleLeft,
  onToggleRight,
  leftOpen,
  rightOpen
}) => {
  const [input, setInput] = useState('');
  const [editingOptionIndex, setEditingOptionIndex] = useState<number | null>(null);
  const [editedOptionValue, setEditedOptionValue] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { history, location, time, round, activePopup, options, weather = '晴天' } = state;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
      setShowOptions(false);
      setEditingOptionIndex(null);
    }
  };

  const handleOptionClick = (option: string) => {
    if (isLoading) return;
    onSendMessage(option);
    setShowOptions(false);
    setEditingOptionIndex(null);
  };

  const startEditing = (index: number, option: string) => {
    setEditingOptionIndex(index);
    setEditedOptionValue(option);
  };

  const cancelEditing = () => {
    setEditingOptionIndex(null);
    setEditedOptionValue('');
  };

  const submitEditedOption = () => {
    if (editedOptionValue.trim()) {
      handleOptionClick(editedOptionValue);
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent relative overflow-hidden px-2">
      <WeatherOverlay type={weather} />
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between p-2 sm:p-3 bg-white/40 backdrop-blur-md border border-white/60 rounded-[24px] sm:rounded-[32px] mt-2 sm:mt-4 mb-2 sm:mb-4 shadow-sm">
        {/* Left Side: Toggle & Title */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button 
            onClick={onToggleLeft}
            className={`p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border transition-all ${
              leftOpen 
                ? 'bg-brand-pink/10 border-brand-pink/20 text-brand-pink' 
                : 'bg-white/60 border-white/80 text-slate-400 hover:text-brand-pink'
            }`}
            title={leftOpen ? "隐藏属性面板" : "显示属性面板"}
          >
            <PanelLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-brand-pink animate-pulse" />
              <h1 className="text-[10px] sm:text-sm font-black text-slate-800 tracking-tight font-sans">校园物语</h1>
            </div>
            <p className="text-[7px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2 sm:ml-3">Life Simulator</p>
          </div>
        </div>

        {/* Center: Game Info Group */}
        <div className="hidden lg:flex items-center gap-1.5 bg-white/60 p-1 rounded-2xl border border-white/80 shadow-inner">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl shadow-sm border border-slate-100">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">回合</span>
            <span className="text-xs font-black text-brand-purple">{round}</span>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl shadow-sm border border-slate-100">
            <WeatherIcon type={weather} />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{weather}</span>
          </div>

          <div className="flex items-center gap-2 px-4 py-1.5 bg-white rounded-xl shadow-sm border border-slate-100 max-w-[240px]">
            <MapPin className="w-3.5 h-3.5 text-brand-pink" />
            <span className="text-[10px] font-black text-slate-500 truncate uppercase tracking-widest">
              {location}
            </span>
            <span className="text-[10px] font-black text-slate-300 ml-1">|</span>
            <span className="text-[10px] font-black text-slate-400">{time}</span>
          </div>
        </div>

        {/* Right Side: Actions & Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="flex items-center gap-1 sm:gap-1.5 bg-white/40 p-1 rounded-xl sm:rounded-2xl border border-white/60">
            <NavButton onClick={onSave} icon={<Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} label="存档" />
            <NavButton onClick={onMenu} icon={<Menu className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} label="菜单" />
          </div>
          
          <button 
            onClick={onToggleRight}
            className={`p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border transition-all ${
              rightOpen 
                ? 'bg-brand-purple/10 border-brand-purple/20 text-brand-purple' 
                : 'bg-white/60 border-white/80 text-slate-400 hover:text-brand-purple'
            }`}
            title={rightOpen ? "隐藏目标面板" : "显示目标面板"}
          >
            <PanelRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* AI Thoughts Bubble */}
      <AnimatePresence>
        {state.aiThoughts && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="px-6 py-2 mb-4 bg-brand-purple/5 border border-brand-purple/10 rounded-2xl self-center flex items-center gap-3 max-w-2xl"
          >
            <Sparkles className="w-3 h-3 text-brand-purple shrink-0" />
            <p className="text-[10px] font-bold text-brand-purple italic leading-tight">
              AI 碎碎念: {state.aiThoughts}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Story Area */}
      <div className="flex-1 overflow-hidden flex flex-col glass-panel rounded-[30px] sm:rounded-[40px] mb-2 sm:mb-4 relative border border-white/60">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 sm:space-y-10 scroll-smooth scrollbar-custom">
          {history.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-2 sm:gap-4 max-w-[90%] sm:max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl shrink-0 flex items-center justify-center shadow-lg ${
                  msg.role === 'user' ? 'bg-brand-pink text-white' : 'bg-white text-brand-purple'
                }`}>
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className={`p-4 sm:p-8 rounded-[24px] sm:rounded-[40px] shadow-sm border leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-brand-pink text-white border-brand-pink/20 rounded-tr-none' 
                    : 'bg-white/80 backdrop-blur-md text-slate-700 border-white rounded-tl-none'
                }`}>
                  <div className="markdown-body max-w-none text-sm sm:text-base">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-3 bg-white/40 backdrop-blur-md p-4 rounded-2xl border border-white/60">
                <Loader2 className="w-4 h-4 animate-spin text-brand-pink" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI 正在构思剧情...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-3 sm:p-6 bg-white/60 border-t border-white/40 backdrop-blur-xl">
          <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4">
            {/* Action Options Toggle */}
            <div className="flex flex-col items-center">
              <button 
                type="button"
                onClick={() => setShowOptions(!showOptions)}
                className="flex items-center gap-2 px-4 sm:px-6 py-1.5 sm:py-2 bg-white/60 hover:bg-white/80 rounded-t-xl sm:rounded-t-2xl border border-white/80 border-b-0 transition-all text-slate-500 group shadow-sm"
              >
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-pink group-hover:scale-110 transition-transform" />
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest">行动选项</span>
                <span className="px-1 py-0.5 bg-brand-pink/10 text-brand-pink text-[8px] sm:text-[10px] rounded-md font-black">
                  {options?.length || 0}
                </span>
                {showOptions ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
              </button>

              <AnimatePresence>
                {showOptions && options && options.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="w-full overflow-hidden"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-white/60 border border-white/80 rounded-2xl mb-2 shadow-inner">
                      {options.map((opt, idx) => (
                        <div key={idx} className="relative group">
                          {editingOptionIndex === idx ? (
                            <div className="flex items-center gap-2 bg-white p-1 rounded-xl border-2 border-brand-pink shadow-lg animate-in zoom-in-95 duration-200">
                              <input 
                                autoFocus
                                value={editedOptionValue}
                                onChange={e => setEditedOptionValue(e.target.value)}
                                onKeyDown={e => {
                                  if (e.key === 'Enter') submitEditedOption();
                                  if (e.key === 'Escape') cancelEditing();
                                }}
                                className="flex-1 px-3 py-2 text-sm font-bold text-slate-700 focus:outline-none bg-transparent"
                              />
                              <div className="flex gap-1 pr-1">
                                <button 
                                  type="button"
                                  onClick={submitEditedOption}
                                  className="p-1.5 bg-brand-pink text-white rounded-lg hover:bg-brand-pink/90 transition-colors"
                                >
                                  <Send className="w-3 h-3" />
                                </button>
                                <button 
                                  type="button"
                                  onClick={cancelEditing}
                                  className="p-1.5 bg-slate-100 text-slate-400 rounded-lg hover:bg-slate-200 transition-colors"
                                >
                                  <LogOut className="w-3 h-3 rotate-180" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div 
                              className="group relative flex items-center gap-3 p-3 bg-white/80 hover:bg-brand-pink/5 border border-white/80 hover:border-brand-pink/30 rounded-xl transition-all cursor-pointer text-left shadow-sm"
                              onClick={() => handleOptionClick(opt)}
                            >
                              <span className="flex-shrink-0 w-7 h-7 flex items-center justify-center bg-brand-pink/10 text-brand-pink text-xs font-black rounded-lg">
                                {String.fromCharCode(65 + idx)}
                              </span>
                              <span className="text-sm font-bold text-slate-600 flex-1 line-clamp-2">{opt}</span>
                              <button 
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  startEditing(idx, opt);
                                }}
                                className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-brand-pink/10 rounded-md transition-all text-brand-pink"
                              >
                                <Pencil className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <form onSubmit={handleSubmit} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-brand-pink/20 to-brand-purple/20 rounded-[24px] sm:rounded-[32px] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
              <div className="relative flex items-center bg-white border border-white rounded-[24px] sm:rounded-[32px] p-1 sm:p-2 shadow-xl">
                <div className="p-2 sm:p-4 text-brand-pink">
                  <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isLoading ? "请稍候..." : "输入自定义行动..."}
                  disabled={isLoading}
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm sm:text-base font-bold text-slate-700 placeholder:text-slate-300 px-1 sm:px-2"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="p-3 sm:p-4 bg-brand-pink text-white rounded-xl sm:rounded-2xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all shadow-lg shadow-brand-pink/20"
                >
                  <Send className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Popups */}
      <AnimatePresence>
        {activePopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[40px] shadow-2xl w-full max-w-md overflow-hidden border border-white/60"
            >
              <div className={`h-32 flex items-center justify-center ${
                activePopup.type === 'event' ? 'bg-brand-purple' : 'bg-brand-pink'
              }`}>
                {activePopup.type === 'event' ? <Sparkles className="w-16 h-16 text-white/40" /> : <Heart className="w-16 h-16 text-white/40" />}
              </div>
              
              <div className="p-10 flex flex-col items-center text-center gap-4">
                <h3 className="text-2xl font-black text-slate-800">{activePopup.title}</h3>
                <div className="bg-slate-50/80 rounded-[32px] p-8 border border-slate-100 w-full">
                  <div className="markdown-body text-left">
                    <ReactMarkdown>{activePopup.content}</ReactMarkdown>
                  </div>
                  
                  {activePopup.data?.type === 'phone' && (
                    <div className="mt-4 space-y-2 max-h-48 overflow-y-auto pr-2 scrollbar-custom">
                      {activePopup.data.contacts && activePopup.data.contacts.length > 0 ? (
                        activePopup.data.contacts.map((contact: any, idx: number) => (
                          <button
                            key={idx}
                            onClick={() => {
                              onSendMessage(`[短信] 给 ${contact.name} 发送消息：我想和你聊聊。`);
                              onClosePopup();
                            }}
                            className="w-full flex items-center justify-between p-3 bg-white hover:bg-brand-pink/5 border border-slate-200 rounded-xl transition-all group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-brand-pink/10 flex items-center justify-center text-brand-pink text-xs font-black">
                                {contact.name[0]}
                              </div>
                              <div className="text-left">
                                <p className="text-xs font-black text-slate-700">{contact.name}</p>
                                <p className="text-[9px] text-slate-400">{contact.tags?.[0] || '联系人'}</p>
                              </div>
                            </div>
                            <Send className="w-3 h-3 text-slate-300 group-hover:text-brand-pink transition-colors" />
                          </button>
                        ))
                      ) : (
                        <p className="text-[10px] text-slate-400 italic py-2">通讯录空空如也...</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex gap-3 w-full mt-4">
                  <button 
                    onClick={onClosePopup}
                    className={`w-full py-4 rounded-2xl text-white font-black shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] ${
                      activePopup.type === 'event' ? 'bg-brand-purple shadow-brand-purple/20' : 'bg-brand-pink shadow-brand-pink/20'
                    }`}
                  >
                    确认
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const NavButton = ({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-white/60 hover:bg-white/90 rounded-lg sm:rounded-xl border border-white/80 transition-all group shadow-sm"
  >
    <div className="text-slate-400 group-hover:text-brand-purple transition-colors">{icon}</div>
    <span className="hidden sm:inline text-xs font-black text-slate-500 group-hover:text-slate-700 transition-colors uppercase tracking-widest">{label}</span>
  </button>
);

const WeatherIcon = ({ type }: { type: WeatherType }) => {
  switch (type) {
    case '晴天': return <Sun className="w-4 h-4 text-amber-400" />;
    case '雨天': return <CloudRain className="w-4 h-4 text-blue-400" />;
    case '阴天': return <Cloud className="w-4 h-4 text-slate-400" />;
    case '雪天': return <Snowflake className="w-4 h-4 text-sky-200" />;
    case '大风': return <Wind className="w-4 h-4 text-teal-400" />;
    case '雷阵雨': return <CloudLightning className="w-4 h-4 text-purple-400" />;
    default: return <Sun className="w-4 h-4 text-amber-400" />;
  }
};

const WeatherOverlay = ({ type }: { type: WeatherType }) => {
  if (type === '雨天' || type === '雷阵雨') {
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: -100, x: Math.random() * 100 + '%' }}
            animate={{ y: '100vh' }}
            transition={{ duration: 0.5 + Math.random(), repeat: Infinity, ease: 'linear', delay: Math.random() }}
            className="absolute w-0.5 h-8 bg-blue-400/50 rounded-full"
          />
        ))}
      </div>
    );
  }
  if (type === '雪天') {
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-40">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: -20, x: Math.random() * 100 + '%' }}
            animate={{ y: '100vh', x: (Math.random() * 100 - 50) + '%' }}
            transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, ease: 'linear', delay: Math.random() * 2 }}
            className="absolute w-2 h-2 bg-white rounded-full blur-[1px]"
          />
        ))}
      </div>
    );
  }
  return null;
};
