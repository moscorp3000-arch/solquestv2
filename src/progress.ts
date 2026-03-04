// src/progress.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const COMPLETED_KEY = 'solquest_completed_modules';
const XP_KEY = 'solquest_xp';
const STREAK_KEY = 'solquest_streak';
const LAST_PLAYED_KEY = 'solquest_last_played';
const ONBOARDING_KEY = 'solquest_onboarding_done';

export const getCompletedModules = async (): Promise<number[]> => {
  try {
    const val = await AsyncStorage.getItem(COMPLETED_KEY);
    return val ? JSON.parse(val) : [];
  } catch { return []; }
};

export const completeModule = async (moduleId: number): Promise<void> => {
  try {
    const completed = await getCompletedModules();
    if (!completed.includes(moduleId)) {
      completed.push(moduleId);
      await AsyncStorage.setItem(COMPLETED_KEY, JSON.stringify(completed));
    }
  } catch {}
};

export const getTotalXP = async (): Promise<number> => {
  try {
    const val = await AsyncStorage.getItem(XP_KEY);
    return val ? parseInt(val) : 0;
  } catch { return 0; }
};

export const addXP = async (amount: number): Promise<number> => {
  try {
    const current = await getTotalXP();
    const newTotal = current + amount;
    await AsyncStorage.setItem(XP_KEY, String(newTotal));
    return newTotal;
  } catch { return 0; }
};

export const getStreak = async (): Promise<number> => {
  try {
    const lastPlayed = await AsyncStorage.getItem(LAST_PLAYED_KEY);
    const streakVal = await AsyncStorage.getItem(STREAK_KEY);
    const streak = streakVal ? parseInt(streakVal) : 0;
    if (!lastPlayed) return 0;
    const last = new Date(lastPlayed);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays <= 1) return streak;
    return 0;
  } catch { return 0; }
};

export const updateStreak = async (): Promise<number> => {
  try {
    const lastPlayed = await AsyncStorage.getItem(LAST_PLAYED_KEY);
    const streakVal = await AsyncStorage.getItem(STREAK_KEY);
    const streak = streakVal ? parseInt(streakVal) : 0;
    const now = new Date();
    if (!lastPlayed) {
      await AsyncStorage.setItem(STREAK_KEY, '1');
      await AsyncStorage.setItem(LAST_PLAYED_KEY, now.toISOString());
      return 1;
    }
    const last = new Date(lastPlayed);
    const diffDays = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
    let newStreak = streak;
    if (diffDays === 1) newStreak = streak + 1;
    else if (diffDays > 1) newStreak = 1;
    await AsyncStorage.setItem(STREAK_KEY, String(newStreak));
    await AsyncStorage.setItem(LAST_PLAYED_KEY, now.toISOString());
    return newStreak;
  } catch { return 0; }
};

export const getNextUnlockedModule = async (): Promise<number> => {
  try {
    const completed = await getCompletedModules();
    for (let i = 1; i <= 10; i++) {
      if (!completed.includes(i)) return i;
    }
    return 1;
  } catch { return 1; }
};

export const isModuleUnlocked = (moduleId: number, completed: number[]): boolean => {
  if (moduleId === 1) return true;
  return completed.includes(moduleId - 1);
};

export const isOnboardingDone = async (): Promise<boolean> => {
  try {
    const val = await AsyncStorage.getItem(ONBOARDING_KEY);
    return val === 'true';
  } catch { return false; }
};

export const setOnboardingDone = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
  } catch {}
};

// DEV ONLY — reset everything
export const resetAllProgress = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      COMPLETED_KEY, XP_KEY, STREAK_KEY,
      LAST_PLAYED_KEY, ONBOARDING_KEY,
    ]);
  } catch {}
};