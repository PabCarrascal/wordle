// Statistics storage and modal rendering.

const STORAGE_STATS = 'palabrle_stats';

function defaultStats() {
  return {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
  };
}

export function loadStats() {
  try {
    const raw = localStorage.getItem(STORAGE_STATS);
    if (raw) return { ...defaultStats(), ...JSON.parse(raw) };
  } catch (_) {}
  return defaultStats();
}

function saveStats(stats) {
  localStorage.setItem(STORAGE_STATS, JSON.stringify(stats));
}

export function recordGame(result, attempts) {
  const stats = loadStats();
  stats.gamesPlayed++;

  if (result === 'won') {
    stats.gamesWon++;
    stats.currentStreak++;
    if (stats.currentStreak > stats.maxStreak) stats.maxStreak = stats.currentStreak;
    const key = String(attempts);
    stats.distribution[key] = (stats.distribution[key] || 0) + 1;
  } else {
    stats.currentStreak = 0;
  }

  saveStats(stats);
}

export function getStats() {
  return loadStats();
}

export function showStatsModal(lastAttempts = null) {
  const stats = loadStats();
  const overlay = document.getElementById('modal-overlay');

  document.getElementById('stat-played').textContent = stats.gamesPlayed;
  const pct = stats.gamesPlayed > 0
    ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
    : 0;
  document.getElementById('stat-winpct').textContent = pct;
  document.getElementById('stat-streak').textContent = stats.currentStreak;
  document.getElementById('stat-maxstreak').textContent = stats.maxStreak;

  const distEl = document.getElementById('stats-distribution');
  distEl.innerHTML = '';

  const maxCount = Math.max(1, ...Object.values(stats.distribution));

  for (let i = 1; i <= 6; i++) {
    const count = stats.distribution[i] || 0;
    const pctWidth = Math.max(8, Math.round((count / maxCount) * 100));

    const row = document.createElement('div');
    row.className = 'dist-row';

    const label = document.createElement('span');
    label.className = 'dist-label';
    label.textContent = i;

    const barBg = document.createElement('div');
    barBg.className = 'dist-bar-bg';

    const bar = document.createElement('div');
    bar.className = 'dist-bar' + (lastAttempts === i ? ' highlight' : '');
    bar.style.width = `${pctWidth}%`;
    bar.textContent = count;

    barBg.appendChild(bar);
    row.appendChild(label);
    row.appendChild(barBg);
    distEl.appendChild(row);
  }

  overlay.classList.remove('hidden');
}

export function hideStatsModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
}
