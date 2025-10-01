// A small Facade over modal DOM to keep game code clean
// Provides: showRulesModal, showGameOverModal, initModals, onPlayAgain

let playAgainHandler = null;

export function initModals() {
  const rulesModal = document.getElementById("modal");
  const rulesClose = rulesModal?.querySelector(".modal-close");
  const rulesConfirm = rulesModal?.querySelector("#modal-confirm-btn");

  const overModal = document.getElementById("game-over-modal");
  const overClose = overModal?.querySelector(".modal-close");
  const overConfirm = overModal?.querySelector("button");

  const closeRules = () => (rulesModal.style.display = "none");
  const closeOver = () => {
    overModal.style.display = "none";
    if (typeof playAgainHandler === "function") playAgainHandler();
  };

  rulesClose?.addEventListener("click", closeRules);
  rulesConfirm?.addEventListener("click", closeRules);

  overClose?.addEventListener("click", closeOver);
  overConfirm?.addEventListener("click", closeOver);

  rulesModal?.addEventListener("click", (e) => {
    if (e.target === rulesModal) closeRules();
  });
  overModal?.addEventListener("click", (e) => {
    if (e.target === overModal) closeOver();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (rulesModal?.style.display === "flex") closeRules();
      if (overModal?.style.display === "flex") closeOver();
    }
  });

  //"?" icons
  document.querySelectorAll(".game-info-icon").forEach((icon) => {
    icon.addEventListener("click", (e) => {
      const type = e.currentTarget.getAttribute("data-modal");
      showRulesModal(type);
    });
  });
}

//Call by index.js so games can reset when user presses "Play Again"
export function onPlayAgain(handler) {
  playAgainHandler = handler;
}

//Show the rules modal for either game
export function showRulesModal(type) {
  const modal = document.getElementById("modal");
  const title = document.getElementById("modal-title");
  const body = document.getElementById("modal-text");
  const image = document.getElementById("modal-image");

  if (type === "matching-rules") {
    title.textContent = "Matching Pairs Rules";
    image.src = "image/Right/Matching Pairs.png";
    body.innerHTML = `
      <h3>How to Play:</h3>
      <ol>
        <li>Click on any card to flip it over and reveal the badge.</li>
        <li>Click a second card to try to find its match.</li>
        <li>Matched pairs stay face‑up; mismatches flip back.</li>
        <li>Match all pairs to win.</li>
      </ol>
      <h3>Game Features:</h3>
      <ul>
        <li>3 difficulty levels (more pairs on higher levels).</li>
        <li>Timer to track completion time.</li>
        <li>Move counter for attempts made.</li>
      </ul>
    `;
  } else {
    title.textContent = "Triplix Match Rules";
    image.src = "image/Right/Triplix Match.png";
    body.innerHTML = `
      <h3>How to Play:</h3>
      <ol>
        <li>Click a visible tile to move it to the stack area below.</li>
        <li>Three identical tiles in the stack clear automatically.</li>
        <li>If the stack hits its limit before clearing, you lose.</li>
        <li>Clear all tiles from the board to win.</li>
      </ol>
      <h3>Special Features:</h3>
      <ul>
        <li><strong>3 Levels:</strong> more tiles at higher levels.</li>
        <li><strong>Overlapping tiles:</strong> only the topmost is clickable.</li>
        <li><strong>Reshuffle (3x):</strong> repositions visible tiles.</li>
        <li><strong>Undo (3x):</strong> returns the last moved tile.</li>
      </ul>
    `;
  }

  modal.style.display = "flex";
}

//Show the game‑over modal with a message and image
export function showGameOverModal({ title, message, isWin }) {
  const modal = document.getElementById("game-over-modal");
  document.getElementById("game-over-title").textContent = title;
  document.getElementById("game-over-text").textContent = message;
  document.getElementById("game-over-image").src =
    isWin ? "image/Right/Matching Pairs.png" : "image/Right/Matching Pairs.png";
  modal.style.display = "flex";
}
