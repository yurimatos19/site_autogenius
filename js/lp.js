/* Auto Genius — comportamento compartilhado das landing pages por vertical. */
(function () {
  'use strict';

  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Revelação no scroll. Sem observer (ou com movimento reduzido), tudo nasce visível. */
  var alvos = document.querySelectorAll('.rv');
  if (calm || !('IntersectionObserver' in window)) {
    alvos.forEach(function (el) { el.classList.add('in'); });
  } else {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        obs.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
    alvos.forEach(function (el) { obs.observe(el); });
  }

  /* ── Relógio ao vivo ──────────────────────────────────────────
     A página inteira argumenta sobre horário. Em vez de ilustrar uma
     hora inventada, o relógio lê a hora de quem está olhando e diz se
     o negócio dele está aberto agora. O expediente vem do HTML porque
     muda por vertical. */
  var relogio = document.querySelector('[data-vivo]');
  if (relogio) {
    var estado = document.querySelector('.estado');
    var abre = +relogio.dataset.abre;       // hora de abrir, dias úteis
    var fecha = +relogio.dataset.fecha;     // hora de fechar, dias úteis
    var fechaSab = +relogio.dataset.sabado; // fecha no sábado; 0 = não abre
    var dias = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];

    var tique = function () {
      var agora = new Date();
      var h = agora.getHours(), m = agora.getMinutes(), d = agora.getDay();
      relogio.textContent = String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');

      var limite = d === 0 ? 0 : (d === 6 ? fechaSab : fecha);
      var aberto = limite > 0 && h >= abre && h < limite;

      if (!estado) return;
      estado.className = 'estado ' + (aberto ? 'aberto' : 'fechado');
      estado.textContent = aberto
        ? dias[d] + ', ' + h + 'h — você está aberto. E às ' + limite + 'h?'
        : dias[d] + ', ' + h + 'h — você está fechado. O agente não.';
    };
    tique();
    setInterval(tique, 20000);
  }

  /* ── Calculadora ──────────────────────────────────────────────
     Transforma a promessa de retorno numa conta que o próprio visitante
     faz. Os campos vêm do HTML — cada vertical tem os seus. */
  var calc = document.querySelector('[data-calc]');
  if (calc) {
    var campos = calc.querySelectorAll('input[type=range]');
    var saidaValor = calc.querySelector('[data-valor]');
    var saidaConta = calc.querySelector('[data-conta]');

    var real = function (n) {
      return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
    };
    var forte = function (txt) {
      var b = document.createElement('b');
      b.textContent = txt;
      return b;
    };

    var recalcular = function () {
      var v = {};
      campos.forEach(function (c) {
        v[c.name] = +c.value;
        var eco = calc.querySelector('output[for="' + c.id + '"]');
        if (eco) {
          eco.textContent = c.dataset.moeda
            ? real(+c.value)
            : (+c.value).toLocaleString('pt-BR') + (c.dataset.sufixo || '');
        }
      });

      // Contatos que chegam fora do expediente e hoje esperam horas.
      var fora = v.leads * (v.fora / 100);
      // Destes, a parcela que esfria por demora — premissa exposta na tela.
      var perdidos = fora * (v.perda / 100);

      saidaValor.textContent = real(perdidos * v.ticket);

      saidaConta.textContent = '';
      saidaConta.append(
        forte(String(Math.round(fora))),
        ' dos seus ' + v.leads + ' contatos por mês chegam fora do horário. A ',
        forte(v.perda + '%'),
        ' de perda por demora, são ',
        forte(String(Math.round(perdidos))),
        ' negócios que esfriam — a ' + real(v.ticket) + ' cada.'
      );
    };

    campos.forEach(function (c) { c.addEventListener('input', recalcular); });
    recalcular();
  }

  /* A conversa do hero encena a resposta fora do horário: é o argumento da página.
     As mensagens já estão no HTML — aqui só entram em cena na ordem certa,
     e o painel acompanha rolando, como um WhatsApp aberto. */
  var corpo = document.querySelector('.chat-body');
  if (!corpo) return;

  var msgs = corpo.querySelectorAll('.msg');
  if (calm) {
    msgs.forEach(function (m) { m.style.animation = 'none'; m.style.opacity = 1; m.style.transform = 'none'; });
    corpo.scrollTop = corpo.scrollHeight;
    return;
  }

  msgs.forEach(function (m, i) {
    var atraso = 0.45 + i * 0.72;
    m.style.animationDelay = atraso + 's';
    setTimeout(function () {
      corpo.scrollTo({ top: corpo.scrollHeight, behavior: 'smooth' });
    }, (atraso + 0.3) * 1000);
  });
})();
