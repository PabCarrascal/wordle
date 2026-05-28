#!/usr/bin/env python3
"""
Genera data/words.js con todas las palabras de 5 letras del español de España.

Fuente: diccionario Hunspell es_ES del proyecto rla-es (mismo que LibreOffice/Firefox).
Método: expande el .dic usando las reglas SFX/PFX del .aff para obtener todas
las formas válidas. Filtrado posterior de conjugaciones verbales mediante el
corpus Universal Dependencies Spanish-GSD + AnCora.

Sin pip install — solo stdlib Python 3.
"""

import urllib.request
import zipfile
import io
import re
import os
import unicodedata

# ── Utilidades ────────────────────────────────────────────────────────────────

def normalize(word):
    """Minúsculas, sin diacríticos, solo a-z."""
    word = word.lower()
    word = unicodedata.normalize('NFD', word)
    word = ''.join(c for c in word if unicodedata.category(c) != 'Mn')
    word = re.sub(r'[^a-z]', '', word)
    return word

def download_bytes(url):
    print(f"  Descargando {url.split('/')[-1]}...")
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=120) as r:
        return r.read()

def download_text(url):
    return download_bytes(url).decode('utf-8')

# ── 1. Descargar y extraer es_ES.oxt ─────────────────────────────────────────
OXT_URL = 'https://github.com/sbosio/rla-es/releases/download/v2.9/es_ES.oxt'

print("Descargando diccionario Hunspell es_ES (rla-es)...")
oxt_data = download_bytes(OXT_URL)
with zipfile.ZipFile(io.BytesIO(oxt_data)) as z:
    aff_text = z.read('es_ES.aff').decode('utf-8')
    dic_text = z.read('es_ES.dic').decode('utf-8')

print(f"  .aff: {len(aff_text.splitlines())} líneas")
print(f"  .dic: {len(dic_text.splitlines())} entradas (incluyendo cabecera)")

# ── 2. Parsear reglas SFX/PFX del .aff ───────────────────────────────────────
print("\nParsando reglas de afijos...")

sfx_rules = {}  # flag -> list of (strip, add_base, add_flags, condition_pattern)
pfx_rules = {}  # flag -> list of (strip, add_base, add_flags, condition_pattern)

def compile_condition(cond_str):
    """Convierte una condición Hunspell en regex compilado para el fin de palabra."""
    if cond_str == '.':
        return re.compile(r'.*', re.UNICODE)
    # Hunspell usa sintaxis similar a regex pero anclada al final
    # Reemplazamos . por [^] no (.) para que sea literal de Hunspell
    # El patrón ya está en formato regex-like, solo hay que añadir $
    try:
        return re.compile(cond_str + r'$', re.UNICODE | re.IGNORECASE)
    except re.error:
        return re.compile(re.escape(cond_str) + r'$', re.UNICODE | re.IGNORECASE)

lines = aff_text.splitlines()
i = 0
while i < len(lines):
    line = lines[i].split('#')[0].strip()
    if not line:
        i += 1
        continue
    parts = line.split()
    if len(parts) >= 4 and parts[0] in ('SFX', 'PFX'):
        kind = parts[0]
        flag = parts[1]
        try:
            num = int(parts[3])
        except (ValueError, IndexError):
            i += 1
            continue
        rules = []
        for j in range(i + 1, min(i + 1 + num, len(lines))):
            rline = lines[j].split('#')[0].strip().split()
            if len(rline) < 5 or rline[0] != kind or rline[1] != flag:
                continue
            strip_s = rline[2]   # '0' o cadena a quitar
            add_raw = rline[3]   # cadena a añadir, puede contener /flags
            cond_s  = rline[4]
            # Separar add del posible /flags secundario
            if '/' in add_raw:
                add_base, add_flags = add_raw.split('/', 1)
            else:
                add_base, add_flags = add_raw, ''
            rules.append((strip_s, add_base, add_flags, compile_condition(cond_s)))
        target = sfx_rules if kind == 'SFX' else pfx_rules
        if flag not in target:
            target[flag] = []
        target[flag].extend(rules)
        i += 1 + num
    else:
        i += 1

print(f"  SFX flags: {len(sfx_rules)}, PFX flags: {len(pfx_rules)}")

# ── 3. Expandir el diccionario ────────────────────────────────────────────────
print("\nExpandiendo diccionario...")

def apply_sfx(word, flags, sfx_rules):
    """Genera todas las formas SFX de una palabra dado su conjunto de flags."""
    results = []  # list of (form, secondary_flags)
    for flag in flags:
        for strip_s, add_base, add_flags, cond_re in sfx_rules.get(flag, []):
            if not cond_re.search(word):
                continue
            if strip_s == '0':
                new_word = word + add_base
            elif word.lower().endswith(strip_s.lower()):
                new_word = word[:-len(strip_s)] + add_base
            else:
                continue
            results.append((new_word, add_flags))
    return results

def apply_pfx(word, flags, pfx_rules):
    """Genera todas las formas PFX de una palabra dado su conjunto de flags."""
    results = []
    for flag in flags:
        for strip_s, add_base, add_flags, cond_re in pfx_rules.get(flag, []):
            if not cond_re.search(word):
                continue
            if strip_s == '0':
                new_word = add_base + word
            elif word.lower().startswith(strip_s.lower()):
                new_word = add_base + word[len(strip_s):]
            else:
                continue
            results.append((new_word, add_flags))
    return results

