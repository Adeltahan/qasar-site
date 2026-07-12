<div align="center">

<img src="assets/qasar-mark-gold.png" alt="QASAR International Broker" width="180">

# QASAR — International Broker

**Site vitrine d'un courtage international de luxe**
Location de yachts · Villas d'exception · Services sur mesure

`HTML` · `CSS` · `JavaScript vanilla` — aucun framework, aucune dépendance

</div>

---

## ✦ Aperçu

Site multi-pages au design *quiet luxury* : émeraude profond et or champagne extraits du logo, typographies Cormorant Garamond (titres) et Jost (corps), animations sobres au scroll (révélations masquées, filets or qui se tracent, parallaxe douce, marquee).

| Page | Fichier | Contenu |
|---|---|---|
| Accueil | `index.html` | Hero plein écran, l'offre (3 verticales), sections éditoriales Yachts & Villas, présentation du fondateur, destinations, méthode, formulaire de contact |
| Yachts | `yachts.html` | Flotte en cards générées depuis `data/yachts.json`, contact WhatsApp par yacht |
| Villas | `villas.html` | Portefeuille en cards générées depuis `data/villas.json`, contact WhatsApp par villa |
| Services sur mesure | `services.html` | 3 tuiles (Jets privés, Transport privé, Stay management) depuis `data/services.json` |

## ✦ Structure du projet

```
qasar-site/
├── index.html            Page d'accueil (one-page à sections)
├── yachts.html           Page flotte
├── villas.html           Page portefeuille villas
├── services.html         Page services sur mesure
├── css/
│   └── style.css         Toute la charte (variables CSS en tête de fichier)
├── js/
│   ├── main.js           Animations, header, menu mobile, formulaire
│   ├── yachts.js         Rendu des cards yachts depuis le JSON
│   ├── villas.js         Rendu des cards villas depuis le JSON
│   └── services.js       Rendu des tuiles services depuis le JSON
├── data/
│   ├── yachts.json       ← Ajouter / modifier un yacht ici
│   ├── villas.json       ← Ajouter / modifier une villa ici
│   └── services.json     ← Ajouter / modifier une rubrique de service ici
└── assets/               Logos (fond transparent) + portrait du fondateur
```

## ✦ Lancer le site en local

Le site est 100 % statique. Les données étant chargées en `fetch()`, il faut le servir par HTTP (pas en double-cliquant sur le fichier) :

```bash
# Option 1 — Node
npx serve .

# Option 2 — Python
python3 -m http.server 4173
```

Puis ouvrir `http://localhost:4173` (ou le port affiché).

## ✦ Modifier le contenu sans toucher au code

### Ajouter un yacht ou une villa

Éditer `data/yachts.json` ou `data/villas.json` et ajouter un objet dans le tableau :

```json
{
  "nom": "Nouveau Yacht",
  "taille_m": 40,
  "invites": 10,
  "equipage": 6,
  "zone": "Méditerranée",
  "tarif": "Prix sur demande",
  "image": "https://…",
  "description": "Une phrase de présentation."
}
```

### Ajouter une rubrique de service

Éditer `data/services.json`. Icônes disponibles : `jet`, `voiture`, `cloche`, `etoile`, `cle`, `horloge`. La grille s'adapte automatiquement au nombre de tuiles.

### Changer le numéro WhatsApp

Champ `whatsapp` en tête de **chacun** des trois fichiers JSON (format international sans `+`, ex. `33612345678`). Le message pré-rempli se personnalise via `whatsapp_message` (`{nom}` est remplacé par le nom du bien ou de la rubrique).

### Changer les coordonnées de contact

Directement dans `index.html`, section `CONTACT` (e-mail, téléphone, bureaux).

## ✦ Charte graphique

Les couleurs et typos sont centralisées dans les variables CSS en tête de `css/style.css` :

| Variable | Valeur | Usage |
|---|---|---|
| `--emerald` | `#13423D` | Vert émeraude signature (extrait du logo) |
| `--gold` | `#CBB484` | Or champagne — accents, filets, CTA |
| `--ivory` | `#F7F4EC` | Fond dominant des sections claires |
| `--black` | `#0B0F0E` | Bandeau destinations |
| `--serif` | Cormorant Garamond | Titres |
| `--sans` | Jost | Corps de texte |

Toutes les animations respectent `prefers-reduced-motion`.

## ✦ Déploiement

Aucun build nécessaire — déployer le dossier tel quel :

- **GitHub Pages** : Settings → Pages → Deploy from branch (`main`, racine).
- **Netlify / Vercel** : glisser-déposer le dossier ou connecter le repo (framework preset : *Other / None*).

## ✦ Points d'attention

- **Formulaire de contact** : la validation est fonctionnelle (téléphone avec indicatif pays obligatoire), mais l'envoi est *front-only* — brancher un service (Formspree, Netlify Forms, backend e-mail) avant la mise en production.
- **Images d'illustration** : chargées depuis Unsplash (hotlink). Pour la production, prévoir des photos propriétaires hébergées dans `assets/`.
- Mentions légales et politique de confidentialité : liens présents dans le footer, pages à créer.

---

<div align="center">

© 2026 Qasar International Broker — Tous droits réservés.

</div>
