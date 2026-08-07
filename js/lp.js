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
