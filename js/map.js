/* ════════════════════════════════════════════════════════
   QASAR — globe 3D du réseau (maplibre-gl, projection globe)
   Hub Côte d'Azur + arcs or vers les destinations.
   ════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const el = document.getElementById('qasarMap');
  if (!el) return;

  const legend = document.querySelector('.network__legend');
  const fail = () => { el.style.display = 'none'; if (legend) legend.classList.add('is-forced'); };

  /* ── Chargement paresseux de maplibre-gl ─────────────────
     La bibliothèque (~800 Ko de JS + CSS) n'est injectée que
     lorsque la section carte approche du viewport : le chargement
     initial de la page (LCP/TBT mobile) n'en paie jamais le coût. */
  const MAPLIBRE_JS = 'https://unpkg.com/maplibre-gl@5/dist/maplibre-gl.js';
  const MAPLIBRE_CSS = 'https://unpkg.com/maplibre-gl@5/dist/maplibre-gl.css';

  let started = false;
  function boot() {
    if (started) return;
    started = true;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = MAPLIBRE_CSS;
    document.head.appendChild(link);
    const script = document.createElement('script');
    script.src = MAPLIBRE_JS;
    script.async = true;
    script.onload = init;
    script.onerror = fail;
    document.head.appendChild(script);
  }

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { io.disconnect(); boot(); }
    }, { rootMargin: '600px 0px' });
    io.observe(el);
  } else {
    boot();
  }

  function init() {
  if (typeof maplibregl === 'undefined') { fail(); return; }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const hub = { name: "Côte d'Azur", lng: 7.2620, lat: 43.7102 };
  const destinations = [
    { name: 'Courchevel', lng: 6.6338, lat: 45.4149 },
    { name: 'Paris', lng: 2.3522, lat: 48.8566 },
    { name: 'Londres', lng: -0.1276, lat: 51.5072 },
    { name: 'Ibiza', lng: 1.4206, lat: 38.9067 },
    { name: 'Saint-Barthélemy', lng: -62.8333, lat: 17.9000 },
    { name: 'Miami', lng: -80.1918, lat: 25.7617 },
    { name: 'Mykonos', lng: 25.3289, lat: 37.4467 },
    { name: 'Dubaï', lng: 55.2708, lat: 25.2048 }
  ];

  /* arc de grand cercle entre deux points (interpolation sphérique) */
  function greatCircle(a, b, steps) {
    const rad = Math.PI / 180, deg = 180 / Math.PI;
    const φ1 = a.lat * rad, λ1 = a.lng * rad, φ2 = b.lat * rad, λ2 = b.lng * rad;
    const v1 = [Math.cos(φ1) * Math.cos(λ1), Math.cos(φ1) * Math.sin(λ1), Math.sin(φ1)];
    const v2 = [Math.cos(φ2) * Math.cos(λ2), Math.cos(φ2) * Math.sin(λ2), Math.sin(φ2)];
    const ω = Math.acos(Math.min(1, v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2]));
    const coords = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const A = Math.sin((1 - t) * ω) / Math.sin(ω), B = Math.sin(t * ω) / Math.sin(ω);
      const x = A * v1[0] + B * v2[0], y = A * v1[1] + B * v2[1], z = A * v1[2] + B * v2[2];
      coords.push([Math.atan2(y, x) * deg, Math.atan2(z, Math.hypot(x, y)) * deg]);
    }
    return { type: 'Feature', geometry: { type: 'LineString', coordinates: coords } };
  }

  let map;
  try {
    map = new maplibregl.Map({
      container: el,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [14, 34],
      zoom: 1.6,
      minZoom: 1,
      maxZoom: 4,
      attributionControl: false,
      scrollZoom: false,
      doubleClickZoom: false,
      dragRotate: false,
      pitchWithRotate: false,
      touchPitch: false
    });
  } catch (e) { fail(); return; }

  map.on('error', () => {});
  window.__qasarMap = map;

  map.on('style.load', () => {
    if (map.setProjection) map.setProjection({ type: 'globe' });

    /* recoloration du fond de carte dans la charte Qasar */
    for (const layer of map.getStyle().layers) {
      if (layer.type === 'symbol') {
        map.setLayoutProperty(layer.id, 'visibility', 'none');
      } else if (layer.type === 'background') {
        map.setPaintProperty(layer.id, 'background-color', '#0A322C'); /* océan */
      } else if (layer.type === 'fill') {
        map.setPaintProperty(layer.id, 'fill-color', '#16473F');       /* terres */
        map.setPaintProperty(layer.id, 'fill-outline-color', 'rgba(203, 180, 132, 0.10)');
      } else if (layer.type === 'line') {
        map.setPaintProperty(layer.id, 'line-color', 'rgba(203, 180, 132, 0.18)');
      }
    }

    /* arcs or depuis le hub — purement visuels (aucun handler de clic) */
    map.addSource('qasar-arcs', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: destinations.map((d) => greatCircle(hub, d, 72)) }
    });
    map.addLayer({
      id: 'qasar-arcs',
      type: 'line',
      source: 'qasar-arcs',
      paint: { 'line-color': '#CBB484', 'line-width': 1.4, 'line-opacity': 0.85 }
    });

    /* marqueurs — positionnés via map.project() à chaque frame
       (les Marker natifs dérivent verticalement en projection globe) */
    const overlay = document.createElement('div');
    overlay.className = 'map-markers';
    el.appendChild(overlay);

    const items = [{ ...hub, isHub: true }].concat(destinations).map((d) => {
      const div = document.createElement('div');
      div.className = 'map-marker' + (d.isHub ? ' map-marker--hub' : '');
      div.innerHTML = '<span class="map-marker__label">' + d.name + (d.isHub ? ' — hub' : '') + '</span>';
      overlay.appendChild(div);
      return { d, div };
    });

    const rad = Math.PI / 180;
    function place() {
      const c = map.getCenter();
      for (const { d, div } of items) {
        const p = map.project([d.lng, d.lat]);
        /* masquer les points sur la face cachée du globe */
        const cosDist = Math.sin(c.lat * rad) * Math.sin(d.lat * rad) +
                        Math.cos(c.lat * rad) * Math.cos(d.lat * rad) * Math.cos((d.lng - c.lng) * rad);
        const visible = cosDist > 0.05;
        div.style.transform = 'translate(' + p.x + 'px,' + p.y + 'px) translate(-50%,-50%)';
        div.style.opacity = visible ? '' : '0';
        div.style.pointerEvents = visible ? '' : 'none';
      }
    }
    map.on('render', place);
    place();
  });

  /* rotation lente du globe, en pause au survol / à l'interaction */
  if (!reduceMotion) {
    let paused = false;
    el.addEventListener('pointerenter', () => { paused = true; });
    el.addEventListener('pointerleave', () => { paused = false; });
    map.on('dragstart', () => { paused = true; });
    setInterval(() => {
      if (paused || document.hidden) return;
      const c = map.getCenter();
      c.lng -= 0.18;
      map.easeTo({ center: c, duration: 1000, easing: (n) => n });
    }, 1000);
  }
  } /* fin init() */
})();
