/* Vitrine da home: o vídeo cresce no scroll e toca mudo quando aparece; o CRM real roda num iframe
   escalado dentro da janela. No celular, a janela mostra a tela e abre o sistema em tela cheia. */
(function () {
  'use strict';
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s) { return document.querySelector(s); };

  /* ── Vídeo ── */
  var tela = $('#vt-tela'), v = $('#vt-v'), som = $('#vt-som');
  if (tela && v) {
    var carregado = false;
    var carregar = function () {
      if (carregado) return; carregado = true;
      v.src = window.innerWidth < 900 ? '/video/autogenius-1-minuto-720.mp4' : '/video/autogenius-1-minuto.mp4';
    };
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) { carregar(); if (!calm || tela.classList.contains('com-som')) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } }
          else if (!v.paused) v.pause();
        });
      }, { threshold: .35 }).observe(tela);
    }
    som.addEventListener('click', function () {
      carregar();
      v.muted = false; v.loop = false; v.controls = true; v.currentTime = 0;
      tela.classList.add('com-som');
      var p = v.play(); if (p && p.catch) p.catch(function () {});
      if (window.gtag) gtag('event', 'video_play', { video_title: 'AutoGenius em 1 minuto', local: 'home' });
    });
    v.addEventListener('ended', function () { if (window.gtag) gtag('event', 'video_complete', { video_title: 'AutoGenius em 1 minuto' }); });
    // o vídeo cresce de 76% para a largura total enquanto entra na tela
    var crescer = function () {
      var r = tela.getBoundingClientRect(), h = window.innerHeight;
      var p = Math.min(1, Math.max(0, (h - r.top) / (h * .85)));
      var e = 1 - Math.pow(1 - p, 3);
      tela.style.transform = 'scale(' + (0.76 + 0.24 * e).toFixed(4) + ')';
    };
    if (!calm) { crescer(); window.addEventListener('scroll', crescer, { passive: true }); window.addEventListener('resize', crescer); }
  }

  /* ── O sistema ── */
  var palco = $('#vt-palco'), usar = $('#vt-usar'), foto = $('#vt-foto'), cheia = $('#vt-cheia');
  if (!palco) return;
  var NOMES = { carros: 'concessionárias', imoveis: 'imobiliárias', clinicas: 'clínicas', escolas: 'escolas', alimentacao: 'restaurantes e delivery' };
  var atual = 'carros', frames = {}, desktop = function () { return window.matchMedia('(min-width: 900px)').matches; };

  function escala() {
    var s = palco.clientWidth / 1440;
    Object.keys(frames).forEach(function (k) { frames[k].style.transform = 'scale(' + s + ')'; });
  }
  function mostrar(k) {
    atual = k;
    cheia.href = '/demo/' + k + '.html';
    foto.src = '/image/v3/demo-' + k + '.jpg';
    foto.alt = 'Tela do CRM AutoGenius para ' + NOMES[k] + ': conversas no WhatsApp com a IA respondendo';
    Object.keys(frames).forEach(function (n) { frames[n].hidden = n !== k; });
    if (palco.classList.contains('ativo')) abrir();
  }
  function abrir() {
    if (!desktop()) { window.open('/demo/' + atual + '.html', '_blank', 'noopener'); return; }
    if (!frames[atual]) {
      var f = document.createElement('iframe');
      f.src = '/demo/' + atual + '.html';
      f.title = 'Demonstração do CRM AutoGenius para ' + NOMES[atual];
      f.setAttribute('loading', 'lazy');
      palco.appendChild(f); frames[atual] = f; escala();
    }
    Object.keys(frames).forEach(function (n) { frames[n].hidden = n !== atual; });
    palco.classList.add('ativo');
    if (window.gtag) gtag('event', 'demo_aberta', { segmento: atual });
  }
  usar.addEventListener('click', abrir);
  document.querySelectorAll('.vt-abas button').forEach(function (b) {
    b.addEventListener('click', function () {
      document.querySelectorAll('.vt-abas button').forEach(function (x) { x.setAttribute('aria-selected', x === b); });
      mostrar(b.getAttribute('data-demo'));
    });
  });
  window.addEventListener('resize', escala);
})();
