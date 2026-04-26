import React, { useState, useEffect } from 'react';
import { Save, Trash2, Play, ChevronLeft, Clock, Calendar, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SaveData, GameState } from '../types';

interface SaveLoadScreenProps {
  onLoad: (state: GameState) => void;
  onSave?: (state: GameState) => void;
  onBack: () => void;
  currentState?: GameState;
  mode: 'save' | 'load';
}

export const SaveLoadScreen: React.FC<SaveLoadScreenProps> = ({ onLoad, onSave, onBack, currentState, mode }) => {
  const [saves, setSaves] = useState<SaveData[]>([]);

  useEffect(() => {
    const loadSaves = async () => {
      try {
        // Try gapp.state first, fallback to localStorage
        if (typeof gapp !== 'undefined' && gapp.state) {
          const cloudSaves = await gapp.state.get('ai_life_sim_saves');
          if (cloudSaves && Array.isArray(cloudSaves)) {
            setSaves(cloudSaves);
            return;
          }
        }
        
        const storedSaves = localStorage.getItem('ai_life_sim_saves');
        if (storedSaves) {
          const parsed = JSON.parse(storedSaves);
          if (parsed && Array.isArray(parsed)) {
            setSaves(parsed);
          }
        }
      } catch (err) {
        console.error("Failed to load saves:", err);
      }
    };
    loadSaves();
  }, []);

  const handleSave = async (slotId: string) => {
    if (!currentState) return;
    
    const newSave: SaveData = {
      id: slotId,
      name: `${currentState.profile.name} - ${currentState.location}`,
      date: new Date().toLocaleString(),
      state: currentState
    };

    const updatedSaves = saves.filter(s => s.id !== slotId);
    updatedSaves.push(newSave);
    updatedSaves.sort((a, b) => a.id.localeCompare(b.id));
    
    setSaves(updatedSaves);
    
    // Save to cloud if available
    if (typeof gapp !== 'undefined' && gapp.state) {
      await gapp.state.set('ai_life_sim_saves', updatedSaves);
    }
    // Also save to localStorage as backup/local sync
    localStorage.setItem('ai_life_sim_saves', JSON.stringify(updatedSaves));
  };

  const handleDelete = async (slotId: string) => {
    const updatedSaves = saves.filter(s => s.id !== slotId);
    setSaves(updatedSaves);
    
    if (typeof gapp !== 'undefined' && gapp.state) {
      await gapp.state.set('ai_life_sim_saves', updatedSaves);
    }
    localStorage.setItem('ai_life_sim_saves', JSON.stringify(updatedSaves));
  };

  const slots = ['Slot 1', 'Slot 2', 'Slot 3', 'Slot 4', 'Slot 5', 'Slot 6'];

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-brand-bg p-2 sm:p-4 py-4 sm:py-12 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl bg-white/80 backdrop-blur-xl rounded-[32px] sm:rounded-[40px] shadow-2xl border border-white/60 overflow-hidden"
      >
        <div className="p-6 sm:p-12">
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
                <h2 className="text-2xl font-black text-slate-800">{mode === 'save' ? '保存进度' : '读取存档'}</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Manage Your Game Progress</p>
              </div>
            </div>
            <div className={`w-12 h-12 ${mode === 'save' ? 'bg-brand-pink' : 'bg-brand-secondary'} rounded-2xl flex items-center justify-center shadow-lg`}>
              {mode === 'save' ? <Save className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-white" />}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {slots.map(slotId => {
              const saveData = saves.find(s => s.id === slotId);
              return (
                <div 
                  key={slotId}
                  className={`group relative p-6 rounded-[32px] border-2 transition-all ${
                    saveData 
                      ? 'bg-white border-slate-100 hover:border-brand-pink/40 shadow-sm hover:shadow-md' 
                      : 'bg-slate-50/50 border-dashed border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{slotId}</span>
                    {saveData && (
                      <button 
                        onClick={() => handleDelete(slotId)}
                        className="p-2 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded-xl transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {saveData ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-pink/10 rounded-xl flex items-center justify-center text-brand-pink">
                          <User className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-black text-slate-700 truncate">{saveData.name}</h4>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold">
                            <Clock className="w-3 h-3" /> 回合 {saveData.state.round}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold px-1">
                        <Calendar className="w-3 h-3" /> {saveData.date}
                      </div>
                      <button 
                        onClick={() => mode === 'save' ? handleSave(slotId) : onLoad(saveData.state)}
                        className={`w-full py-3 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 ${
                          mode === 'save' 
                            ? 'bg-brand-pink/10 text-brand-pink hover:bg-brand-pink hover:text-white' 
                            : 'bg-brand-secondary/10 text-brand-secondary hover:bg-brand-secondary hover:text-white'
                        }`}
                      >
                        {mode === 'save' ? <Save className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        {mode === 'save' ? '覆盖存档' : '载入此存档'}
                      </button>
                    </div>
                  ) : (
                    <div className="h-[140px] flex flex-col items-center justify-center text-center space-y-3">
                      <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-300">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-bold text-slate-300">空存档位</p>
                      {mode === 'save' && (
                        <button 
                          onClick={() => handleSave(slotId)}
                          className="px-6 py-2 bg-brand-pink/10 text-brand-pink hover:bg-brand-pink hover:text-white rounded-xl font-black text-[10px] transition-all"
                        >
                          创建新存档
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
