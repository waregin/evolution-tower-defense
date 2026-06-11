// main.js — bootstrap: build the UI, build the Game, wire them together.
import { Game } from "./game.js";
import { UI } from "./ui.js";
import { LEVELS } from "./levels.js";

const canvas = document.getElementById("board");
const ui = new UI();

const game = new Game(canvas, {
  onChange: () => ui.render(),
  onTip: (title, msg) => ui.showToast(title, msg),
  onEnd: (result) => ui.showBanner(result),
});
ui.setGame(game);

let currentLevel = 0;

function loadLevel(index) {
  currentLevel = index;
  document.getElementById("level-select").value = String(index);
  game.load(LEVELS[index]);
  ui.onLevelLoaded();
}

ui.bindBoard(
  (pt) => game.placeTower(pt.x, pt.y),
  (pt) => game.sellAt(pt.x, pt.y),
  (pt) => { game.hoverCell = pt ? game.cellAt(pt.x, pt.y) : null; }
);

ui.bindControls({
  onStart: () => { game.startGeneration(); ui.forceCharts(); },
  onSpeed: () => game.cycleSpeed(),
  onRestart: () => loadLevel(currentLevel),
  onLevelChange: (i) => loadLevel(i),
});

loadLevel(0);

// Show the help panel on first visit.
if (!localStorage.getItem("etd-seen-help")) {
  ui.openHelp();
  localStorage.setItem("etd-seen-help", "1");
}
