// On-screen keyboard rendering and state management.

const ROWS = [
  ['q','w','e','r','t','y','u','i','o','p'],
  ['a','s','d','f','g','h','j','k','l','n'],
  ['ENTER','z','x','c','v','b','m','BACKSPACE'],
];

const KEY_PRIORITY = { correct: 3, present: 2, absent: 1 };

export function renderKeyboard(onKey) {
  const container = document.getElementById('keyboard-container');
  container.innerHTML = '';

  ROWS.forEach(keys => {
    const row = document.createElement('div');
    row.className = 'keyboard-row';

    keys.forEach(k => {
      const btn = document.createElement('button');
      btn.className = 'key';
      btn.dataset.key = k;

      if (k === 'ENTER') {
        btn.textContent = 'Intro';
        btn.classList.add('wide');
      } else if (k === 'BACKSPACE') {
        btn.innerHTML = '&#9003;';
        btn.classList.add('wide');
      } else {
        btn.textContent = k.toUpperCase();
      }

      btn.addEventListener('click', () => onKey(k));
      row.appendChild(btn);
    });

    container.appendChild(row);
  });
}

export function buildColorMap(guessResults) {
  const map = {};
  guessResults.forEach(({ letters }) => {
    letters.forEach(({ letter, state }) => {
      const current = map[letter];
      const newPriority = KEY_PRIORITY[state] || 0;
      const currentPriority = KEY_PRIORITY[current] || 0;
      if (newPriority > currentPriority) {
        map[letter] = state;
      }
    });
  });
  return map;
}

export function updateKeyboardColors(colorMap) {
  Object.entries(colorMap).forEach(([letter, state]) => {
    const btn = document.querySelector(`.key[data-key="${letter}"]`);
    if (btn) btn.dataset.state = state;
  });
}
