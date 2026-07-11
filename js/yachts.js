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

  fetch('data/yachts.json')
    .then((r) => {
      if (!r.ok) throw new Error(r.status);
      return r.json();
    })
    .then((data) => {
      const num = String(data.whatsapp || '').replace(/\D/g, '');
      const msgTpl = data.whatsapp_message || "Bonjour, je souhaite obtenir plus d'informations sur le yacht {nom}.";

      grid.innerHTML = data.yachts
        .map((y) => {
          const waText = encodeURIComponent(msgTpl.replace('{nom}', y.nom));
          const waHref = 'https://wa.me/' + num + '?text=' + waText;

          const metaParts = [];
          if (y.invites != null) metaParts.push(y.invites + ' invités');
          if (y.equipage != null) metaParts.push(y.equipage + ' équipage');
          if (y.zone) metaParts.push(esc(y.zone));
          const meta = metaParts.join(' · ');
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
                    '" data-go="' + i + '" aria-label="Aller à la photo ' + (i + 1) + '"></button>'
                  )
                  .join('') +
              '</div>';

          const nav = single
            ? ''
            : '<button type="button" class="carousel__nav carousel__nav--prev" data-dir="-1" aria-label="Photo précédente">' + ARROW_PREV + '</button>' +
              '<button type="button" class="carousel__nav carousel__nav--next" data-dir="1" aria-label="Photo suivante">' + ARROW_NEXT + '</button>';

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
                '<p class="card__meta">' + meta + '</p>' +
                '<p class="card__desc">' + esc(y.description) + '</p>' +
                '<span class="card__price">' + esc(y.tarif) + '</span>' +
                '<div class="card__actions">' +
                  '<a class="btn-wa" href="' + waHref + '" target="_blank" rel="noopener" aria-label="Contacter Qasar sur WhatsApp au sujet du yacht ' + esc(y.nom) + '">' +
                    WA_ICON + '<span>WhatsApp</span>' +
                  '</a>' +
                '</div>' +
              '</div>' +
            '</article>'
          );
        })
        .join('');

      grid.querySelectorAll('[data-carousel]').forEach(initCarousel);
    })
    .catch(() => {
      grid.innerHTML =
        '<p class="fleet__loading">La flotte est momentanément indisponible — ' +
        '<a href="index.html#contact">contactez-nous directement</a>.</p>';
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
