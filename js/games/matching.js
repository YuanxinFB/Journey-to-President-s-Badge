// Matching Pairs game
import { GAME_LEVELS, ALL_IMAGES, pickRandom, shuffle } from "./config.js";
import { showGameOverModal } from "./modals.js";
import { saveScore, renderLeaderboard } from "./storage.js";

export class MatchingPairsGame {
  constructor(opts) {
    this.boardEl = document.querySelector(opts.boardSelector);
    this.movesEl = document.querySelector(opts.movesSelector);
    this.timerEl = document.querySelector(opts.timerSelector);
    this.startBtn = document.querySelector(opts.startBtnSelector);
    this.restartBtn = document.querySelector(opts.restartBtnSelector);
    this.levelBtns = Array.from(document.querySelectorAll(opts.levelButtonsSelector));
    this.lbEl = document.querySelector(opts.leaderboardSelector);

    this.level = 1;
    this._timer = 0;
    this._timerHandle = null;
    this._moves = 0;
    this._matchedPairs = 0;
    this._flipped = [];
    this._currentImages = [];
  }

  init() { this._wireUI(); this.reset(); }
  start() { this._start(); }
  reset() { this._setupBoard(); }

  _wireUI() {
    this.levelBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        this.levelBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.level = parseInt(btn.dataset.level, 10) || 1;
        this.reset();
      });
    });

    this.startBtn.addEventListener("click", () => this._start());
    this.restartBtn.addEventListener("click", () => this.reset());
  }

  _setupBoard() {
    clearInterval(this._timerHandle);
    this._timer = 0;
    this._moves = 0;
    this._matchedPairs = 0;
    this._flipped = [];
    this.movesEl.textContent = "Moves: 0";
    this.timerEl.textContent = "Time: 0s";

    const cfg = GAME_LEVELS.matching[this.level];
    this._currentImages = pickRandom(ALL_IMAGES, cfg.pairs);
    const deck = shuffle([...this._currentImages, ...this._currentImages]);

    this.boardEl.innerHTML = "";
    this.boardEl.style.gridTemplateColumns = `repeat(${cfg.cols}, 1fr)`;
    this.boardEl.style.gridTemplateRows = `repeat(${cfg.rows}, 1fr)`;

    deck.forEach(src => {
      const card = document.createElement("div");
      card.className = "card";
      card.dataset.value = src;
      card.innerHTML = `
        <div class="front"><img src="${src}" alt="Card"></div>
        <div class="back"></div>
      `;
      card.addEventListener("click", () => this._flip(card));
      this.boardEl.appendChild(card);
    });

    this.boardEl.classList.add("disabled-game");
    this.startBtn.disabled = false;
    this.startBtn.textContent = "Start Game";
    this.restartBtn.disabled = true;
    this.restartBtn.classList.add("disabled-button");
  }

  _start() {
    this.boardEl.classList.remove("disabled-game");
    this.startBtn.disabled = true;
    this.startBtn.textContent = "Playing...";
    this.restartBtn.disabled = false;
    this.restartBtn.classList.remove("disabled-button");

    this._timerHandle = setInterval(() => {
      this._timer++;
      this.timerEl.textContent = `Time: ${this._timer}s`;
    }, 1000);
  }

  _flip(card) {
    if (card.classList.contains("flipped")) return;
    if (this._flipped.length >= 2) return;

    card.classList.add("flipped");
    this._flipped.push(card);

    if (this._flipped.length === 2) {
      this._moves++;
      this.movesEl.textContent = `Moves: ${this._moves}`;
      setTimeout(() => this._checkMatch(), 450);
    }
  }

  _checkMatch() {
    const [a, b] = this._flipped;
    if (!a || !b) return;

    if (a.dataset.value === b.dataset.value) {
      a.classList.add("matched");
      b.classList.add("matched");
      this._matchedPairs++;

      if (this._matchedPairs === this._currentImages.length) {
        clearInterval(this._timerHandle);
        setTimeout(() => {
          showGameOverModal({
            title: "Congratulations!",
            message: `You won in ${this._moves} moves and ${this._timer} seconds!`,
            isWin: true
          });

          saveScore({
            game: "matching",
            level: this.level,
            time: this._timer,
            moves: this._moves,
            win: true
          });
          if (this.lbEl) renderLeaderboard(this.lbEl, "matching");
        }, 400);
      }
    } else {
      a.classList.remove("flipped");
      b.classList.remove("flipped");
    }
    this._flipped = [];
  }
}
