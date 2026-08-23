const STORAGE_KEY = "sift.history.v1";
const MAX_ENTRIES = 10;

function safeParse(raw) {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getHistory() {
  if (typeof window === "undefined") return [];
  try {
    return safeParse(window.localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function addHistoryEntry(entry) {
  if (typeof window === "undefined") return;
  try {
    const current = getHistory();
    const next = [{ id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, ...entry }, ...current].slice(
      0,
      MAX_ENTRIES
    );
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next;
  } catch {
    return getHistory();
  }
}

export function removeHistoryEntry(id) {
  if (typeof window === "undefined") return [];
  try {
    const next = getHistory().filter((e) => e.id !== id);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next;
  } catch {
    return getHistory();
  }
}

export function clearHistory() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // storage unavailable — nothing to clean up
  }
}
