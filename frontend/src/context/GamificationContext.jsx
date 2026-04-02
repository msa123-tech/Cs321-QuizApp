import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';

const GamificationContext = createContext(null);

const XP_PREFIX = 'codingPlatform_xp_';
const LESSONS_PREFIX = 'codingPlatform_lessonsCompleted_';

function readNumber(raw, fallback = 0) {
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
}

function xpStorageKey(userId) {
  return `${XP_PREFIX}${userId}`;
}

function lessonsStorageKey(userId) {
  return `${LESSONS_PREFIX}${userId}`;
}

function getUserStorageId(user) {
  if (!user) return null;
  const id = user.id ?? user.userId;
  if (id != null && id !== '') return String(id);
  return null;
}

export function GamificationProvider({ children }) {
  const { user } = useAuth();
  const userId = getUserStorageId(user);

  const [xp, setXpState] = useState(0);
  const [lessonsCompleted, setLessonsCompletedState] = useState(0);

  // Load or reset when the logged-in user changes (logout → login as someone else).
  useEffect(() => {
    if (!userId) {
      setXpState(0);
      setLessonsCompletedState(0);
      return;
    }

    const lessons = readNumber(localStorage.getItem(lessonsStorageKey(userId)), 0);
    const apiXp = user?.xp != null ? Number(user.xp) : NaN;
    const initialXp = Number.isFinite(apiXp)
      ? apiXp
      : readNumber(localStorage.getItem(xpStorageKey(userId)), 0);

    setXpState(initialXp);
    setLessonsCompletedState(lessons);
    localStorage.setItem(xpStorageKey(userId), String(initialXp));
    // Only userId: when the id changes we load that account. Omitting `user` avoids resetting XP if the auth object is replaced with the same id.
  }, [userId]);

  const setXp = useCallback(
    (value) => {
      if (!userId) return;
      setXpState((prev) => {
        const next = typeof value === 'function' ? value(prev) : value;
        const n = Number(next);
        if (!Number.isFinite(n)) return prev;
        localStorage.setItem(xpStorageKey(userId), String(n));
        return n;
      });
    },
    [userId]
  );

  const syncTotalXp = useCallback(
    (total) => {
      const n = Number(total);
      if (!Number.isFinite(n) || !userId) return;
      setXpState(n);
      localStorage.setItem(xpStorageKey(userId), String(n));
    },
    [userId]
  );

  const addXp = useCallback(
    (amount) => {
      if (!userId) return;
      const n = Number(amount);
      if (!Number.isFinite(n) || n === 0) return;
      setXp((prev) => prev + n);
    },
    [userId, setXp]
  );

  const setLessonsCompleted = useCallback(
    (value) => {
      if (!userId) return;
      setLessonsCompletedState((prev) => {
        const next = typeof value === 'function' ? value(prev) : value;
        const capped = Math.max(0, Math.floor(next));
        localStorage.setItem(lessonsStorageKey(userId), String(capped));
        return capped;
      });
    },
    [userId]
  );

  const completeLessonAtIndex = useCallback(
    (index) => {
      const i = Math.floor(index);
      if (i < 0 || !userId) return;
      setLessonsCompleted((prev) => Math.max(prev, i + 1));
    },
    [userId, setLessonsCompleted]
  );

  const value = useMemo(
    () => ({
      xp,
      lessonsCompleted,
      setXp,
      syncTotalXp,
      addXp,
      setLessonsCompleted,
      completeLessonAtIndex,
    }),
    [xp, lessonsCompleted, setXp, syncTotalXp, addXp, setLessonsCompleted, completeLessonAtIndex]
  );

  return <GamificationContext.Provider value={value}>{children}</GamificationContext.Provider>;
}

export function useGamification() {
  const ctx = useContext(GamificationContext);
  if (!ctx) {
    throw new Error('useGamification must be used within GamificationProvider');
  }
  return ctx;
}
