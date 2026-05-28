#!/usr/bin/env python3
"""
Filtra el diccionario para quedarse solo con:
- Infinitivos verbales (VerbForm=Inf)
- Sustantivos, adjetivos, adverbios (todas sus formas)
Elimina conjugaciones, gerundios y participios verbales.

Fuente de análisis morfológico: Universal Dependencies Spanish-GSD
"""

import urllib.request
import re
import os

def normalize(word):
    """Igual que normalizeWord() de game.js."""
    import unicodedata
    word = word.lower()
    word = unicodedata.normalize('NFD', word)
    word = ''.join(c for c in word if unicodedata.category(c) != 'Mn')
    word = re.sub(r'[^a-z]', '', word)
    return word

def download(url):
    print(f"  Descargando {url.split('/')[-1]}...")
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read().decode('utf-8')

# ── 1. Descargar corpus UD Spanish-GSD ───────────────────────────────────────
BASE = 'https://raw.githubusercontent.com/UniversalDependencies/UD_Spanish-GSD/master/'
SPLITS = ['es_gsd-ud-train.conllu', 'es_gsd-ud-dev.conllu', 'es_gsd-ud-test.conllu']

print("Descargando corpus Universal Dependencies Spanish-GSD...")
corpus_text = ''
for split in SPLITS:
    try:
        corpus_text += download(BASE + split) + '\n'
    except Exception as e:
        print(f"  AVISO: no se pudo descargar {split}: {e}")

# ── 2. Parsear CoNLL-U: construir info morfológica ────────────────────────────
# Para cada palabra normalizada (5 letras), guardamos:
#   verb_nonInf: True  → aparece como verbo NO infinitivo
#   non_verb:    True  → aparece como no-verbo (NOUN, ADJ, ADV, etc.)
#   verb_inf:    True  → aparece como verbo infinitivo

print("Analizando corpus...")
word_info = {}  # norm -> {'verb_inf': bool, 'verb_noninf': bool, 'non_verb': bool}

for line in corpus_text.splitlines():
    if line.startswith('#') or not line.strip():
        continue
    parts = line.split('\t')
    if len(parts) < 6:
        continue
    idx, surface, lemma, upos, xpos, feats = parts[0], parts[1], parts[2], parts[3], parts[4], parts[5]
    if not idx.isdigit():
        continue  # skip multi-word tokens

    norm = normalize(surface)
    if not re.match(r'^[a-z]{5}$', norm):
        continue

    if norm not in word_info:
        word_info[norm] = {'verb_inf': False, 'verb_noninf': False, 'non_verb': False}

    if upos == 'VERB':
        is_inf = 'VerbForm=Inf' in feats
        if is_inf:
            word_info[norm]['verb_inf'] = True
        else:
            word_info[norm]['verb_noninf'] = True
    elif upos in ('NOUN', 'ADJ', 'ADV', 'PROPN', 'NUM', 'INTJ', 'DET', 'PRON', 'ADP', 'CCONJ', 'SCONJ', 'PART'):
        word_info[norm]['non_verb'] = True

print(f"  Palabras de 5 letras con info morfológica: {len(word_info)}")

# ── 3. Leer el diccionario actual ─────────────────────────────────────────────
words_js = os.path.join(os.path.dirname(__file__), '..', 'data', 'words.js')
current_words = []
with open(words_js, encoding='utf-8') as f:
    for line in f:
        for m in re.finditer(r'"([a-z]{5})"', line):
            current_words.append(m.group(1))
current_words = sorted(set(current_words))
print(f"\nPalabras en diccionario actual: {len(current_words)}")

# ── 4. Aplicar filtro ─────────────────────────────────────────────────────────
kept, removed = [], []
removed_corpus, removed_pattern = [], []

# Patrones de conjugación seguros para palabras de 5 letras
# (el riesgo de falsos positivos es muy bajo para estos sufijos)
CONJ_PATTERNS = re.compile(
    r'(abas|aban|ibas|iban|'   # imperfecto 2sg/3pl
    r'aste|aste|aste|iste|'    # pretérito 2sg
    r'asen|esen|isen|'         # subjuntivo imperfecto 3pl
    r'aras|eras|eras|iras|'    # subj. imperfecto / cond.
    r'ando|endo|iendo|'        # gerundio (ojo: "mando" puede ser nombre)
    r'abos|ibos)$'
)

