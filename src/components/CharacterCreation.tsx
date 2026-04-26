import React, { useState } from 'react';
import { User, Heart, Sparkles, Wand2, ChevronRight, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { GameState } from '../types';

interface CharacterCreationProps {
  onComplete: (profile: GameState['profile'], stats: GameState['stats']) => void;
}

export const CharacterCreation: React.FC<CharacterCreationProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('vin');
  const [gender, setGender] = useState<GameState['profile']['gender']>('女');
  const [personality, setPersonality] = useState('温柔体贴');
  const [background, setBackground] = useState('书香门第');
  const [major, setMajor] = useState('计算机科学');
  const [interests, setInterests] = useState<string[]>(['编程', '游戏']);
  const [avatar, setAvatar] = useState<string | undefined>(undefined);
  
  const [stats, setStats] = useState({
    academic: 50,
    social: 50,
    health: 80,
    money: 1000,
    gpa: 0,
    charm: 50,
    luck: 50
  });

  const [points, setPoints] = useState(20);

  const handleStatChange = (stat: keyof typeof stats, delta: number) => {
    if (delta > 0 && points <= 0) return;
    if (delta < 0 && stats[stat] <= 0) return;
    
    setStats(prev => ({ ...prev, [stat]: prev[stat] + delta }));
    setPoints(prev => prev - delta);
  };

  const personalities = ['温柔体贴', '高冷孤傲', '活泼开朗', '沉稳内敛', '古灵精怪', '毒舌腹黑'];
  const backgrounds = ['普通家庭', '书香门第', '商贾之家', '艺术世家', '寒门学子'];
  const majors = ['计算机科学', '艺术设计', '金融贸易', '临床医学', '文学创作', '心理学'];
  const allInterests = ['编程', '游戏', '绘画', '音乐', '运动', '阅读', '美食', '旅行', '摄影'];

  const toggleInterest = (interest: string) => {
    setInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest) 
        : [...prev, interest]
    );
  };

  const handleComplete = () => {
    onComplete({ name: name || '蓝天白云', gender, personality, background, major, interests, avatar }, stats);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-brand-bg p-2 sm:p-4 py-4 sm:py-12 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-white/80 backdrop-blur-xl rounded-[32px] sm:rounded-[40px] shadow-2xl border border-white/60 overflow-hidden"
      >
        <div className="p-6 sm:p-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-pink rounded-2xl flex items-center justify-center shadow-lg shadow-brand-pink/20">
                <Wand2 className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-black text-slate-800">角色初始化</h2>
            </div>
            <div className="flex gap-2">
              {[1, 2, 3].map(i => (
                <div key={i} className={`w-8 h-1.5 rounded-full transition-all ${step === i ? 'bg-brand-pink w-12' : 'bg-slate-200'}`} />
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden transition-all group-hover:border-brand-pink/50">
                      {avatar ? (
                        <img src={avatar} alt="Avatar Preview" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-10 h-10 text-slate-300" />
                      )}
                    </div>
                    <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-brand-pink text-white rounded-xl flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-all">
                      <Sparkles className="w-4 h-4" />
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setAvatar(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">点击上传自定义头像</p>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-black text-slate-500 ml-1">你的名字</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="text" 
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="输入你的姓名..."
                      className="w-full pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-pink/10 focus:border-brand-pink/40 transition-all font-bold text-slate-700"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-black text-slate-500 ml-1">性别选择</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                    {(['男', '女', '其他'] as const).map(g => (
                      <button
                        key={g}
                        onClick={() => setGender(g)}
                        className={`py-4 rounded-2xl font-bold transition-all border-2 ${
                          gender === g 
                            ? 'bg-brand-pink border-brand-pink text-white shadow-lg shadow-brand-pink/20' 
                            : 'bg-white border-slate-100 text-slate-500 hover:border-brand-pink/30'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-black text-slate-500 ml-1">性格特质</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                    {personalities.map(p => (
                      <button
                        key={p}
                        onClick={() => setPersonality(p)}
                        className={`py-3 rounded-xl text-xs font-bold transition-all border ${
                          personality === p 
                            ? 'bg-brand-purple border-brand-purple text-white shadow-md shadow-brand-purple/20' 
                            : 'bg-white border-slate-100 text-slate-500 hover:border-brand-purple/30'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-black text-slate-500 ml-1">家庭背景</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                    {backgrounds.map(b => (
                      <button
                        key={b}
                        onClick={() => setBackground(b)}
                        className={`py-3 rounded-xl text-xs font-bold transition-all border-2 ${
                          background === b 
                            ? 'bg-white border-brand-secondary text-brand-secondary shadow-[0_0_20px_rgba(134,211,255,0.4)] ring-4 ring-brand-secondary/10 scale-[1.02]' 
                            : 'bg-white border-slate-100 text-slate-500 hover:border-brand-secondary/30'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => setStep(2)}
                  className="w-full py-5 bg-brand-pink text-white rounded-3xl font-black shadow-xl shadow-brand-pink/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  下一步：专业与兴趣 <ChevronRight className="w-5 h-5" />
                </button>
              </motion.div>
            ) : step === 2 ? (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <label className="text-sm font-black text-slate-500 ml-1">选择专业</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {majors.map(m => (
                      <button
                        key={m}
                        onClick={() => setMajor(m)}
                        className={`py-4 rounded-2xl font-bold transition-all border-2 ${
                          major === m 
                            ? 'bg-brand-purple border-brand-purple text-white shadow-lg shadow-brand-purple/20' 
                            : 'bg-white border-slate-100 text-slate-500 hover:border-brand-purple/30'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-black text-slate-500 ml-1">兴趣爱好 (多选)</label>
                  <div className="grid grid-cols-3 gap-3">
                    {allInterests.map(i => (
                      <button
                        key={i}
                        onClick={() => toggleInterest(i)}
                        className={`py-3 rounded-xl text-xs font-bold transition-all border ${
                          interests.includes(i) 
                            ? 'bg-brand-pink border-brand-pink text-white shadow-md shadow-brand-pink/20' 
                            : 'bg-white border-slate-100 text-slate-500 hover:border-brand-pink/30'
                        }`}
                      >
                        {i}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => setStep(1)}
                    className="flex-1 py-5 bg-slate-100 text-slate-500 rounded-3xl font-black hover:bg-slate-200 transition-all"
                  >
                    返回
                  </button>
                  <button 
                    onClick={() => setStep(3)}
                    className="flex-[2] py-5 bg-brand-pink text-white rounded-3xl font-black shadow-xl shadow-brand-pink/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    下一步：分配属性 <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="bg-brand-pink/5 rounded-3xl p-6 border border-brand-pink/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-brand-pink" />
                    <div>
                      <h4 className="font-black text-slate-800">剩余潜力点</h4>
                      <p className="text-xs text-slate-400 font-bold">分配点数以增强你的初始能力</p>
                    </div>
                  </div>
                  <span className="text-4xl font-black text-brand-pink">{points}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { id: 'academic', label: '学业', icon: <Sparkles className="w-4 h-4" />, color: 'text-brand-purple' },
                    { id: 'social', label: '社交', icon: <Heart className="w-4 h-4" />, color: 'text-brand-pink' },
                    { id: 'health', label: '健康', icon: <Sparkles className="w-4 h-4" />, color: 'text-green-500' },
                    { id: 'charm', label: '魅力', icon: <Sparkles className="w-4 h-4" />, color: 'text-brand-secondary' },
                    { id: 'luck', label: '幸运', icon: <Sparkles className="w-4 h-4" />, color: 'text-amber-500' },
                  ].map(stat => (
                    <div key={stat.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={stat.color}>{stat.icon}</span>
                          <span className="text-sm font-black text-slate-700">{stat.label}</span>
                        </div>
                        <span className="text-lg font-black text-slate-800">{stats[stat.id as keyof typeof stats]}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleStatChange(stat.id as any, -5)}
                          className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl font-black text-slate-400 transition-colors"
                        >
                          -
                        </button>
                        <button 
                          onClick={() => handleStatChange(stat.id as any, 5)}
                          className="flex-1 py-2 bg-brand-pink/10 hover:bg-brand-pink/20 rounded-xl font-black text-brand-pink transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => setStep(2)}
                    className="flex-1 py-5 bg-slate-100 text-slate-500 rounded-3xl font-black hover:bg-slate-200 transition-all"
                  >
                    返回
                  </button>
                  <button 
                    onClick={handleComplete}
                    className="flex-[2] py-5 bg-brand-pink text-white rounded-3xl font-black shadow-xl shadow-brand-pink/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    开启大学生活
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
