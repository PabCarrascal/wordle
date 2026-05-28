#!/usr/bin/env python3
"""
Filtra el diccionario para quedarse solo con:
  - Infinitivos verbales (VerbForm=Inf)
  - Sustantivos, adjetivos, adverbios (todas sus formas)
Elimina conjugaciones, gerundios, participios y verbos auxiliares conjugados.

Fuentes:
  - UD Spanish-GSD  (~80 k tokens)
  - UD Spanish-AnCora (~500 k tokens)

Criterio de eliminación (corpus):
  A word is removed if:
    · verb_count > 0  (aparece como VERB/AUX no-infinitivo)
    · non_verb_count == 0  O  verb_ratio > VERB_RATIO_THRESHOLD
    · verb_inf_count == 0  (nunca aparece como infinitivo)
    · no está en EXCEPTIONS
  donde non_verb cuenta solo NOUN, ADJ, ADV, INTJ, NUM
  (excluimos PROPN, DET, PRON, ADP, CCONJ, SCONJ, PART para evitar
   que formas verbales usadas como nombres propios o palabras función
   se clasifiquen erróneamente como palabras con uso nominal).
"""

import urllib.request
import re
import os

# Si en el corpus aparece N veces como VERBO y M veces como sustantivo/adjetivo,
# se elimina si verb_count/(verb_count+non_verb_count) >= este umbral.
VERB_RATIO_THRESHOLD = 0.85

def normalize(word):
    import unicodedata
    word = word.lower()
    word = unicodedata.normalize('NFD', word)
    word = ''.join(c for c in word if unicodedata.category(c) != 'Mn')
    word = re.sub(r'[^a-z]', '', word)
    return word

def download(url):
    print(f"  Descargando {url.split('/')[-1]}...")
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=120) as r:
        return r.read().decode('utf-8')

def parse_conllu(text, word_info):
    """Acumula conteos morfológicos en word_info."""
    for line in text.splitlines():
        if line.startswith('#') or not line.strip():
            continue
        parts = line.split('\t')
        if len(parts) < 6:
            continue
        idx, surface, lemma, upos, xpos, feats = (
            parts[0], parts[1], parts[2], parts[3], parts[4], parts[5]
        )
        if not idx.isdigit():
            continue

        norm = normalize(surface)
        if not re.match(r'^[a-z]{5}$', norm):
            continue

        if norm not in word_info:
            word_info[norm] = {'verb_inf': 0, 'verb_noninf': 0, 'non_verb': 0}

        if upos in ('VERB', 'AUX'):
            # AUX (poder, haber, ser…) se trata igual que VERB
            if 'VerbForm=Inf' in feats:
                word_info[norm]['verb_inf'] += 1
            else:
                word_info[norm]['verb_noninf'] += 1
        elif upos in ('NOUN', 'ADJ', 'ADV', 'INTJ', 'NUM'):
            # Solo palabras de contenido "plenas" cuentan como uso nominal.
            # Excluimos PROPN (nombres propios que pueden ser verbos en uso
            # como nombre), DET, PRON, ADP, CCONJ, SCONJ, PART (palabras
            # función que aparecen en contextos inusuales / errores de corpus).
            word_info[norm]['non_verb'] += 1

# ── 1. Descargar corpora ──────────────────────────────────────────────────────
word_info = {}

CORPORA = [
    (
        'Universal Dependencies Spanish-GSD',
        'https://raw.githubusercontent.com/UniversalDependencies/UD_Spanish-GSD/master/',
        ['es_gsd-ud-train.conllu', 'es_gsd-ud-dev.conllu', 'es_gsd-ud-test.conllu'],
    ),
    (
        'Universal Dependencies Spanish-AnCora',
        'https://raw.githubusercontent.com/UniversalDependencies/UD_Spanish-AnCora/master/',
        ['es_ancora-ud-train.conllu', 'es_ancora-ud-dev.conllu', 'es_ancora-ud-test.conllu'],
    ),
]

for name, base, splits in CORPORA:
    print(f"\nDescargando corpus {name}...")
    for split in splits:
        try:
            text = download(base + split)
            parse_conllu(text, word_info)
        except Exception as e:
            print(f"  AVISO: no se pudo descargar {split}: {e}")

print(f"\nPalabras de 5 letras con info morfológica: {len(word_info)}")

# ── 2. Leer el diccionario actual ─────────────────────────────────────────────
words_js = os.path.join(os.path.dirname(__file__), '..', 'data', 'words.js')
current_words = []
with open(words_js, encoding='utf-8') as f:
    for line in f:
        for m in re.finditer(r'"([a-z]{5})"', line):
            current_words.append(m.group(1))
