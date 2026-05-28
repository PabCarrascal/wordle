#!/usr/bin/env node
// Descarga el diccionario español de lorenbrichter/Words y genera data/words.js
// con todas las palabras de exactamente 5 letras a-z (sin acentos, sin duplicados).

const https = require('https');
const fs = require('fs');
const path = require('path');

const URL = 'https://raw.githubusercontent.com/lorenbrichter/Words/master/Words/es.txt';
const OUT = path.join(__dirname, '..', 'data', 'words.js');

function normalize(word) {
  return word
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z]/g, '');
}

console.log('Descargando diccionario...');

https.get(URL, (res) => {
  let raw = '';
  res.on('data', chunk => raw += chunk);
  res.on('end', () => {
    const words = raw.split('\n');
    const set = new Set();

    for (const w of words) {
      const n = normalize(w.trim());
      if (/^[a-z]{5}$/.test(n)) set.add(n);
    }

    const sorted = [...set].sort();
    console.log(`Palabras únicas de 5 letras: ${sorted.length}`);

    const rows = [];
    for (let i = 0; i < sorted.length; i += 10) {
      rows.push('  ' + sorted.slice(i, i + 10).map(w => `"${w}"`).join(','));
    }

    const content = [
      '// Palabras en español de 5 letras, sin tildes, minúsculas.',
      '// Generado automáticamente desde lorenbrichter/Words (es.txt).',
      '// Todas son válidas como respuesta e intento.',
      '',
      'window.ANSWER_WORDS = [',
      rows.join(',\n'),
      '];',
      '',
      'window.ANSWER_WORDS = [...new Set(window.ANSWER_WORDS)].filter(w => /^[a-z]{5}$/.test(w));',
      '',
    ].join('\n');

    fs.writeFileSync(OUT, content, 'utf8');
    console.log(`Escrito en ${OUT}`);
  });
}).on('error', err => {
  console.error('Error descargando:', err.message);
  process.exit(1);
});
