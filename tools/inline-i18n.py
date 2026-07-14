#!/usr/bin/env python3
"""
QASAR — inline js/i18n.js dans les pages.

js/i18n.js reste la SOURCE DE VÉRITÉ. Le voile anti-flash (i18n-cloak)
n'est levé qu'une fois i18n exécuté : tant que c'était un fichier séparé,
le LCP dépendait d'une requête réseau supplémentaire. Inline en fin de
<body>, il s'exécute dès la fin du parse, sans aller-retour réseau.

⚠ À relancer après CHAQUE modification de js/i18n.js :
    python3 tools/inline-i18n.py
"""
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGES = ['index.html', 'yachts.html', 'villas.html', 'services.html',
         'contact.html', 'cgv.html', 'confidentialite.html']

js = (ROOT / 'js' / 'i18n.js').read_text(encoding='utf-8')
block = '<script data-inline-i18n>\n' + js + '\n</script>'
SRC_RE = re.compile(r'[ \t]*<script src="js/i18n\.js" defer[^>]*></script>\n?')
INLINE_RE = re.compile(r'<script data-inline-i18n>.*?</script>', re.S)

for name in PAGES:
    page = ROOT / name
    html = page.read_text(encoding='utf-8')
    if INLINE_RE.search(html):
        html = INLINE_RE.sub(lambda m: block, html, count=1)
    elif SRC_RE.search(html):
        # retire la balise <script src> du <head> et injecte en fin de <body>
        html = SRC_RE.sub('', html, count=1)
        html = html.replace('</body>', block + '\n</body>', 1)
    else:
        print(f"!! {name} : aucun point d'injection trouvé")
        continue
    page.write_text(html, encoding='utf-8')
    print(f'{name} : i18n inliné ({len(js)} octets)')
