/* MotoGenius — demo interativa no celular do hero.
   O visitante conversa como se fosse o cliente: escolhe a moto, "envia" dados
   de exemplo (já mascarados, nada é digitado nem enviado a lugar nenhum),
   escolhe a entrada e vê a IA simular nos bancos e mandar o card ao vendedor.
   Com movimento reduzido, as mensagens aparecem sem as pausas. */
(function () {
  'use strict';
  var demo = document.querySelector('[data-demo]');
  if (!demo) return;
  var corpo = demo.querySelector('.demo-corpo');
  var resp = demo.querySelector('.demo-resp');
  var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var rodada = 0;

  function hora(min) { return '23:' + String(47 + min).padStart(2, '0'); }
  function esperar(ms, r) {
    return new Promise(function (ok, nao) { setTimeout(function () { r === rodada ? ok() : nao('reiniciou'); }, calm ? 0 : ms); });
  }
  function rolar() { corpo.scrollTop = corpo.scrollHeight; }
  function bolha(classe, html) {
    var d = document.createElement('div');
    d.className = 'msg ' + classe;
    d.innerHTML = html;
    corpo.appendChild(d); rolar();
    return d;
  }
  function digitando(r, ms) {
    var d = bolha('ia digitando', '<i></i><i></i><i></i>');
    return esperar(ms || 1100, r).then(function () { d.remove(); }, function (e) { d.remove(); throw e; });
  }
  function ia(r, html, min, ms) {
    return digitando(r, ms).then(function () { bolha('ia', html + '<span class="h">' + hora(min) + '</span>'); });
  }
  function cliente(html, min) { bolha('ele', html + '<span class="h">' + hora(min) + '</span>'); }
  function opcoes(r, lista) {
    resp.innerHTML = '';
    return new Promise(function (ok, nao) {
      lista.forEach(function (t) {
        var b = document.createElement('button');
        b.type = 'button'; b.textContent = t;
        b.addEventListener('click', function () {
          resp.innerHTML = '';
          if (r !== rodada) return nao('reiniciou');
          ok(t);
        });
        resp.appendChild(b);
      });
    });
  }

  function bancos(r) {
    var nomes = ['Banco A', 'Banco B', 'Banco C', 'Banco D'], res = [0, 1, 1, 0];
    var d = bolha('ia bancos', '<b>Simulando em 4 bancos</b>' + nomes.map(function (n) {
      return '<span class="bk"><em>' + n + '</em><i class="st">analisando…</i></span>';
    }).join(''));
    var linhas = d.querySelectorAll('.st');
    var p = Promise.resolve();
    linhas.forEach(function (st, i) {
      p = p.then(function () { return esperar(650, r); }).then(function () {
        st.textContent = res[i] ? 'pré-aprovado' : 'recusado';
        st.className = 'st ' + (res[i] ? 'ok' : 'nao');
      });
    });
    return p;
  }

  function conversa() {
    var r = ++rodada, moto;
    corpo.innerHTML = ''; resp.innerHTML = '';
    return esperar(500, r)
      .then(function () { cliente('Boa noite! Quanto tá a Bros? Dá pra financiar?', 0); })
      .then(function () { return ia(r, 'Boa noite! 🏍️ Nessa pegada tenho 3 modelos. Qual te interessa mais?', 0); })
      .then(function () { return opcoes(r, ['SHI 175 EFI', 'Jet 50', 'Worker 125']); })
      .then(function (m) { moto = m; cliente(m, 1); })
      .then(function () { return ia(r, 'Boa escolha! Te mando o vídeo da ' + moto + ' e já vejo o financiamento pra você.', 1); })
      .then(function () { bolha('ia video', '<span class="play" aria-hidden="true"></span><span><b>' + moto + '</b><small>vídeo · 0:42</small></span>'); return esperar(500, r); })
      .then(function () { return ia(r, 'Pra simular, preciso de:<br>✅ CPF<br>✅ Data de nascimento<br>✅ Tem CNH?', 1); })
      .then(function () { return opcoes(r, ['Enviar dados de exemplo']); })
      .then(function () { cliente('***.456.789-** · 15/06/1996 · tenho CNH', 2); })
      .then(function () { return ia(r, 'Obrigado! E vai dar entrada?', 2, 800); })
      .then(function () { return opcoes(r, ['Sem entrada', 'Dou R$ 2 mil']); })
      .then(function (e) { cliente(e, 3); })
      .then(function () { return ia(r, 'Perfeito! Já estou simulando nos bancos, um minutinho. 👊', 3, 800); })
      .then(function () { return bancos(r); })
      .then(function () { return esperar(400, r); })
      .then(function () { return ia(r, '<b class="aprov">Crédito pré-aprovado ✅</b>Boa notícia: a ' + moto + ' cabe no seu bolso! Amanhã cedo o vendedor te liga pra fechar.', 7); })
      .then(function () { return esperar(500, r); })
      .then(function () { bolha('sistema', 'Card enviado ao vendedor · CRM'); demo.classList.add('fechou'); })
      .then(function () { return opcoes(r, ['Conversar de novo ↺']); })
      .then(function () { demo.classList.remove('fechou'); conversa(); })
      .catch(function () { /* reiniciado: a rodada nova assume */ });
  }

  if (calm || !('IntersectionObserver' in window)) { conversa(); return; }
  var obs = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { conversa(); obs.disconnect(); } });
  }, { threshold: .3 });
  obs.observe(demo);
})();
