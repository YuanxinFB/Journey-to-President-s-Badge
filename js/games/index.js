import { initModals, onPlayAgain } from "./modals.js";
import { GameManager } from "./gameManager.js";
import { MatchingPairsGame } from "./matching.js";
import { TriplixGame } from "./triplix.js";
import { renderLeaderboard } from "./storage.js";  // ⬅️ add this

function ready(fn) {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
  else fn();
}

ready(() => {
  initModals();

  const manager = new GameManager();

  const matching = new MatchingPairsGame({
    boardSelector: "#matching-game-board",
    movesSelector: "#matching-moves",
    timerSelector: "#matching-timer",
    startBtnSelector: "#startMatchingGame",
    restartBtnSelector: "#restartMatchingGame",
    levelButtonsSelector: '.game-box:nth-child(1) .level-button',
    leaderboardSelector: '#matching-leaderboard' 
  });

  const triplix = new TriplixGame({
    boardSelector: "#solitaire-game-board",
    stackAreaSelector: "#stack",
    stackLabelSelector: "#solitaire-stack",
    timerSelector: "#solitaire-timer",
    startBtnSelector: "#startSolitaireGame",
    restartBtnSelector: "#restartSolitaireGame",
    reshuffleBtnSelector: "#reshuffleButton",
    undoBtnSelector: "#undoButton",
    levelButtonsSelector: '.game-box:nth-child(2) .level-button',
    leaderboardSelector: '#triplix-leaderboard' 
  });

  manager.register("matching", matching);
  manager.register("triplix", triplix);
  manager.initAll();

  // Show current leaderboards at startup
  renderLeaderboard(document.getElementById('matching-leaderboard'), 'matching');
  renderLeaderboard(document.getElementById('triplix-leaderboard'), 'triplix');

  onPlayAgain(() => manager.resetAll());
});
