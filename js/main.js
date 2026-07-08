/* ════════════════════════════════════════════════════════
   QASAR — interactions "quiet luxury"
   ════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
    window.addEventListener('load', () => setTimeout(openCurtain, 1600));
    /* garde-fou si "load" tarde (images distantes) */
    setTimeout(openCurtain, 3800);
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

  /* ── Formulaire ──────────────────────────────────────── */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll('[required]').forEach((input) => {
        const field = input.closest('.form__field');
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
      form.classList.add('is-sent');
      form.querySelector('button[type="submit"]').disabled = true;
      form.querySelector('button[type="submit"]').textContent = 'Demande envoyée';
    });
    form.querySelectorAll('input, textarea, select').forEach((input) => {
      input.addEventListener('blur', () => {
        if (input.value.trim()) input.closest('.form__field').classList.remove('has-error');
      });
    });
  }

  /* ── Année du footer déjà statique ; rien d'autre. ──── */
})();
