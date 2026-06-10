// progress.js — saved progress: best star rating per level, and chapter unlocks.
// Stored in localStorage so a learner can come back and continue.

const KEY = "etd-progress-v2";
const CHAPTER_SIZE = 5;       // levels per chapter
const UNLOCK_WINS = 3;        // wins needed in a chapter to unlock the next

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {}; }
  catch { return {}; }
}
function save(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* ignore */ }
}

let stars = load(); // { "extinction-3": 2, ... }

// Parse "mode-12" -> { mode, num (1-based), chapter (0-based) }.
function parseId(id) {
  const i = id.lastIndexOf("-");
  const mode = id.slice(0, i);
  const num = Number(id.slice(i + 1));
  return { mode, num, chapter: Math.floor((num - 1) / CHAPTER_SIZE) };
}

export const Progress = {
  starsFor(id) { return stars[id] || 0; },

  // Record a result; keeps the best stars ever earned for that level.
  record(id, earned) {
    if (earned > (stars[id] || 0)) { stars[id] = earned; save(stars); }
    return stars[id] || 0;
  },

  winsInChapter(mode, chapter) {
    let n = 0;
    for (let s = 1; s <= CHAPTER_SIZE; s++) {
      if ((stars[`${mode}-${chapter * CHAPTER_SIZE + s}`] || 0) > 0) n++;
    }
    return n;
  },

  // A chapter is open if it's the first, or you've won enough of the one before.
  isChapterUnlocked(mode, chapter) {
    return chapter === 0 || this.winsInChapter(mode, chapter - 1) >= UNLOCK_WINS;
  },

  isUnlocked(id) {
    const { mode, chapter } = parseId(id);
    return this.isChapterUnlocked(mode, chapter);
  },

  totalStars() {
    return Object.values(stars).reduce((a, b) => a + b, 0);
  },

  reset() { stars = {}; save(stars); },
};

export { CHAPTER_SIZE, UNLOCK_WINS };
