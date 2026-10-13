/* AutoGenius — comportamento compartilhado do site (out/2026).
   · cabeçalho que ganha fundo ao rolar e menu do celular
   · revelação no scroll
   · painel "Agendar uma conversa": formulário curto que termina no
     WhatsApp com a mensagem pronta

   Abrir o painel: href="#agendar", data-agendar="" ou data-agendar="<interesse>".
   Todo link para o WhatsApp da empresa também abre o painel — o href
   continua no HTML, então sem JavaScript o botão vai direto ao WhatsApp. */
(function () {
  'use strict';
  document.documentElement.classList.add('js');

  var NUMERO = '5581991471765';
  var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function h(tag, attrs, filhos) {
    var e = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      var v = attrs[k];
      if (v == null || v === false) return;
      if (k === 'class') e.className = v;
      else if (k === 'text') e.textContent = v;
      else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v === true ? '' : v);
    });
    (filhos || []).forEach(function (c) { if (c) e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return e;
  }
  var NS = 'http://www.w3.org/2000/svg';
  function icone(d) {
    var s = document.createElementNS(NS, 'svg'); s.setAttribute('viewBox', '0 0 16 16'); s.setAttribute('aria-hidden', 'true');
    var p = document.createElementNS(NS, 'path'); p.setAttribute('d', d); s.appendChild(p); return s;
  }

  /* ── Cabeçalho e menu ── */
  function iniciarTopo() {
    var topo = document.querySelector('.topo');
    if (topo) {
      var marca = function () { topo.classList.toggle('rolou', window.scrollY > 24); };
      marca(); window.addEventListener('scroll', marca, { passive: true });
    }
    var burger = document.querySelector('.burger');
    if (burger) burger.addEventListener('click', function () {
      var aberto = document.documentElement.classList.toggle('menu-aberto');
      burger.setAttribute('aria-expanded', aberto ? 'true' : 'false');
    });
    document.querySelectorAll('.gaveta a').forEach(function (a) {
      a.addEventListener('click', function () { document.documentElement.classList.remove('menu-aberto'); });
    });
  }

  /* ── Revelação ── */
  function iniciarRevelacao() {
    var alvos = document.querySelectorAll('.rv');
    if (calm || !('IntersectionObserver' in window)) { alvos.forEach(function (e) { e.classList.add('in'); }); return; }
    var obs = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    alvos.forEach(function (e) { obs.observe(e); });
  }

  /* ── Rastreamento: nome, empresa e telefone nunca vão para o dataLayer ── */
  function track(nome, extra) {
    var ev = { event: nome };
    Object.keys(extra || {}).forEach(function (k) { ev[k] = extra[k]; });
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(ev);
    var ga = { ag_agendar_abrir: 'agendar_open', ag_agendar_enviar: 'generate_lead' }[nome];
    if (ga && window.gtag) window.gtag('event', ga, extra || {});
    if (nome === 'ag_agendar_enviar' && window.fbq) window.fbq('track', 'Lead', { content_name: extra && extra.interesse });
  }

  /* ── Painel Agendar ── */
  var INTERESSES = [
    ['raiox', 'Raio-X de IA'],
    ['implantacao', 'Implantação de IA'],
    ['atendimento', 'Agente de atendimento'],
    ['trafego', 'IA para tráfego pago'],
    ['palestra', 'Palestra ou formação']
  ];
  var painel, form, okEl, ultimoFoco;

  function chips(nome, opcoes, rotulo) {
    return h('fieldset', { class: 'ag-campo', style: 'border:0' }, [
      h('legend', { class: 'ag-campo-leg', text: rotulo, style: 'font-size:13px;color:var(--ink-2);margin-bottom:10px' }),
      h('div', { class: 'ag-chips' }, opcoes.map(function (o) {
        var valor = Array.isArray(o) ? o[0] : o, txt = Array.isArray(o) ? o[1] : o;
        return h('label', {}, [h('input', { type: 'radio', name: nome, value: valor, required: true }), h('span', { text: txt })]);
      }))
    ]);
  }
  function campo(id, rotulo, attrs) {
    attrs.id = id; attrs.class = 'ag-in';
    return h('div', { class: 'ag-campo' }, [h('label', { for: id, text: rotulo }), h('input', attrs)]);
  }

  function montarPainel() {
    var tel = h('input', { id: 'ag-tel', class: 'ag-in', type: 'tel', name: 'telefone', required: true, inputmode: 'numeric', autocomplete: 'tel-national', placeholder: '(81) 99999-0000' });
    tel.addEventListener('input', function () {
      var d = tel.value.replace(/\D/g, '').slice(0, 11), out = d, cut = d.length === 11 ? 7 : 6;
      if (d.length > 2) out = '(' + d.slice(0, 2) + ') ' + d.slice(2);
      if (d.length > 7) out = '(' + d.slice(0, 2) + ') ' + d.slice(2, cut) + '-' + d.slice(cut);
      tel.value = out;
      tel.setCustomValidity(d.length && (d.length < 10 || d.length > 11) ? 'Informe DDD + número.' : '');
    });

    form = h('form', { class: 'ag-form', onsubmit: enviar }, [
      chips('interesse', INTERESSES, 'Sobre o que você quer conversar?'),
      campo('ag-nome', 'Seu nome', { name: 'nome', required: true, autocomplete: 'name', placeholder: 'Nome e sobrenome' }),
      campo('ag-empresa', 'Empresa e cargo', { name: 'empresa', required: true, autocomplete: 'organization', placeholder: 'Ex.: Grupo Exemplo · Diretor de operações' }),
      h('div', { class: 'ag-campo' }, [h('label', { for: 'ag-tel', text: 'WhatsApp' }), h('div', { class: 'ag-tel' }, [h('span', { text: '+55' }), tel])]),
      h('input', { class: 'ag-hp', type: 'text', name: 'website', tabindex: '-1', autocomplete: 'off', 'aria-hidden': 'true' }),
      h('button', { class: 'btn ag-enviar', type: 'submit' }, ['Continuar no WhatsApp ', h('span', { class: 'seta', 'aria-hidden': 'true', text: '→' })]),
      h('p', { class: 'ag-nota', text: 'A conversa continua no WhatsApp, com a sua mensagem pronta.' })
    ]);

    var fechar = h('button', { class: 'ag-fechar', type: 'button', 'aria-label': 'Fechar', onclick: function () { alternar(false); } }, [icone('M3 3l10 10M13 3L3 13')]);
    fechar.querySelector('path').setAttribute('stroke-linecap', 'round');

    painel = h('div', { class: 'ag-painel', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'ag-titulo', hidden: true }, [
      h('div', { class: 'ag-cab' }, [h('span', { class: 'rotulo', text: 'Fale com a AutoGenius' }), fechar]),
      h('div', { class: 'ag-corpo' }, [
        h('h2', { id: 'ag-titulo' }, ['Vamos ', h('span', { class: 'g', text: 'conversar.' })]),
        h('p', { text: 'Conte quem você é e o que quer resolver. Em seguida a conversa continua no WhatsApp, direto comigo.' }),
        h('div', { class: 'ag-yuri' }, [
          h('img', { src: '/image/v2/yuri-busto.jpg', alt: 'Yuri Matos', width: '64', height: '80' }),
          h('div', {}, [h('b', { text: 'Yuri Matos' }), h('span', { text: 'Fundador da AutoGenius · conduz cada Raio-X' })])
        ]),
        form
      ])
    ]);
    var veu = h('div', { class: 'ag-veu', onclick: function () { alternar(false); } });
    document.body.appendChild(veu);
    document.body.appendChild(painel);
  }

  function alternar(abrir, interesse) {
    if (!painel) montarPainel();
    var aberto = document.documentElement.classList.contains('ag-aberto');
    if (abrir === aberto) return;
    if (abrir) {
      ultimoFoco = document.activeElement;
      painel.hidden = false;
      // força o layout antes da transição para o painel deslizar
      void painel.offsetWidth;
      document.documentElement.classList.add('ag-aberto');
      if (interesse) { var r = form.querySelector('input[name="interesse"][value="' + interesse + '"]'); if (r) r.checked = true; }
      track('ag_agendar_abrir', { interesse: interesse || '', page_path: location.pathname });
      setTimeout(function () {
        var alvo = form.querySelector('input[name="interesse"]:checked') ? form.querySelector('#ag-nome') : form.querySelector('input[name="interesse"]');
        if (alvo && window.innerWidth > 640) alvo.focus();
      }, 450);
    } else {
      document.documentElement.classList.remove('ag-aberto');
      setTimeout(function () { if (!document.documentElement.classList.contains('ag-aberto')) painel.hidden = true; }, 600);
      if (ultimoFoco && ultimoFoco.focus) ultimoFoco.focus();
    }
  }

  function enviar(e) {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    var fd = new FormData(form);
    if (fd.get('website')) return;
    var v = function (k) { return String(fd.get(k) || '').trim(); };
    var interesse = (INTERESSES.filter(function (i) { return i[0] === v('interesse'); })[0] || ['', v('interesse')])[1];
    var msg = [
      'Olá, Yuri! Vim pelo site da AutoGenius.',
      '',
      'Assunto: ' + interesse,
      document.body.getAttribute('data-segmento') ? 'Segmento: ' + document.body.getAttribute('data-segmento') : null,
      'Nome: ' + v('nome'),
      'Empresa e cargo: ' + v('empresa'),
      'WhatsApp: +55 ' + v('telefone')
    ].filter(function (l) { return l !== null; }).join('\n');
    var link = 'https://wa.me/' + NUMERO + '?text=' + encodeURIComponent(msg);
    track('ag_agendar_enviar', { interesse: v('interesse'), page_path: location.pathname });
    var w = window.open(link, '_blank');
    if (okEl) okEl.remove();
    okEl = h('div', { class: 'ag-ok', role: 'status' }, [
      v('nome').split(' ')[0] + ', abrimos o WhatsApp com a sua mensagem pronta. ',
      h('a', { href: link, target: '_blank', rel: 'noopener', 'data-direto': true, text: 'Não abriu? Toque aqui.' })
    ]);
    form.appendChild(okEl);
    if (!w) location.href = link;
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { alternar(false); document.documentElement.classList.remove('menu-aberto'); }
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest) return;
    var a = e.target.closest('a[href="#agendar"], [data-agendar]');
    if (!a) {
      var w = e.target.closest('a[href*="wa.me/"]');
      if (w && !w.hasAttribute('data-direto') && w.href.indexOf(NUMERO) > -1) a = w;
    }
    if (!a) return;
    e.preventDefault();
    document.documentElement.classList.remove('menu-aberto');
    alternar(true, a.getAttribute('data-agendar') || document.body.getAttribute('data-assunto') || '');
  });

  function iniciar() {
    iniciarTopo(); iniciarRevelacao();
    if (location.hash === '#agendar') alternar(true);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
