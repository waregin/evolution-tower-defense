// main.js — bootstrap: build the UI, build the Game, wire them together.
import { Game } from "./game.js";
import { UI } from "./ui.js";
import { LEVELS } from "./levels.js";
import { Progress } from "./progress.js";

const canvas = document.getElementById("board");
const ui = new UI();

let currentLevel = 0;

const game = new Game(canvas, {
  onChange: () => ui.render(),
  onTip: (title, msg) => ui.showToast(title, msg),
  onEnd: (result) => {
    // Record stars, refresh the picker (stars + any newly-unlocked chapters),
    // then show the debrief with a Next button if there's an unlocked next level.
    if (result.won) Progress.record(LEVELS[currentLevel].id, result.stars);
    ui.refreshLevels(currentLevel);
    const next = LEVELS[currentLevel + 1];
    const canNext = !!next && Progress.isUnlocked(next.id);
    ui.showDebrief(result, canNext);
  },
});
ui.setGame(game);

function loadLevel(index) {
  if (index < 0 || index >= LEVELS.length) return;
  currentLevel = index;
  game.load(LEVELS[index]);
  ui.refreshLevels(index);
  ui.onLevelLoaded();
}

ui.bindBoard(
  (pt) => game.tapBoard(pt.x, pt.y),                 // tap: place or sell (sell mode)
  (pt) => game.sellAt(pt.x, pt.y),                   // right-click: sell
  (pt) => { game.hoverCell = pt ? game.cellAt(pt.x, pt.y) : null; }
);

ui.bindControls({
  onStart: () => { game.startGeneration(); ui.forceCharts(); },
  onSpeed: () => game.cycleSpeed(),
  onRestart: () => loadLevel(currentLevel),
  onLevelChange: (i) => loadLevel(i),
  onNext: () => loadLevel(currentLevel + 1),
});

loadLevel(0);

// Show the help panel on first visit.
if (!localStorage.getItem("etd-seen-help")) {
  ui.openHelp();
  localStorage.setItem("etd-seen-help", "1");
}
