import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Phone, MessageSquare, User, Wallet, 
  Settings, Battery, Wifi, Signal, Home,
  ChevronLeft, Send, Sparkles, CreditCard,
  Calendar, BookOpen, MapPin, Search, Heart
} from 'lucide-react';
import type { GameState, Relationship } from '../types';
import { DEFAULT_AVATAR } from '../lib/gameLogic';

interface ItemInteractionOverlayProps {
  item: string;
  state: GameState;
  onClose: () => void;
  onSendMessage: (message: string) => void;
}

export const ItemInteractionOverlay: React.FC<ItemInteractionOverlayProps> = ({ 
  item, 
  state, 
  onClose,
  onSendMessage 
}) => {
  const isPhone = item.includes('手机') || item.toLowerCase().includes('phone');
  const isCard = item.includes('校园卡') || item.includes('卡');
  const isLetter = item.includes('录取通知书');

  if (isPhone) return <PhoneInterface state={state} onClose={onClose} onSendMessage={onSendMessage} />;
  if (isCard) return <CardInterface state={state} onClose={onClose} />;
  if (isLetter) return <AdmissionLetter state={state} onClose={onClose} />;

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 bg-white/80 backdrop-blur-xl rounded-[40px] border border-white shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-pink/20 to-transparent" />
      <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors group">
        <X className="w-5 h-5 text-slate-300 group-hover:text-slate-500" />
      </button>
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-24 h-24 bg-brand-pink/5 rounded-[32px] flex items-center justify-center text-brand-pink mb-6 border border-brand-pink/10"
      >
        <Sparkles className="w-12 h-12" />
      </motion.div>
      <h3 className="text-xl font-black text-slate-700 mb-3">{item}</h3>
      <p className="text-sm text-slate-400 font-bold text-center leading-relaxed max-w-[200px]">
        这是一个普通的道具，目前没有特殊的交互功能。
      </p>
      <div className="mt-8 pt-8 border-t border-slate-100 w-full flex justify-center">
        <button 
          onClick={onClose}
          className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-500 text-xs font-black rounded-xl transition-colors"
        >
          返回面板
        </button>
      </div>
    </div>
  );
};

const AdmissionLetter = ({ state, onClose }: { state: GameState; onClose: () => void }) => {
  return (
    <motion.div 
      initial={{ y: 50, opacity: 0, rotate: -2 }}
      animate={{ y: 0, opacity: 1, rotate: 0 }}
      className="relative w-full h-full bg-[#fdfcf0] rounded-xl p-8 shadow-2xl border border-[#e5e0c9] flex flex-col font-serif text-slate-800 overflow-y-auto"
    >
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '20px 20px' }} />
      
      <div className="flex justify-between items-start mb-12 relative z-10">
        <div className="w-16 h-16 border-4 border-red-700 rounded-full flex items-center justify-center text-red-700 font-black text-xl rotate-[-15deg]">
          录取
        </div>
        <div className="text-right">
          <h4 className="text-2xl font-black text-red-800 tracking-widest mb-1">录取通知书</h4>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Admission Letter</p>
        </div>
      </div>

      <div className="space-y-6 relative z-10 flex-1">
        <p className="text-lg font-bold border-b-2 border-slate-200 pb-2 inline-block">{state.profile.name} 同学：</p>
        
        <p className="text-sm leading-loose indent-8">
          祝贺你！经过严格的审核与选拔，你已被我校 <span className="font-black text-red-800 underline decoration-red-200 underline-offset-4">2026级</span> 正式录取。
        </p>

        <p className="text-sm leading-loose indent-8">
          请于规定时间内持本通知书及相关证件来校报到。我们期待在美丽的校园里与你相遇，共同开启人生新篇章。
        </p>

        <div className="pt-12 flex flex-col items-end gap-2">
          <div className="w-32 h-32 rounded-full border-4 border-red-700/20 flex items-center justify-center relative">
            <div className="absolute inset-0 border-2 border-red-700/10 rounded-full scale-90" />
            <p className="text-red-700 font-black text-center text-xs rotate-[-5deg]">
              大学招生办公室<br/>
              专用章
            </p>
          </div>
          <p className="text-sm font-bold mt-4">2026年 8月 15日</p>
        </div>
      </div>

      <button 
        onClick={onClose}
        className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors z-20"
      >
        <X className="w-5 h-5 text-slate-300" />
      </button>
    </motion.div>
  );
};

