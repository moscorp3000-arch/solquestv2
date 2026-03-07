import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  STREAK_COUNT:    'streak:count',
  LAST_OPEN:       'streak:last_open',
  FREEZE_USED:     'streak:freeze_used',
  FREEZE_AVAILABLE:'streak:freeze_available',
};

// ─── helpers ──────────────────────────────────────────────────────────────────

function todayStr(): string {
  return new Date().toISOString().slice(0, 10); // "2026-03-07"
}

function daysBetween(a: string, b: string): number {
  const msA = new Date(a).getTime();
  const msB = new Date(b).getTime();
  return Math.round(Math.abs(msB - msA) / 86_400_000);
}

// ─── public API ───────────────────────────────────────────────────────────────

export interface StreakState {
  count: number;          // current streak in days
  lastOpen: string | null;// ISO date string of last open
  freezeAvailable: boolean;// user has a freeze ready
  freezeUsed: boolean;    // freeze was used today (show ice badge)
  isAlreadyCountedToday: boolean;
}

/**
 * Call this every time the app opens (in useEffect on HomeScreen or App).
 * Returns the new StreakState after processing today's open.
 */
export async function recordOpen(): Promise<StreakState> {
  const today = todayStr();

  const [rawCount, rawLast, rawFreezeUsed, rawFreezeAvail] = await Promise.all([
    AsyncStorage.getItem(KEYS.STREAK_COUNT),
    AsyncStorage.getItem(KEYS.LAST_OPEN),
    AsyncStorage.getItem(KEYS.FREEZE_USED),
    AsyncStorage.getItem(KEYS.FREEZE_AVAILABLE),
  ]);

  let count         = parseInt(rawCount  ?? '0', 10) || 0;
  const lastOpen    = rawLast ?? null;
  let freezeUsed    = rawFreezeUsed === 'true';
  let freezeAvail   = rawFreezeAvail !== 'false'; // default true (everyone starts with 1)

  // Already recorded today — no changes needed
  if (lastOpen === today) {
    return {
      count,
      lastOpen,
      freezeAvailable: freezeAvail,
      freezeUsed,
      isAlreadyCountedToday: true,
    };
  }

  const gap = lastOpen ? daysBetween(lastOpen, today) : 0;

  if (!lastOpen || gap === 0) {
    // First ever open or same day (shouldn't happen but guard)
    count = 1;
    freezeUsed = false;
  } else if (gap === 1) {
    // Perfect — consecutive day
    count += 1;
    freezeUsed = false;
    // Every 7-day milestone earns a new freeze
    if (count % 7 === 0) freezeAvail = true;
  } else if (gap === 2 && freezeAvail && !freezeUsed) {
    // Missed yesterday → use freeze, streak survives
    count += 1;
    freezeUsed  = true;
    freezeAvail = false;
  } else {
    // Streak broken
    count = 1;
    freezeUsed = false;
  }

  await Promise.all([
    AsyncStorage.setItem(KEYS.STREAK_COUNT,     String(count)),
    AsyncStorage.setItem(KEYS.LAST_OPEN,        today),
    AsyncStorage.setItem(KEYS.FREEZE_USED,      String(freezeUsed)),
    AsyncStorage.setItem(KEYS.FREEZE_AVAILABLE, String(freezeAvail)),
  ]);

  return {
    count,
    lastOpen: today,
    freezeAvailable: freezeAvail,
    freezeUsed,
    isAlreadyCountedToday: false,
  };
}

/** Read current streak state without modifying anything. */
export async function getStreakState(): Promise<StreakState> {
  const today = todayStr();
  const [rawCount, rawLast, rawFreezeUsed, rawFreezeAvail] = await Promise.all([
    AsyncStorage.getItem(KEYS.STREAK_COUNT),
    AsyncStorage.getItem(KEYS.LAST_OPEN),
    AsyncStorage.getItem(KEYS.FREEZE_USED),
    AsyncStorage.getItem(KEYS.FREEZE_AVAILABLE),
  ]);
  return {
    count:                  parseInt(rawCount ?? '0', 10) || 0,
    lastOpen:               rawLast ?? null,
    freezeAvailable:        rawFreezeAvail !== 'false',
    freezeUsed:             rawFreezeUsed === 'true',
    isAlreadyCountedToday:  rawLast === today,
  };
}

/** Call this from dev-reset to wipe all streak data. */
export async function resetStreak(): Promise<void> {
  await Promise.all(Object.values(KEYS).map(k => AsyncStorage.removeItem(k)));
}