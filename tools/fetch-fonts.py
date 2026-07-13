#!/usr/bin/env python3
"""
QASAR — auto-héberge les Google Fonts (Cormorant Garamond + Jost).

Récupère la feuille Google Fonts, télécharge UNIQUEMENT les sous-ensembles
utiles au site (latin + latin-ext, qui couvrent le français et l'anglais),
enregistre les woff2 dans assets/fonts/ et génère assets/fonts/fonts.css
avec des @font-face locaux (font-display: swap) — plus aucune requête vers
fonts.googleapis.com / fonts.gstatic.com.

    python3 tools/fetch-fonts.py
"""
import pathlib, re, urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
FONTS = ROOT / 'assets' / 'fonts'
FONTS.mkdir(parents=True, exist_ok=True)

CSS_URL = ('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:'
           'ital,wght@0,300;0,400;0,500;0,600;1,400;1,500'
           '&family=Jost:wght@200;300;400;500&display=swap')
UA = ('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 '
      '(KHTML, like Gecko) Chrome/120.0 Safari/537.36')
KEEP = {'latin', 'latin-ext'}


def fetch(url):
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    return urllib.request.urlopen(req).read()


css = fetch(CSS_URL).decode('utf-8')

# découpe en blocs "/* subset */ @font-face { ... }"
blocks = re.findall(r'/\*\s*([\w-]+)\s*\*/\s*(@font-face\s*\{.*?\})', css, re.S)
out = []
seen = {}
for subset, block in blocks:
    if subset not in KEEP:
        continue
    fam = re.search(r"font-family:\s*'([^']+)'", block).group(1)
    style = re.search(r'font-style:\s*(\w+)', block).group(1)
    weight = re.search(r'font-weight:\s*(\d+)', block).group(1)
    url = re.search(r'url\((https://[^)]+\.woff2)\)', block).group(1)
    rng = re.search(r'unicode-range:\s*([^;]+);', block).group(1).strip()

    slug = (fam.lower().replace(' ', '-') + '-' + weight +
            ('-italic' if style == 'italic' else '') + '-' + subset)
    fname = slug + '.woff2'
    dest = FONTS / fname
    if fname not in seen:
        if not dest.exists():
            dest.write_bytes(fetch(url))
        seen[fname] = dest.stat().st_size
        print(f'↓ {fname}  ({seen[fname]/1024:.1f} KiB)')

    out.append(
        # chemin résolu depuis le HTML racine (la CSS est inlinée dans les pages)
        "@font-face{{font-family:'{fam}';font-style:{style};font-weight:{w};"
        "font-display:swap;src:url('assets/fonts/{fname}') format('woff2');"
        "unicode-range:{rng}}}".format(fam=fam, style=style, w=weight,
                                       fname=fname, rng=rng)
    )

(FONTS / 'fonts.css').write_text('\n'.join(out) + '\n', encoding='utf-8')
print(f'\n{len(out)} @font-face → assets/fonts/fonts.css '
      f'({sum(seen.values())/1024:.1f} KiB de woff2, {len(seen)} fichiers)')
