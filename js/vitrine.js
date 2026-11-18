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
  var SEG = {
    carros: ['Concessionárias', 'A IA responde o lead do anúncio em segundos, avalia o carro na troca, simula o financiamento e agenda o test-drive.', ['Estoque com fotos', 'Funil de vendas com arrastar e soltar', 'Simulação de financiamento', 'Test-drive direto na agenda'], 'Vendedor de concessionária usando o CRM AutoGenius com o cliente: a IA já qualificou o lead e simulou o financiamento'],
    imoveis: ['Imobiliárias', 'Responde os portais na hora, qualifica orçamento e bairro, envia as opções certas com foto e preço e agenda a visita.', ['Carteira de imóveis', 'Visitas na agenda', 'Propostas', 'Acompanhamento de cada lead'], 'Corretora mostrando no tablet o CRM AutoGenius com as opções de imóveis enviadas pela IA'],
    clinicas: ['Clínicas', 'Agenda direto no sistema, confirma as consultas, faz a triagem de convênio e chama o paciente para o retorno.', ['Agenda real', 'Ficha de pacientes', 'Confirmação de consultas', 'Retornos e convênios'], 'Recepcionista de clínica atendendo uma paciente com o CRM AutoGenius aberto no monitor'],
    escolas: ['Escolas', 'Atende as famílias na hora da decisão, informa valores, marca a visita e cuida da rematrícula e da cobrança.', ['Famílias e alunos', 'Matrículas e rematrículas', 'Controle de inadimplência', 'Venda de atividades extras'], 'Secretária de escola atendendo mãe e filho com o CRM AutoGenius aberto no monitor'],
    alimentacao: ['Restaurantes e delivery', 'Fecha o pedido no WhatsApp sem atendente, cuida das reservas e chama de volta o cliente que sumiu.', ['Pedido no WhatsApp', 'Reservas e mesas', 'Margem por prato', 'Reativação de clientes sumidos'], 'Dono de restaurante conferindo no tablet os pedidos fechados pela IA no WhatsApp']
  };
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
    var d = SEG[k];
    foto.src = '/image/v3/cena-' + k + '.jpg'; foto.alt = d[3];
    $('#vt-seg-t').textContent = d[0]; $('#vt-seg-p').textContent = d[1];
    var ul = $('#vt-seg-l'); ul.replaceChildren(); d[2].forEach(function (x) { var li = document.createElement('li'); li.textContent = x; ul.appendChild(li); });
    palco.classList.remove('troca'); void palco.offsetWidth; palco.classList.add('troca');
    document.querySelectorAll('.vt-abas button').forEach(function (x) { x.setAttribute('aria-selected', x.getAttribute('data-demo') === k); });
  }
  usar.addEventListener('click', abrir);
  document.querySelectorAll('[data-abrir-demo]').forEach(function (b) { b.addEventListener('click', abrir); });
  document.querySelectorAll('.vt-abas button').forEach(function (b) {
    b.addEventListener('click', function () { selecionar(b.getAttribute('data-demo')); });
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && modal && modal.classList.contains('on')) fechar(); });
})();
