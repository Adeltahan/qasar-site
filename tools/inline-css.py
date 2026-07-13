#!/usr/bin/env python3
"""
QASAR — inline le CSS critique dans les pages.

css/style.css reste la SOURCE DE VÉRITÉ. Ce script en injecte une copie
minifiée dans chaque page HTML (balise <style data-inline-css>), ce qui
supprime la requête CSS bloquante de la chaîne critique (FCP/LCP mobile).

⚠ À relancer après CHAQUE modification de css/style.css :
    python3 tools/inline-css.py
"""
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGES = ['index.html', 'yachts.html', 'villas.html', 'services.html',
         'contact.html', 'cgv.html', 'confidentialite.html']

css = (ROOT / 'css' / 'style.css').read_text(encoding='utf-8')

# Minification prudente : commentaires, blancs, espaces autour de la ponctuation
css = re.sub(r'/\*.*?\*/', '', css, flags=re.S)
css = re.sub(r'\s+', ' ', css)
css = re.sub(r' ?([{};:,>]) ?', r'\1', css)
css = css.replace(';}', '}').strip()

block = '<style data-inline-css>' + css + '</style>'
LINK = '<link rel="stylesheet" href="css/style.css">'

for name in PAGES:
    page = ROOT / name
    html = page.read_text(encoding='utf-8')
    if LINK in html:
        html = html.replace(LINK, block, 1)
    elif '<style data-inline-css>' in html:
        html = re.sub(r'<style data-inline-css>.*?</style>',
                      lambda m: block, html, count=1, flags=re.S)
    else:
        print(f'!! {name} : aucun point d\'injection trouvé')
        continue
    page.write_text(html, encoding='utf-8')
    print(f'{name} : CSS inliné ({len(css)} octets minifiés)')