dic_lines = dic_text.splitlines()
# Primera línea es el número de entradas
dic_lines = dic_lines[1:]

all_forms = set()   # formas normalizadas de 5 letras
total_entries = 0

for entry in dic_lines:
    entry = entry.strip()
    if not entry or entry[0].isupper():
        continue  # saltar nombres propios y líneas vacías
    # Separar base y flags
    if '/' in entry:
        base, flags_str = entry.split('/', 1)
    else:
        base, flags_str = entry, ''

    # Ignorar entradas que claramente no darán palabras de 5 letras
    base_norm = normalize(base)
    if len(base_norm) > 9 or len(base_norm) < 2:
        continue

    total_entries += 1

    # La forma base puede ser ya una palabra válida de 5 letras
    if re.match(r'^[a-z]{5}$', base_norm):
        all_forms.add(base_norm)

    # Flags: en FLAG UTF-8, cada codepoint es un flag
    flags = list(flags_str)

    # Expandir SFX
    sfx_forms = apply_sfx(base, flags, sfx_rules)
    for form, sec_flags in sfx_forms:
        fn = normalize(form)
        if re.match(r'^[a-z]{5}$', fn):
            all_forms.add(fn)
        # Segunda pasada: aplicar SFX secundarios
        if sec_flags:
            sfx2 = apply_sfx(form, list(sec_flags), sfx_rules)
            for form2, _ in sfx2:
                fn2 = normalize(form2)
                if re.match(r'^[a-z]{5}$', fn2):
                    all_forms.add(fn2)

    # Expandir PFX (para palabras cortas que con prefijo lleguen a 5 letras)
    pfx_forms = apply_pfx(base, flags, pfx_rules)
    for form, sec_flags in pfx_forms:
        fn = normalize(form)
        if re.match(r'^[a-z]{5}$', fn):
            all_forms.add(fn)

print(f"  Entradas procesadas: {total_entries}")
print(f"  Formas de 5 letras generadas: {len(all_forms)}")

# ── 4. Filtro de conjugaciones verbales (UD corpus) ───────────────────────────
VERB_RATIO_THRESHOLD = 0.85

def parse_conllu(text, word_info):
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
            if 'VerbForm=Inf' in feats:
                word_info[norm]['verb_inf'] += 1
            else:
                word_info[norm]['verb_noninf'] += 1
        elif upos in ('NOUN', 'ADJ', 'ADV', 'INTJ', 'NUM'):
            word_info[norm]['non_verb'] += 1

word_info = {}
CORPORA = [
    ('UD Spanish-GSD',
     'https://raw.githubusercontent.com/UniversalDependencies/UD_Spanish-GSD/master/',
     ['es_gsd-ud-train.conllu', 'es_gsd-ud-dev.conllu', 'es_gsd-ud-test.conllu']),
    ('UD Spanish-AnCora',
     'https://raw.githubusercontent.com/UniversalDependencies/UD_Spanish-AnCora/master/',
     ['es_ancora-ud-train.conllu', 'es_ancora-ud-dev.conllu', 'es_ancora-ud-test.conllu']),
]

print("\nDescargando corpora para filtro verbal...")
for name, base_url, splits in CORPORA:
    print(f"  {name}...")
    for split in splits:
        try:
            text = download_text(base_url + split)
            parse_conllu(text, word_info)
        except Exception as e:
            print(f"    AVISO: {split}: {e}")

print(f"  Palabras con info morfológica: {len(word_info)}")

CONJ_PATTERNS = re.compile(
    r'(abas|aban|ibas|iban|aste|iste|asen|esen|isen|aras|eras|iras|ando|iendo|abos|ibos)$'
)

EXCEPTIONS = {
    'ahogo','anima','asomo','atajo','bateo','calmo','cobra','dadas','estas','falto',
    'honra','pasas','queda','quedo','toreo','trata','varia','venia','veras',
    'babas','gaban','habas','haras','jaras','bases','gases','ramos','temas',
    'camas','ramas','ceras','peras','meras','haces','bebes','habla','canto',
}

def should_remove(word, word_info):
    info = word_info.get(word)
    if word in EXCEPTIONS:
        return False
    if info:
        v = info['verb_noninf']
        n = info['non_verb']
        i = info['verb_inf']
        if i > 0:
            return False
        if v == 0:
            return False
        if n == 0:
            return True
        return v / (v + n) >= VERB_RATIO_THRESHOLD
    else:
        return bool(CONJ_PATTERNS.search(word))

print("\nAplicando filtro verbal...")
kept = sorted(w for w in all_forms if not should_remove(w, word_info))
removed_count = len(all_forms) - len(kept)
print(f"  Eliminadas: {removed_count} / {len(all_forms)}")
print(f"  Conservadas: {len(kept)}")

# ── 5. Escribir words.js ──────────────────────────────────────────────────────
words_js = os.path.join(os.path.dirname(__file__), '..', 'data', 'words.js')
rows = []
for i in range(0, len(kept), 10):
    rows.append('  ' + ','.join(f'"{w}"' for w in kept[i:i+10]))

content = '\n'.join([
    '// Palabras en español de España de 5 letras, sin tildes, minúsculas.',
    '// Generado automáticamente — fuente: Hunspell es_ES (rla-es v2.9).',
    '// Verbos solo en infinitivo. Filtrado: UD Spanish-GSD + AnCora.',
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