current_words = sorted(set(current_words))
print(f"Palabras en diccionario actual: {len(current_words)}")

# ── 3. Aplicar filtro ─────────────────────────────────────────────────────────
kept, removed = [], []
removed_corpus, removed_pattern = [], []

# Patrones de sufijos de conjugación, solo para palabras NO cubiertas por corpus.
CONJ_PATTERNS = re.compile(
    r'('
    r'abas|aban|ibas|iban|'   # imperfecto -ar/-ir 2sg/3pl
    r'aste|iste|'              # pretérito 2sg
    r'asen|esen|isen|'         # subj. imperfecto 3pl
    r'aras|eras|iras|'         # subj. imperfecto 2sg / futuro subj.
    r'ando|iendo|'             # gerundio
    r'abos|ibos'               # rarísimas
    r')$'
)

# Palabras que los corpora o los patrones eliminarían incorrectamente
# por tener uso nominal o pronominal genuino en español.
EXCEPTIONS = {
    # Uso nominal detectado incorrectamente por el corpus
    'ahogo',  # asfixia (sust.)
    'anima',  # ánima = alma (sust.)
    'asomo',  # indicio ("un asomo de")
    'atajo',  # camino corto (sust.)
    'bateo',  # acción de batear (sust. deportivo)
    'calmo',  # tranquilo (adj.)
    'cobra',  # serpiente (sust.)
    'dadas',  # "dadas las circunstancias" (adj./part.)
    'estas',  # pronombre demostrativo
    'falto',  # "falto de recursos" (adj.)
    'honra',  # honor (sust.)
    'pasas',  # uvas pasas (sust. pl.)
    'queda',  # "toque de queda" (sust.)
    'quedo',  # "en voz queda" (adj./adv.)
    'toreo',  # tauromaquia (sust.)
    'trata',  # "trata de personas" (sust.)
    'varia',  # variada (adj.)
    'venia',  # permiso (sust.)
    'veras',  # "de veras" (sust. pl.)
    # Sustantivos con sufijos parecidos a conjugaciones
    'babas',  # saliva (pl. de baba)
    'gaban',  # gabán = abrigo
    'habas',  # legumbre (pl. de haba)
    'haras',  # yeguada (préstamo)
    'jaras',  # planta (pl. de jara)
    'bases',  # pl. de base
    'gases',  # pl. de gas
    'ramos',  # pl. de ramo
    'temas',  # pl. de tema
    'camas',  # pl. de cama
    'ramas',  # pl. de rama
    'ceras',  # pl. de cera
    'peras',  # pl. de pera
    'meras',  # mero (adj. pl. fem.)
    # Homónimos: forma verbal = forma nominal
    'haces',  # pl. de haz (manojo)
    'bebes',  # pl. de bebé (se escribe bebés pero normaliza a bebes)
    'habla',  # el habla (sust. fem.)
    'canto',  # canto = canto llano, canto del gallo (sust.)
    'llevo',  # "en llevo" es raro, pero "llevo" puede ser subst. coloquial
}

def should_remove_corpus(info, word):
    """Decide si una palabra cubierta por el corpus debe eliminarse."""
    v = info['verb_noninf']
    n = info['non_verb']
    i = info['verb_inf']
    if i > 0:
        return False  # infinitivo → conservar siempre
    if v == 0:
        return False  # nunca aparece como verbo → conservar
    if n == 0:
        return True   # solo verbo conjugado → eliminar
    ratio = v / (v + n)
    return ratio >= VERB_RATIO_THRESHOLD  # mayoritariamente verbo → eliminar

corpus_covered = 0
for word in current_words:
    info = word_info.get(word)

    if info:
        corpus_covered += 1
        if word not in EXCEPTIONS and should_remove_corpus(info, word):
            removed.append(word)
            removed_corpus.append(word)
            continue
    else:
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

# ── 4. Mostrar muestra de eliminados ─────────────────────────────────────────
print("\nMuestra eliminados por corpus (primeros 60):")
print(', '.join(removed_corpus[:60]))
print("\nMuestra eliminados por patrón (primeros 60):")
print(', '.join(removed_pattern[:60]))

# ── 5. Escribir nuevo words.js ────────────────────────────────────────────────
rows = []
for i in range(0, len(kept), 10):
    rows.append('  ' + ','.join(f'"{w}"' for w in kept[i:i+10]))

content = '\n'.join([
    '// Palabras en español de 5 letras, sin tildes, minúsculas.',
    '// Generado automáticamente — verbos solo en infinitivo.',
    '// Fuentes: UD Spanish-GSD + UD Spanish-AnCora.',
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
