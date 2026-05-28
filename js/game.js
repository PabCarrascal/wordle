// Pure game logic — no DOM access.
// Reads window.ANSWER_WORDS and window.VALID_WORDS (set by data/words.js).

const STORAGE_STATE = 'palabrle_state';

let state = null;

export function normalizeWord(word) {
  return word.toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z]/g, '');
}

function randomAnswer() {
  const words = window.ANSWER_WORDS;
  return words[Math.floor(Math.random() * words.length)];
}

export function isValidWord(word) {
  const w = normalizeWord(word);
  if (w.length !== 5) return false;
  return window.ANSWER_WORDS.includes(w);
}

function evaluateGuess(guess, answer) {
  const result = Array.from({ length: 5 }, (_, i) => ({ letter: guess[i], state: 'absent' }));
  const pool = answer.split('');

  // Pass 1: exact matches
  for (let i = 0; i < 5; i++) {
    if (guess[i] === answer[i]) {
      result[i].state = 'correct';
      pool[i] = null;
    }
  }

  // Pass 2: present in word but wrong position
  for (let i = 0; i < 5; i++) {
    if (result[i].state !== 'correct') {
      const idx = pool.indexOf(guess[i]);
      if (idx !== -1) {
        result[i].state = 'present';
        pool[idx] = null;
      }
    }
  }

  return result;
}

function freshState() {
  return {
    guesses: [],
    currentInput: '',
    status: 'playing',
    answer: randomAnswer(),
  };
}

export function initGame() {
  const raw = localStorage.getItem(STORAGE_STATE);
  if (raw) {
    try {
      const saved = JSON.parse(raw);
      if (saved.status === 'playing' && Array.isArray(saved.guesses) && saved.answer) {
        state = saved;
        return { ...state };
      }
    } catch (_) { /* corrupt data */ }
  }
  state = freshState();
  persistState();
  return { ...state };
}

export function getState() {
  return { ...state };
}

export function persistState() {
  localStorage.setItem(STORAGE_STATE, JSON.stringify(state));
}

export function submitGuess(word) {
  const w = normalizeWord(word);
  if (w.length !== 5) return null;
  if (!isValidWord(w)) return null;
  if (state.status !== 'playing') return null;

  const letterResults = evaluateGuess(w, state.answer);
  state.guesses.push(w);
  state.currentInput = '';

  if (w === state.answer) {
    state.status = 'won';
  } else if (state.guesses.length >= 6) {
    state.status = 'lost';
  }

  persistState();
  return { word: w, letters: letterResults };
}

export function addLetter(letter) {
  if (state.status !== 'playing') return false;
  const l = normalizeWord(letter);
  if (!l || state.currentInput.length >= 5) return false;
  state.currentInput += l;
  persistState();
  return true;
}

export function removeLetter() {
  if (state.status !== 'playing') return false;
  if (state.currentInput.length === 0) return false;
  state.currentInput = state.currentInput.slice(0, -1);
  persistState();
  return true;
}

export function evaluatePriorGuesses() {
  return state.guesses.map(guess => ({
    word: guess,
    letters: evaluateGuess(guess, state.answer),
  }));
}

export function startNewGame() {
  const currentAnswer = state ? state.answer : null;
  let newAnswer;
  do {
    newAnswer = randomAnswer();
  } while (newAnswer === currentAnswer && window.ANSWER_WORDS.length > 1);

  state = {
    guesses: [],
    currentInput: '',
    status: 'playing',
    answer: newAnswer,
  };
  persistState();
  return { ...state };
}
