const STORAGE_KEY = 'sprint3_play_difficulty';

export function readPlayProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { easy: false, medium: false, hard: false };
    const o = JSON.parse(raw);
    return {
      easy: Boolean(o.easy),
      medium: Boolean(o.medium),
      hard: Boolean(o.hard),
    };
  } catch {
    return { easy: false, medium: false, hard: false };
  }
}

export function markDifficultyComplete(level) {
  const prev = readPlayProgress();
  const next = { ...prev };
  if (level === 'easy') next.easy = true;
  if (level === 'medium') next.medium = true;
  if (level === 'hard') next.hard = true;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}
