import React from 'react';
import { Play, Settings, Save, LogOut, Sparkles, Heart, GraduationCap, Trophy } from 'lucide-react';
import { motion } from 'motion/react';

interface HomeScreenProps {
  onStart: () => void;
  onConfig: () => void;
  onAchievements: () => void;
  onLoad: () => void;
  onContinue?: () => void;
  canContinue?: boolean;
  hasApiKey?: boolean;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onStart, onConfig, onAchievements, onLoad, onContinue, canContinue, hasApiKey }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-brand-bg p-4 py-12 overflow-y-auto">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 10, 0],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-brand-pink/10 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, -15, 0],
            x: [0, -40, 0],
            y: [0, -20, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-40 -right-20 w-[700px] h-[700px] bg-brand-purple/10 rounded-full blur-[150px]"
        />
      </div>

      <div className="relative z-10 w-full max-w-4xl px-6 flex flex-col items-center text-center">
        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-16 h-16 bg-brand-pink rounded-[24px] flex items-center justify-center shadow-2xl shadow-brand-pink/30 rotate-12">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <div className="w-16 h-16 bg-brand-purple rounded-[24px] flex items-center justify-center shadow-2xl shadow-brand-purple/30 -rotate-12">
              <Heart className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-slate-800 tracking-tighter mb-4">
            校园物语 <span className="text-brand-pink">AI</span>
          </h1>
          <p className="text-lg font-bold text-slate-400 uppercase tracking-[0.3em]">
            Interactive Life Simulator
          </p>
        </motion.div>

        {/* Main Menu Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          {canContinue && onContinue && (
            <MenuButton 
              onClick={onContinue}
              icon={<Play className="w-6 h-6" />}
              title="回到游戏"
              description="继续当前的校园生活"
              primary
            />
          )}
          <MenuButton 
            onClick={onStart}
            icon={<Sparkles className="w-6 h-6" />}
            title="开启新生活"
            description="塑造你的角色，开始一段全新的校园冒险"
            primary={!canContinue}
          />
          <MenuButton 
            onClick={onLoad}
            icon={<Save className="w-6 h-6" />}
            title="载入存档"
            description="从存档中继续你的故事"
          />
          <MenuButton 
            onClick={onConfig}
            icon={<Settings className="w-6 h-6" />}
            title="API 配置"
            description={hasApiKey ? "修改你的 Gemini API 密钥" : "设置你的 Gemini API 密钥以开始游戏"}
            primary={!hasApiKey}
          />
          <MenuButton 
            onClick={() => window.close()}
            icon={<LogOut className="w-6 h-6" />}
            title="退出游戏"
            description="保存并离开模拟器"
          />
        </div>

        {/* Footer Info */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16 flex flex-col items-center gap-6"
        >
          <button 
            onClick={onAchievements}
            className="flex items-center gap-3 px-6 py-3 bg-white/40 hover:bg-white/60 backdrop-blur-md rounded-2xl border border-white/60 shadow-sm transition-all group"
          >
            <Trophy className="w-5 h-5 text-brand-purple group-hover:scale-110 transition-transform" />
            <span className="text-sm font-black text-slate-600">查看成就</span>
          </button>

          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/40 backdrop-blur-md rounded-full border border-white/60 shadow-sm">
              <Sparkles className="w-4 h-4 text-brand-pink" />
              <span className="text-xs font-black text-slate-500">Powered by Gemini 3.1 Flash</span>
            </div>
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
              © 2026 AI Life Simulator Project v2.0
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const MenuButton = ({ onClick, icon, title, description, primary }: { 
  onClick: () => void; 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  primary?: boolean;
}) => (
  <motion.button
    whileHover={{ scale: 1.02, y: -4 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`group relative flex flex-col items-start p-6 rounded-[32px] text-left transition-all overflow-hidden border-2 ${
      primary 
        ? 'bg-brand-pink border-brand-pink shadow-xl shadow-brand-pink/20' 
        : 'bg-white/60 backdrop-blur-md border-white/80 hover:bg-white/80 shadow-lg'
    }`}
  >
    {primary && (
      <div className="absolute top-0 right-0 p-4 opacity-20">
        <Sparkles className="w-20 h-20 text-white" />
      </div>
    )}
    <div className={`p-3 rounded-2xl mb-4 ${
      primary ? 'bg-white/20 text-white' : 'bg-brand-pink/10 text-brand-pink group-hover:bg-brand-pink group-hover:text-white transition-colors'
    }`}>
      {icon}
    </div>
    <h3 className={`text-xl font-black mb-1 ${primary ? 'text-white' : 'text-slate-800'}`}>
      {title}
    </h3>
    <p className={`text-xs font-bold leading-relaxed ${primary ? 'text-white/80' : 'text-slate-400'}`}>
      {description}
    </p>
  </motion.button>
);
