#!/usr/bin/env python3
"""
QASAR — génère les variantes optimisées de la galerie flotte (data/yachts.json).

Les JPG d'origine (assets/yachts/*.jpg) sont pleine résolution (jusqu'à
~2100 px de côté, ~150-400 Ko chacun) alors que les cartes de la grille et
la modale n'affichent jamais plus de 960 px de large. Pour chaque image
référencée dans data/yachts.json, ce script produit à côté du fichier
d'origine :
    nom-960.jpg   (JPG redimensionné, fallback universel)
    nom-960.webp  (WebP, sert de source principale)
    nom-960.avif  (AVIF, encore plus compact, navigateurs récents)

Les JPG d'origine ne sont jamais modifiés (utilisés comme source PIL en
lecture seule). js/yachts.js dérive les chemins -960.* au moment du rendu :
aucune modification de data/yachts.json n'est nécessaire.

À relancer après l'ajout / le remplacement d'une photo de yacht :
    python3 tools/gen-yacht-gallery.py
"""
import json
import pathlib
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
MAX_WIDTH = 960
JPG_QUALITY = 80
WEBP_QUALITY = 74
AVIF_QUALITY = 54


def variant_paths(src: pathlib.Path):
    base = src.with_name(src.stem + '-960')
    return base.with_suffix('.jpg'), base.with_suffix('.webp'), base.with_suffix('.avif')


def kib(p):
    return f'{p.stat().st_size / 1024:.0f} Ko'


def process(src: pathlib.Path):
    jpg_out, webp_out, avif_out = variant_paths(src)
    if jpg_out.exists() and webp_out.exists() and avif_out.exists():
        src_m, jpg_m = src.stat().st_mtime, jpg_out.stat().st_mtime
        if jpg_m >= src_m:
            return None  # déjà généré, source inchangée depuis

    im = Image.open(src).convert('RGB')
    if im.width > MAX_WIDTH:
        h = round(im.height * MAX_WIDTH / im.width)
        im = im.resize((MAX_WIDTH, h), Image.LANCZOS)

    im.save(jpg_out, 'JPEG', quality=JPG_QUALITY, optimize=True, progressive=True)
    im.save(webp_out, 'WEBP', quality=WEBP_QUALITY, method=6)
    im.save(avif_out, 'AVIF', quality=AVIF_QUALITY)

    before = src.stat().st_size
    after = jpg_out.stat().st_size + webp_out.stat().st_size + avif_out.stat().st_size
    return before, after


if __name__ == '__main__':
    data = json.loads((ROOT / 'data' / 'yachts.json').read_text(encoding='utf-8'))
    paths = sorted({img for y in data['yachts'] for img in y['images']})

    total_before = total_after = 0
    done = skipped = 0
    for rel in paths:
        src = ROOT / rel
        if not src.exists():
            print(f'!! introuvable : {rel}')
            continue
        result = process(src)
        if result is None:
            skipped += 1
            continue
        before, after = result
        total_before += before
        total_after += after
        done += 1
        print(f'{rel}  {kib(src)} → {after / 1024:.0f} Ko (jpg+webp+avif)')

    print(f'\n{done} images générées, {skipped} déjà à jour.')
    if done:
        print(f'Poids original : {total_before / 1024 / 1024:.1f} Mo → variantes -960 : {total_after / 1024 / 1024:.1f} Mo')
