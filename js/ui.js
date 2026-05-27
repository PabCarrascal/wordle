// DOM rendering helpers and animations.

const BOARD_EL = () => document.getElementById('board');

export function renderBoard() {
  const board = BOARD_EL();
  board.innerHTML = '';
  for (let r = 0; r < 6; r++) {
    const row = document.createElement('div');
    row.className = 'row';
    row.id = `row-${r}`;
    for (let c = 0; c < 5; c++) {
      const tile = document.createElement('div');
      tile.className = 'tile';
      tile.id = `tile-${r}-${c}`;
      tile.dataset.state = 'empty';
      row.appendChild(tile);
    }
    board.appendChild(row);
  }
}

function getTile(row, col) {
  return document.getElementById(`tile-${row}-${col}`);
}

export function setTile(row, col, letter, state) {
  const tile = getTile(row, col);
  if (!tile) return;
  tile.textContent = letter.toUpperCase();
  tile.dataset.state = state;
}

export function renderCurrentInput(row, input) {
  for (let c = 0; c < 5; c++) {
    const tile = getTile(row, c);
    if (!tile) continue;
    if (c < input.length) {
      if (tile.textContent !== input[c].toUpperCase()) {
        tile.textContent = input[c].toUpperCase();
        tile.dataset.state = 'filled';
        popTile(tile);
      }
    } else {
      tile.textContent = '';
      tile.dataset.state = 'empty';
    }
  }
}

function popTile(tile) {
  tile.classList.remove('pop');
  void tile.offsetWidth; // force reflow to restart animation
  tile.classList.add('pop');
  tile.addEventListener('animationend', () => tile.classList.remove('pop'), { once: true });
}

export function animateGuessReveal(row, letterResults) {
  return new Promise(resolve => {
    const FLIP_DURATION = 500;
    const STAGGER = 100;

    letterResults.forEach(({ letter, state }, col) => {
      const tile = getTile(row, col);
      if (!tile) return;

      const delay = col * STAGGER;
      tile.style.animationDelay = `${delay}ms`;
      tile.classList.add('flip');

      // Reveal color at the midpoint of the flip (tile faces away)
      setTimeout(() => {
        tile.dataset.state = state;
      }, delay + FLIP_DURATION / 2);

      tile.addEventListener('animationend', () => {
        tile.classList.remove('flip');
        tile.style.animationDelay = '';
      }, { once: true });
    });

    const totalDuration = (letterResults.length - 1) * STAGGER + FLIP_DURATION;
    setTimeout(resolve, totalDuration);
  });
}

export function animateRowShake(row) {
  const rowEl = document.getElementById(`row-${row}`);
  if (!rowEl) return;
  rowEl.classList.remove('shake');
  void rowEl.offsetWidth;
  rowEl.classList.add('shake');
  rowEl.addEventListener('animationend', () => rowEl.classList.remove('shake'), { once: true });
}

export function animateBounce(row) {
  for (let c = 0; c < 5; c++) {
    const tile = getTile(row, c);
    if (!tile) continue;
    tile.style.animationDelay = `${c * 100}ms`;
    tile.classList.add('bounce');
    tile.addEventListener('animationend', () => {
      tile.classList.remove('bounce');
      tile.style.animationDelay = '';
    }, { once: true });
  }
}


export function showToast(message, duration = 1500) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('fade-out');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
  }, duration);
}
