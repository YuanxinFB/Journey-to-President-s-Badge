// Tiny orchestrator. Each "game" must implement: init(), start(), reset().
export class GameManager {
  constructor() { this._games = new Map(); }

  register(name, gameInstance) {
    this._games.set(name, gameInstance);
  }

  initAll() { this._games.forEach(g => g.init()); }
  resetAll() { this._games.forEach(g => g.reset()); }

  get(name) { return this._games.get(name); }
}
