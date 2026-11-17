/* AutoGenius — nova home (prévia): régua do Raio-X, aprovação da Ads AI e conversa do pedido. Depende de /js/ag.js (painel, vídeo, revelação)
   e de GSAP + ScrollTrigger (régua do Raio-X e antes/depois). Sem GSAP, tudo aparece no estado final. */
(function () {
  'use strict';
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var largo = function () { return window.matchMedia('(min-width: 768px)').matches; };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function push(ev, extra) { window.dataLayer = window.dataLayer || []; var o = { event: ev }; for (var k in extra) o[k] = extra[k]; window.dataLayer.push(o); }
  function agora() { var d = new Date(); return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); }

  /* ── 1. console do hero: "Aprovar" vira carimbo ── */
  function carimbar(btn, onde) {
    var c = el('span', 'carimbo' + (calm ? '' : ' bate'), '✓ Aprovado por você · ' + agora());
    c.setAttribute('role', 'status');
    btn.replaceWith(c);
    push('pv_aprovar', { onde: onde });
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-aprovar]'); if (!b) return;
    var onde = b.getAttribute('data-aprovar');
    if (onde === 'ads') {
      $('#ads-al').classList.add('ok'); $('#ads-tit').textContent = 'Ajuste aplicado: anúncio 3 pausado';
      $('#ads-reg').textContent = 'Registro: verba movida para o conjunto que mais converte · motivo salvo no histórico';
    }
    carimbar(b, onde);
  });

  /* ── 3. Raio-X: a régua de 14 dias ── */
  var FASES = [
    [1, 'Entrevistas com as lideranças', 'Entendemos como cada área trabalha hoje e onde o tempo do time vai embora.'],
    [4, 'Mapa de tarefas', 'As tarefas que mais consomem horas, área por área, com quem faz e quanto tempo leva.'],
    [8, 'Três oportunidades priorizadas', 'Onde a IA paga a conta primeiro, com esforço, prazo e impacto de cada uma.'],
    [12, 'Plano de implantação', 'O que fazer primeiro, com quem e em quanto tempo. É o que você leva para a diretoria.']
  ];
  var dias = $('#rx-dias');
  for (var d = 1; d <= 14; d++) dias.appendChild(el('i', '', ('0' + d).slice(-2)));
  var ticks = $$('#rx-dias i'), fasesEl = $$('#rx-fases span'), ops = $$('#rx-ops .op');
  var diaAtual = 0;
  function mostrarDia(n) {
    if (n === diaAtual) return; diaAtual = n;
    $('#rx-n').textContent = ('0' + n).slice(-2);
    var f = FASES.filter(function (x) { return x[0] <= n; }).pop(), fi = FASES.indexOf(f);
    var fe = $('#rx-fase'); if (fe.getAttribute('data-f') != fi) { fe.setAttribute('data-f', fi); fe.firstChild.textContent = f[1]; fe.querySelector('span').textContent = f[2]; }
    ticks.forEach(function (t, i) { t.classList.toggle('on', i < n); });
    fasesEl.forEach(function (s, i) { s.classList.toggle('on', i === fi); });
    ops.forEach(function (o, i) { o.classList.toggle('on', n >= 9 + i); });
  }
  function rxFinal() { mostrarDia(14); $('#rx-prog').style.setProperty('--p', 1); }

  /* GSAP: só no desktop e sem "reduzir movimento"; no celular nada fica preso no scroll */
  function iniciarScroll() {
    if (calm || !window.gsap || !window.ScrollTrigger) { rxFinal(); return; }
    gsap.registerPlugin(ScrollTrigger);
    var mm = gsap.matchMedia();
    mm.add('(min-width: 768px)', function () {
      var st = ScrollTrigger.create({
        trigger: '#rx-palco', start: 'top 14%', end: '+=900', pin: true, scrub: true,
        onUpdate: function (s) { $('#rx-prog').style.setProperty('--p', s.progress); mostrarDia(Math.max(1, Math.min(14, Math.ceil(s.progress * 14)))); }
      });
      mostrarDia(1); $('#rx-prog').style.setProperty('--p', 0);
      return function () { st.kill(); rxFinal(); };
    });
    mm.add('(max-width: 767px)', function () { rxFinal(); });
  }
  if (document.readyState === 'complete') iniciarScroll(); else window.addEventListener('load', iniciarScroll);

  /* ── 6. monte seu pedido: três perguntas que escrevem a mensagem ── */
  var PERG = [
    ['setor', 'Olá! Sou o Yuri. Qual é o setor da sua empresa?', ['Indústria', 'Varejo e e-commerce', 'Saúde', 'Educação', 'Serviços', 'Imobiliário', 'Automotivo', 'Outro']],
    ['porte', 'E quantas pessoas trabalham aí, mais ou menos?', ['Até 50', '50 a 200', '200 a 1.000', 'Mais de 1.000']],
    ['area', 'Onde o time mais perde tempo hoje?', ['Atendimento', 'Comercial', 'Operação', 'Financeiro', 'Marketing e anúncios', 'Ainda não sei']]
  ];
  var corpo = $('#chat-corpo'), resp = {}, passo = 0, iniciado = false;
  function balao(txt, quem) { var b = el('div', 'bal ' + quem, txt); corpo.appendChild(b); return b; }
  function perguntar() {
    var p = PERG[passo];
    var dig = el('div', 'digita'); dig.setAttribute('aria-label', 'digitando'); for (var i = 0; i < 3; i++) dig.appendChild(el('i'));
    corpo.appendChild(dig);
    setTimeout(function () {
      dig.remove(); balao(p[1], 'ia');
      var op = el('div', 'opcoes');
      p[2].forEach(function (o) {
        var bt = el('button', '', o); bt.type = 'button';
        bt.addEventListener('click', function () {
          op.remove(); balao(o, 'eu'); resp[p[0]] = o; push('pv_pedido_resposta', { pergunta: p[0], resposta: o });
          atualizarMsg(); passo++;
          if (passo < PERG.length) perguntar(); else concluir();
        });
        op.appendChild(bt);
      });
      corpo.appendChild(op);
    }, calm ? 0 : 700);
  }
  function atualizarMsg() {
    var partes = [resp.setor, resp.porte && resp.porte + ' pessoas', resp.area && 'mais tempo perdido em: ' + resp.area].filter(Boolean);
    var m = $('#chat-msg'); m.textContent = '';
    m.appendChild(document.createTextNode('Quero um Raio-X de IA. ')); var b = el('b', '', partes.join(' · ')); m.appendChild(b);
    document.body.setAttribute('data-segmento', partes.join(' · '));
  }
  function concluir() {
    setTimeout(function () {
      balao('Perfeito. Toque em “Enviar pedido”, coloque seu nome e seu WhatsApp, e a mensagem vai pronta para mim.', 'ia');
      var e = $('#chat-enviar'); e.setAttribute('aria-disabled', 'false');
    }, calm ? 0 : 500);
  }
  function iniciarChat() { if (iniciado) return; iniciado = true; perguntar(); }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { iniciarChat(); io.disconnect(); } }, { threshold: .3 });
    io.observe($('#chat'));
  } else iniciarChat();
})();
