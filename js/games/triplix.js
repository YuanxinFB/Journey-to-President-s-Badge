// Triplix match game

import { GAME_LEVELS, ALL_IMAGES, pickRandom, shuffle } from "./config.js";
import { showGameOverModal } from "./modals.js";
import { saveScore, renderLeaderboard } from "./storage.js";

export class TriplixGame {
  constructor(opts) {
    this.boardEl = document.querySelector(opts.boardSelector);
    this.stackAreaEl = document.querySelector(opts.stackAreaSelector);
    this.stackLabelEl = document.querySelector(opts.stackLabelSelector);
    this.timerEl = document.querySelector(opts.timerSelector);
    this.startBtn = document.querySelector(opts.startBtnSelector);
    this.restartBtn = document.querySelector(opts.restartBtnSelector);
    this.reshuffleBtn = document.querySelector(opts.reshuffleBtnSelector);
    this.undoBtn = document.querySelector(opts.undoBtnSelector);
    this.levelBtns = Array.from(document.querySelectorAll(opts.levelButtonsSelector));
    this.lbEl = document.querySelector(opts.leaderboardSelector);

    this.level = 1;
    this.tileSize = 80;
    this._tiles = [];
    this._stack = [];
    this._undoStack = [];
    this._undoCount = 3;
    this._reshuffleCount = 3;
    this._timer = 0;
    this._timerHandle = null;

    this._tileClick = this._handleTileClick.bind(this);
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
    this.reshuffleBtn.addEventListener("click", () => this._reshuffle());
    this.undoBtn.addEventListener("click", () => this._undo());
  }

  _setupBoard() {
    clearInterval(this._timerHandle);
    this._timer = 0;
    this.timerEl.textContent = "Time: 0s";

    const cfg = GAME_LEVELS.solitaire[this.level];
    this._stack = [];
    this._undoStack = [];
    this._undoCount = 3;
    this._reshuffleCount = 3;
    this._updateUndoUI();

    this.stackLabelEl.textContent = `Stack: 0/${cfg.stackLimit}`;

    const uniques = pickRandom(ALL_IMAGES, cfg.uniqueTiles);
    this._tiles = shuffle(uniques.flatMap(src => Array.from({ length: cfg.copies }, () => src)));

    this.boardEl.innerHTML = "";
    this.boardEl.style.minHeight = "400px";
    this.boardEl.style.position = "relative";

    const maxX = Math.max(0, this.boardEl.clientWidth - this.tileSize);
    const maxY = Math.max(0, this.boardEl.clientHeight - this.tileSize);

    this._tiles.forEach((src, z) => {
      const tile = document.createElement("div");
      tile.className = "tile";
      tile.dataset.value = src;
      tile.style.width = `${this.tileSize}px`;
      tile.style.height = `${this.tileSize}px`;
      tile.style.position = "absolute";
      tile.style.left = `${Math.floor(Math.random() * (maxX + 1))}px`;
      tile.style.top = `${Math.floor(Math.random() * (maxY + 1))}px`;
      tile.style.zIndex = String(z);
      tile.style.backgroundImage = `url('${encodeURI(src)}')`;
      tile.style.backgroundSize = "cover";
      tile.addEventListener("click", this._tileClick);
      this.boardEl.appendChild(tile);
    });

    this.boardEl.classList.add("disabled-game");
    this.startBtn.disabled = false;
    this.startBtn.textContent = "Start Game";
    this.restartBtn.disabled = true;
    this.reshuffleBtn.disabled = true;
    this.undoBtn.disabled = true;
  }

  _start() {
    this.boardEl.classList.remove("disabled-game");
    this.startBtn.disabled = true;
    this.startBtn.textContent = "Playing...";
    this.restartBtn.disabled = false;
    this.reshuffleBtn.disabled = false;
    this.undoBtn.disabled = false;

    this._timerHandle = setInterval(() => {
      this._timer++;
      this.timerEl.textContent = `Time: ${this._timer}s`;
    }, 1000);
  }

  _handleTileClick(e) {
    if (this.boardEl.classList.contains("disabled-game")) return;

    const tile = e.currentTarget;
    const clickedX = parseInt(tile.style.left, 10);
    const clickedY = parseInt(tile.style.top, 10);

    const visibleTiles = Array.from(this.boardEl.querySelectorAll(".tile:not(.hidden)"));
    const inCell = visibleTiles.filter(t => {
      const x = parseInt(t.style.left, 10);
      const y = parseInt(t.style.top, 10);
      return Math.abs(x - clickedX) < this.tileSize / 2 && Math.abs(y - clickedY) < this.tileSize / 2;
    });

    if (inCell.length === 0) return;

    inCell.sort((a, b) => parseInt(b.style.zIndex, 10) - parseInt(a.style.zIndex, 10));
    const topmost = inCell[0];

    if (tile === topmost) {
      this._moveToStack(tile);
    } else {
      tile.style.boxShadow = "0 0 10px 3px rgba(255,0,0,0.8)";
      setTimeout(() => (tile.style.boxShadow = ""), 250);
    }
  }

