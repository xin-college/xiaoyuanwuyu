import { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import OpenAI from 'openai';
import { motion, AnimatePresence } from 'motion/react';
import { StatsPanel } from './components/StatsPanel';
import { GameInterface } from './components/GameInterface';
import { RightPanel } from './components/RightPanel';
import { ItemInteractionOverlay } from './components/ItemInteractionOverlay';
import { CharacterCreation } from './components/CharacterCreation';
import { HomeScreen } from './components/HomeScreen';
import { ConfigScreen } from './components/ConfigScreen';
import { SaveLoadScreen } from './components/SaveLoadScreen';
import { AchievementScreen } from './components/AchievementScreen';
import { ErrorBoundary } from './components/ErrorBoundary';
import { INITIAL_STATE, SYSTEM_INSTRUCTION } from './lib/gameLogic';
import type { GameState, StateUpdate, GameSettings } from './types';

type Screen = 'home' | 'config' | 'character' | 'game' | 'save' | 'load' | 'achievement';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [activeInteractiveItem, setActiveInteractiveItem] = useState<string | null>(null);
  const [settings, setSettings] = useState<GameSettings>({
    apiKey: process.env.GEMINI_API_KEY || "",
    baseUrl: "https://generativelanguage.googleapis.com",
    modelName: "gemini-3-flash-preview",
    provider: 'gemini'
  });

  // Load settings and game state from cloud on mount
  useEffect(() => {
    const loadCloudData = async () => {
      try {
        if (typeof gapp !== 'undefined' && gapp.state) {
          const cloudSettings = await gapp.state.get('ai_life_sim_settings');
          if (cloudSettings && typeof cloudSettings === 'object') {
            setSettings(prev => ({ ...prev, ...cloudSettings }));
          }

          const lastState = await gapp.state.get('ai_life_sim_last_state');
          if (lastState && typeof lastState === 'object' && lastState.profile) {
            setGameState(prev => ({ ...prev, ...lastState }));
            setIsInitialized(true);
          }
        } else {
          // Fallback to localStorage
          const storedSettings = localStorage.getItem('ai_life_sim_settings');
          if (storedSettings) {
            const parsed = JSON.parse(storedSettings);
            if (parsed && typeof parsed === 'object') {
              setSettings(prev => ({ ...prev, ...parsed }));
            }
          }
        }
      } catch (err) {
        console.error("Failed to load cloud data:", err);
      }
    };
    loadCloudData();
  }, []);

  // Auto-save last state to cloud
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setLeftPanelOpen(false);
        setRightPanelOpen(false);
      } else {
        setLeftPanelOpen(true);
        setRightPanelOpen(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isInitialized && typeof gapp !== 'undefined' && gapp.state) {
      const timeout = setTimeout(async () => {
        await gapp.state.set('ai_life_sim_last_state', gameState);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [gameState, isInitialized]);

  const processAIResponse = useCallback((text: string) => {
    const stateMatch = text.match(/\[STATE_UPDATE\]([\s\S]*?)\[\/STATE_UPDATE\]/);
    let cleanText = text;
    let update: StateUpdate = {};

    if (stateMatch) {
      try {
        let jsonStr = stateMatch[1].trim();
        // Remove markdown code blocks and other common AI formatting artifacts
        jsonStr = jsonStr.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
        // Further clean by finding the first '{' and last '}' to handle bolding or other text
        const firstBrace = jsonStr.indexOf('{');
        const lastBrace = jsonStr.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1) {
          jsonStr = jsonStr.substring(firstBrace, lastBrace + 1);
        }
        
        update = JSON.parse(jsonStr);
        cleanText = text.replace(/\[STATE_UPDATE\][\s\S]*?\[\/STATE_UPDATE\]/, '').trim();
      } catch (e) {
        console.error("Failed to parse state update:", e);
      }
    }

    setGameState(prev => {
      const nextStats = { ...prev.stats };
      if (update.statsChange) {
        Object.entries(update.statsChange).forEach(([key, val]) => {
          const k = key as keyof typeof nextStats;
          if (k === 'gpa') {
            nextStats[k] = Math.max(0, Math.min(4.0, (nextStats[k] || 0) + (val || 0)));
          } else {
            nextStats[k] = Math.max(0, Math.min(100, (nextStats[k] || 0) + (val || 0)));
          }
        });
      }

      const nextInventory = [...prev.inventory];
      if (update.newInventory) {
        update.newInventory.forEach(item => {
          if (!nextInventory.includes(item)) nextInventory.push(item);
        });
      }

      const nextRelationships = { ...prev.relationships };
      if (update.relationshipChange) {
        Object.entries(update.relationshipChange).forEach(([name, data]) => {
          const existing = nextRelationships[name] || { 
            name, 
            value: 0, 
            tags: [], 
            description: '',
            isRomanceable: false,
            storylineProgress: 0
          };
          nextRelationships[name] = {
            ...existing,
            value: Math.min(100, Math.max(0, existing.value + data.value)),
            tags: data.tags ? Array.from(new Set([...existing.tags, ...data.tags])) : existing.tags,
            description: data.description || existing.description,
            avatar: data.avatar || existing.avatar,
            isRomanceable: data.isRomanceable !== undefined ? data.isRomanceable : existing.isRomanceable,
            storylineProgress: data.storylineProgress !== undefined ? data.storylineProgress : existing.storylineProgress,
            unlockedFacts: data.unlockedFacts ? Array.from(new Set([...(existing.unlockedFacts || []), ...data.unlockedFacts])) : existing.unlockedFacts
          };
        });
      }

      const nextCourses = [...prev.courses];
      if (update.newCourses) {
        update.newCourses.forEach(course => {
          const existingIndex = nextCourses.findIndex(c => c.id === course.id || c.name === course.name);
          if (existingIndex >= 0) {
            nextCourses[existingIndex] = { ...nextCourses[existingIndex], ...course };
          } else {
            nextCourses.push(course);
          }
        });
      }

      const nextGoals = [...prev.goals];
      if (update.newGoals) {
        update.newGoals.forEach(goal => {
          if (!nextGoals.find(g => g.id === goal.id)) nextGoals.push(goal);
        });
      }
      if (update.updateGoal) {
        const goalIndex = nextGoals.findIndex(g => g.id === update.updateGoal?.id);
        if (goalIndex >= 0) {
          nextGoals[goalIndex] = { ...nextGoals[goalIndex], ...update.updateGoal };
        }
      }

      const nextKeyEvents = [...prev.keyEvents];
      if (update.newKeyEvents) {
        update.newKeyEvents.forEach(event => {
          if (!nextKeyEvents.find(e => e.id === event.id)) nextKeyEvents.push(event);
        });
      }
      if (update.resolveKeyEvent) {
        const eventIndex = nextKeyEvents.findIndex(e => e.id === update.resolveKeyEvent);
        if (eventIndex >= 0) {
          nextKeyEvents[eventIndex] = { ...nextKeyEvents[eventIndex], resolved: true };
        }
      }

      const nextClubs = [...prev.clubs];
      if (update.newClubs) {
        update.newClubs.forEach(club => {
          if (!nextClubs.find(c => c.id === club.id)) nextClubs.push(club);
        });
      }
      if (update.updateClub) {
        const clubIndex = nextClubs.findIndex(c => c.id === update.updateClub?.id);
        if (clubIndex >= 0) {
          nextClubs[clubIndex] = { ...nextClubs[clubIndex], ...update.updateClub };
        }
      }

      const nextJobs = [...prev.jobs];
      if (update.newJobs) {
        update.newJobs.forEach(job => {
          if (!nextJobs.find(j => j.id === job.id)) nextJobs.push(job);
        });
      }
      if (update.updateJob) {
        const jobIndex = nextJobs.findIndex(j => j.id === update.updateJob?.id);
        if (jobIndex >= 0) {
          nextJobs[jobIndex] = { ...nextJobs[jobIndex], ...update.updateJob };
        }
      }

      const nextRecentEvents = [...prev.recentEvents];
      if (update.newRandomEvents) {
        update.newRandomEvents.forEach(event => {
          nextRecentEvents.unshift(event);
        });
        if (nextRecentEvents.length > 10) nextRecentEvents.pop();
      }

      const nextSocialFeed = [...(prev.socialFeed || [])];
      if (update.newSocialPosts) {
        update.newSocialPosts.forEach(post => {
          nextSocialFeed.unshift({
            ...post,
            id: Math.random().toString(36).substring(2, 9)
          });
        });
        if (nextSocialFeed.length > 20) nextSocialFeed.splice(20);
      }

      const nextAchievements = [...(prev.achievements || [])];
      if (update.newAchievements) {
        update.newAchievements.forEach(ach => {
          if (!nextAchievements.find(a => a.id === ach.id)) {
            nextAchievements.push(ach);
          }
        });
      }

      return {
        ...prev,
        stats: nextStats,
        location: update.newLocation || prev.location,
        time: update.newTime || prev.time,
        round: prev.round + (update.roundIncrement || 0),
        inventory: nextInventory,
        relationships: nextRelationships,
        clubs: nextClubs,
        jobs: nextJobs,
        recentEvents: nextRecentEvents,
        courses: nextCourses,
        goals: nextGoals,
        keyEvents: nextKeyEvents,
        options: update.newOptions !== undefined ? update.newOptions : prev.options,
        activePopup: update.triggerPopup || prev.activePopup,
        weather: update.newWeather || prev.weather,
        aiThoughts: update.newAiThoughts || prev.aiThoughts,
        socialFeed: nextSocialFeed,
        achievements: nextAchievements,
        history: [...prev.history, { role: 'model', content: cleanText }]
      };
    });
  }, []);

  const getGameStateContext = (state: GameState) => {
    const rels = Object.values(state.relationships).map(r => 
      `${r.name} (好感度: ${r.value}, 标签: ${r.tags.join(',')}, 描述: ${r.description}${r.isRomanceable ? ', 可攻略' : ''}${r.unlockedFacts ? `, 已解锁资料: ${r.unlockedFacts.join(';')}` : ''})`
    ).join('\n');
    const clubs = state.clubs.map(c => `${c.name} (职位: ${c.role}, 等级: ${c.level})`).join('\n');
    const jobs = state.jobs.map(j => `${j.name} (公司: ${j.company}, 表现: ${j.performance}%)`).join('\n');
    const courses = state.courses.map(c => `${c.name} (${c.type}, 成绩: ${c.grade}%, ${c.isEnrolled ? '已选' : '未选'})`).join('\n');
    const social = (state.socialFeed || []).slice(0, 3).map(s => `${s.author}: ${s.content} (${s.likes}赞)`).join('\n');
    
    return `
当前天气：${state.weather || '晴天'}
当前地点：${state.location}
当前时间：${state.time}
当前回合：${state.round}

专业：${state.profile.major} | 兴趣：${state.profile.interests.join(', ')}
当前数值：
学业：${state.stats.academic} | 社交：${state.stats.social} | 健康：${state.stats.health}
金钱：${state.stats.money} | GPA：${state.stats.gpa} | 魅力：${state.stats.charm} | 幸运：${state.stats.luck}

当前课程：
${courses || '暂无'}

人脉网络：
${rels || '暂无'}

已加入社团：
${clubs || '暂无'}

当前兼职：
${jobs || '暂无'}

最近朋友圈动态：
${social || '暂无'}

背包物品：${state.inventory.join(', ') || '无'}

当前行动选项：
${state.options.map((opt, i) => `${i + 1}. ${opt}`).join('\n') || '暂无'}
`;
  };

  const handleSendMessage = async (userMessage: string) => {
    if (!userMessage.trim() || isLoading) return;

    setIsLoading(true);
    setGameState(prev => ({
      ...prev,
      history: [...prev.history, { role: 'user', content: userMessage }]
    }));

    try {
      let responseText = "";
      const systemPrompt = `${SYSTEM_INSTRUCTION}

当前角色设定：
姓名：${gameState.profile.name} | 性别：${gameState.profile.gender} | 性格：${gameState.profile.personality} | 背景：${gameState.profile.background} | 专业：${gameState.profile.major} | 兴趣：${gameState.profile.interests.join(', ')}

${getGameStateContext(gameState)}`;

      if (settings.provider === 'gemini') {
        const ai = new GoogleGenAI({ apiKey: settings.apiKey });
        const response = await ai.models.generateContent({
          model: settings.modelName,
          contents: [
            ...gameState.history.map(msg => ({
              role: msg.role,
              parts: [{ text: msg.content }]
            })),
            { role: 'user', parts: [{ text: userMessage }] }
          ],
          config: {
            systemInstruction: systemPrompt,
          }
        });
        responseText = response.text || "";
      } else {
        const openai = new OpenAI({
          apiKey: settings.apiKey,
          baseURL: settings.baseUrl,
          dangerouslyAllowBrowser: true
        });
        const response = await openai.chat.completions.create({
          model: settings.modelName,
          messages: [
            { role: 'system', content: systemPrompt },
            ...gameState.history.map(msg => ({
              role: msg.role as 'user' | 'assistant',
              content: msg.content
            })),
            { role: 'user', content: userMessage }
          ],
        });
        responseText = response.choices[0]?.message?.content || "";
      }

      processAIResponse(responseText);
    } catch (error) {
      console.error("AI Error:", error);
      setGameState(prev => ({
        ...prev,
        history: [...prev.history, { role: 'model', content: "抱歉，由于网络波动，我暂时无法回应。请检查 API 配置并重试。" }]
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const initGame = async (profile?: GameState['profile'], initialStats?: GameState['stats']) => {
    setIsLoading(true);
    try {
      const currentProfile = profile || gameState.profile;
      const currentStats = initialStats || gameState.stats;
      
      // Create a temporary state for context
      const tempState = { ...gameState, profile: currentProfile, stats: currentStats };
      const systemPrompt = `${SYSTEM_INSTRUCTION}

当前角色设定：
姓名：${currentProfile.name} | 性别：${currentProfile.gender} | 性格：${currentProfile.personality} | 背景：${currentProfile.background} | 专业：${currentProfile.major} | 兴趣：${currentProfile.interests.join(', ')}

${getGameStateContext(tempState)}`;

      let responseText = "";

      if (settings.provider === 'gemini') {
        const ai = new GoogleGenAI({ apiKey: settings.apiKey });
        const result = await ai.models.generateContent({
          model: settings.modelName,
          contents: [{ role: 'user', parts: [{ text: "开始游戏" }] }],
          config: { 
            systemInstruction: systemPrompt,
          }
        });
        responseText = result.text || "";
      } else {
        const openai = new OpenAI({
          apiKey: settings.apiKey,
          baseURL: settings.baseUrl,
          dangerouslyAllowBrowser: true
        });
        const result = await openai.chat.completions.create({
          model: settings.modelName,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: "开始游戏" }
          ],
        });
        responseText = result.choices[0]?.message?.content || "";
      }
      
      processAIResponse(responseText);
      setIsInitialized(true);
    } catch (error) {
      console.error("Init Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreationComplete = (profile: GameState['profile'], stats: GameState['stats']) => {
    setGameState(prev => ({
      ...prev,
      profile,
      stats,
      history: [] // Reset history for new game
    }));
    setIsInitialized(true); // Set initialized here so they can "Continue" if they accidentally leave
    setCurrentScreen('game');
    initGame(profile, stats);
  };

  const handleSaveSettings = async (newSettings: GameSettings) => {
    setSettings(newSettings);
    if (typeof gapp !== 'undefined' && gapp.state) {
      await gapp.state.set('ai_life_sim_settings', newSettings);
    }
    localStorage.setItem('ai_life_sim_settings', JSON.stringify(newSettings));
    setCurrentScreen('home');
  };

  const handleLoadGame = (loadedState: GameState) => {
    setGameState(loadedState);
    setIsInitialized(true);
    setCurrentScreen('game');
  };

  const handleUpdateProfile = (update: Partial<GameState['profile']>) => {
    setGameState(prev => ({
      ...prev,
      profile: { ...prev.profile, ...update }
    }));
  };

  const handleUseItem = (item: string) => {
    if (item.includes('手机') || item.toLowerCase().includes('phone')) {
      setActiveInteractiveItem(item);
      setRightPanelOpen(true);
    } else if (item.includes('校园卡') || item.includes('卡')) {
      setActiveInteractiveItem(item);
      setRightPanelOpen(true);
    } else if (item.includes('录取通知书')) {
      setActiveInteractiveItem(item);
      setRightPanelOpen(true);
    } else {
      handleSendMessage(`[使用物品] 我仔细查看了手中的${item}。`);
    }
  };

  return (
    <ErrorBoundary>
      <div className="flex h-screen w-full overflow-hidden bg-brand-bg">
        {/* Screens */}
        {currentScreen === 'home' && (
          <HomeScreen 
            onStart={() => setCurrentScreen('character')} 
            onConfig={() => setCurrentScreen('config')} 
            onAchievements={() => setCurrentScreen('achievement')} 
            onLoad={() => setCurrentScreen('load')} 
            onContinue={() => setCurrentScreen('game')}
            canContinue={isInitialized || (gameState.profile.name !== "")}
            hasApiKey={!!settings.apiKey}
          />
        )}

        {currentScreen === 'achievement' && (
          <AchievementScreen 
            achievements={gameState.achievements} 
            onBack={() => setCurrentScreen('home')} 
          />
        )}

        {currentScreen === 'config' && (
          <ConfigScreen 
            settings={settings} 
            onSave={handleSaveSettings} 
            onBack={() => setCurrentScreen('home')} 
          />
        )}

        {currentScreen === 'character' && (
          <CharacterCreation onComplete={handleCreationComplete} />
        )}

        {(currentScreen === 'save' || currentScreen === 'load') && (
          <SaveLoadScreen 
            mode={currentScreen}
            currentState={gameState}
            onLoad={handleLoadGame}
            onSave={(state) => {
              // Save logic is handled inside the component for slots
              console.log("Saving state...", state);
            }}
            onBack={() => currentScreen === 'save' ? setCurrentScreen('game') : setCurrentScreen('home')}
          />
        )}

        {/* Main Game UI */}
        {currentScreen === 'game' && (
          <>
            <AnimatePresence mode="wait">
              {leftPanelOpen && (
                <>
                  {isMobile && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setLeftPanelOpen(false)}
                      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[80]"
                    />
                  )}
                  <motion.div
                    initial={{ x: -320, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -320, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className={`${isMobile ? 'fixed inset-y-0 left-0 z-[90]' : 'h-full'}`}
                  >
                    <StatsPanel state={gameState} onUpdateProfile={handleUpdateProfile} />
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            <main className="flex-1 h-full min-w-0 relative">
              <GameInterface 
                state={gameState}
                onSendMessage={handleSendMessage} 
                isLoading={isLoading} 
                onClosePopup={() => setGameState(prev => ({ ...prev, activePopup: undefined }))}
                onMenu={() => setCurrentScreen('home')}
                onSave={() => setCurrentScreen('save')}
                onToggleLeft={() => {
                  if (isMobile) setRightPanelOpen(false);
                  setLeftPanelOpen(!leftPanelOpen);
                }}
                onToggleRight={() => {
                  if (isMobile) setLeftPanelOpen(false);
                  setRightPanelOpen(!rightPanelOpen);
                }}
                leftOpen={leftPanelOpen}
                rightOpen={rightPanelOpen}
              />
            </main>

            <AnimatePresence mode="wait">
              {rightPanelOpen && (
                <>
                  {isMobile && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setRightPanelOpen(false)}
                      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[80]"
                    />
                  )}
                  <motion.div
                    initial={{ x: 320, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 320, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className={`${isMobile ? 'fixed inset-y-0 right-0 z-[90]' : 'h-full'}`}
                  >
                    {activeInteractiveItem ? (
                      <div className="w-80 h-full p-4 flex flex-col bg-white">
                        <ItemInteractionOverlay 
                          item={activeInteractiveItem} 
                          state={gameState} 
                          onClose={() => setActiveInteractiveItem(null)}
                          onSendMessage={handleSendMessage}
                        />
                      </div>
                    ) : (
                      <RightPanel state={gameState} onUseItem={handleUseItem} />
                    )}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </ErrorBoundary>
  );
}