# Excepciones: palabras que el corpus o los patrones marcarían como conjugación
# pero en realidad son también sustantivos, adjetivos o pronombres válidos.
EXCEPTIONS = {
    # Sustantivos/adjetivos detectados por el corpus como solo-verbo
    'ahogo',  # ahogo = suffocation
    'anima',  # ánima = soul
    'asomo',  # asomo = hint/glimpse ("un asomo de")
    'atajo',  # atajo = shortcut
    'bateo',  # bateo = batting (sport)
    'calmo',  # calmo = calm (adj)
    'cobra',  # cobra = cobra (snake)
    'dadas',  # dadas = given (adj, "dadas las circunstancias")
    'estas',  # estas = these (demonstrative pronoun)
    'falto',  # falto = lacking (adj, "falto de recursos")
    'honra',  # honra = honor (noun)
    'pasas',  # pasas = raisins (noun plural)
    'queda',  # queda = curfew ("toque de queda")
    'quedo',  # quedo = quiet/quietly (adj/adv)
    'toreo',  # toreo = bullfighting (noun)
    'trata',  # trata = human trafficking ("trata de personas")
    'varia',  # varia = varied (adj)
    'venia',  # venia = permission/pardon (noun)
    'veras',  # veras = "de veras" = truly
    # Sustantivos con terminaciones tipo conjugación (-abas/-aban/-aras/-asen)
    'babas',  # babas = drool (plural of baba)
    'gaban',  # gabán = overcoat
    'habas',  # habas = fava beans (plural of haba)
    'haras',  # haras = horse farm (loanword)
    'jaras',  # jaras = cistus plants (plural of jara)
    'bases',  # bases = bases (plural of base)
    'gases',  # gases = gases
    'ramos',  # ramos = branches/bouquets
    'temas',  # temas = themes
    'camas',  # camas = beds
    'ramas',  # ramas = branches
    'ceras',  # ceras = waxes
    'peras',  # peras = pears
    'veras',  # de veras (already above)
    'meras',  # meras = mere (adj plural)
}

corpus_covered = 0
for word in current_words:
    info = word_info.get(word)

    if info:
        corpus_covered += 1
        # Si aparece como verbo NO infinitivo Y NUNCA como no-verbo → ELIMINAR
        # (salvo que esté en EXCEPTIONS, donde sabemos que tiene uso nominal)
        if info['verb_noninf'] and not info['non_verb'] and not info['verb_inf'] and word not in EXCEPTIONS:
            removed.append(word)
            removed_corpus.append(word)
            continue
    else:
        # No está en el corpus → aplicar patrones seguros
        if CONJ_PATTERNS.search(word) and word not in EXCEPTIONS:
            removed.append(word)
            removed_pattern.append(word)
            continue

    kept.append(word)

print(f"\nCubiertos por corpus UD: {corpus_covered} / {len(current_words)}")
print(f"Eliminados por corpus:   {len(removed_corpus)}")
print(f"Eliminados por patrón:   {len(removed_pattern)}")
print(f"Eliminados total:        {len(removed)}")
print(f"Palabras conservadas:    {len(kept)}")

# ── 5. Mostrar muestra de eliminados ─────────────────────────────────────────
print("\nMuestra eliminados por corpus (primeros 30):")
print(', '.join(removed_corpus[:30]))
print("\nMuestra eliminados por patrón (primeros 30):")
print(', '.join(removed_pattern[:30]))

# ── 6. Escribir nuevo words.js ────────────────────────────────────────────────
rows = []
for i in range(0, len(kept), 10):
    rows.append('  ' + ','.join(f'"{w}"' for w in kept[i:i+10]))

content = '\n'.join([
    '// Palabras en español de 5 letras, sin tildes, minúsculas.',
    '// Generado automáticamente — verbos solo en infinitivo.',
    '',
    'window.ANSWER_WORDS = [',
    ',\n'.join(rows),
    '];',
    '',
    'window.ANSWER_WORDS = [...new Set(window.ANSWER_WORDS)].filter(w => /^[a-z]{5}$/.test(w));',
    '',
])

with open(words_js, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"\n✓ Escrito en {words_js}")
print(f"  Total final: {len(kept)} palabras")
