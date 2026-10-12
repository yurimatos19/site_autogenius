/* AutoGenius — widget de WhatsApp com formulário por produto.
   Adaptado do front-end do Forza WhatsApp Widget para site estático:
   sem WordPress, sem roteamento por região e sem salvar lead em servidor.
   O lead responde 3 ou 4 perguntas e cai no WhatsApp com a mensagem pronta.

   Abrir por botões da página:
     href="#ag-abrir" · href="#ag-abrir-trafego" · data-ag-open="whatsapp"
   Aba inicial da página: <body data-ag-linha="trafego"> ou ?ag=trafego na URL. */
(function () {
  'use strict';
  if (window.__agWidget) return;
  window.__agWidget = true;

  var NUMERO = '5581991471765';

  var SEGMENTO = { key: 'segmento', label: 'Qual é o segmento da sua empresa?', msgLabel: 'Segmento', kind: 'select', options: ['Clínica / saúde', 'Imobiliária', 'Concessionária / veículos', 'Escola / curso', 'Varejo / e-commerce', 'Serviços', 'Outro'] };
  var INVESTIMENTO = { key: 'investimento', label: 'Quanto investe por mês em anúncios?', msgLabel: 'Investimento mensal em anúncios', kind: 'select', options: ['Até R$ 3 mil', 'R$ 3 mil a R$ 10 mil', 'R$ 10 mil a R$ 50 mil', 'Mais de R$ 50 mil', 'Ainda não invisto'] };
  var NOME = { key: 'nome', label: 'Seu nome', msgLabel: 'Nome', kind: 'text', placeholder: 'Como podemos te chamar?' };
  var TELEFONE = { key: 'telefone', label: 'WhatsApp', kind: 'phone' };

  var LINHAS = [
    {
      id: 'whatsapp', label: 'WhatsApp', nome: 'Agente de IA para WhatsApp',
      intro: 'Oi! Aqui é da AutoGenius 👋 Me conta rapidinho sobre sua empresa que um especialista já te chama no WhatsApp.',
      fields: [SEGMENTO,
        { key: 'volume', label: 'Quantos contatos chegam por mês no WhatsApp?', msgLabel: 'Contatos por mês', kind: 'select', options: ['Até 100', '100 a 500', '500 a 2.000', 'Mais de 2.000'] },
        NOME, TELEFONE]
    },
    {
      id: 'trafego', label: 'Tráfego pago', nome: 'AutoGenius Ads AI',
      intro: 'Oi! Aqui é da AutoGenius 👋 Algumas perguntas sobre seus anúncios e a gente te mostra o que a IA enxerga na sua conta.',
      fields: [INVESTIMENTO,
        { key: 'gestao', label: 'Quem cuida das campanhas hoje?', msgLabel: 'Quem cuida das campanhas', kind: 'select', options: ['Eu mesmo', 'Gestor de tráfego / freelancer', 'Agência', 'Ninguém ainda'] },
        NOME, TELEFONE]
    },
    {
      id: 'combo', label: 'Os dois', nome: 'Tráfego + Atendimento',
      intro: 'Oi! Aqui é da AutoGenius 👋 Da campanha até a conversa com o cliente. Me conta um pouco da sua operação:',
      fields: [SEGMENTO, INVESTIMENTO, NOME, TELEFONE]
    }
  ];

  var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function digits(s) { return String(s || '').replace(/\D/g, ''); }
  function uuid() { return (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : Date.now() + '-' + Math.random().toString(16).slice(2); }
  function isMobile() { return window.innerWidth < 640; }
  function achar(id) { return id && LINHAS.some(function (l) { return l.id === id; }) ? id : null; }
  function h(tag, attrs, children) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v == null || v === false) return;
      if (k === 'class') e.className = v;
      else if (k === 'text') e.textContent = v;
      else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), v);
      else if (v === true) e.setAttribute(k, '');
      else e.setAttribute(k, v);
    });
    (children || []).forEach(function (c) { if (c) e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return e;
  }
  // Ícones montados pelo DOM: nada de HTML em string.
  var NS = 'http://www.w3.org/2000/svg';
  function icone(d) {
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    var p = document.createElementNS(NS, 'path');
    p.setAttribute('d', d);
    svg.appendChild(p);
    return svg;
  }
  var WA = 'M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.8-1.4.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.1.6 2.8.5a2.4 2.4 0 0 0 1.6-1.1 2 2 0 0 0 .1-1.1c0-.1-.2-.2-.5-.3z';

  // UTMs guardadas na sessão para irem junto no evento de lead
  var UTM = (function () {
    var keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'gclid', 'fbclid'], out = {}, has = false;
    try {
      var q = new URLSearchParams(location.search);
      keys.forEach(function (k) { var v = q.get(k); if (v) { out[k] = v; has = true; } });
      if (has) sessionStorage.setItem('ag_utm', JSON.stringify(out));
      else out = JSON.parse(sessionStorage.getItem('ag_utm') || '{}');
    } catch (e) { }
    return out;
  })();

  var S = { open: false, linha: LINHAS[0].id, started: false };
  function linhaAtual() { return LINHAS.filter(function (l) { return l.id === S.linha; })[0]; }

  /* ── Rastreamento: dataLayer sempre; GA4 e Pixel quando existem na página.
     Nome e telefone nunca vão para o dataLayer. */
  var MAPA = {
    ag_widget_open: { ga4: 'widget_open' },
    ag_linha_select: { ga4: 'select_content' },
    ag_form_start: { ga4: 'form_start' },
    ag_form_submit: { ga4: 'generate_lead', meta: 'Lead' },
    ag_whatsapp_redirect: { ga4: 'whatsapp_redirect', meta: 'Contact' }
  };
  function track(name, extra) {
    var l = linhaAtual(), id = uuid(), m = MAPA[name];
    var p = { linha: l.id, linha_nome: l.nome, dispositivo: isMobile() ? 'mobile' : 'desktop', page_path: location.pathname };
    Object.keys(extra || {}).forEach(function (k) { p[k] = extra[k]; });
    var ev = { event: name, event_id: id };
    Object.keys(p).forEach(function (k) { ev[k] = p[k]; });
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(ev);
    if (m && window.gtag) window.gtag('event', m.ga4, p);
    if (m && m.meta && window.fbq) window.fbq('track', m.meta, { content_name: l.nome }, { eventID: id });
    return id;
  }

  /* ── DOM ── */
  var root = h('div', { class: 'agw' });
  var fab = h('button', { class: 'agw-fab', type: 'button', 'aria-label': 'Falar com um especialista no WhatsApp', 'aria-expanded': 'false', onclick: function () { toggle(); } },
    [icone(WA), h('span', { class: 'agw-fab-txt', text: 'Fale com um especialista' })]);

  var tabs = h('div', { class: 'agw-tabs', role: 'tablist', 'aria-label': 'Produto de interesse' });
  var scroll = h('div', { class: 'agw-scroll' });
  var fechar = h('button', { class: 'agw-close', type: 'button', 'aria-label': 'Fechar', onclick: function () { toggle(false); } }, [icone('M6 6l12 12M18 6L6 18')]);
  var panel = h('div', { class: 'agw-panel', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Falar com a AutoGenius no WhatsApp', hidden: true }, [
    h('div', { class: 'agw-head' }, [
      h('div', { class: 'agw-av', text: 'AG' }),
      h('div', { class: 'agw-head-txt' }, [h('div', { class: 'agw-nome', text: 'AutoGenius AI' }), h('div', { class: 'agw-status', text: 'Online · responde em minutos' })]),
      fechar
    ]),
    h('div', { class: 'agw-tabs-wrap' }, [h('div', { class: 'agw-tabs-title', text: 'Qual IA te interessa?' }), tabs]),
    scroll
  ]);
  root.appendChild(panel);
  /* Páginas que já têm barra fixa de WhatsApp (as landing pages por
     segmento) pedem data-ag-fab="nao": lá o widget só é aberto pelos
     botões da própria página, sem um segundo botão flutuante por cima. */
  if (document.body.getAttribute('data-ag-fab') !== 'nao') root.appendChild(fab);

  function renderTabs() {
    tabs.replaceChildren();
    LINHAS.forEach(function (l) {
      tabs.appendChild(h('button', {
        class: 'agw-tab', type: 'button', role: 'tab', 'aria-selected': l.id === S.linha ? 'true' : 'false', text: l.label,
        onclick: function () { selecionar(l.id, true); }
      }));
    });
  }
  function selecionar(id, porClique) {
    var mudou = id !== S.linha;
    S.linha = id; S.started = false;
    if (porClique && mudou) track('ag_linha_select');
    renderTabs(); renderForm();
  }

  var form, okEl;
  function renderForm() {
    var l = linhaAtual();
    scroll.replaceChildren();
    okEl = null;
    scroll.appendChild(h('div', { class: 'agw-intro', text: l.intro }));
    form = h('form', { class: 'agw-form', onsubmit: onSubmit });
    l.fields.forEach(function (f) {
      var id = 'agw-' + l.id + '-' + f.key;
      var wrap = h('div', { class: 'agw-field' }, [h('label', { class: 'agw-label', text: f.label, for: id })]);
      if (f.kind === 'select') {
        var sel = h('select', { class: 'agw-input agw-select', name: f.key, id: id, required: true }, [h('option', { value: '', text: 'Selecione' })]);
        f.options.forEach(function (o) { sel.appendChild(h('option', { value: o, text: o })); });
        var outro = h('input', { class: 'agw-input agw-outro', type: 'text', name: f.key + '_outro', placeholder: 'Qual?', hidden: true, 'aria-label': 'Qual?' });
        sel.addEventListener('change', function () { var on = sel.value === 'Outro'; outro.hidden = !on; outro.required = on; if (on) outro.focus(); });
        wrap.appendChild(sel); wrap.appendChild(outro);
      } else if (f.kind === 'phone') {
        var tel = h('input', { class: 'agw-input', type: 'tel', name: f.key, id: id, placeholder: 'DDD + número', required: true, inputmode: 'numeric', autocomplete: 'tel-national' });
        tel.addEventListener('input', function () {
          var d = digits(tel.value).slice(0, 11), out = d, cut = d.length === 11 ? 7 : 6;
          if (d.length > 2) out = '(' + d.slice(0, 2) + ') ' + d.slice(2);
          if (d.length > 7) out = '(' + d.slice(0, 2) + ') ' + d.slice(2, cut) + '-' + d.slice(cut);
          tel.value = out;
          tel.setCustomValidity(d.length && (d.length < 10 || d.length > 11) ? 'Informe DDD + número (10 ou 11 dígitos).' : '');
        });
        wrap.appendChild(h('div', { class: 'agw-phone' }, [h('span', { class: 'agw-ddi', text: '+55' }), tel]));
      } else {
        wrap.appendChild(h('input', { class: 'agw-input', type: 'text', name: f.key, id: id, placeholder: f.placeholder || '', required: true, autocomplete: f.key === 'nome' ? 'name' : 'on' }));
      }
      form.appendChild(wrap);
    });
    form.appendChild(h('input', { class: 'agw-hp', type: 'text', name: 'website', tabindex: '-1', autocomplete: 'off', 'aria-hidden': 'true' }));
    form.appendChild(h('button', { class: 'agw-submit', type: 'submit' }, [icone(WA), h('span', { text: 'Continuar no WhatsApp' })]));
    form.appendChild(h('p', { class: 'agw-nota', text: 'Seus dados só são usados para falarmos com você.' }));
    form.addEventListener('focusin', function (e) { if (!S.started && e.target.name) { S.started = true; track('ag_form_start'); } });
    scroll.appendChild(form);
  }

  function onSubmit(e) {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    var fd = new FormData(form);
    if (fd.get('website')) return; // honeypot
    var l = linhaAtual(), linhas = [], dados = {}, nome = '';
    l.fields.forEach(function (f) {
      var v = String(fd.get(f.key) || '').trim(); if (!v) return;
      if (f.kind === 'select' && v === 'Outro') { var o = String(fd.get(f.key + '_outro') || '').trim(); if (o) v = 'Outro (' + o + ')'; }
      if (f.kind === 'phone') v = '+55 ' + v;
      if (f.kind === 'select') dados[f.key] = v;
      if (f.key === 'nome') nome = v;
      linhas.push((f.msgLabel || f.label) + ': ' + v);
    });
    var msg = 'Olá! Vim pelo site da AutoGenius e tenho interesse em: ' + l.nome + '.\n\n' + linhas.join('\n');
    var link = 'https://wa.me/' + NUMERO + '?text=' + encodeURIComponent(msg);

    Object.keys(UTM).forEach(function (k) { dados[k] = UTM[k]; });
    track('ag_form_submit', dados);
    var w = window.open(link, '_blank');
    track('ag_whatsapp_redirect', { popup_bloqueado: !w });

    if (okEl) okEl.remove();
    okEl = h('div', { class: 'agw-ok', role: 'status' }, [
      (nome ? nome.split(' ')[0] + ', abrimos' : 'Abrimos') + ' seu WhatsApp com a mensagem pronta. ',
      h('a', { href: link, target: '_blank', rel: 'noopener', 'data-ag-direct': true, text: 'Não abriu? Toque aqui.' })
    ]);
    form.appendChild(okEl);
    if (!w) location.href = link;
  }

  /* ── Abrir / fechar ── */
  var lastFocus = null;
  function toggle(force, origem) {
    var abrir = typeof force === 'boolean' ? force : !S.open;
    if (abrir === S.open) return;
    S.open = abrir;
    panel.hidden = !abrir;
    root.classList.toggle('agw--open', abrir);
    fab.setAttribute('aria-expanded', abrir ? 'true' : 'false');
    document.documentElement.classList.toggle('agw-lock', abrir && isMobile());
    if (abrir) {
      lastFocus = document.activeElement;
      track('ag_widget_open', origem ? { origem: origem } : {});
      if (!isMobile()) { var t = panel.querySelector('.agw-tab[aria-selected="true"]'); if (t) t.focus(); }
    } else if (lastFocus && lastFocus.focus) {
      lastFocus.focus();
    }
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && S.open) toggle(false); });

  /* Qual aba abrir a partir do botão clicado: o que a página declarar,
     senão o que o texto do botão ou da mensagem indicar. */
  function linhaDoBotao(a) {
    var id = a.getAttribute('data-ag-open') || ((a.getAttribute('href') || '').match(/^#ag-abrir-([\w-]+)/) || [])[1];
    if (achar(id)) return id;
    if (achar(document.body.getAttribute('data-ag-linha'))) return document.body.getAttribute('data-ag-linha');
    var texto = ((a.textContent || '') + ' ' + (a.getAttribute('href') || '')).toLowerCase();
    if (/tr[áa]fego|ads%20ai|ads ai|campanha|an[úu]ncio/.test(decodeURIComponent(texto))) return 'trafego';
    return null;
  }

  document.addEventListener('click', function (e) {
    if (!e.target.closest) return;
    // 1) botões que pedem o widget explicitamente
    var a = e.target.closest('a[href^="#ag-abrir"], [data-ag-open]');
    // 2) todo link para o WhatsApp da empresa passa a abrir o widget.
    //    O href continua valendo: sem JavaScript, o botão abre o WhatsApp
    //    direto, como antes. data-ag-direct escapa da regra, e o WhatsApp
    //    pessoal do fundador (outro número) nunca é interceptado.
    if (!a) {
      var link = e.target.closest('a[href*="wa.me/"]');
      if (link && !link.hasAttribute('data-ag-direct') && link.href.indexOf(NUMERO) > -1) a = link;
    }
    if (!a) return;
    e.preventDefault();
    var id = linhaDoBotao(a);
    if (id && id !== S.linha) selecionar(id, true);
    toggle(true, 'cta');
  });

  function iniciar() {
    var q = null; try { q = new URLSearchParams(location.search).get('ag'); } catch (e) { }
    var hm = (location.hash || '').match(/^#ag-abrir-([\w-]+)/);
    S.linha = achar(q) || achar(hm && hm[1]) || achar(document.body.getAttribute('data-ag-linha')) || LINHAS[0].id;
    renderTabs(); renderForm();
    document.body.appendChild(root);
    if (calm) root.classList.add('agw--pronto');
    else setTimeout(function () { root.classList.add('agw--pronto'); }, 900);
    if (/^#ag-abrir/.test(location.hash)) toggle(true, 'link');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
