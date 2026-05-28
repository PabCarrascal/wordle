import * as game from './game.js';
import * as ui from './ui.js';
import * as keyboard from './keyboard.js';
import * as stats from './stats.js';

const STORAGE_THEME = 'palabrle_theme';
const WIN_MESSAGES = ['Brillante', 'Impresionante', 'Magnífico', 'Excelente', 'Bien hecho', 'Uf!'];

let isAnimating = false;
let guessResults = [];
let lastAttempts = null;

function startNextWord() {
  guessResults = [];
  lastAttempts = null;
  game.startNewGame();
  ui.renderBoard();
  keyboard.renderKeyboard(handleKey);
  ui.renderCurrentInput(0, '');
}

function applyTheme(theme) {
  document.body.dataset.theme = theme;
  localStorage.setItem(STORAGE_THEME, theme);
}

function toggleTheme() {
  const current = document.body.dataset.theme || 'light';
  applyTheme(current === 'light' ? 'dark' : 'light');
}

async function handleKey(key) {
  if (isAnimating) return;

  const state = game.getState();
  if (state.status !== 'playing') return;

  if (key === 'BACKSPACE') {
    game.removeLetter();
    ui.renderCurrentInput(state.guesses.length, game.getState().currentInput);
    return;
  }

  if (key === 'ENTER') {
    const currentState = game.getState();
    const word = currentState.currentInput;

    if (word.length < 5) {
      ui.animateRowShake(currentState.guesses.length);
      ui.showToast('Faltan letras');
      return;
    }

    if (!game.isValidWord(word)) {
      ui.animateRowShake(currentState.guesses.length);
      ui.showToast('No está en la lista');
      return;
    }

    const row = currentState.guesses.length;
    const result = game.submitGuess(word);
    if (!result) return;

    guessResults.push(result);
    isAnimating = true;
    await ui.animateGuessReveal(row, result.letters);
    isAnimating = false;

    keyboard.updateKeyboardColors(keyboard.buildColorMap(guessResults));

    const newState = game.getState();

    if (newState.status === 'won') {
      lastAttempts = newState.guesses.length;
      stats.recordGame('won', lastAttempts);
      ui.animateBounce(row);
      ui.showToast(WIN_MESSAGES[lastAttempts - 1] || '¡Ganaste!', 2000);
      setTimeout(startNextWord, 2500);
    } else if (newState.status === 'lost') {
      stats.recordGame('lost', 0);
      ui.showToast(newState.answer.toUpperCase(), 3000);
      setTimeout(startNextWord, 3500);
    }
    return;
  }

  // Letter key
  const normalized = game.normalizeWord(key);
  if (normalized.length === 1 && /^[a-z]$/.test(normalized)) {
    if (game.addLetter(normalized)) {
      ui.renderCurrentInput(game.getState().guesses.length, game.getState().currentInput);
    }
  }
}

function handleKeyDown(e) {
  if (e.ctrlKey || e.altKey || e.metaKey) return;

  if (e.key === 'Enter') { handleKey('ENTER'); return; }
  if (e.key === 'Backspace') { handleKey('BACKSPACE'); return; }
  if (e.key.length === 1) { handleKey(e.key); return; }
}

function init() {
  if (!window.ANSWER_WORDS || window.ANSWER_WORDS.length === 0) {
    ui.showToast('Error: lista de palabras no cargada', 5000);
    return;
  }

  const savedTheme = localStorage.getItem(STORAGE_THEME) || 'light';
  applyTheme(savedTheme);

  const state = game.initGame();

  ui.renderBoard();
  keyboard.renderKeyboard(handleKey);

  if (state.guesses.length > 0) {
    const priorResults = game.evaluatePriorGuesses();
    guessResults = priorResults;

    priorResults.forEach(({ word, letters }, row) => {
      word.split('').forEach((letter, col) => {
        ui.setTile(row, col, letter, letters[col].state);
      });
    });

    keyboard.updateKeyboardColors(keyboard.buildColorMap(priorResults));

    if (state.status === 'won') {
      lastAttempts = state.guesses.length;
    }
  }

  if (state.status === 'playing') {
    ui.renderCurrentInput(state.guesses.length, state.currentInput);
  } else {
    startNextWord();
  }

  document.addEventListener('keydown', handleKeyDown);

  document.getElementById('btn-theme').addEventListener('click', toggleTheme);
  document.getElementById('btn-stats').addEventListener('click', () => stats.showStatsModal(lastAttempts));
  document.getElementById('modal-close').addEventListener('click', stats.hideStatsModal);
  document.getElementById('modal-overlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) stats.hideStatsModal();
  });
}

init();
