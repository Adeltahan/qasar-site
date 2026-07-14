/* Bandeau de consentement cookies — QASAR
   Pilote le Google Consent Mode v2 (ad_storage, analytics_storage, etc.).
   Tant que l'utilisateur n'a pas choisi, tout est en "denied" (posé dans le <head>).
   Le choix est mémorisé dans localStorage et réappliqué sur chaque page. */
(function () {
  'use strict';

  var STORE = 'qasar_consent';

  function getGtag() {
    window.dataLayer = window.dataLayer || [];
    return function () { window.dataLayer.push(arguments); };
  }

  function applyConsent(granted) {
    var gtag = getGtag();
    var state = granted ? 'granted' : 'denied';
    gtag('consent', 'update', {
      ad_storage: state,
      ad_user_data: state,
      ad_personalization: state,
      analytics_storage: state
    });
  }

  function saveChoice(granted) {
    try { localStorage.setItem(STORE, granted ? 'granted' : 'denied'); } catch (e) {}
  }

  function readChoice() {
    try { return localStorage.getItem(STORE); } catch (e) { return null; }
  }

  function lang() {
    return (window.QASAR && window.QASAR.EN) ? 'en' : 'fr';
  }

  var COPY = {
    fr: {
      text: 'Nous utilisons des cookies pour mesurer l’audience et la performance de nos campagnes. Vous pouvez accepter ou refuser leur dépôt.',
      link: 'En savoir plus',
      accept: 'Accepter',
      reject: 'Refuser'
    },
    en: {
      text: 'We use cookies to measure audience and campaign performance. You can accept or decline them.',
      link: 'Learn more',
      accept: 'Accept',
      reject: 'Decline'
    }
  };

  function render() {
    var l = lang();
    var c = COPY[l];

    var el = document.createElement('div');
    el.id = 'qasarConsent';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', l === 'en' ? 'Cookie consent' : 'Consentement aux cookies');
    el.innerHTML =
      '<div class="qc__inner">' +
        '<p class="qc__text">' + c.text + ' <a href="confidentialite.html" class="qc__link">' + c.link + '</a></p>' +
        '<div class="qc__actions">' +
          '<button type="button" class="qc__btn qc__btn--reject" data-qc="reject">' + c.reject + '</button>' +
          '<button type="button" class="qc__btn qc__btn--accept" data-qc="accept">' + c.accept + '</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(el);
    requestAnimationFrame(function () { el.classList.add('qc--visible'); });

    el.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-qc]');
      if (!btn) return;
      var granted = btn.getAttribute('data-qc') === 'accept';
      applyConsent(granted);
      saveChoice(granted);
      el.classList.remove('qc--visible');
      setTimeout(function () { el.remove(); }, 400);
    });
  }

  function init() {
    var choice = readChoice();
    if (choice === 'granted' || choice === 'denied') {
      applyConsent(choice === 'granted');
      return;
    }
    if (document.body) render();
    else document.addEventListener('DOMContentLoaded', render);
  }

  init();
})();
