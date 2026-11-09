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

  /* ── O sistema: prévia na página; o CRM abre numa camada por cima, com saída sempre à vista ── */
  var palco = $('#vt-palco'), usar = $('#vt-usar'), foto = $('#vt-foto'), cheia = $('#vt-cheia');
  if (!palco) return;
  var NOMES = { carros: 'concessionárias', imoveis: 'imobiliárias', clinicas: 'clínicas', escolas: 'escolas', alimentacao: 'restaurantes e delivery' };
  var ROTULO = { carros: 'Concessionárias', imoveis: 'Imobiliárias', clinicas: 'Clínicas', escolas: 'Escolas', alimentacao: 'Alimentação' };
  var atual = 'carros', modal = null, frames = {}, ultimoFoco = null;

  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }

  function montar() {
    modal = el('div', 'vt-modal'); modal.setAttribute('role', 'dialog'); modal.setAttribute('aria-modal', 'true'); modal.setAttribute('aria-label', 'Demonstração do CRM AutoGenius');
    var barra = el('div', 'vt-m-barra');
    var voltar = el('button', 'vt-m-voltar', '← Voltar ao site'); voltar.type = 'button'; voltar.addEventListener('click', fechar);
    var abas = el('div', 'vt-m-abas'); abas.setAttribute('role', 'tablist');
    Object.keys(ROTULO).forEach(function (k) {
      var b = el('button', '', ROTULO[k]); b.type = 'button'; b.setAttribute('role', 'tab'); b.setAttribute('data-k', k);
      b.addEventListener('click', function () { selecionar(k); carregarDemo(k); }); abas.appendChild(b);
    });
    var cta = el('a', 'btn vt-m-cta', 'Quero isso na minha empresa'); cta.href = '#agendar'; cta.setAttribute('data-agendar', 'atendimento');
    cta.addEventListener('click', fechar);
    barra.appendChild(voltar); barra.appendChild(abas); barra.appendChild(cta);
    var corpo = el('div', 'vt-m-corpo');
    var aviso = el('p', 'vt-m-aviso', 'Demonstração com dados fictícios · clique, abra conversas, arraste os cards do funil');
    modal.appendChild(barra); modal.appendChild(aviso); modal.appendChild(corpo);
    modal.addEventListener('keydown', function (e) { if (e.key === 'Escape') fechar(); });
    document.body.appendChild(modal);
  }
  function carregarDemo(k) {
    var corpo = modal.querySelector('.vt-m-corpo');
    if (!frames[k]) {
      var f = el('iframe'); f.src = '/demo/' + k + '.html'; f.title = 'CRM AutoGenius para ' + NOMES[k];
      corpo.appendChild(f); frames[k] = f;
    }
    Object.keys(frames).forEach(function (n) { frames[n].hidden = n !== k; });
    modal.querySelectorAll('.vt-m-abas button').forEach(function (b) { b.setAttribute('aria-selected', b.getAttribute('data-k') === k); });
  }
  function abrir() {
    if (!modal) montar();
    ultimoFoco = document.activeElement;
    carregarDemo(atual);
    document.documentElement.classList.add('vt-modal-aberto');
    requestAnimationFrame(function () { modal.classList.add('on'); });
    modal.querySelector('.vt-m-voltar').focus({ preventScroll: true });
    if (window.gtag) gtag('event', 'demo_aberta', { segmento: atual });
  }
  function fechar() {
    if (!modal) return;
    modal.classList.remove('on');
    document.documentElement.classList.remove('vt-modal-aberto');
    if (ultimoFoco && ultimoFoco.focus) ultimoFoco.focus({ preventScroll: true });
  }
  function selecionar(k) {
    atual = k;
    cheia.href = '/demo/' + k + '.html';
    foto.src = '/image/v3/demo-' + k + '.jpg';
    foto.alt = 'Tela do CRM AutoGenius para ' + NOMES[k] + ': conversas no WhatsApp com a IA respondendo';
    document.querySelectorAll('.vt-abas button').forEach(function (x) { x.setAttribute('aria-selected', x.getAttribute('data-demo') === k); });
  }
  usar.addEventListener('click', abrir);
  document.querySelectorAll('[data-abrir-demo]').forEach(function (b) { b.addEventListener('click', abrir); });
  document.querySelectorAll('.vt-abas button').forEach(function (b) {
    b.addEventListener('click', function () { selecionar(b.getAttribute('data-demo')); });
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && modal && modal.classList.contains('on')) fechar(); });
})();
