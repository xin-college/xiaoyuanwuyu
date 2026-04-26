import React, { useState } from 'react';
import { Target, Flag, Wallet, CheckCircle2, Clock, ChevronUp, ChevronDown, Briefcase, Users2, Zap, BookOpen, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { GameState } from '../types';

interface RightPanelProps {
  state: GameState;
  onUseItem?: (item: string) => void;
}

export const RightPanel: React.FC<RightPanelProps> = ({ state, onUseItem }) => {
  const { goals, keyEvents, inventory, clubs, jobs, recentEvents, courses } = state;
  const [goalsOpen, setGoalsOpen] = useState(true);
  const [eventsOpen, setEventsOpen] = useState(true);
  const [clubsOpen, setClubsOpen] = useState(false);
  const [jobsOpen, setJobsOpen] = useState(false);
  const [recentOpen, setRecentOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(true);

  return (
    <div className="flex flex-col gap-4 p-4 w-[280px] sm:w-72 h-full flex-shrink-0 overflow-y-auto bg-white/90 sm:bg-transparent z-10 border-l border-white/20 sm:border-none">
      {/* Courses Section */}
      <div className="card-panel flex flex-col gap-4">
        <button 
          onClick={() => setCoursesOpen(!coursesOpen)}
          className="flex items-center justify-between px-1 group"
        >
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-brand-purple" />
            <h3 className="text-[13px] font-bold text-slate-600 group-hover:text-slate-800 transition-colors">课程表</h3>
            <span className="text-[11px] bg-brand-purple/20 text-brand-purple px-2 py-0.5 rounded-full font-bold">
              {courses.filter(c => c.isEnrolled).length}
            </span>
          </div>
          {coursesOpen ? <ChevronUp className="w-3.5 h-3.5 text-slate-300" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-300" />}
        </button>

        <AnimatePresence initial={false}>
          {coursesOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="space-y-3 pt-2">
                {courses.length > 0 ? (
                  courses.map(course => (
                    <div key={course.id} className="p-3 bg-white/40 rounded-xl border border-white/60 space-y-2 group/course relative overflow-hidden">
                      <div className="flex items-center justify-between">
                        <h4 className="text-[12px] font-bold text-slate-700 truncate pr-2">{course.name}</h4>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-black ${
                          course.type === '必修' ? 'bg-red-100 text-red-500' : 
                          course.type === '选修' ? 'bg-blue-100 text-blue-500' : 'bg-green-100 text-green-500'
                        }`}>
                          {course.type}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-tight line-clamp-2">{course.description}</p>
                      <div className="flex items-center justify-between text-[9px] font-bold">
                        <span className="text-brand-purple">学分: {course.credits}</span>
                        <span className="text-brand-pink">效果: {course.effects}</span>
                      </div>
                      <div className="flex items-center gap-2 pt-1">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-brand-purple transition-all" style={{ width: `${course.grade}%` }} />
                        </div>
                        <span className="text-[9px] font-black text-slate-400">{course.grade}%</span>
                      </div>
                      {course.isEnrolled ? (
                        <button 
                          onClick={() => onUseItem?.(`[参加课程] ${course.name}`)}
                          className="w-full py-1.5 bg-brand-purple/10 hover:bg-brand-purple text-brand-purple hover:text-white text-[10px] font-black rounded-lg transition-all flex items-center justify-center gap-1"
                        >
                          <GraduationCap className="w-3 h-3" /> 去上课 ({course.energyCost}回合)
                        </button>
                      ) : (
                        <button 
                          onClick={() => onUseItem?.(`[选修课程] ${course.name}`)}
                          className="w-full py-1.5 bg-brand-pink/10 hover:bg-brand-pink text-brand-pink hover:text-white text-[10px] font-black rounded-lg transition-all"
                        >
                          选修此课
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-[11px] text-slate-400 italic text-center py-2">本学期暂无可选课程</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Goals Section */}
      <div className="card-panel flex flex-col gap-4">
        <button 
          onClick={() => setGoalsOpen(!goalsOpen)}
          className="flex items-center justify-between px-1 group"
        >
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-brand-pink" />
            <h3 className="text-[13px] font-bold text-slate-600 group-hover:text-slate-800 transition-colors">目标</h3>
            <span className="text-[11px] bg-brand-pink/20 text-brand-pink px-2 py-0.5 rounded-full font-bold">
              {goals.filter(g => g.completed).length}/{goals.length}
            </span>
          </div>
          {goalsOpen ? <ChevronUp className="w-3.5 h-3.5 text-slate-300" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-300" />}
        </button>

        <AnimatePresence initial={false}>
          {goalsOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="space-y-4 pt-2">
                {goals.length > 0 ? (
                  goals.map(goal => (
                    <div key={goal.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`text-[13px] font-bold ${goal.completed ? 'text-slate-400 line-through' : 'text-slate-600'}`}>
                          {goal.title}
                        </span>
                        {goal.completed && <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />}
                      </div>
                      <div className="w-full h-1.5 bg-white/60 rounded-full overflow-hidden border border-white/40">
                        <div 
                          className={`h-full ${goal.completed ? 'bg-green-400' : 'bg-brand-pink'} transition-all duration-700`} 
                          style={{ width: `${goal.progress}%` }} 
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold">{goal.progress}%</span>
                    </div>
                  ))
                ) : (
                  <p className="text-[11px] text-slate-400 italic text-center py-2">暂无目标</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Key Events Section */}
      <div className="card-panel flex flex-col gap-4">
        <button 
          onClick={() => setEventsOpen(!eventsOpen)}
          className="flex items-center justify-between px-1 group"
        >
          <div className="flex items-center gap-2">
            <Flag className="w-4 h-4 text-brand-purple" />
            <h3 className="text-[13px] font-bold text-slate-600 group-hover:text-slate-800 transition-colors">关键事件</h3>
            <span className="text-[11px] bg-brand-purple/20 text-brand-purple px-2 py-0.5 rounded-full font-bold">
              {keyEvents.length}
            </span>
          </div>
          {eventsOpen ? <ChevronUp className="w-3.5 h-3.5 text-slate-300" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-300" />}
        </button>

        <AnimatePresence initial={false}>
          {eventsOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="space-y-3 pt-2">
                {keyEvents.length > 0 ? (
                  keyEvents.map(event => (
                    <div key={event.id} className="p-4 bg-white/40 rounded-2xl border border-white/60 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-[13px] font-bold text-slate-700">{event.title}</h4>
                        {event.resolved && (
                          <span className="text-[10px] bg-green-100 text-green-500 px-1.5 py-0.5 rounded font-bold">已解决</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold">
                        <Clock className="w-3 h-3" />
                        <span>回合 {event.round}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{event.description}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-[11px] text-slate-400 italic text-center py-2">暂无关键事件</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Clubs Section */}
      <div className="card-panel flex flex-col gap-4">
        <button 
          onClick={() => setClubsOpen(!clubsOpen)}
          className="flex items-center justify-between px-1 group"
        >
          <div className="flex items-center gap-2">
            <Users2 className="w-4 h-4 text-brand-secondary" />
            <h3 className="text-[13px] font-bold text-slate-600 group-hover:text-slate-800 transition-colors">社团</h3>
            <span className="text-[11px] bg-brand-secondary/20 text-brand-secondary px-2 py-0.5 rounded-full font-bold">
              {clubs.length}
            </span>
          </div>
          {clubsOpen ? <ChevronUp className="w-3.5 h-3.5 text-slate-300" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-300" />}
        </button>

        <AnimatePresence initial={false}>
          {clubsOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="space-y-3 pt-2">
                {clubs.length > 0 ? (
                  clubs.map(club => (
                    <div key={club.id} className="p-3 bg-white/40 rounded-xl border border-white/60 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-[13px] font-bold text-slate-700">{club.name}</h4>
                        <span className="text-[10px] bg-brand-secondary/10 text-brand-secondary px-1.5 py-0.5 rounded font-bold">Lv.{club.level}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">{club.role}</p>
                      <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-secondary" style={{ width: `${(club.activitiesParticipated % 10) * 10}%` }} />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-[11px] text-slate-400 italic text-center py-2">尚未加入社团</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Jobs Section */}
      <div className="card-panel flex flex-col gap-4">
        <button 
          onClick={() => setJobsOpen(!jobsOpen)}
          className="flex items-center justify-between px-1 group"
        >
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-brand-primary" />
            <h3 className="text-[13px] font-bold text-slate-600 group-hover:text-slate-800 transition-colors">兼职</h3>
            <span className="text-[11px] bg-brand-primary/20 text-brand-primary px-2 py-0.5 rounded-full font-bold">
              {jobs.length}
            </span>
          </div>
          {jobsOpen ? <ChevronUp className="w-3.5 h-3.5 text-slate-300" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-300" />}
        </button>

        <AnimatePresence initial={false}>
          {jobsOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="space-y-3 pt-2">
                {jobs.length > 0 ? (
                  jobs.map(job => (
                    <div key={job.id} className="p-3 bg-white/40 rounded-xl border border-white/60 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-[13px] font-bold text-slate-700">{job.name}</h4>
                        <span className="text-[11px] font-black text-brand-primary">¥{job.salary}/h</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-bold">{job.company}</p>
                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold">
                        <span>表现: {job.performance}%</span>
                        <span>{job.hoursPerWeek}h/周</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-[11px] text-slate-400 italic text-center py-2">暂无兼职</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Recent Events Section */}
      <div className="card-panel flex flex-col gap-4">
        <button 
          onClick={() => setRecentOpen(!recentOpen)}
          className="flex items-center justify-between px-1 group"
        >
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-green-500" />
            <h3 className="text-[13px] font-bold text-slate-600 group-hover:text-slate-800 transition-colors">近期动态</h3>
          </div>
          {recentOpen ? <ChevronUp className="w-3.5 h-3.5 text-slate-300" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-300" />}
        </button>

        <AnimatePresence initial={false}>
          {recentOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="space-y-3 pt-2">
                {recentEvents.length > 0 ? (
                  recentEvents.map(event => (
                    <div key={event.id} className="p-3 bg-white/40 rounded-xl border border-white/60 space-y-1">
                      <h4 className="text-[12px] font-bold text-slate-700">{event.title}</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{event.description}</p>
                      <p className="text-[10px] text-green-600 font-bold">{event.impact}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-[11px] text-slate-400 italic text-center py-2">暂无动态</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Assets/Inventory Section */}
      <div className="card-panel flex flex-col gap-4">
        <div className="flex items-center gap-2 px-1">
          <Wallet className="w-4 h-4 text-amber-500" />
          <h3 className="text-[13px] font-bold text-slate-600">资产</h3>
          <span className="text-[11px] bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full font-bold">
            {inventory.length}/50
          </span>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {inventory.length > 0 ? (
            inventory.map((item, i) => (
              <button 
                key={i} 
                onClick={() => onUseItem?.(item)}
                className="px-3 py-1.5 bg-white/60 hover:bg-brand-pink/10 text-slate-500 hover:text-brand-pink text-[11px] rounded-lg border border-white/80 hover:border-brand-pink/30 font-bold transition-all active:scale-95 shadow-sm"
                title="点击使用/查看"
              >
                {item}
              </button>
            ))
          ) : (
            <p className="text-[11px] text-slate-400 italic text-center py-2 w-full">暂无资产</p>
          )}
        </div>
      </div>
    </div>
  );
};
