import React, { useState } from 'react';
import { Users, Heart, Plus, ChevronUp, ChevronDown, User, Sparkles, X, Info, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { GameState, Relationship } from '../types';
import { DEFAULT_AVATAR } from '../lib/gameLogic';

interface StatsPanelProps {
  state: GameState;
  onUpdateProfile?: (update: Partial<GameState['profile']>) => void;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ state, onUpdateProfile }) => {
  const { stats, profile, relationships } = state;
  const [socialOpen, setSocialOpen] = useState(true);
  const [attributesOpen, setAttributesOpen] = useState(true);
  const [selectedNPC, setSelectedNPC] = useState<Relationship | null>(null);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpdateProfile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateProfile({ avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <aside className="w-[280px] sm:w-80 h-full flex flex-col flex-shrink-0 bg-white/90 sm:bg-white/40 backdrop-blur-md border-r border-white/20 p-4 sm:p-6 z-10 overflow-hidden">
      {/* Profile Section - Fixed at top */}
      <div className="glass-panel p-4 sm:p-6 rounded-[24px] sm:rounded-[32px] mb-4 sm:mb-6 text-center relative overflow-hidden group shrink-0 shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-pink/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative z-10">
          <div className="w-24 h-24 mx-auto mb-4 rounded-3xl bg-white shadow-xl flex items-center justify-center border-4 border-white overflow-hidden relative group/avatar">
            <div className="w-full h-full bg-brand-pink/10 flex items-center justify-center text-brand-pink">
              <img 
                src={profile.avatar || DEFAULT_AVATAR} 
                alt={profile.name} 
                className="w-full h-full object-cover" 
              />
            </div>
            {onUpdateProfile && (
              <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer">
                <Sparkles className="w-6 h-6 text-white" />
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
              </label>
            )}
          </div>
          <h2 className="text-xl font-black text-slate-800 mb-1 font-sans">{profile.name}</h2>
          <div className="flex items-center justify-center gap-2">
            <span className="px-2.5 py-1 bg-brand-pink/10 text-brand-pink text-[11px] font-bold rounded-full border border-brand-pink/20 font-sans">
              {profile.gender}
            </span>
            <span className="px-2.5 py-1 bg-brand-purple/10 text-brand-purple text-[11px] font-bold rounded-full border border-brand-purple/20 font-sans">
              {profile.personality}
            </span>
          </div>
          <p className="mt-3 text-[11px] text-slate-400 font-bold uppercase tracking-widest font-sans">{profile.background}</p>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto scrollbar-custom pr-2 -mr-2 space-y-8">
        {/* Social Network */}
        <div className="space-y-4">
          <button 
            onClick={() => setSocialOpen(!socialOpen)}
            className="w-full flex items-center justify-between px-2 group"
          >
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 group-hover:text-slate-600 transition-colors">
              <Users className="w-3.5 h-3.5" /> 人脉网络
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-brand-pink bg-brand-pink/10 px-2 py-0.5 rounded-full">
                {Object.keys(relationships).length}/18
              </span>
              {socialOpen ? <ChevronUp className="w-3.5 h-3.5 text-slate-300" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-300" />}
            </div>
          </button>
          
          <AnimatePresence initial={false}>
            {socialOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="space-y-4 pt-2">
                  {Object.values(relationships).length > 0 ? (
                    Object.values(relationships).map((rel, idx) => (
                      <motion.div 
                        key={idx} 
                        whileHover={{ scale: 1.02, x: 4 }}
                        onClick={() => setSelectedNPC(rel)}
                        className="glass-panel p-5 rounded-2xl flex items-center gap-4 hover:bg-white/60 transition-all cursor-pointer group/card"
                      >
                        <div className="w-11 h-11 rounded-xl bg-white shadow-sm flex items-center justify-center text-brand-pink shrink-0 overflow-hidden border border-slate-100 group-hover/card:border-brand-pink/30 transition-colors">
                          <img 
                            src={rel.avatar || DEFAULT_AVATAR} 
                            alt={rel.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <h4 className="text-[15px] font-bold text-slate-700 truncate group-hover/card:text-brand-pink transition-colors">{rel.name}</h4>
                              {rel.isRomanceable && <Heart className="w-3 h-3 text-brand-pink fill-brand-pink shrink-0" />}
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-black text-brand-pink">{rel.value}</span>
                            </div>
                          </div>
                          {rel.isRomanceable && (
                            <div className="w-full h-1 bg-slate-100 rounded-full mb-2 overflow-hidden">
                              <div className="h-full bg-brand-pink" style={{ width: `${rel.storylineProgress || 0}%` }} />
                            </div>
                          )}
                          <div className="flex flex-wrap gap-1.5">
                            {rel.tags.slice(0, 2).map(tag => (
                              <span key={tag} className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="p-10 text-center border-2 border-dashed border-slate-200 rounded-3xl">
                      <Plus className="w-6 h-6 text-slate-300 mx-auto mb-2" />
                      <p className="text-[11px] font-bold text-slate-400">暂无社交联系</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Attributes */}
        <div className="space-y-4">
          <button 
            onClick={() => setAttributesOpen(!attributesOpen)}
            className="w-full flex items-center justify-between px-2 group"
          >
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 group-hover:text-slate-600 transition-colors">
              <Plus className="w-3.5 h-3.5" /> 个人属性
            </h3>
            {attributesOpen ? <ChevronUp className="w-3.5 h-3.5 text-slate-300" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-300" />}
          </button>
          
          <AnimatePresence initial={false}>
            {attributesOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="space-y-5 bg-white/60 p-6 rounded-[32px] border border-white/80 pt-2">
                  <StatBar label="学业" value={stats.academic} color="bg-brand-purple" icon={<Sparkles className="w-3.5 h-3.5" />} />
                  <StatBar label="社交" value={stats.social} color="bg-brand-pink" icon={<Users className="w-3.5 h-3.5" />} />
                  <StatBar label="健康" value={stats.health} color="bg-green-500" icon={<Heart className="w-3.5 h-3.5" />} />
                  <StatBar label="魅力" value={stats.charm} color="bg-brand-secondary" icon={<Sparkles className="w-3.5 h-3.5" />} />
                  <StatBar label="幸运" value={stats.luck} color="bg-amber-500" icon={<Sparkles className="w-3.5 h-3.5" />} />
                  
                  <div className="pt-3 grid grid-cols-2 gap-4">
                    <div className="bg-white/80 p-4 rounded-2xl border border-white text-center shadow-sm">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1.5 tracking-wider">GPA</p>
                      <p className="text-xl font-black text-brand-primary leading-none">{stats.gpa.toFixed(1)}</p>
                    </div>
                    <div className="bg-white/80 p-4 rounded-2xl border border-white text-center shadow-sm">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1.5 tracking-wider">资产</p>
                      <p className="text-xl font-black text-brand-secondary leading-none">¥{stats.money}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* NPC Profile Modal */}
      <AnimatePresence>
        {selectedNPC && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedNPC(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[40px] shadow-2xl overflow-hidden border border-white/60"
            >
              {/* Header */}
              <div className="h-32 bg-gradient-to-r from-brand-pink/20 to-brand-purple/20 relative">
                <button 
                  onClick={() => setSelectedNPC(null)}
                  className="absolute top-4 right-4 p-2 bg-white/60 hover:bg-white rounded-full transition-colors z-10"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Content */}
              <div className="px-8 pb-10 -mt-16 relative">
                <div className="w-32 h-32 mx-auto mb-6 rounded-[40px] bg-white p-1 shadow-2xl relative">
                  <div className="w-full h-full rounded-[36px] overflow-hidden border-4 border-white">
                    <img 
                      src={selectedNPC.avatar || DEFAULT_AVATAR} 
                      alt={selectedNPC.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  {selectedNPC.isRomanceable && (
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-brand-pink rounded-2xl flex items-center justify-center shadow-lg border-4 border-white">
                      <Heart className="w-5 h-5 text-white fill-white" />
                    </div>
                  )}
                </div>

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-black text-slate-800 mb-2">{selectedNPC.name}</h3>
                  <div className="flex flex-wrap justify-center gap-2">
                    {selectedNPC.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-500 text-[11px] font-black rounded-full uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Relationship Progress */}
                  <div className="bg-slate-50/80 rounded-3xl p-5 border border-slate-100">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Heart className="w-3.5 h-3.5 text-brand-pink" /> 亲密度
                      </span>
                      <span className="text-sm font-black text-brand-pink">{selectedNPC.value}/100</span>
                    </div>
                    <div className="h-2 w-full bg-white rounded-full overflow-hidden border border-slate-100">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedNPC.value}%` }}
                        className="h-full bg-brand-pink"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                      <Info className="w-3.5 h-3.5" /> 印象描述
                    </h4>
                    <p className="text-sm font-bold text-slate-600 leading-relaxed bg-slate-50/50 p-4 rounded-2xl border border-slate-100 italic">
                      "{selectedNPC.description}"
                    </p>
                  </div>

                  {/* Unlocked Facts */}
                  <div className="space-y-3">
                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                      <Sparkles className="w-3.5 h-3.5 text-brand-purple" /> 已解锁资料
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {selectedNPC.unlockedFacts && selectedNPC.unlockedFacts.length > 0 ? (
                        selectedNPC.unlockedFacts.map((fact, i) => (
                          <motion.div 
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center gap-3 p-3 bg-brand-purple/5 border border-brand-purple/10 rounded-xl"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-purple" />
                            <span className="text-xs font-bold text-slate-600">{fact}</span>
                          </motion.div>
                        ))
                      ) : (
                        <p className="text-xs font-bold text-slate-300 italic px-1">通过互动解锁更多资料...</p>
                      )}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedNPC(null)}
                  className="w-full mt-8 py-4 bg-slate-800 text-white font-black rounded-2xl shadow-xl shadow-slate-200 hover:bg-slate-900 transition-all active:scale-[0.98]"
                >
                  关闭资料
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </aside>
  );
};

const StatBar = ({ label, value, color, icon }: { label: string; value: number; color: string; icon: React.ReactNode }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between px-1">
      <div className="flex items-center gap-2">
        <div className={`p-1.5 rounded-md ${color} text-white`}>
          {icon}
        </div>
        <span className="text-[11px] font-black text-slate-600">{label}</span>
      </div>
      <span className="text-[11px] font-black text-slate-400">{value}/100</span>
    </div>
    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-white shadow-inner">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        className={`h-full ${color} rounded-full`}
      />
    </div>
  </div>
);
