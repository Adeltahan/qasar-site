/* ════════════════════════════════════════════════════════
   QASAR — rendu de la flotte depuis data/yachts.json
   Ajouter / modifier un yacht = éditer le JSON, sans toucher au code.
   Chaque carte affiche un carrousel des photos du yacht (champ "images").
   ════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const grid = document.getElementById('fleetGrid');
  if (!grid) return;

  const WA_ICON =
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';

  const ARROW_PREV = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>';
  const ARROW_NEXT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>';

  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ── Bilingue (voir js/i18n.js) ───────────────────── */
  let enOverlay = null; // data/yachts.en.json : { nom: description }
  const EN = () => !!(window.QASAR && window.QASAR.EN);
  const descOf = (y) => (EN() && enOverlay && enOverlay[y.nom]) ? enOverlay[y.nom] : (y.description || '');
  const zoneOf = (y) => (window.QASAR && y.zone) ? window.QASAR.zone(y.zone) : (y.zone || '');
  const tarifOf = (y) => (window.QASAR && y.tarif) ? window.QASAR.tarif(y.tarif) : (y.tarif || '');
  const metaOf = (y) => {
    const w = EN() ? { g: ' guests', c: ' crew' } : { g: ' invités', c: ' équipage' };
    const p = [];
    if (y.invites != null) p.push(y.invites + w.g);
    if (y.equipage != null) p.push(y.equipage + w.c);
    if (y.zone) p.push(zoneOf(y));
    return p.join(' · ');
  };
  const waAria = (nom) => EN() ? ('Contact Qasar on WhatsApp about the yacht ' + nom) : ('Contacter Qasar sur WhatsApp au sujet du yacht ' + nom);
  const cardAria = (nom) => EN() ? ('View the full details of the yacht ' + nom) : ('Voir la fiche complète du yacht ' + nom);

  /* ── Modal fiche yacht ────────────────────────────── */
  const modal = document.getElementById('yachtModal');
  let openYachtModal = () => {};

  if (modal) {
    const modalTrack = document.getElementById('yachtModalTrack');
    const modalDots = document.getElementById('yachtModalDots');
    const modalCarousel = modal.querySelector('[data-carousel]');
    const modalTitle = document.getElementById('yachtModalTitle');
    const modalMeta = document.getElementById('yachtModalMeta');
    const modalDesc = document.getElementById('yachtModalDesc');
    const modalPrice = document.getElementById('yachtModalPrice');
    const modalWa = document.getElementById('yachtModalWa');
    let lastFocused = null;

    openYachtModal = function (y, waHref) {
      modalTitle.textContent = y.nom + ' — ' + y.taille_m + ' m';
      modalMeta.textContent = metaOf(y);
      modalDesc.textContent = descOf(y);
      modalPrice.textContent = tarifOf(y);
      modalWa.href = waHref;
      modalWa.setAttribute('aria-label', waAria(y.nom));

      const images = Array.isArray(y.images) && y.images.length ? y.images : (y.image ? [y.image] : []);
      modalTrack.innerHTML = images
        .map((src, i) =>
          '<div class="carousel__slide">' +
            '<img src="' + esc(src) + '" alt="Yacht ' + esc(y.nom) + ' — photo ' + (i + 1) + '"' +
            (i === 0 ? '' : ' loading="lazy"') + '>' +
          '</div>'
        )
        .join('');
      modalTrack.style.transform = 'translateX(0)';

      const single = images.length <= 1;
      modalCarousel.classList.toggle('carousel--single', single);
      modalDots.innerHTML = single
        ? ''
        : images
            .map((_, i) =>
              '<button type="button" class="carousel__dot' + (i === 0 ? ' is-active' : '') +
              '" data-go="' + i + '" aria-label="Aller à la photo ' + (i + 1) + '"></button>'
            )
            .join('');
      initCarousel(modalCarousel);

      lastFocused = document.activeElement;
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.documentElement.classList.add('modal-open');
      modal.querySelector('.yacht-modal__close').focus();
    };

    function closeYachtModal() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.documentElement.classList.remove('modal-open');
      if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    }

    modal.querySelectorAll('[data-modal-close]').forEach((el) => el.addEventListener('click', closeYachtModal));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) closeYachtModal();
    });
  }

  let DATA = null;

  /* ── Tri par prix ─────────────────────────────────── */
  const sortSelect = document.getElementById('fleetSort');
  let currentSort = 'default';

  /* Normalise le tarif en équivalent €/jour pour comparaison ;
     null si "Prix sur demande" (pas de montant) — ces yachts restent
     en fin de liste quel que soit le sens du tri. */
  const priceValue = (y) => {
    const s = String(y.tarif || '');
    const m = s.match(/(\d[\d\s ]*)/);
    if (!m) return null;
    const num = parseFloat(m[1].replace(/[\s ]/g, ''));
    if (!num) return null;
    return /semaine/i.test(s) ? num / 7 : num;
  };

  const sortedYachts = () => {
    const list = DATA.yachts.slice();
    if (currentSort === 'default') return list;
    const dir = currentSort === 'price-asc' ? 1 : -1;
    return list
      .map((y, i) => ({ y, i, p: priceValue(y) }))
      .sort((a, b) => {
        if (a.p == null && b.p == null) return a.i - b.i;
        if (a.p == null) return 1;
        if (b.p == null) return -1;
        return (a.p - b.p) * dir;
      })
      .map((e) => e.y);
  };

  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      currentSort = sortSelect.value;
      renderGrid();
    });
  }

  const waHrefFor = (nom) => {
    const num = String((DATA && DATA.whatsapp) || '').replace(/\D/g, '');
    const tpl = EN()
      ? 'Hello, I would like more information about the yacht {nom}.'
      : ((DATA && DATA.whatsapp_message) || "Bonjour, je souhaite obtenir plus d'informations sur le yacht {nom}.");
    return 'https://wa.me/' + num + '?text=' + encodeURIComponent(tpl.replace('{nom}', nom));
  };

  function renderGrid() {
    if (!DATA) return;
    const yachts = sortedYachts();
    grid.innerHTML = yachts
      .map((y) => {
        const waHref = waHrefFor(y.nom);
        const images = Array.isArray(y.images) && y.images.length ? y.images : (y.image ? [y.image] : []);
        const single = images.length <= 1;

        const slides = images
          .map((src, i) =>
            '<div class="carousel__slide">' +
              '<img src="' + esc(src) + '" alt="Yacht ' + esc(y.nom) + ' — photo ' + (i + 1) + '"' +
              (i === 0 ? '' : ' loading="lazy"') + '>' +
            '</div>'
          )
          .join('');

        const dots = single
          ? ''
          : '<div class="carousel__dots">' +
              images
                .map((_, i) =>
                  '<button type="button" class="carousel__dot' + (i === 0 ? ' is-active' : '') +
                  '" data-go="' + i + '" aria-label="' + (EN() ? 'Go to photo ' : 'Aller à la photo ') + (i + 1) + '"></button>'
                )
                .join('') +
            '</div>';

        const nav = single
          ? ''
          : '<button type="button" class="carousel__nav carousel__nav--prev" data-dir="-1" aria-label="' + (EN() ? 'Previous photo' : 'Photo précédente') + '">' + ARROW_PREV + '</button>' +
            '<button type="button" class="carousel__nav carousel__nav--next" data-dir="1" aria-label="' + (EN() ? 'Next photo' : 'Photo suivante') + '">' + ARROW_NEXT + '</button>';

        return (
          '<article class="card">' +
            '<div class="card__media">' +
              '<div class="carousel' + (single ? ' carousel--single' : '') + '" data-carousel>' +
                '<div class="carousel__track">' + slides + '</div>' +
                nav +
                dots +
              '</div>' +
            '</div>' +
            '<div class="card__body">' +
              '<h3 class="card__name">' + esc(y.nom) + ' — ' + y.taille_m + ' m</h3>' +
              '<p class="card__meta">' + esc(metaOf(y)) + '</p>' +
              '<p class="card__desc">' + esc(descOf(y)) + '</p>' +
              '<span class="card__price">' + esc(tarifOf(y)) + '</span>' +
              '<div class="card__actions">' +
                '<a class="btn-wa" href="' + waHref + '" target="_blank" rel="noopener" aria-label="' + esc(waAria(y.nom)) + '">' +
                  WA_ICON + '<span>WhatsApp</span>' +
                '</a>' +
              '</div>' +
            '</div>' +
          '</article>'
        );
      })
      .join('');

    grid.querySelectorAll('[data-carousel]').forEach(initCarousel);

    const ignoreSelector = '.carousel__nav, .carousel__dot, .btn-wa';
    grid.querySelectorAll('.card').forEach((card, i) => {
      const y = yachts[i];
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', cardAria(y.nom));
      card.addEventListener('click', (e) => {
        if (e.target.closest(ignoreSelector)) return;
        openYachtModal(y, waHrefFor(y.nom));
      });
      card.addEventListener('keydown', (e) => {
        if ((e.key !== 'Enter' && e.key !== ' ') || e.target.closest(ignoreSelector)) return;
        e.preventDefault();
        openYachtModal(y, waHrefFor(y.nom));
      });
    });
  }

  Promise.all([
    fetch('data/yachts.json').then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); }),
    fetch('data/yachts.en.json').then((r) => r.ok ? r.json() : {}).catch(() => ({}))
  ])
    .then(([data, overlay]) => {
      DATA = data;
      enOverlay = overlay || {};
      renderGrid();
      if (window.QASAR) window.QASAR.onChange(renderGrid);
    })
    .catch(() => {
      grid.innerHTML = EN()
        ? '<p class="fleet__loading">The fleet is momentarily unavailable — <a href="/#contact">contact us directly</a>.</p>'
        : '<p class="fleet__loading">La flotte est momentanément indisponible — <a href="/#contact">contactez-nous directement</a>.</p>';
    });

  function initCarousel(root) {
    const track = root.querySelector('.carousel__track');
    const slides = root.querySelectorAll('.carousel__slide');
    const dots = root.querySelectorAll('.carousel__dot');
    const count = slides.length;
    if (count <= 1) return;

    let index = 0;

    function go(i) {
      index = (i + count) % count;
      track.style.transform = 'translateX(' + -index * 100 + '%)';
      dots.forEach((d, k) => d.classList.toggle('is-active', k === index));
    }

    root.querySelectorAll('.carousel__nav').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        go(index + parseInt(btn.dataset.dir, 10));
      });
    });

    dots.forEach((dot) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        go(parseInt(dot.dataset.go, 10));
      });
    });

    /* ── Swipe tactile ─────────────────────────────── */
    let startX = 0;
    let dragging = false;

    track.addEventListener(
      'touchstart',
      (e) => {
        startX = e.touches[0].clientX;
        dragging = true;
      },
      { passive: true }
    );
    track.addEventListener(
      'touchend',
      (e) => {
        if (!dragging) return;
        dragging = false;
        const dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
      },
      { passive: true }
    );
  }
})();
