// A tiny "database" for mini‑games using localStorage.
// Patterns: Facade (simple API for the rest of the app), Repository (hide storage details).

const ROOT_KEY = 'j2pb.v1.scores';

///Read/write helpers with safe JSON handling
function readAll() {
  try {
    return JSON.parse(localStorage.getItem(ROOT_KEY)) || { scores: [] };
  } catch {
    return { scores: [] };
  }
}
function writeAll(obj) {
  localStorage.setItem(ROOT_KEY, JSON.stringify(obj));
}

//Save one score record
export function saveScore({ game, level, time, moves, win }) {
  const db = readAll();
  db.scores.push({
    id: randomId(),
    game,
    level: Number(level) || 1,
    time: time == null ? null : Number(time),
    moves: moves == null ? null : Number(moves),
    win: !!win,
    ts: new Date().toISOString()
  });
  writeAll(db);
}

//Return top N scores for a game (best first)
export function getTopScores(game, limit = 5) {
  const db = readAll();
  const onlyWins = db.scores.filter(s => s.game === game && s.win);

  const byBest = (a, b) => {
    //Matching: fewer moves first, then faster time
    if (game === 'matching') {
      const ma = a.moves ?? Number.POSITIVE_INFINITY;
      const mb = b.moves ?? Number.POSITIVE_INFINITY;
      if (ma !== mb) return ma - mb;
      return (a.time ?? Number.POSITIVE_INFINITY) - (b.time ?? Number.POSITIVE_INFINITY);
    }
    // Triplix: faster time first
    return (a.time ?? Number.POSITIVE_INFINITY) - (b.time ?? Number.POSITIVE_INFINITY);
  };

  return onlyWins.sort(byBest).slice(0, limit);
}

//Clear scores (all, or just one game)
export function clearScores(game /* optional */) {
  const db = readAll();
  db.scores = game ? db.scores.filter(s => s.game !== game) : [];
  writeAll(db);
}

//Small UI helper to render a leaderboard into a container element
export function renderLeaderboard(container, game, limit = 5) {
  if (!container) return;
  const rows = getTopScores(game, limit);
  const title = game === 'matching' ? 'Matching – Top Scores' : 'Triplix – Top Scores';

  container.innerHTML = `
    <h3 style="margin:10px 0">${title}</h3>
    ${rows.length === 0 ? '<p>No scores yet.</p>' : `
      <table class="lb">
        <thead>
          <tr><th>No.</th><th>Level</th>${game === 'matching' ? '<th>Moves</th>' : ''}<th>Time (s)</th><th>Date</th></tr>
        </thead>
        <tbody>
        ${rows.map((r,i) => `
          <tr>
            <td>${i + 1}</td>
            <td>${r.level}</td>
            ${game === 'matching' ? `<td>${r.moves ?? '-'}</td>` : ''}
            <td>${r.time ?? '-'}</td>
            <td>${new Date(r.ts).toLocaleDateString()}</td>
          </tr>`).join('')}
        </tbody>
      </table>
      <button class="action-button" data-clear="${game}">Clear ${game} scores</button>
    `}
  `;

  const btn = container.querySelector('button[data-clear]');
  if (btn) {
    btn.addEventListener('click', () => {
      clearScores(btn.dataset.clear);
      renderLeaderboard(container, game, limit);
    });
  }
}

//Tiny random id helper
function randomId() {
  try {
    const a = crypto.getRandomValues(new Uint8Array(8));
    return Array.from(a, b => b.toString(16).padStart(2, '0')).join('');
  } catch {
    return String(Math.random()).slice(2);
  }
}