const PhoneInterface = ({ state, onClose, onSendMessage }: { state: GameState; onClose: () => void; onSendMessage: (message: string) => void }) => {
  const [activeApp, setActiveApp] = useState<'home' | 'messages' | 'contacts' | 'wallet' | 'notes' | 'social'>('home');
  const [selectedContact, setSelectedContact] = useState<Relationship | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const handleSendChatMessage = () => {
    if (chatInput.trim() && selectedContact) {
      onSendMessage(`[短信] 给 ${selectedContact.name} 发送消息：${chatInput}`);
      setChatInput('');
      // In a real game, we might want to stay in the chat or close the phone
      // For now, let's just close it to show the action in the main interface
      onClose();
    }
  };

  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="relative w-full h-full max-w-[300px] mx-auto bg-slate-900 rounded-[3rem] p-3 shadow-2xl border-[6px] border-slate-800 overflow-hidden"
    >
      {/* Phone Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl z-50 flex items-center justify-center gap-2">
        <div className="w-2 h-2 rounded-full bg-slate-700" />
        <div className="w-8 h-1 bg-slate-700 rounded-full" />
      </div>

      {/* Exit Button (Power Button Style) */}
      <button 
        onClick={onClose}
        className="absolute top-12 -right-1 w-1.5 h-12 bg-slate-700 rounded-l-md z-50 hover:bg-red-500 transition-colors"
        title="关闭手机"
      />
      <button 
        onClick={onClose}
        className="absolute top-4 right-6 z-[60] p-1.5 bg-slate-800/50 hover:bg-red-500/80 text-white rounded-full backdrop-blur-md transition-all active:scale-90"
        title="退出"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {/* Screen Content */}
      <div className="relative w-full h-full bg-slate-100 rounded-[2.2rem] overflow-hidden flex flex-col">
        {/* Status Bar */}
        <div className="h-10 flex items-center justify-between px-6 pt-2 text-[10px] font-black text-slate-600">
          <span>{currentTime}</span>
          <div className="flex items-center gap-1.5">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-3 h-3" />
          </div>
        </div>

        {/* App Content */}
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {activeApp === 'home' && (
              <motion.div 
                key="home"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="h-full p-6 grid grid-cols-3 gap-4 content-start"
              >
                <AppIcon icon={<MessageSquare className="w-6 h-6" />} label="信息" color="bg-green-500" onClick={() => setActiveApp('messages')} />
                <AppIcon icon={<User className="w-6 h-6" />} label="通讯录" color="bg-blue-500" onClick={() => setActiveApp('contacts')} />
                <AppIcon icon={<Sparkles className="w-6 h-6" />} label="朋友圈" color="bg-gradient-to-tr from-purple-500 to-pink-500" onClick={() => setActiveApp('social')} />
                <AppIcon icon={<Wallet className="w-6 h-6" />} label="钱包" color="bg-amber-500" onClick={() => setActiveApp('wallet')} />
                <AppIcon icon={<BookOpen className="w-6 h-6" />} label="备忘录" color="bg-brand-purple" onClick={() => setActiveApp('notes')} />
                <AppIcon icon={<MapPin className="w-6 h-6" />} label="地图" color="bg-red-400" />
                <AppIcon icon={<Settings className="w-6 h-6" />} label="设置" color="bg-slate-400" />
              </motion.div>
            )}

            {activeApp === 'messages' && (
              <motion.div 
                key="messages"
                initial={{ x: 300 }}
                animate={{ x: 0 }}
                exit={{ x: 300 }}
                className="h-full bg-white flex flex-col"
              >
                <div className="p-4 border-b flex items-center gap-3">
                  <button onClick={() => setActiveApp('home')}><ChevronLeft className="w-5 h-5 text-blue-500" /></button>
                  <h4 className="text-sm font-black text-slate-800">信息</h4>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                  {Object.values(state.relationships).map((rel, i) => (
                    <button 
                      key={i} 
                      onClick={() => { setSelectedContact(rel); setActiveApp('contacts'); }}
                      className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors text-left"
                    >
                      <div className="w-10 h-10 rounded-full bg-brand-pink/10 flex items-center justify-center text-brand-pink font-black overflow-hidden border border-slate-100">
                        <img 
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${rel.name}`} 
                          alt={rel.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-slate-800">{rel.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">点击发起对话...</p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {activeApp === 'contacts' && (
              <motion.div 
                key="contacts"
                initial={{ x: 300 }}
                animate={{ x: 0 }}
                exit={{ x: 300 }}
                className="h-full bg-white flex flex-col"
              >
                <div className="p-4 border-b flex items-center gap-3">
                  <button onClick={() => { selectedContact ? setSelectedContact(null) : setActiveApp('home') }}><ChevronLeft className="w-5 h-5 text-blue-500" /></button>
                  <h4 className="text-sm font-black text-slate-800">{selectedContact ? selectedContact.name : '通讯录'}</h4>
                </div>
                
                {selectedContact ? (
                  <div className="flex-1 flex flex-col p-4">
                    <div className="flex flex-col items-center mb-6">
                      <div className="w-20 h-20 rounded-full bg-brand-pink/10 flex items-center justify-center text-brand-pink text-2xl font-black mb-2 overflow-hidden border-2 border-white shadow-lg">
                        <img 
                          src={selectedContact.avatar || DEFAULT_AVATAR} 
                          alt={selectedContact.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <h5 className="text-lg font-black text-slate-800">{selectedContact.name}</h5>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{selectedContact.tags.join(' · ')}</p>
                    </div>
                    
                    <div className="flex-1 bg-slate-50 rounded-2xl p-4 mb-4 overflow-y-auto">
                      <p className="text-[11px] text-slate-500 leading-relaxed italic">
                        "{selectedContact.description || '暂无详细描述。'}"
                      </p>
                    </div>

                    <div className="mt-auto space-y-2">
                      <div className="relative">
                        <input 
                          type="text" 
                          value={chatInput}
                          onChange={e => setChatInput(e.target.value)}
                          placeholder="发送消息..."
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold focus:outline-none focus:border-brand-pink"
                        />
                        <button 
                          onClick={handleSendChatMessage}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-brand-pink text-white rounded-xl shadow-lg shadow-brand-pink/20"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {Object.values(state.relationships).map((rel, i) => (
                      <button 
                        key={i} 
                        onClick={() => setSelectedContact(rel)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors text-left"
                      >
                        <div className="w-10 h-10 rounded-full bg-brand-pink/10 flex items-center justify-center text-brand-pink font-black overflow-hidden border border-slate-100">
                          <img 
                            src={rel.avatar || DEFAULT_AVATAR} 
                            alt={rel.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <p className="text-xs font-black text-slate-800">{rel.name}</p>
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeApp === 'social' && (
              <motion.div 
                key="social"
                initial={{ x: 300 }}
                animate={{ x: 0 }}
                exit={{ x: 300 }}
                className="h-full bg-slate-50 flex flex-col"
              >
                <div className="p-4 bg-white border-b flex items-center gap-3">
                  <button onClick={() => setActiveApp('home')}><ChevronLeft className="w-5 h-5 text-pink-500" /></button>
                  <h4 className="text-sm font-black text-slate-800">校园朋友圈</h4>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-4 scrollbar-custom">
                  {state.socialFeed && state.socialFeed.length > 0 ? (
                    state.socialFeed.map((post) => (
                      <div key={post.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-full bg-brand-pink/10 flex items-center justify-center text-brand-pink text-[10px] font-black overflow-hidden">
                            <img 
                              src={DEFAULT_AVATAR} 
                              alt={post.author} 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-[11px] font-black text-slate-700">{post.author}</p>
                            <p className="text-[9px] text-slate-400">{post.time}</p>
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed mb-3">
                          {post.content}
                        </p>
                        <div className="flex items-center gap-4 pt-3 border-t border-slate-50">
                          <div className="flex items-center gap-1 text-slate-400">
                            <Heart className="w-3 h-3" />
                            <span className="text-[10px] font-bold">{post.likes}</span>
                          </div>
                          <div className="flex items-center gap-1 text-slate-400">
                            <MessageSquare className="w-3 h-3" />
                            <span className="text-[10px] font-bold">回复</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full opacity-40 py-20">
                      <Sparkles className="w-12 h-12 text-slate-300 mb-4" />
                      <p className="text-[10px] text-slate-400 italic">暂时没有新动态...</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeApp === 'wallet' && (
              <motion.div 
                key="wallet"
                initial={{ x: 300 }}
                animate={{ x: 0 }}
                exit={{ x: 300 }}
                className="h-full bg-slate-50 flex flex-col"
              >
                <div className="p-4 bg-white border-b flex items-center gap-3">
                  <button onClick={() => setActiveApp('home')}><ChevronLeft className="w-5 h-5 text-blue-500" /></button>
                  <h4 className="text-sm font-black text-slate-800">钱包</h4>
                </div>
                <div className="p-6">
                  <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 text-white shadow-xl mb-6">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">总资产</p>
                    <h5 className="text-3xl font-black">¥{state.stats.money.toFixed(2)}</h5>
                    <div className="mt-8 flex justify-between items-end">
                      <div className="text-[10px] font-bold text-slate-400">
                        <p>{state.profile.name}</p>
                        <p>**** **** **** 2026</p>
                      </div>
                      <CreditCard className="w-8 h-8 text-white/20" />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h6 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">最近交易</h6>
                    <div className="bg-white rounded-2xl p-4 border border-slate-100 text-center py-8">
                      <p className="text-[10px] text-slate-400 italic">暂无交易记录</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeApp === 'notes' && (
              <motion.div 
                key="notes"
                initial={{ x: 300 }}
                animate={{ x: 0 }}
                exit={{ x: 300 }}
                className="h-full bg-white flex flex-col"
              >
                <div className="p-4 border-b flex items-center gap-3">
                  <button onClick={() => setActiveApp('home')}><ChevronLeft className="w-5 h-5 text-amber-500" /></button>
                  <h4 className="text-sm font-black text-slate-800">备忘录</h4>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {state.keyEvents.map((event, i) => (
                    <div key={i} className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                      <h5 className="text-xs font-black text-slate-800 mb-1">{event.title}</h5>
                      <p className="text-[10px] text-slate-500 leading-relaxed">{event.description}</p>
                    </div>
                  ))}
                  {state.keyEvents.length === 0 && (
                    <p className="text-[10px] text-slate-400 italic text-center py-10">备忘录空空如也...</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Home Button */}
        <div className="h-14 flex items-center justify-center">
          <button 
            onClick={() => setActiveApp('home')}
            className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-slate-300 hover:text-slate-400 transition-colors"
          >
            <Home className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const AppIcon = ({ icon, label, color, onClick }: { icon: React.ReactNode; label: string; color: string; onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center gap-1.5 group"
  >
    <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center text-white shadow-lg group-active:scale-90 transition-transform`}>
      {icon}
    </div>
    <span className="text-[10px] font-bold text-slate-600">{label}</span>
  </button>
);

const CardInterface = ({ state, onClose }: { state: GameState; onClose: () => void }) => {
  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0, rotateY: -20 }}
      animate={{ scale: 1, opacity: 1, rotateY: 0 }}
      className="relative w-full aspect-[1.58/1] max-w-[400px] mx-auto perspective-1000"
    >
      <div className="w-full h-full bg-gradient-to-br from-brand-primary to-brand-purple rounded-3xl p-8 text-white shadow-2xl border border-white/20 relative overflow-hidden">
        {/* Card Background Patterns */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10 h-full flex flex-col">
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-black tracking-widest">校园通</h4>
                <p className="text-[8px] font-bold opacity-60 uppercase">Smart Campus Card</p>
              </div>
            </div>
            <Sparkles className="w-6 h-6 text-white/40" />
          </div>

          <div className="flex gap-6 mt-auto">
            <div className="w-24 h-32 bg-white/10 rounded-xl border border-white/20 backdrop-blur-md flex items-center justify-center overflow-hidden">
              {state.profile.avatar ? (
                <img src={state.profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 opacity-20" />
              )}
            </div>
            <div className="flex-1 flex flex-col justify-center gap-3">
              <div>
                <p className="text-[8px] font-bold opacity-60 uppercase mb-0.5">姓名 / Name</p>
                <p className="text-lg font-black">{state.profile.name}</p>
              </div>
              <div>
                <p className="text-[8px] font-bold opacity-60 uppercase mb-0.5">学号 / Student ID</p>
                <p className="text-sm font-mono font-bold tracking-wider">2026{String(state.round + 1000).padStart(4, '0')}</p>
              </div>
              <div>
                <p className="text-[8px] font-bold opacity-60 uppercase mb-0.5">院系 / Department</p>
                <p className="text-xs font-bold">{state.profile.background}</p>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">点击卡片以外区域关闭</p>
      </div>
    </motion.div>
  );
};
