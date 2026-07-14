/* ════════════════════════════════════════════════════════
   QASAR — bilingue EN / FR
   Le site est rédigé en français dans le HTML ; ce module le
   traduit en anglais à la volée (langue par défaut) et permet
   de revenir au français via le sélecteur d'en-tête.
   Le choix est mémorisé (localStorage) d'une page à l'autre.

   Pour ajouter / corriger une traduction : éditez l'objet DICT
   ci-dessous — clé = texte français, valeur = texte anglais.
   ════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var STORE = 'qasar_lang';
  var DEFAULT = 'en';

  /* Normalise apostrophes courbes → droites + espaces, pour la
     correspondance (toutes les clés ci-dessous sont en ' droit). */
  function collapse(s) {
    return s.replace(/’/g, "'").replace(/\s+/g, ' ').trim();
  }

  /* ── Dictionnaire FR → EN ─────────────────────────────── */
  var DICT = {
    /* En-tête / navigation / chrome partagé */
    "Services sur mesure": "Bespoke Services",
    "Accueil": "Home",
    "Faire une demande": "Make a request",
    "Cannes · Côte d'Azur — 24/7": "Cannes · French Riviera — 24/7",
    "Ouvrir le menu": "Open menu",
    "QASAR — retour en haut": "QASAR — back to top",
    "QASAR — retour à l'accueil": "QASAR — back to home",
    "Navigation principale": "Main navigation",
    "Navigation mobile": "Mobile navigation",
    "Navigation pied de page": "Footer navigation",
    "Défiler vers le bas": "Scroll down",

    /* Titres de page (<title>) */
    "QASAR — Courtage International · Yachts & Villas": "QASAR — International Broker · Yachts & Villas",
    "Yachts — QASAR · Location de yachts de luxe": "Yachts — QASAR · Luxury yacht charter",
    "Services sur mesure — QASAR · Courtage privé": "Bespoke Services — QASAR · Private broker",
    "Villas — QASAR · Location de villas de luxe": "Villas — QASAR · Luxury villa rental",
    "Contact — QASAR · Faire une demande": "Contact — QASAR · Make a request",

    /* Meta descriptions */
    "QASAR, courtage international d'exception. Location de yachts et de villas d'exception, services sur mesure, disponibilité absolue. Monaco, Saint-Tropez, Dubaï, Mykonos.": "QASAR, an exceptional international broker. Rental of exceptional yachts and villas, bespoke services, absolute availability. Monaco, Saint-Tropez, Dubai, Mykonos.",
    "Adressez votre demande à QASAR — yachts, villas, jets privés, transport privé, stay management. Une réponse rapide et personnelle, dans votre langue.": "Send your request to QASAR — yachts, villas, private jets, private transport, stay management. A fast, personal reply, in your language.",
    "La flotte QASAR : yachts et superyachts d'exception à la location, avec équipage. Méditerranée, Golfe, Caraïbes. Charters à la journée, à la semaine ou à la saison.": "The QASAR fleet: exceptional yachts and superyachts for charter, with crew. Mediterranean, Gulf, Caribbean. Charters by the day, week or season.",
    "Le sur-mesure QASAR : jets privés, transport privé, stay management. Discrétion absolue, exigence sans compromis, réseau international. Un interlocuteur unique, 24/7.": "QASAR bespoke: private jets, private transport, stay management. Absolute discretion, uncompromising standards, international network. A single point of contact, 24/7.",
    "Le portefeuille QASAR : villas, riads et chalets d'exception à la location, avec personnel de maison. Cap Ferrat, Marrakech, Courchevel, Ibiza, Mykonos, Maldives.": "The QASAR portfolio: exceptional villas, riads and chalets for rent, with house staff. Cap Ferrat, Marrakech, Courchevel, Ibiza, Mykonos, Maldives.",

    /* Accueil — hero */
    "Le monde, à votre porte.": "The world, at your door.",
    "En mer comme à terre.": "At sea and ashore.",
    "Yachts, villas, services sur mesure,": "Yachts, villas, bespoke services,",
    "où que vous soyez, nous y sommes déjà.": "wherever you are, we are already there.",
    "Découvrir nos services": "Discover our services",
    "Découvrir": "Discover",

    /* Accueil — l'offre */
    "L'offre": "The offering",
    "Trois univers,": "Three worlds,",
    "orchestrés en silence.": "orchestrated in silence.",
    "Charters privés à la journée, à la semaine ou à la saison. Équipages certifiés, itinéraires dessinés sur mesure, un service entièrement dédié à bord.": "Private charters by the day, week or season. Certified crews, bespoke itineraries, service entirely dedicated to you on board.",
    "Un portefeuille de villas réparties dans toute l'Europe, chacune vérifiée et sélectionnée selon des critères précis de standing, d'emplacement et de service.": "A portfolio of villas across Europe, each verified and selected against exacting standards of prestige, location and service.",
    "Jets privés, transport privé, stay management : un seul point de contact pour organiser l'ensemble du séjour, 24/7.": "Private jets, private transport, stay management: a single point of contact to organise your entire stay, 24/7.",

    /* Accueil — domaine yachts */
    "Méditerranée — 42° 17′ N": "Mediterranean — 42° 17′ N",
    "Yachts — N° 01": "Yachts — No. 01",
    "Une flotte pensée": "A fleet designed",
    "pour chaque envie.": "for every desire.",
    "Du day-cruiser au superyacht avec équipage complet, notre portefeuille couvre tous les formats de navigation. Chaque unité est inspectée avant intégration, chaque itinéraire dessiné sur mesure, chaque équipage certifié, pour une mer organisée à votre image.": "From day-cruiser to fully crewed superyacht, our portfolio covers every format of navigation. Every vessel is inspected before it joins us, every itinerary drawn to measure, every crew certified, for a sea arranged in your image.",
    "Charters à la journée, à la semaine, à la saison": "Charters by the day, week or season",
    "Équipages certifiés, discrétion contractuelle": "Certified crews, contractual discretion",
    "Un service entièrement dédié à bord": "Service entirely dedicated to you on board",
    "Affréter un yacht": "Charter a yacht",
    "9 invités · 1 équipage · Côte d'Azur & Corse": "9 guests · 1 crew · French Riviera & Corsica",
    "10 invités · 1 équipage · Côte d'Azur & Corse": "10 guests · 1 crew · French Riviera & Corsica",
    "12 invités · 2 équipage · Côte d'Azur & Corse": "12 guests · 2 crew · French Riviera & Corsica",
    "12 invités · 4 équipage · Côte d'Azur & Corse": "12 guests · 4 crew · French Riviera & Corsica",
    "À partir de 6 900 € / jour + APA": "From €6,900 / day + APA",
    "À partir de 5 900 € / jour + APA": "From €5,900 / day + APA",
    "À partir de 7 600 € / jour + APA": "From €7,600 / day + APA",
    "À partir de 24 000 € / jour + APA": "From €24,000 / day + APA",
    "Découvrir tous nos yachts": "Discover all our yachts",

    /* Accueil — domaine villas */
    "Cap Ferrat — Villa privée": "Cap Ferrat — Private villa",
    "Villas — N° 02": "Villas — No. 02",
    "Un niveau d'exigence,": "One standard of excellence,",
    "une seule sélection.": "a single selection.",
    "Côte d'Azur, Saint-Barthélemy, Courchevel, Mykonos, Ibiza et au-delà : chaque villa est choisie pour son architecture, sa vue et la qualité de ses prestations.": "French Riviera, Saint Barthélemy, Courchevel, Mykonos, Ibiza and beyond: each villa is chosen for its architecture, its view and the quality of its service.",
    "Portefeuille privé, accès sur introduction": "Private portfolio, access by introduction",
    "Personnel de maison & chef dédiés": "Dedicated house staff & chef",
    "Intendance avant, pendant et après le séjour": "Stewardship before, during and after your stay",
    "Réserver une villa": "Book a villa",
    "8 chambres · Front de mer · Saint-Jean-Cap-Ferrat": "8 bedrooms · Seafront · Saint-Jean-Cap-Ferrat",
    "10 chambres · Palmeraie privée · Marrakech": "10 bedrooms · Private palm grove · Marrakech",
    "7 chambres · Ski-in / ski-out · Courchevel 1850": "7 bedrooms · Ski-in / ski-out · Courchevel 1850",
    "Prix sur demande": "Price on request",
    "Découvrir toutes nos villas": "Discover all our villas",

    /* Accueil — manifeste */
    "Mon parcours dans le courtage de luxe a débuté": "My path in luxury brokerage began",
    "entre les Alpes-Maritimes et les Émirats": "between the Alpes-Maritimes and the Emirates",
    ", où j'ai développé une structure opérant à l'échelle internationale, au service d'une clientèle exigeante entre la": ", where I built a structure operating on an international scale, serving a demanding clientele between the",
    "et le": "and the",
    "Golfe": "Gulf",
    "Cette expérience, construite en tant qu'associé, m'a permis d'acquérir une connaissance fine des attentes d'une clientèle internationale : location et mise à disposition de yachts et de villas, organisation d'événements sur mesure, coordination logistique dans plusieurs pays à la fois. Trilingue en français, anglais et arabe, je mène chaque échange dans la langue de mon interlocuteur, ce qui facilite naturellement les dialogues internationaux.": "Built as a partner, this experience gave me a fine understanding of what an international clientele expects: the rental and provision of yachts and villas, bespoke event planning, and logistics coordinated across several countries at once. Trilingual in French, English and Arabic, I conduct every exchange in my counterpart's own language, which naturally eases international dialogue.",
    "Aujourd'hui, je porte cette expertise à travers ma propre structure. Qasar est né de cette volonté d'apporter, en toute indépendance, le même niveau d'exigence et de savoir-faire à chaque client, avec une attention plus directe et personnelle à chaque demande.": "Today I carry this expertise through my own company. Qasar was born of a desire to bring, in complete independence, the same level of exigence and craft to every client, with a more direct and personal attention to each request.",
    "Ancré sur la Côte d'Azur, Qasar conserve cette vocation internationale qui a toujours guidé mon activité, avec un point d'ancrage désormais unique et une vision qui m'appartient entièrement.": "Anchored on the French Riviera, Qasar keeps the international vocation that has always guided my work — now with a single home base and a vision entirely my own.",
    "Adel Tahan — Fondateur": "Adel Tahan — Founder",
    "Disponibilité absolue": "Absolute availability",
    "Destinations privées": "Private destinations",
    "Yachts & villas en portefeuille": "Yachts & villas in portfolio",
    "Sur mesure, sans exception": "Bespoke, without exception",

    /* Marquee destinations */
    "Sardaigne": "Sardinia",
    "Dubaï": "Dubai",
    "Nos destinations": "Our destinations",

    /* Accueil — méthode */
    "La méthode": "The method",
    "Trois temps,": "Three movements,",
    "une signature.": "one signature.",
    "L'écoute": "Listening",
    "Une conversation, pas un formulaire. Nous comprenons le séjour rêvé avant d'en dessiner les contours.": "A conversation, not a form. We understand the stay you dream of before shaping its outline.",
    "La curation": "Curation",
    "Trois propositions au plus, toutes irréprochables. Jamais de catalogue, jamais de compromis.": "Three proposals at most, each impeccable. Never a catalogue, never a compromise.",
    "L'exécution": "Execution",
    "Chaque détail orchestré en amont, une présence discrète pendant, un suivi attentif après.": "Every detail orchestrated in advance, a discreet presence throughout, attentive follow-up after.",

    /* Accueil — réseau */
    "Le réseau": "The network",
    "Chaque saison a sa destination.": "Every season has its destination.",
    "Nous y sommes déjà.": "We are already there.",
    "Carte des destinations Qasar : Côte d'Azur, Courchevel, Paris, Londres, Ibiza, Saint-Barthélemy, Miami, Mykonos, Dubaï": "Map of Qasar destinations: French Riviera, Courchevel, Paris, London, Ibiza, Saint Barthélemy, Miami, Mykonos, Dubai",
    "Côte d'Azur — hub": "French Riviera — hub",
    "Londres": "London",

    /* Contact — hero propre à la page */
    "Une demande,": "One request,",
    "une réponse.": "one reply.",
    "Yachts, villas, jets privés, transport privé, stay management.": "Yachts, villas, private jets, private transport, stay management.",
    "Une seule adresse pour tout organiser.": "One address to arrange everything.",

    /* Contact (partagé) */
    "Confiez-nous": "Entrust us with",
    "l'intention.": "the intention.",
    "Nom complet": "Full name",
    "Adresse e-mail": "Email address",
    "Téléphone — indicatif pays inclus": "Phone — country code included",
    "Votre demande concerne": "Your request concerns",
    "Sélectionnez une rubrique": "Select a category",
    "Jets privés": "Private jets",
    "Transport privé": "Private transport",
    "Dates envisagées — facultatif": "Preferred dates — optional",
    "Votre intention": "Your intention",
    "Juillet 2026, deux semaines…": "July 2026, two weeks…",
    "Décrivez le séjour tel que vous l'imaginez.": "Describe the stay as you imagine it.",
    "Décrivez votre demande telle que vous l'imaginez.": "Describe your request as you imagine it.",
    "J'ai lu la": "I have read the",
    "politique de confidentialité": "privacy policy",
    "et j'accepte que mes données personnelles soient utilisées pour traiter ma demande.": "and I accept that my personal data may be used to process my request.",
    "Envoyer la demande": "Send request",
    "Vos informations restent strictement confidentielles.": "Your information remains strictly confidential.",
    "Merci. Votre demande nous est parvenue — notre équipe vous recontacte au plus vite.": "Thank you. Your request has reached us — our team will get back to you as soon as possible.",
    "Une erreur est survenue lors de l'envoi. Merci de réessayer, ou de nous écrire directement à": "An error occurred while sending. Please try again, or write to us directly at",
    "Une demande, une réponse.": "One request, one reply.",
    "Notre équipe vous recontacte": "Our team gets back to you",
    "au plus vite": "as soon as possible",
    ", où que vous soyez.": ", wherever you are.",
    "Écrire": "Write",
    "Basé à": "Based in",
    "Cannes · Côte d'Azur": "Cannes · French Riviera",

    /* Pied de page */
    "© 2026 Qasar International Broker. Tous droits réservés.": "© 2026 Qasar International Broker. All rights reserved.",
    "CGV": "Terms",
    "Confidentialité": "Privacy",

    /* Page Yachts */
    "Une flotte choisie,": "A chosen fleet,",
    "le prestige en signature.": "prestige as signature.",
    "Du day-cruiser confidentiel au superyacht avec équipage complet.": "From the discreet day-cruiser to the fully crewed superyacht.",
    "Chaque unité est inspectée, éprouvée, sélectionnée.": "Every vessel is inspected, proven, selected.",
    "La flotte": "The fleet",
    "Nos yachts": "Our yachts",
    "à la location.": "for hire.",
    "Chargement de la flotte…": "Loading the fleet…",
    "Trier par prix": "Sort by price",
    "Par défaut": "Default",
    "Prix croissant": "Price: low to high",
    "Prix décroissant": "Price: high to low",
    "Tarifs indicatifs hors APA et frais de livraison. Chaque affrètement fait l'objet d'une proposition personnalisée dans les meilleurs délais.": "Indicative rates excluding APA and delivery fees. Every charter is the subject of a personalised proposal in the shortest possible time.",

    /* Page Services */
    "Le sur-mesure,": "The bespoke,",
    "orchestré en silence.": "orchestrated in silence.",
    "Discrétion absolue, exigence sans compromis, réseau international.": "Absolute discretion, uncompromising standards, international network.",
    "Un interlocuteur unique, joignable 24/7.": "A single point of contact, reachable 24/7.",
    "Nos services": "Our services",
    "Trois demandes,": "Three requests,",
    "un seul geste.": "a single gesture.",
    "Chargement des services…": "Loading services…",

    /* Page Villas */
    "Des adresses d'exception,": "Addresses of distinction,",
    "à la hauteur de vos exigences.": "worthy of your expectations.",
    "Domaines en front de mer, riads confidentiels, chalets d'altitude.": "Seafront estates, confidential riads, alpine chalets.",
    "Chaque propriété est visitée, éprouvée, livrée avec son personnel.": "Every property is visited, proven, delivered with its staff.",
    "Le portefeuille": "The portfolio",
    "Nos villas": "Our villas",
    "Chargement du portefeuille…": "Loading the portfolio…",
    "Tarifs indicatifs, personnel de maison inclus. Chaque séjour fait l'objet d'une proposition personnalisée dans les meilleurs délais.": "Indicative rates, house staff included. Every stay is the subject of a personalised proposal in the shortest possible time.",
    "Maintenance temporaire": "Temporarily unavailable",
    "Notre portefeuille de villas": "Our villa portfolio",
    "se prépare.": "is being prepared.",
    "Cette sélection est en cours de finalisation. En attendant, confiez-nous vos envies : nous vous proposons la villa qui correspond exactement à votre séjour.": "This selection is being finalised. In the meantime, tell us what you have in mind — we will propose the villa that matches your stay exactly.",
    "Demander votre villa": "Request your villa"
  };

  /* ── Aides pour le contenu généré (cartes) ────────────── */
  var ZONES = {
    "Côte d'Azur": "French Riviera",
    "Côte d'Azur & Corse": "French Riviera & Corsica",
    "Côte d'Azur & Méditerranée": "French Riviera & Mediterranean",
    "Côte d'Azur — événementiel": "French Riviera — events",
    "Méditerranée — à la semaine": "Mediterranean — weekly",
    "Riviera — à la journée": "Riviera — daily"
  };

  function trTarif(s) {
    if (/^\s*prix sur demande\s*$/i.test(s)) return 'Price on request';
    return String(s)
      .replace(/À partir de\s*/i, 'From ')
      .replace(/(\d[\d\s ]*\d)\s*€/g, function (m, n) { return '€' + n.replace(/[\s ]/g, ','); })
      .replace(/\s*\/\s*semaine/gi, ' / week')
      .replace(/\s*\/\s*jour/gi, ' / day');
  }

  /* ── État courant ─────────────────────────────────────── */
  var lang;
  try { lang = localStorage.getItem(STORE) || DEFAULT; } catch (e) { lang = DEFAULT; }
  if (lang !== 'fr' && lang !== 'en') lang = DEFAULT;

  /* Registre construit de façon incrémentale et dédupliquée : build() peut
     être appelé plusieurs fois (hero d'abord, puis le reste) sans jamais
     re-parcourir un nœud déjà indexé — indispensable car une fois un nœud
     traduit en EN, son texte n'est plus une clé du dictionnaire FR→EN. */
  var textItems = [];
  var attrItems = [];
  var doneText = (typeof WeakSet !== 'undefined') ? new WeakSet() : null;
  var doneAttr = (typeof WeakMap !== 'undefined') ? new WeakMap() : null;

  var SKIP = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, svg: 1, SVG: 1 };
  function isSkipped(node) {
    var el = node;
    while (el) {
      if (el.nodeType === 1) {
        var tag = el.tagName;
        if (tag && (SKIP[tag] || tag.toLowerCase() === 'svg')) return true;
        if (el.hasAttribute && el.hasAttribute('data-no-i18n')) return true;
      }
      el = el.parentNode;
    }
    return false;
  }

  var ATTRS = ['placeholder', 'aria-label', 'alt', 'title', 'content'];

  function build(root) {
    root = root || document.documentElement;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
    var n;
    while ((n = walker.nextNode())) {
      if (doneText && doneText.has(n)) continue;
      var raw = n.nodeValue;
      if (!raw || !/\S/.test(raw)) continue;
      if (isSkipped(n.parentNode)) continue;
      var key = collapse(raw);
      if (DICT[key] == null) continue;
      if (doneText) doneText.add(n);
      textItems.push({
        node: n,
        lead: (raw.match(/^\s*/) || [''])[0],
        trail: (raw.match(/\s*$/) || [''])[0],
        key: key,
        original: raw
      });
    }
    var all = root.getElementsByTagName('*');
    for (var i = 0; i < all.length; i++) {
      var el = all[i];
      var tag = el.tagName;
      if (SKIP[tag]) continue;
      if (el.hasAttribute('data-no-i18n')) continue;
      var seen = doneAttr ? doneAttr.get(el) : null;
      for (var a = 0; a < ATTRS.length; a++) {
        if (!el.hasAttribute(ATTRS[a])) continue;
        if (seen && seen[ATTRS[a]]) continue;
        var val = el.getAttribute(ATTRS[a]);
        var k = collapse(val);
        if (DICT[k] == null) continue;
        if (doneAttr) {
          if (!seen) { seen = {}; doneAttr.set(el, seen); }
          seen[ATTRS[a]] = 1;
        }
        attrItems.push({ el: el, attr: ATTRS[a], key: k, original: val });
      }
    }
  }

  /* Écrit dans le DOM les nœuds déjà collectés (textItems / attrItems). */
  function writeAll() {
    var en = lang === 'en';
    var i;
    for (i = 0; i < textItems.length; i++) {
      var it = textItems[i];
      it.node.nodeValue = en ? (it.lead + DICT[it.key] + it.trail) : it.original;
    }
    for (i = 0; i < attrItems.length; i++) {
      var at = attrItems[i];
      at.el.setAttribute(at.attr, en ? DICT[at.key] : at.original);
    }
    document.documentElement.lang = lang;
    updateSwitch();
  }

  /* Traduit l'intégralité du document. build() est incrémental et
     dédupliqué : le premier appel indexe tout, les suivants sont quasi
     gratuits (aucun nœud re-parcouru). */
  function apply() {
    build(document.documentElement);
    writeAll();
  }

  function updateSwitch() {
    var btns = document.querySelectorAll('.lang-switch__btn');
    for (var i = 0; i < btns.length; i++) {
      var on = btns[i].getAttribute('data-lang') === lang;
      btns[i].classList.toggle('is-active', on);
      btns[i].setAttribute('aria-pressed', on ? 'true' : 'false');
    }
  }

  function set(next) {
    if (next !== 'fr' && next !== 'en') return;
    if (next === lang) return;
    lang = next;
    try { localStorage.setItem(STORE, lang); } catch (e) {}
    apply();
    document.dispatchEvent(new CustomEvent('qasar:langchange', { detail: { lang: lang } }));
  }

  /* API publique pour les modules de rendu des cartes */
  window.QASAR = {
    get lang() { return lang; },
    get EN() { return lang === 'en'; },
    zone: function (fr) { return (lang === 'en' && ZONES[fr]) ? ZONES[fr] : fr; },
    tarif: function (fr) { return lang === 'en' ? trTarif(fr) : fr; },
    t: function (fr, en) { return lang === 'en' ? en : fr; },
    onChange: function (cb) { document.addEventListener('qasar:langchange', function (e) { cb(e.detail.lang); }); }
  };

  /* Clics sur le sélecteur de langue (délégation) */
  document.addEventListener('click', function (e) {
    var b = e.target && e.target.closest ? e.target.closest('.lang-switch__btn') : null;
    if (!b) return;
    e.preventDefault();
    set(b.getAttribute('data-lang'));
  });

  /* Anti-scintillement : la classe i18n-cloak est posée par le script
     inline du <head> (au plus tôt) ; ce module, chargé en defer, applique
     la traduction puis lève le voile. */
  function reveal() { document.documentElement.classList.remove('i18n-cloak'); }

  /* Boot en deux phases : on traduit d'abord l'en-tête + le hero
     (au-dessus de la ligne de flottaison) puis on lève AUSSITÔT le voile —
     le texte LCP peut peindre sans attendre la traduction de tout le
     document, qui est reportée hors de la tâche critique (item LCP + longue
     tâche du thread principal). En FR (aucune traduction) on lève direct. */
  function boot() {
    try {
      if (lang !== 'en') { reveal(); return; }
      var head = document.querySelector('.header');
      var hero = document.querySelector('.hero');
      if (head) build(head);
      if (hero) build(hero);
      writeAll();
      reveal();
      var rest = function () { apply(); };
      if ('requestIdleCallback' in window) {
        requestIdleCallback(rest, { timeout: 900 });
      } else {
        setTimeout(rest, 60);
      }
    } catch (e) {
      try { apply(); } catch (e2) {}
      reveal();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
  /* Filet de sécurité : ne jamais laisser le corps masqué */
  setTimeout(reveal, 1500);
})();
