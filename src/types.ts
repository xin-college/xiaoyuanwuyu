export type WeatherType = '晴天' | '雨天' | '阴天' | '雪天' | '大风' | '雷阵雨';

export interface Stats {
  academic: number;
  social: number;
  health: number;
  money: number;
  gpa: number;
  charm: number; // Added charm
  luck: number;  // Added luck
}

export interface Course {
  id: string;
  name: string;
  description: string;
  grade: number; // 0-100
  credits: number;
  type: '必修' | '选修' | '兴趣';
  effects: string;
  energyCost: number;
  isEnrolled: boolean;
  requirements?: string;
}

export interface Goal {
  id: string;
  title: string;
  progress: number; // 0-100
  completed: boolean;
}

export interface KeyEvent {
  id: string;
  title: string;
  description: string;
  round: number;
  resolved: boolean;
}

export interface Relationship {
  name: string;
  value: number;
  tags: string[]; // e.g., ["室友", "同桌"]
  description: string;
  avatar?: string;
  isRomanceable?: boolean;
  storylineProgress?: number; // 0-100
  personality?: string;
  lastInteraction?: string;
  unlockedFacts?: string[];
}

export interface Club {
  id: string;
  name: string;
  role: string;
  level: number; // 1-5
  activitiesParticipated: number;
}

export interface Job {
  id: string;
  name: string;
  company: string;
  salary: number;
  hoursPerWeek: number;
  performance: number; // 0-100
}

export interface RandomEvent {
  id: string;
  title: string;
  description: string;
  impact: string;
  round: number;
}

export interface GameSettings {
  apiKey: string;
  baseUrl: string;
  modelName: string;
  provider: 'gemini' | 'openai';
}

export interface SaveData {
  id: string;
  name: string;
  date: string;
  state: GameState;
}

export interface GameState {
  profile: {
    name: string;
    gender: '男' | '女' | '其他';
    personality: string;
    background: string;
    major: string;
    interests: string[];
    avatar?: string;
  };
  stats: Stats;
  location: string;
  time: string;
  round: number;
  history: Message[];
  inventory: string[];
  relationships: Record<string, Relationship>;
  clubs: Club[];
  jobs: Job[];
  recentEvents: RandomEvent[];
  courses: Course[];
  goals: Goal[];
  keyEvents: KeyEvent[];
  options: string[];
  activePopup?: {
    type: 'event' | 'relationship';
    title: string;
    content: string;
    data?: any;
  };
  activeInteractiveItem?: string;
  weather?: WeatherType;
  aiThoughts?: string;
  achievements?: {
    id: string;
    title: string;
    description: string;
    unlockedAt: string;
    icon: string;
  }[];
  socialFeed?: {
    id: string;
    author: string;
    content: string;
    time: string;
    likes: number;
  }[];
}

export interface Message {
  role: 'user' | 'model';
  content: string;
}

export interface StateUpdate {
  statsChange?: Partial<Stats>;
  newLocation?: string;
  newTime?: string;
  roundIncrement?: number;
  newInventory?: string[];
  relationshipChange?: Record<string, { 
    value: number; 
    tags?: string[]; 
    description?: string;
    avatar?: string;
    isRomanceable?: boolean;
    storylineProgress?: number;
    unlockedFacts?: string[];
  }>;
  newCourses?: Course[];
  newGoals?: Goal[];
  updateGoal?: { id: string; progress?: number; completed?: boolean };
  newKeyEvents?: KeyEvent[];
  resolveKeyEvent?: string;
  newClubs?: Club[];
  updateClub?: { id: string; level?: number; activitiesParticipated?: number };
  newJobs?: Job[];
  updateJob?: { id: string; performance?: number };
  newRandomEvents?: RandomEvent[];
  newOptions?: string[];
  newWeather?: WeatherType;
  newAiThoughts?: string;
  newAchievements?: {
    id: string;
    title: string;
    description: string;
    unlockedAt: string;
    icon: string;
  }[];
  newSocialPosts?: {
    author: string;
    content: string;
    time: string;
    likes: number;
  }[];
  triggerPopup?: {
    type: 'event' | 'relationship';
    title: string;
    content: string;
    data?: any;
  };
}
