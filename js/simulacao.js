/* AutoGenius — simulação de crédito encenada (MotoGenius e concessionárias).
   Quando o painel .sim aparece na tela, cada banco "analisa" em sequência e
   devolve o resultado escrito no HTML (data-res="ok" | "nao", data-txt).
   No fim, o rodapé mostra o card indo para o vendedor. "Simular de novo"
   reinicia. Com movimento reduzido, o painel já aparece no estado final. */
(function () {
  'use strict';
  var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('.sim').forEach(function (sim) {
    var linhas = [].slice.call(sim.querySelectorAll('.sim-bancos li'));
    var estado = sim.querySelector('.sim-estado');
    var relogio = sim.querySelector('[data-relogio]');
    var botao = sim.querySelector('[data-refazer]');
    var timers = [];

    function limpar() {
      timers.forEach(clearTimeout); timers = [];
      sim.classList.remove('feito');
      estado.classList.remove('ok'); estado.textContent = 'Em análise';
      if (relogio) relogio.textContent = '0 min';
      linhas.forEach(function (li) {
        li.querySelector('.sim-barra i').style.setProperty('--p', '0%');
        var r = li.querySelector('.sim-res'); r.className = 'sim-res'; r.textContent = 'Na fila';
      });
    }

    function final(li) {
      li.querySelector('.sim-barra i').style.setProperty('--p', '100%');
      var r = li.querySelector('.sim-res');
      r.className = 'sim-res ' + li.getAttribute('data-res');
      r.textContent = li.getAttribute('data-txt');
    }

    function concluir() {
      sim.classList.add('feito');
      estado.classList.add('ok'); estado.textContent = sim.getAttribute('data-estado-final') || 'Pré-aprovado';
      if (relogio) relogio.textContent = sim.getAttribute('data-tempo') || '7 min';
    }

    function rodar() {
      limpar();
      if (calm) { linhas.forEach(final); concluir(); return; }
      var t = 300;
      linhas.forEach(function (li, i) {
        timers.push(setTimeout(function () {
          li.querySelector('.sim-barra i').style.setProperty('--p', '62%');
          li.querySelector('.sim-res').textContent = 'Analisando…';
          if (relogio) relogio.textContent = (i + 1) * 2 - 1 + ' min';
        }, t));
        t += 900;
        timers.push(setTimeout(function () { final(li); }, t));
        t += 350;
      });
      timers.push(setTimeout(concluir, t + 300));
    }

    if (botao) botao.addEventListener('click', rodar);

    if (calm || !('IntersectionObserver' in window)) { rodar(); return; }
    limpar();
    var obs = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { rodar(); obs.disconnect(); } });
    }, { threshold: .35 });
    obs.observe(sim);
  });
})();