  _moveToStack(tileEl) {
    const cfg = GAME_LEVELS.solitaire[this.level];
    const value = tileEl.dataset.value;

    this._undoStack.push({ action: "move", value });
    tileEl.classList.add("hidden");

    const idx = this._tiles.indexOf(value);
    if (idx >= 0) this._tiles.splice(idx, 1);

    this._stack.push(value);
    this._renderStack();
    this.stackLabelEl.textContent = `Stack: ${this._stack.length}/${cfg.stackLimit}`;

    this._checkTriples();

    if (this._stack.length >= cfg.stackLimit) {
      clearInterval(this._timerHandle);
      setTimeout(() => {
        showGameOverModal({
          title: "Game Over!",
          message: "Your stack got too full! Try again!",
          isWin: false
        });
      }, 400);
      return; //no save
    }

    if (this._tiles.length === 0 && this._stack.length === 0) {
      clearInterval(this._timerHandle);
      setTimeout(() => {
        showGameOverModal({
          title: "You Win!",
          message: `You cleared all tiles in ${this._timer} seconds!`,
          isWin: true
        });

        //Save score only at the end
        saveScore({
          game: "triplix",
          level: this.level,
          time: this._timer,
          moves: null,
          win: true
        });
        if (this.lbEl) renderLeaderboard(this.lbEl, "triplix");
      }, 400);
    }
  }

  _renderStack() {
    this.stackAreaEl.innerHTML = "";
    const counts = {};
    this._stack.forEach(v => (counts[v] = (counts[v] || 0) + 1));

    this._stack.forEach(v => {
      const card = document.createElement("div");
      card.className = "stack-card";
      card.style.backgroundImage = `url('${encodeURI(v)}')`;
      card.style.backgroundSize = "contain";
      card.style.backgroundRepeat = "no-repeat";
      card.style.backgroundPosition = "center";
      if (counts[v] >= 3) card.classList.add("match-candidate");
      this.stackAreaEl.appendChild(card);
    });
  }

  _checkTriples() {
    const counts = {};
    this._stack.forEach(v => (counts[v] = (counts[v] || 0) + 1));

    Object.entries(counts).forEach(([value, count]) => {
      if (count >= 3) {
        let removed = 0;
        for (let i = this._stack.length - 1; i >= 0 && removed < 3; i--) {
          if (this._stack[i] === value) {
            this._stack.splice(i, 1);
            removed++;
          }
        }
        this.stackLabelEl.textContent = `Stack: ${this._stack.length}/${GAME_LEVELS.solitaire[this.level].stackLimit}`;
        this._renderStack();
        try { new Audio("match-sound.mp3").play(); } catch {}
      }
    });
  }

  _reshuffle() {
    if (this._reshuffleCount <= 0) return;
    this._reshuffleCount--;
    this._undoStack.push({ action: "reshuffle" });

    const visible = Array.from(this.boardEl.querySelectorAll(".tile:not(.hidden)"));
    const maxX = Math.max(0, this.boardEl.clientWidth - this.tileSize);
    const maxY = Math.max(0, this.boardEl.clientHeight - this.tileSize);

    visible.forEach(tile => {
      tile.style.left = `${Math.floor(Math.random() * (maxX + 1))}px`;
      tile.style.top = `${Math.floor(Math.random() * (maxY + 1))}px`;
    });

    this._updateUndoUI();
  }

  _undo() {
    if (this._undoCount <= 0 || this._undoStack.length === 0) return;

    const last = this._undoStack.pop();
    if (last.action === "reshuffle") {
      if (this._undoStack.length > 0) this._undo();
      return;
    }

    this._undoCount--;
    const value = this._stack.pop();

    const hiddenTiles = Array.from(this.boardEl.querySelectorAll(`.tile.hidden[data-value="${CSS.escape(value)}"]`));
    const tileToReveal = hiddenTiles[hiddenTiles.length - 1];
    if (tileToReveal) {
      tileToReveal.classList.remove("hidden");
      const maxX = Math.max(0, this.boardEl.clientWidth - this.tileSize);
      const maxY = Math.max(0, this.boardEl.clientHeight - this.tileSize);
      tileToReveal.style.left = `${Math.floor(Math.random() * (maxX + 1))}px`;
      tileToReveal.style.top = `${Math.floor(Math.random() * (maxY + 1))}px`;
      tileToReveal.style.zIndex = String(this._tiles.length);
    }

    this._tiles.push(value);
    this._renderStack();
    this.stackLabelEl.textContent = `Stack: ${this._stack.length}/${GAME_LEVELS.solitaire[this.level].stackLimit}`;
    this._updateUndoUI();
  }

  _updateUndoUI() {
    this.undoBtn.textContent = `Undo (${this._undoCount})`;
    this.undoBtn.disabled = this._undoCount <= 0;
    this.reshuffleBtn.textContent = `Reshuffle (${this._reshuffleCount})`;
    this.reshuffleBtn.disabled = this._reshuffleCount <= 0;
  }
}
