/* ════════════════════════════════════════════════════════
   QASAR — interactions "quiet luxury"

   CONFIGURATION REQUISE POUR L'ENVOI DES FORMULAIRES :
   Chercher "WEB3FORMS_ACCESS_KEY" plus bas dans ce fichier et
   remplacer le texte "REMPLACER_PAR_VOTRE_CLE_WEB3FORMS" par la
   clé réelle obtenue sur https://web3forms.com (voir instructions
   fournies séparément). Tant que ce n'est pas fait, le formulaire
   affiche un message d'erreur au lieu d'envoyer quoi que ce soit.
   ════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Bulle flottante WhatsApp (injectée sur toutes les pages) ── */
  (function initWhatsAppFloat() {
    const link = document.createElement('a');
    link.className = 'whatsapp-float';
    link.href = 'https://wa.me/33625433186?text=' + encodeURIComponent('Bonjour, je vous contacte depuis votre site');
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', 'Contacter QASAR sur WhatsApp');
    link.innerHTML =
      '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" fill="none" aria-hidden="true">' +
      '<path fill="#fff" d="M16.02 4C9.4 4 4 9.37 4 15.98c0 2.13.56 4.13 1.53 5.86L4 28l6.35-1.66a11.96 11.96 0 0 0 5.67 1.44h.01c6.62 0 12.02-5.37 12.02-11.98C28.05 9.37 22.65 4 16.02 4Zm0 21.9h-.01a9.9 9.9 0 0 1-5.05-1.38l-.36-.21-3.77.99 1.01-3.68-.24-.38a9.9 9.9 0 0 1-1.52-5.26c0-5.47 4.46-9.92 9.95-9.92 2.65 0 5.15 1.04 7.02 2.92a9.87 9.87 0 0 1 2.91 7.02c0 5.47-4.46 9.9-9.94 9.9Z"/>' +
      '<path fill="#fff" d="M21.62 18.4c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.96 1.18-.18.2-.35.22-.65.08-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.79-1.68-2.09-.18-.3-.02-.46.13-.61.14-.14.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.65-.94-2.26-.25-.6-.5-.5-.68-.51h-.58c-.2 0-.53.08-.8.38-.28.3-1.05 1.02-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.13 3.26 5.17 4.57.72.31 1.29.5 1.73.64.73.23 1.39.2 1.91.12.58-.09 1.78-.73 2.03-1.43.25-.7.25-1.3.18-1.43-.07-.13-.27-.2-.57-.35Z"/>' +
      '</svg>';
    document.body.appendChild(link);
  })();

  /* ── Suivi conversion Google Ads : clic sur un bouton WhatsApp ── */
  document.addEventListener('click', function (e) {
    if (e.target.closest('.btn-wa, .whatsapp-float') && typeof gtag === 'function') {
      gtag('event', 'conversion', { send_to: 'AW-18323270454/f-7LCPa-ytAcELbWm6FE' });
    }
  });

  /* ── Préloader → révélation du hero ─────────────────── */
  const preloader = document.getElementById('preloader');
  const hero = document.getElementById('hero');

  function openCurtain() {
    if (preloader) preloader.classList.add('is-done');
    if (hero) hero.classList.add('is-revealed');
  }

  if (reduceMotion) {
    openCurtain();
  } else {
    /* rideau court et indépendant de window.load : la vidéo hero est
       chargée après coup (voir lazyHeroVideos), le poster sert de LCP */
    setTimeout(openCurtain, 150);
  }

  /* ── Header : état scrollé ───────────────────────────── */
  const header = document.getElementById('header');
  let lastY = 0, ticking = false;

  function onScroll() {
    lastY = window.scrollY;
    if (!ticking) {
      requestAnimationFrame(() => {
        header.classList.toggle('is-scrolled', lastY > 40);
        if (!reduceMotion && heroImg && lastY < window.innerHeight) {
          heroImg.style.transform = 'translateY(' + lastY * 0.18 + 'px)';
        }
        ticking = false;
      });
      ticking = true;
    }
  }

  /* parallaxe douce du hero (après le Ken Burns d'entrée) */
  const heroImg = document.getElementById('heroImg');
  if (heroImg && !reduceMotion) {
    heroImg.addEventListener('animationend', () => {
      heroImg.style.animation = 'none';
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Menu mobile ─────────────────────────────────────── */
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');

  function closeMenu() {
    burger.classList.remove('is-open');
    mobileMenu.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      const open = !mobileMenu.classList.contains('is-open');
      burger.classList.toggle('is-open', open);
      mobileMenu.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
      mobileMenu.setAttribute('aria-hidden', String(!open));
      document.body.style.overflow = open ? 'hidden' : '';
      if (open) {
        /* stagger des liens */
        mobileMenu.querySelectorAll('nav a').forEach((a, i) => {
          a.style.transitionDelay = (0.08 + i * 0.06) + 's';
        });
      }
    });
    mobileMenu.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) closeMenu();
    });
  }

  /* ── Révélations au scroll (IntersectionObserver) ──────
     Les éléments [data-reveal-clip] sont entièrement clippés au départ :
     le navigateur calcule leur intersection après clip-path (rect nul),
     donc on observe leur PARENT comme proxy. */
  const proxyClips = new Map();

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-inview');
      (proxyClips.get(entry.target) || []).forEach((el) => el.classList.add('is-inview'));
      io.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  /* stagger automatique dans les groupes */
  document.querySelectorAll('[data-reveal-group]').forEach((group) => {
    group.querySelectorAll('[data-reveal]').forEach((el, i) => {
      el.style.setProperty('--d', (i * 0.09) + 's');
    });
  });

  document.querySelectorAll('[data-reveal-clip]').forEach((el) => {
    const proxy = el.parentElement || el;
    if (!proxyClips.has(proxy)) proxyClips.set(proxy, []);
    proxyClips.get(proxy).push(el);
    io.observe(proxy);
  });

  document
    .querySelectorAll('[data-reveal], [data-reveal-lines], .kicker')
    .forEach((el) => io.observe(el));

  /* ── Compteurs ───────────────────────────────────────── */
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      counterIO.unobserve(el);
      const target = parseInt(el.dataset.counter, 10);
      if (reduceMotion) { el.textContent = target; return; }
      const dur = 1600;
      const t0 = performance.now();
      (function tick(now) {
        const p = Math.min((now - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 4); /* ease-out-quart */
        el.textContent = Math.round(target * eased);
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-counter]').forEach((el) => counterIO.observe(el));

  /* ── Boutons magnétiques (subtil) ────────────────────── */
  if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('[data-magnetic]').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.14;
        const y = (e.clientY - r.top - r.height / 2) * 0.22;
        btn.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* ── Formulaire ──────────────────────────────────────────
     Envoi réel via Web3Forms (https://web3forms.com) — service
     pensé pour être appelé depuis du JS 100% client, sans backend.
     La clé ci-dessous n'est PAS un secret (comme un ID Formspree) :
     web3forms.com l'affiche pour l'associer à l'adresse e-mail de
     réception déclarée sur leur site. Voir la note de configuration
     en tête de fichier. */
  const WEB3FORMS_ACCESS_KEY = '02bc05b2-99c6-4ae7-8ceb-5cebcce557ba';
  const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

  const form = document.getElementById('contactForm');
  if (form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const submitLabel = submitBtn.textContent;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      form.classList.remove('is-error');

      let valid = true;
      form.querySelectorAll('[required]').forEach((input) => {
        const field = input.closest('.form__field');
        if (input.type === 'checkbox') {
          field.classList.toggle('has-error', !input.checked);
          if (!input.checked) valid = false;
          return;
        }
        const v = input.value.trim();
        let bad = !v;
        if (!bad && input.type === 'email') {
          bad = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        }
        if (!bad && input.type === 'tel') {
          /* indicatif pays obligatoire : commence par + puis 6 à 15 chiffres */
          bad = !/^\+\d{6,15}$/.test(v.replace(/[\s().\-]/g, ''));
        }
        field.classList.toggle('has-error', bad);
        if (bad) valid = false;
      });
      if (!valid) {
        const firstBad = form.querySelector('.has-error input, .has-error select, .has-error textarea');
        if (firstBad) firstBad.focus();
        return;
      }

      if (WEB3FORMS_ACCESS_KEY === 'REMPLACER_PAR_VOTRE_CLE_WEB3FORMS') {
        console.error(
          '[Qasar] Formulaire non configuré : renseignez WEB3FORMS_ACCESS_KEY dans js/main.js ' +
          '(clé obtenue sur https://web3forms.com, liée à contact@qasar-international.com).'
        );
        form.classList.add('is-error');
        return;
      }

      const data = new FormData(form);
      data.append('access_key', WEB3FORMS_ACCESS_KEY);
      data.append('subject', 'Nouvelle demande QASAR — ' + (data.get('interest') || 'site web'));
      data.append('from_name', 'Site QASAR');
      /* champ honeypot anti-spam recommandé par Web3Forms */
      if (!data.has('botcheck')) data.append('botcheck', '');

      const L = (fr, en) => (document.documentElement.lang === 'en' ? en : fr);
      submitBtn.disabled = true;
      submitBtn.textContent = L('Envoi en cours…', 'Sending…');

      fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data
      })
        .then((r) => r.json().then((json) => ({ ok: r.ok, json })))
        .then(({ ok, json }) => {
          if (!ok || !json.success) {
            throw new Error((json && json.message) || 'Échec de l\'envoi (réponse serveur non valide).');
          }
          form.classList.add('is-sent');
          submitBtn.textContent = L('Demande envoyée', 'Request sent');
        })
        .catch((err) => {
          console.error('[Qasar] Échec de l\'envoi du formulaire :', err);
          form.classList.add('is-error');
          submitBtn.disabled = false;
          submitBtn.textContent = submitLabel;
        });
    });

    form.querySelectorAll('input, textarea, select').forEach((input) => {
      if (input.type === 'checkbox') {
        input.addEventListener('change', () => {
          if (input.checked) input.closest('.form__field').classList.remove('has-error');
        });
        return;
      }
      input.addEventListener('blur', () => {
        if (input.value.trim()) input.closest('.form__field').classList.remove('has-error');
      });
    });
  }

  /* ── Vidéos hero : chargées APRÈS window.load ─────────
     Les <video> portent data-video-src (pas de <source>) : le poster
     s'affiche immédiatement (LCP), la vidéo arrive ensuite en douceur
     sans peser sur le chargement initial — crucial pour le score mobile. */
  (function lazyHeroVideos() {
    const vids = document.querySelectorAll('video[data-video-src]');
    if (!vids.length) return;
    function start() {
      vids.forEach((v) => {
        v.src = v.getAttribute('data-video-src');
        v.removeAttribute('data-video-src');
        const p = v.play();
        if (p && p.catch) p.catch(() => {});
      });
    }
    if (document.readyState === 'complete') {
      setTimeout(start, 150);
    } else {
      window.addEventListener('load', () => setTimeout(start, 150), { once: true });
    }
  })();

  /* ── Année du footer déjà statique ; rien d'autre. ──── */
})();
