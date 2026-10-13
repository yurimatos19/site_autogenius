/* AutoGenius — comportamento das páginas de plataforma.
   · relógio ao vivo: a hora de quem está lendo e se o negócio dele estaria
     aberto agora (o expediente vem do HTML: data-abre, data-fecha, data-sabado)
   · tela do produto que inclina seguindo o mouse
   · conversa encenada que aparece mensagem por mensagem */
(function () {
  'use strict';
  var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Relógio ── */
  var rel = document.querySelector('.relogio');
  if (rel) {
    var hora = rel.querySelector('b'), estado = rel.querySelector('[data-estado]');
    var abre = +rel.getAttribute('data-abre') || 8, fecha = +rel.getAttribute('data-fecha') || 18;
    var sabado = rel.hasAttribute('data-sabado') ? +rel.getAttribute('data-sabado') : 12;
    var quem = rel.getAttribute('data-quem') || 'sua equipe';
    var tick = function () {
      var d = new Date(), h = d.getHours(), m = d.getMinutes(), dia = d.getDay();
      hora.textContent = String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
      var fim = dia === 6 ? sabado : fecha;
      var aberto = dia !== 0 && fim > 0 && h >= abre && h < fim;
      estado.className = aberto ? 'aberto' : 'fechado';
      estado.textContent = aberto
        ? 'Agora ' + quem + ' está trabalhando — e o agente tira dela o repetitivo.'
        : 'Agora ' + quem + ' está fora. O agente está atendendo.';
    };
    tick(); setInterval(tick, 20000);
  }

  /* ── Tela que inclina ── */
  var palco = document.querySelector('.palco'), tela = palco && palco.querySelector('.tela');
  if (palco && tela && !calm && window.matchMedia('(hover:hover)').matches) {
    palco.addEventListener('mousemove', function (e) {
      var r = palco.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      tela.style.setProperty('--ry', (x * 10).toFixed(2) + 'deg');
      tela.style.setProperty('--rx', (-y * 7).toFixed(2) + 'deg');
    });
    palco.addEventListener('mouseleave', function () { tela.style.removeProperty('--ry'); tela.style.removeProperty('--rx'); });
  }

  /* ── Conversa encenada: entra quando aparece na tela ── */
  var zap = document.querySelector('.zap');
  if (zap) {
    zap.querySelectorAll('.msg').forEach(function (m, i) { m.style.animationDelay = (0.2 + i * 0.55) + 's'; });
    if (calm || !('IntersectionObserver' in window)) zap.classList.add('in');
    else {
      var obs = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { zap.classList.add('in'); obs.disconnect(); } });
      }, { threshold: .3 });
      obs.observe(zap);
    }
  }
})();
