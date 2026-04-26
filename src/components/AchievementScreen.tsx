import React from 'react';
import { Trophy, ArrowLeft, Star, Award, Zap, Heart, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import type { GameState } from '../types';

interface AchievementScreenProps {
  achievements?: GameState['achievements'];
  onBack: () => void;
}

export const AchievementScreen: React.FC<AchievementScreenProps> = ({ achievements = [], onBack }) => {
  const allAchievements = [
    { id: 'first_step', title: '初入校园', description: '完成新生报到', icon: <Zap className="w-6 h-6" />, color: 'bg-blue-500' },
    { id: 'scholar', title: '学霸降临', description: 'GPA 达到 4.0', icon: <BookOpen className="w-6 h-6" />, color: 'bg-brand-purple' },
    { id: 'social_butterfly', title: '社交达人', description: '结识 5 位以上的朋友', icon: <Star className="w-6 h-6" />, color: 'bg-brand-pink' },
    { id: 'first_love', title: '青涩初恋', description: '与一位 NPC 建立恋爱关系', icon: <Heart className="w-6 h-6" />, color: 'bg-red-500' },
    { id: 'rich', title: '校园富豪', description: '资产超过 10,000', icon: <Award className="w-6 h-6" />, color: 'bg-amber-500' },
  ];

  return (
    <div className="fixed inset-0 z-[110] bg-brand-bg flex flex-col p-4 sm:p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto w-full">
        <header className="flex items-center justify-between mb-8 sm:mb-12">
          <button 
            onClick={onBack}
            className="p-2 sm:p-3 bg-white/60 hover:bg-white rounded-xl sm:rounded-2xl border border-white/80 transition-all shadow-sm group"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 h-6 text-slate-500 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="text-center">
            <h1 className="text-xl sm:text-3xl font-black text-slate-800 flex items-center justify-center gap-2 sm:gap-3">
              <Trophy className="w-6 h-6 sm:w-8 h-8 text-amber-500" /> 成就系统
            </h1>
            <p className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Your Campus Legacy</p>
          </div>
          <div className="w-10 sm:w-12" /> {/* Spacer */}
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {allAchievements.map((ach) => {
            const isUnlocked = achievements.some(a => a.id === ach.id);
            return (
              <motion.div
                key={ach.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`relative p-6 rounded-[32px] border-2 transition-all ${
                  isUnlocked 
                    ? 'bg-white border-white shadow-xl' 
                    : 'bg-white/40 border-dashed border-slate-200 opacity-60 grayscale'
                }`}
              >
                <div className="flex items-center gap-5">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg ${isUnlocked ? ach.color : 'bg-slate-300'}`}>
                    {ach.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-lg font-black ${isUnlocked ? 'text-slate-800' : 'text-slate-400'}`}>
                      {ach.title}
                    </h3>
                    <p className="text-xs font-bold text-slate-400 mt-1">
                      {ach.description}
                    </p>
                    {isUnlocked && (
                      <div className="mt-3 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 bg-green-100 text-green-600 text-[10px] font-black rounded-md uppercase">已达成</span>
                        <span className="text-[10px] text-slate-300 font-bold">
                          {achievements.find(a => a.id === ach.id)?.unlockedAt}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {achievements.length === 0 && (
          <div className="mt-20 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-10 h-10 text-slate-300" />
            </div>
            <p className="text-slate-400 font-bold italic">还没有达成任何成就，快去开启你的校园生活吧！</p>
          </div>
        )}
      </div>
    </div>
  );
};
