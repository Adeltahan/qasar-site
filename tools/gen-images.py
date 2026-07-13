#!/usr/bin/env python3
"""
QASAR — génère les variantes WebP / AVIF des images du site.

Les JPG restent la SOURCE DE VÉRITÉ (fallback). Ce script produit, à côté
de chaque source listée, un .webp et (pour les <img>) un .avif compressés.
Le HTML sert ensuite ces formats via <picture> (contenu) ou directement en
.webp (posters vidéo), avec repli JPG.

À relancer après l'ajout / le remplacement d'une image :
    python3 tools/gen-images.py
"""
import pathlib
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
ASSETS = ROOT / 'assets'

# Images de contenu : <picture> avec AVIF + WebP + repli JPG
CONTENT = [
    'fondateur.jpg',
    'services-jet.jpg',
    'villa-accueil.jpg',
    'villa-illu.jpg',
    'yachts/azimut-100-1-960.jpg',
    'yachts/lamborghini-63-1-960.jpg',
    'yachts/predator-65-1-960.jpg',
    'yachts/princess-v55-1-960.jpg',
    'yachts/riva-corsaro-100-1-960.jpg',
    'yachts/wajer-55-1-960.jpg',
]

# Posters de vidéo : WebP seulement (l'attribut poster ne gère pas de repli,
# WebP est universellement supporté sur les navigateurs cibles)
POSTERS = [
    'home-hero-poster.jpg',
    'services-hero-poster.jpg',
    'villas-hero-poster.jpg',
    'yachts-hero-poster.jpg',
]


def kib(p):
    return f'{p.stat().st_size / 1024:.1f} KiB'


def convert(rel, webp=True, avif=True, webp_q=72, avif_q=52):
    src = ASSETS / rel
    if not src.exists():
        print(f'!! introuvable : {rel}')
        return
    im = Image.open(src).convert('RGB')
    line = f'{rel}  ({kib(src)} jpg)'
    if webp:
        out = src.with_suffix('.webp')
        im.save(out, 'WEBP', quality=webp_q, method=6)
        line += f'  → {kib(out)} webp'
    if avif:
        out = src.with_suffix('.avif')
        im.save(out, 'AVIF', quality=avif_q)
        line += f'  → {kib(out)} avif'
    print(line)


if __name__ == '__main__':
    print('— Contenu (AVIF + WebP) —')
    for rel in CONTENT:
        convert(rel, webp=True, avif=True)
    print('— Posters (WebP) —')
    for rel in POSTERS:
        # posters sous voile sombre + remplacés vite par la vidéo : compression forte
        convert(rel, webp=True, avif=False, webp_q=58)
