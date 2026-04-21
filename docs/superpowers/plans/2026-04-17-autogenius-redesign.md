# AutoGenius AI — Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformar a home do AutoGenius AI em uma carta de vendas interativa com scroll fluido premium (Linear/Vercel), paleta dark navy espelhando a logo, e WhatsApp como único CTA de conversão.

**Architecture:** Single-page scroll para a home (8 seções narrativas) com Lenis smooth scroll + GSAP ScrollTrigger. Páginas secundárias mantêm templates hash-based existentes. Three.js removido; canvas de partículas 2D nativo no lugar.

**Tech Stack:** HTML/CSS/JS puro · Tailwind CDN · GSAP 3.12 + ScrollTrigger · Lenis 1.x · Font Awesome 6 · Canvas API 2D

**Spec:** `docs/superpowers/specs/2026-04-17-autogenius-redesign.md`
**Working dir:** `/Users/yurimatos/auto_genius/.claude/worktrees/sad-khorana-ca3591/`

---

## File Map

| Arquivo | Ação | Responsabilidade |
|---|---|---|
| `index.html` | Modificar | Head (remove Three.js, add Lenis), nav, barra, WA float, template page-home, noscript, page-contato |
| `css/styles.css` | Modificar | CSS variables navy, keyframes, glassmorphism, components, mobile |
| `js/main.js` | Modificar | Lenis init + router, WA URL builder, GA4, canvas particles, GSAP animations, counters |

---

## FASE 1 — Fundação (Dependências + CSS Variables)

### Task 1: Remover Three.js e adicionar Lenis

**Files:**
- Modify: `index.html` (head)

- [ ] **Step 1: Remover script Three.js do head**

Localizar e deletar a linha:
```
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js" defer></script>
```

- [ ] **Step 2: Adicionar Lenis CDN após o script do GSAP ScrollTrigger**

```html
<script src="https://cdn.jsdelivr.net/npm/lenis@1.1.14/dist/lenis.min.js" defer></script>
```

- [ ] **Step 3: Confirmar remoção**

```bash
grep -n "three" index.html
```
Esperado: zero resultados.

- [ ] **Step 4: Commit**
```bash
git add index.html
git commit -m "chore: remove Three.js, add Lenis 1.1.14 CDN"
```

---

### Task 2: CSS variables navy + keyframes globais

**Files:**
- Modify: `css/styles.css`
- Modify: `index.html` (tailwind.config)

- [ ] **Step 1: Adicionar bloco :root no topo de styles.css**

```css
:root {
  --bg-base:     #03061A;
  --bg-surface:  #070D28;
  --bg-card:     rgba(7, 13, 40, 0.75);
  --gradient-brand: linear-gradient(135deg, #E040FB 0%, #7C3AED 40%, #2563EB 70%, #22D3EE 100%);
  --gradient-text:  linear-gradient(90deg, #E040FB 0%, #7C3AED 50%, #22D3EE 100%);
  --accent-magenta: #E040FB;
  --accent-purple:  #7C3AED;
  --accent-blue:    #2563EB;
  --accent-cyan:    #22D3EE;
  --accent-green:   #25D366;
  --text-primary:   #F0F4FF;
  --text-secondary: #94A3B8;
  --text-muted:     #475569;
  --border-subtle:  rgba(99, 102, 241, 0.12);
  --border-active:  rgba(124, 58, 237, 0.35);
  --z-canvas: 0; --z-content: 10; --z-nav: 100;
  --z-wa-float: 200; --z-tooltip: 210; --z-overlay: 300; --z-mobile-menu: 400;
}
```

- [ ] **Step 2: Atualizar body com gradiente vertical fixo**

```css
body {
  background-color: var(--bg-base);
  background-image: linear-gradient(
    to bottom,
    #03061A 0%, #050A22 25%, #040818 40%,
    #050D24 55%, #03061A 70%, #060F28 85%, #03061A 100%
  );
  background-attachment: fixed;
  color: var(--text-primary);
  font-family: 'DM Sans', sans-serif;
}
```

- [ ] **Step 3: Atualizar tailwind.config no index.html**

```js
colors: {
  brand: { magenta:'#E040FB', purple:'#7C3AED', blue:'#2563EB', cyan:'#22D3EE', green:'#25D366' },
  dark:  { base:'#03061A', surface:'#070D28', card:'rgba(7,13,40,0.75)' }
},
boxShadow: {
  'glow-purple': '0 0 40px rgba(124,58,237,0.3), 0 0 80px rgba(124,58,237,0.1)',
  'glow-blue':   '0 0 40px rgba(37,99,235,0.25), 0 0 80px rgba(37,99,235,0.08)',
  'glow-brand':  '0 0 60px rgba(224,64,251,0.2), 0 0 120px rgba(34,211,238,0.1)',
}
```

- [ ] **Step 4: Adicionar utilitários e keyframes globais ao styles.css**

```css
.gradient-text {
  background: var(--gradient-text);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
@keyframes wa-pulse {
  0%,100% { transform:scale(1); box-shadow:0 0 0 0 rgba(37,211,102,0.4); }
  50%     { transform:scale(1.03); box-shadow:0 0 0 8px rgba(37,211,102,0); }
}
.pulse-cta { animation: wa-pulse 2s ease-in-out infinite; }
.glass-card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition: border-color 0.3s ease;
}
.glass-card:hover { border-color: var(--border-active); }
.gsap-reveal { opacity:0; transform:translateY(30px); }
@keyframes bgPulse { 0%,100%{ opacity:0.6; } 50%{ opacity:1; } }
@keyframes msgIn { from{ opacity:0; transform:translateY(8px); } to{ opacity:1; transform:translateY(0); } }
@media (prefers-reduced-motion: reduce) {
  .gsap-reveal, #hero-canvas, .pain-line { animation:none !important; transition:none !important; opacity:1 !important; transform:none !important; }
  .pulse-cta { animation:none; box-shadow:0 0 0 3px rgba(37,211,102,0.4); }
}
```

- [ ] **Step 5: Abrir no browser — verificar fundo navy (azul escuro, não preto quente)**

- [ ] **Step 6: Commit**
```bash
git add css/styles.css index.html
git commit -m "feat: paleta dark navy, CSS variables, keyframes globais"
```

---

## FASE 2 — Elementos Globais

### Task 3: Barra de anúncio → link WhatsApp acessível

**Files:**
- Modify: `index.html` (~linha 478)

- [ ] **Step 1: Substituir o div da barra por elemento `<a>`**

Localizar o bloco `<div class="bg-gradient-to-r from-purple-900/90 to-cyan-900/90 ...">` e substituir o elemento inteiro por:
```html
<a id="bar-wa-link" href="#"
   target="_blank" rel="noopener"
   class="block bg-[#070D28] text-white text-center py-3 px-4 border-b border-[rgba(99,102,241,0.2)] hover:border-[rgba(124,58,237,0.4)] transition-colors duration-300"
   aria-label="Falar agora no WhatsApp sobre Agentes de IA">
  <div class="flex items-center justify-center gap-3 text-sm font-semibold">
    <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
    <span class="text-[#F0F4FF]">Agentes de IA 24/7</span>
    <span class="text-[#475569] mx-1">·</span>
    <span class="text-[#22D3EE]">Implementação em 7 dias</span>
    <span class="text-[#475569] mx-1 hidden sm:inline">·</span>
    <span class="text-[#E040FB] hidden sm:inline">Fale agora no WhatsApp →</span>
  </div>
</a>
```

- [ ] **Step 2: Verificar Tab → Enter abre WhatsApp**

- [ ] **Step 3: Commit**
```bash
git add index.html
git commit -m "feat: barra de anuncio como link WhatsApp acessivel"
```

---

### Task 4: Nav — CTA WhatsApp (desktop e mobile)

**Files:**
- Modify: `index.html` (nav ~linha 508, menu mobile ~linha 528)

- [ ] **Step 1: Substituir botão nav desktop**

Localizar `<a href="#contato" class="hidden lg:inline-block bg-gradient-glow ...">` e substituir por:
```html
<a id="nav-wa-btn" href="#"
   target="_blank" rel="noopener"
   class="hidden lg:inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 hover:shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:-translate-y-0.5 transform"
   onclick="WA && WA.track('nav')">
  <i class="fab fa-whatsapp text-lg"></i>
  Falar no WhatsApp
</a>
```

- [ ] **Step 2: Substituir botão menu mobile**

Localizar `<a href="#contato" class="bg-gradient-glow shadow-glow-purple ...">Agendar Consultoria</a>` e substituir por:
```html
<a id="nav-wa-btn-mobile" href="#"
   target="_blank" rel="noopener"
   class="bg-[#25D366] text-white px-4 py-4 rounded-xl mt-6 font-bold text-xl inline-flex items-center justify-center gap-3 hover:bg-[#1ebe5d] transition"
   onclick="WA && WA.track('nav')">
  <i class="fab fa-whatsapp text-2xl"></i>
  Falar no WhatsApp
</a>
```

- [ ] **Step 3: Verificar desktop e mobile**

- [ ] **Step 4: Commit**
```bash
git add index.html
git commit -m "feat: nav CTA WhatsApp direto desktop e mobile"
```

---

### Task 5: Botão WhatsApp flutuante — pulse + tooltip

**Files:**
- Modify: `index.html` (~linha 645)
- Modify: `css/styles.css`

- [ ] **Step 1: Substituir o link flutuante existente por wrapper com tooltip**

```html
<div class="wa-float-wrapper" style="position:fixed;bottom:24px;right:20px;z-index:var(--z-wa-float,200);">
  <div class="wa-tooltip" role="tooltip" aria-hidden="true">Fale agora — resposta em minutos</div>
  <a id="float-wa-btn" href="#"
     target="_blank" rel="noopener"
     aria-label="Falar agora no WhatsApp"
     class="wa-float-btn pulse-cta"
     onclick="WA && WA.track('float')">
    <i class="fab fa-whatsapp"></i>
  </a>
</div>
```

- [ ] **Step 2: Adicionar CSS**

```css
.wa-float-btn {
  display:flex; align-items:center; justify-content:center;
  width:60px; height:60px; border-radius:50%;
  background:#25D366; color:white; font-size:1.75rem;
  text-decoration:none; box-shadow:0 4px 20px rgba(37,211,102,0.4);
  transition:transform 0.2s, box-shadow 0.2s;
}
.wa-float-btn:hover { transform:scale(1.1) !important; box-shadow:0 6px 28px rgba(37,211,102,0.6); }
.wa-tooltip {
  position:absolute; bottom:calc(100% + 10px); right:0;
  background:var(--bg-surface); color:var(--text-primary);
  font-size:13px; font-weight:600; white-space:nowrap;
  padding:8px 14px; border-radius:8px; border:1px solid var(--border-subtle);
  opacity:0; pointer-events:none; transform:translateY(4px);
  transition:opacity 0.2s, transform 0.2s;
}
.wa-float-wrapper:hover .wa-tooltip { opacity:1; transform:translateY(0); }
@media (pointer: coarse) { .wa-tooltip { display:none; } }
```

- [ ] **Step 3: Verificar pulse, tooltip hover desktop, sem tooltip mobile**

- [ ] **Step 4: Commit**
```bash
git add index.html css/styles.css
git commit -m "feat: botao WhatsApp flutuante com pulse e tooltip"
```

---

## FASE 3 — JS: Lenis + WA Builder + GA4

### Task 6: Lenis integrado com hash router

**Files:**
- Modify: `js/main.js`

- [ ] **Step 1: Adicionar init Lenis no topo do DOMContentLoaded**

Logo após `document.addEventListener('DOMContentLoaded', () => {`:
```js
let lenis = null;
function initLenis() {
  if (lenis) lenis.destroy();
  lenis = new Lenis({ lerp: 0.08, duration: 1.2, smoothWheel: true });
  // Pass ScrollTrigger.update directly — avoids anonymous wrapper overhead
  // and ensures scroll event args flow through correctly (spec pattern)
  lenis.on('scroll', ScrollTrigger.update);
  // Single RAF driver via GSAP ticker — do NOT add a separate requestAnimationFrame
  // loop or Lenis will be called twice per frame, causing doubled/jerky scroll
  if (typeof gsap !== 'undefined') {
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }
}
```

- [ ] **Step 2: Modificar navigate() para controlar Lenis por rota**

Após `pageContent.dataset.currentPage = templateId;`:
```js
if (templateId === 'page-home') {
  if (!lenis) initLenis(); else lenis.start();
  if (lenis) lenis.scrollTo(0, { immediate: true });
} else {
  if (lenis) lenis.stop();
  window.scrollTo(0, 0);
}
```
Remover qualquer `window.scrollTo(0,0)` existente na função navigate.

- [ ] **Step 3: Verificar — home tem scroll suave, #faq tem scroll nativo**

- [ ] **Step 4: Commit**
```bash
git add js/main.js
git commit -m "feat: Lenis smooth scroll integrado com hash router"
```

---

### Task 7: WhatsApp URL Builder + GA4

**Files:**
- Modify: `js/main.js`

- [ ] **Step 1: Adicionar objeto WA após siteData**

```js
const WA = {
  BASE: 'https://wa.me/5581991471765?text=',
  msg: {
    hero:       'Olá! Quero automatizar meu atendimento com IA.',
    social:     'Vi os resultados de outros clientes e quero saber mais.',
    howItWorks: 'Quero começar em 7 dias. Como funciona?',
    final:      'Estou pronto para começar. Quero falar com a equipe.',
    float:      'Olá! Vi o site e quero saber mais sobre os Agentes de IA.',
    nav:        'Olá! Quero automatizar meu atendimento com IA.',
  },
  url(key, planName) {
    const text = key === 'plans'
      ? 'Quero conhecer o plano ' + planName + ' da AutoGenius.'
      : (this.msg[key] || this.msg.float);
    return this.BASE + encodeURIComponent(text);
  },
  track(section) {
    if (typeof gtag !== 'undefined') gtag('event', 'whatsapp_click', { section });
  }
};
```

- [ ] **Step 2: Testar no DevTools Console**

```js
console.assert(!WA.url('hero').includes('!'), 'deve estar encodado');
console.assert(WA.url('plans','Performance').includes('Performance'), 'plano presente');
console.log('WA OK:', WA.url('hero'));
```
Esperado: sem erros de assertion.

- [ ] **Step 3: Inicializar CTAs globais (barra, nav, float) via WA builder**

Logo após a definição do objeto `WA`, adicionar:
```js
// Wire global persistent CTAs — these elements live outside page templates
// so they must be wired once at DOMContentLoaded, not per-page
(function wireGlobalWACTAs() {
  const globalMap = {
    'bar-wa-link':        'float',   // announcement bar — same "first contact" message
    'nav-wa-btn':         'nav',
    'nav-wa-btn-mobile':  'nav',
    'float-wa-btn':       'float',
  };
  Object.entries(globalMap).forEach(([id, key]) => {
    const el = document.getElementById(id);
    if (el) el.href = WA.url(key);
  });
})();
```

- [ ] **Step 4: Commit**
```bash
git add js/main.js
git commit -m "feat: WhatsApp URL builder com encodeURIComponent e GA4 tracking"
```

---

## FASE 4 — Home: 8 Seções

### Task 8: S1 — Hero (tipografia cinematic + canvas partículas)

**Files:**
- Modify: `index.html` (template page-home — bloco hero)
- Modify: `js/main.js` (initializeHeroParticles, initializeHeroAnimations)
- Modify: `css/styles.css`

- [ ] **Step 1: Substituir todo o bloco hero no template page-home**

Dentro do `<template id="page-home">`, substituir desde `<!-- HERO SECTION -->` até o fechamento da div do globo por:

```html
<section id="home" class="hero-section relative min-h-screen flex flex-col justify-center px-5 lg:px-16 pt-24 pb-16 overflow-hidden">
  <canvas id="hero-canvas" class="absolute inset-0 w-full h-full pointer-events-none" style="z-index:var(--z-canvas,0);"></canvas>
  <div class="absolute inset-0 pointer-events-none" style="background-image:linear-gradient(rgba(99,102,241,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(34,211,238,0.03) 1px,transparent 1px);background-size:60px 60px;z-index:1;"></div>
  <div class="relative max-w-4xl mx-auto w-full text-center lg:text-left" style="z-index:var(--z-content,10);">
    <div class="hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(99,102,241,0.2)] bg-[rgba(7,13,40,0.6)] backdrop-blur-sm mb-8">
      <div class="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
      <span class="text-[#94A3B8] text-xs font-semibold tracking-widest uppercase">Referencia em IA no Brasil</span>
    </div>
    <h1 class="font-display font-extrabold leading-tight mb-6" style="font-size:clamp(2.2rem,7vw,5rem);">
      <span class="hero-line block overflow-hidden"><span class="hero-line-inner block text-[#F0F4FF]">Enquanto voce dormia,</span></span>
      <span class="hero-line block overflow-hidden"><span class="hero-line-inner block gradient-text">um concorrente respondeu</span></span>
      <span class="hero-line block overflow-hidden"><span class="hero-line-inner block text-[#F0F4FF]">o seu cliente.</span></span>
    </h1>
    <p class="hero-sub text-[#94A3B8] mb-10 max-w-2xl mx-auto lg:mx-0" style="font-size:clamp(1rem,2.5vw,1.25rem);line-height:1.7;">
      Agentes de IA que respondem, qualificam e fecham vendas no WhatsApp —
      <strong class="text-[#F0F4FF]">24 horas por dia, 7 dias por semana.</strong>
    </p>
    <div class="hero-cta mb-12">
      <a id="hero-wa-btn" href="#" target="_blank" rel="noopener"
         class="inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold rounded-xl transition-all duration-300 pulse-cta w-full sm:w-auto"
         style="padding:18px 36px;font-size:1.125rem;min-width:280px;"
         onclick="WA && WA.track('hero')">
        <i class="fab fa-whatsapp text-2xl"></i>
        Falar agora no WhatsApp
      </a>
    </div>
    <div class="hero-stats flex flex-wrap gap-6 justify-center lg:justify-start">
      <div class="text-center">
        <div class="font-display font-bold text-[#F0F4FF]" style="font-size:2rem;"><span class="counter" data-target="50">0</span><span class="text-[#22D3EE]">+</span></div>
        <div class="text-[#475569] text-xs uppercase tracking-widest mt-1">Empresas</div>
      </div>
      <div class="w-px bg-[rgba(99,102,241,0.2)] self-stretch hidden sm:block"></div>
      <div class="text-center">
        <div class="font-display font-bold text-[#F0F4FF]" style="font-size:2rem;"><span class="counter" data-target="300">0</span><span class="text-[#E040FB]">%</span></div>
        <div class="text-[#475569] text-xs uppercase tracking-widest mt-1">ROI medio</div>
      </div>
      <div class="w-px bg-[rgba(99,102,241,0.2)] self-stretch hidden sm:block"></div>
      <div class="text-center">
        <div class="font-display font-bold text-[#F0F4FF]" style="font-size:2rem;"><span class="counter" data-target="7">0</span><span class="text-[#22D3EE]">d</span></div>
        <div class="text-[#475569] text-xs uppercase tracking-widest mt-1">Para ativar</div>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Deletar initializeGlobe em main.js. Substituir initializeHeroParticles por:**

```js
function initializeHeroParticles() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    // Canvas unavailable (privacy-hardened browser / old WebView) — render CSS gradient fallback
    canvas.style.background = 'radial-gradient(ellipse at 30% 50%, rgba(124,58,237,0.15) 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(37,99,235,0.1) 0%, transparent 55%)';
    return;
  }
  const isMobile = window.innerWidth < 640;
  const COUNT = isMobile ? 40 : 80;
  let particles = [], mouse = { x:-999, y:-999 }, raf = null, lastTime = 0;
  function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
  resize();
  window.addEventListener('resize', resize);
  if (!isMobile) {
    canvas.addEventListener('mousemove', e => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    });
    canvas.addEventListener('mouseleave', () => { mouse.x = -999; mouse.y = -999; });
  }
  for (let i = 0; i < COUNT; i++) {
    particles.push({ x:Math.random()*canvas.width, y:Math.random()*canvas.height,
      vx:(Math.random()-0.5)*0.3, vy:(Math.random()-0.5)*0.3, r:Math.random()*1.5+0.5 });
  }
  function draw(now) {
    if (now - lastTime < 16) { raf = requestAnimationFrame(draw); return; }
    lastTime = now;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
      const alpha = Math.hypot(p.x-mouse.x, p.y-mouse.y) < 120 ? 0.7 : 0.3;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(124,58,237,'+alpha+')'; ctx.fill();
      particles.forEach(p2 => {
        const d = Math.hypot(p.x-p2.x, p.y-p2.y);
        if (d < 100) {
          ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(p2.x,p2.y);
          ctx.strokeStyle = 'rgba(37,99,235,'+(0.08*(1-d/100))+')';
          ctx.lineWidth = 0.5; ctx.stroke();
        }
      });
    });
    raf = requestAnimationFrame(draw);
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else raf = requestAnimationFrame(draw);
  });
  raf = requestAnimationFrame(draw);
}
```

- [ ] **Step 3: Adicionar initializeHeroAnimations em main.js**

```js
function initializeHeroAnimations() {
  const heroBtn = document.getElementById('hero-wa-btn');
  if (heroBtn && typeof WA !== 'undefined') heroBtn.href = WA.url('hero');
  if (typeof gsap === 'undefined') return;
  gsap.timeline({ defaults: { ease: 'power3.out' } })
    .from('.hero-badge',      { opacity:0, y:20, duration:0.6 })
    .from('.hero-line-inner', { yPercent:110, duration:0.7, stagger:0.15 }, '-=0.3')
    .from('.hero-sub',        { opacity:0, y:20, duration:0.6 }, '-=0.3')
    .from('.hero-cta',        { opacity:0, scale:0.95, duration:0.5 }, '-=0.3')
    .from('.hero-stats > div',{ opacity:0, y:15, duration:0.4, stagger:0.1 }, '-=0.2');
}
```

- [ ] **Step 4: Atualizar runPageInitializers para home**

```js
'page-home': [initializeHeroParticles, initializeHeroAnimations, initializeWhatsAppDemo, initializeHomeScrollAnimations, initializeAnimatedCounters]
```

- [ ] **Step 5: CSS do hero**

```css
.hero-section { min-height:100svh; }
.hero-line { display:block; overflow:hidden; line-height:1.2; }
.hero-line-inner { display:block; }
@media (max-width:639px) { .hero-section { text-align:center; } }
```

- [ ] **Step 6: Verificar hero — animação de entrada, partículas navy, botão pulsando**

- [ ] **Step 7: Commit**
```bash
git add index.html js/main.js css/styles.css
git commit -m "feat: S1 Hero — tipografia cinematic, canvas particulas, CTA WhatsApp"
```

---

### Task 9: S2 — Dor

**Files:**
- Modify: `index.html` (template page-home — após S1)

- [ ] **Step 1: Adicionar HTML da S2 após o fechamento da section do hero**

```html
<section class="s2-pain py-24 lg:py-36 px-5">
  <div class="max-w-3xl mx-auto text-center">
    <div class="gsap-reveal inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.05)] mb-12">
      <div class="w-2 h-2 bg-red-400 rounded-full"></div>
      <span class="text-red-400 text-xs font-semibold uppercase tracking-widest">Voce reconhece isso?</span>
    </div>
    <div class="space-y-8">
      <div class="pain-line flex items-start gap-4 text-left max-w-xl mx-auto">
        <span class="text-red-400 font-bold text-2xl mt-0.5 flex-shrink-0">&#215;</span>
        <p class="text-[#94A3B8] text-lg lg:text-xl leading-relaxed">Voce responde clientes <strong class="text-[#F0F4FF]">quando pode</strong>. Nao quando eles precisam.</p>
      </div>
      <div class="pain-line flex items-start gap-4 text-left max-w-xl mx-auto">
        <span class="text-red-400 font-bold text-2xl mt-0.5 flex-shrink-0">&#215;</span>
        <p class="text-[#94A3B8] text-lg lg:text-xl leading-relaxed">Seu WhatsApp acumula mensagens <strong class="text-[#F0F4FF]">enquanto voce dorme</strong>.</p>
      </div>
      <div class="pain-line flex items-start gap-4 text-left max-w-xl mx-auto">
        <span class="text-red-400 font-bold text-2xl mt-0.5 flex-shrink-0">&#215;</span>
        <p class="text-[#94A3B8] text-lg lg:text-xl leading-relaxed">Leads que voce pagou para atrair <strong class="text-[#F0F4FF]">esfriaram</strong> antes de voce responder.</p>
      </div>
      <div class="pain-line flex items-start gap-4 text-left max-w-xl mx-auto">
        <span class="text-red-400 font-bold text-2xl mt-0.5 flex-shrink-0">&#215;</span>
        <p class="text-[#94A3B8] text-lg lg:text-xl leading-relaxed">Voce sabe que perde vendas. <strong class="text-[#F0F4FF]">So nao sabe quantas.</strong></p>
      </div>
      <div class="pain-line flex items-start gap-4 text-left max-w-xl mx-auto">
        <span class="text-red-400 font-bold text-2xl mt-0.5 flex-shrink-0">&#215;</span>
        <p class="text-[#94A3B8] text-lg lg:text-xl leading-relaxed">Seu negocio e bom. <strong class="text-[#F0F4FF]">Seu atendimento nao acompanha.</strong></p>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Commit**
```bash
git add index.html
git commit -m "feat: S2 Dor — frases de dor para reveal no scroll"
```

---

### Task 10: S3 — Quebra de Padrão

**Files:**
- Modify: `index.html` (template page-home)

- [ ] **Step 1: Adicionar HTML da S3**

```html
<section class="s3-break relative min-h-[60vh] flex items-center justify-center px-5 overflow-hidden">
  <div class="s3-flash-overlay absolute inset-0 pointer-events-none" style="background:rgba(255,255,255,0);z-index:2;"></div>
  <div class="s3-bg-glow absolute inset-0 pointer-events-none" style="background:radial-gradient(ellipse at center,rgba(124,58,237,0.2) 0%,transparent 70%);opacity:0;z-index:1;"></div>
  <div class="relative text-center max-w-4xl px-4" style="z-index:var(--z-content,10);">
    <p class="s3-question font-display font-extrabold gradient-text" style="font-size:clamp(1.8rem,5vw,4rem);line-height:1.25;opacity:0;">
      E se cada mensagem nao respondida virasse uma venda fechada?
    </p>
  </div>
</section>
```

- [ ] **Step 2: Commit**
```bash
git add index.html
git commit -m "feat: S3 Quebra de Padrao — frase de virada emocional"
```

---

### Task 11: S4 — Solução (copy + demo WhatsApp)

**Files:**
- Modify: `index.html` (template page-home)
- Modify: `js/main.js` (initializeWhatsAppDemo — reescrever)
- Modify: `css/styles.css`

- [ ] **Step 1: Adicionar HTML da S4**

```html
<section class="s4-solution py-24 lg:py-36 px-5">
  <div class="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
    <div class="gsap-reveal">
      <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(124,58,237,0.3)] bg-[rgba(124,58,237,0.08)] mb-8">
        <span class="text-[#7C3AED] text-xs font-semibold uppercase tracking-widest">O que e um Agente de IA?</span>
      </div>
      <h2 class="font-display font-bold text-[#F0F4FF] mb-6" style="font-size:clamp(1.75rem,4vw,2.75rem);line-height:1.2;">
        Um chatbot responde perguntas.<br>
        <span class="gradient-text">O seu Agente toma decisoes.</span>
      </h2>
      <div class="space-y-4 mb-8">
        <div class="flex items-center gap-3"><div class="w-8 h-8 rounded-full bg-[rgba(37,99,235,0.15)] border border-[rgba(37,99,235,0.3)] flex items-center justify-center flex-shrink-0"><i class="fas fa-check text-[#2563EB] text-xs"></i></div><span class="text-[#94A3B8]">Qualifica o lead automaticamente</span></div>
        <div class="flex items-center gap-3"><div class="w-8 h-8 rounded-full bg-[rgba(37,99,235,0.15)] border border-[rgba(37,99,235,0.3)] flex items-center justify-center flex-shrink-0"><i class="fas fa-check text-[#2563EB] text-xs"></i></div><span class="text-[#94A3B8]">Agenda direto na sua agenda</span></div>
        <div class="flex items-center gap-3"><div class="w-8 h-8 rounded-full bg-[rgba(37,99,235,0.15)] border border-[rgba(37,99,235,0.3)] flex items-center justify-center flex-shrink-0"><i class="fas fa-check text-[#2563EB] text-xs"></i></div><span class="text-[#94A3B8]">Envia proposta e faz follow-up</span></div>
        <div class="flex items-center gap-3"><div class="w-8 h-8 rounded-full bg-[rgba(37,99,235,0.15)] border border-[rgba(37,99,235,0.3)] flex items-center justify-center flex-shrink-0"><i class="fas fa-check text-[#2563EB] text-xs"></i></div><span class="text-[#94A3B8]">Cobra, confirma e fecha. Sozinho.</span></div>
      </div>
      <p class="text-[#475569] text-sm">Tudo no WhatsApp. Sem voce precisar estar la.</p>
    </div>
    <div class="gsap-reveal">
      <div class="wa-demo-container glass-card rounded-2xl overflow-hidden" style="max-width:380px;margin:0 auto;" role="presentation" aria-label="Demonstracao de conversa com Agente de IA">
        <div class="flex items-center gap-3 p-4 border-b border-[rgba(99,102,241,0.15)]" style="background:rgba(7,13,40,0.9);">
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-[#E040FB] to-[#22D3EE] flex items-center justify-center"><i class="fas fa-robot text-white text-sm"></i></div>
          <div><p class="text-[#F0F4FF] font-semibold text-sm">Agente AutoGenius</p><p class="text-[#25D366] text-xs flex items-center gap-1"><span class="w-1.5 h-1.5 bg-[#25D366] rounded-full inline-block animate-pulse"></span> Online agora</p></div>
        </div>
        <div id="wa-demo-messages" class="p-4 space-y-3" style="min-height:280px;background:rgba(3,6,26,0.8);"></div>
        <div class="flex items-center gap-2 p-3 border-t border-[rgba(99,102,241,0.15)]" style="background:rgba(7,13,40,0.9);">
          <div class="flex-1 bg-[rgba(99,102,241,0.1)] rounded-full px-4 py-2 text-[#475569] text-sm">Digite uma mensagem...</div>
          <div class="w-9 h-9 rounded-full bg-[#25D366] flex items-center justify-center"><i class="fas fa-paper-plane text-white text-sm"></i></div>
        </div>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Reescrever initializeWhatsAppDemo em main.js usando createElement (sem innerHTML externo)**

```js
function initializeWhatsAppDemo() {
  const container = document.getElementById('wa-demo-messages');
  if (!container) return;
  const conversation = [
    { from:'client', text:'Oi, quanto custa uma consulta?' },
    { from:'agent',  text:'Ola! A consulta custa R$150. Posso verificar disponibilidade. Qual seu nome?' },
    { from:'client', text:'Joao' },
    { from:'agent',  text:'Perfeito, Joao! Temos quinta 14h ou sexta 10h. Qual prefere?' },
    { from:'client', text:'Quinta' },
    { from:'agent',  text:'Agendado! Voce recebera a confirmacao em instantes.' },
  ];
  let step = 0;
  function showNext() {
    if (step >= conversation.length) {
      setTimeout(() => { container.replaceChildren(); step = 0; showNext(); }, 3000);
      return;
    }
    const msg = conversation[step];
    const row = document.createElement('div');
    const span = document.createElement('span');
    row.className = 'wa-msg wa-msg--' + msg.from;
    span.textContent = msg.text;
    row.appendChild(span);
    container.appendChild(row);
    container.scrollTop = container.scrollHeight;
    step++;
    setTimeout(showNext, msg.from === 'agent' ? 1200 : 800);
  }
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.create({ trigger:'.wa-demo-container', start:'top 75%', once:true, onEnter:()=>showNext() });
  } else { showNext(); }
}
```

- [ ] **Step 3: CSS da demo**

```css
.wa-msg { display:flex; margin-bottom:4px; }
.wa-msg span { display:inline-block; max-width:78%; padding:10px 14px; border-radius:12px; font-size:0.875rem; line-height:1.5; animation:msgIn 0.3s ease-out; }
.wa-msg--client { justify-content:flex-end; }
.wa-msg--client span { background:rgba(37,99,235,0.2); color:#F0F4FF; border-bottom-right-radius:4px; }
.wa-msg--agent  span { background:rgba(124,58,237,0.2); color:#F0F4FF; border-bottom-left-radius:4px; }
@media (max-width:639px) { .wa-msg:nth-child(n+4) { display:none; } }
```

- [ ] **Step 4: Verificar demo conversa ao scrollar para a seção**

- [ ] **Step 5: Commit**
```bash
git add index.html js/main.js css/styles.css
git commit -m "feat: S4 Solucao — copy e demo WhatsApp animado"
```

---

### Task 12: S5 — Prova Social

**Files:**
- Modify: `index.html` (template page-home)
- Modify: `css/styles.css`

- [ ] **Step 1: Adicionar HTML da S5 (3 cards — copy OAB-safe para Osvaldo)**

```html
<section class="s5-proof py-24 lg:py-36 px-5">
  <div class="max-w-6xl mx-auto">
    <div class="text-center mb-16 gsap-reveal">
      <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(234,179,8,0.3)] bg-[rgba(234,179,8,0.05)] mb-6">
        <span class="text-yellow-400 text-xs font-semibold uppercase tracking-widest">Resultados reais</span>
      </div>
      <h2 class="font-display font-bold text-[#F0F4FF]" style="font-size:clamp(1.75rem,4vw,2.75rem);">
        Pessoas que <span class="gradient-text">pararam de perder vendas</span>
      </h2>
    </div>
    <div class="proof-cards-wrapper">
      <div class="proof-cards-track">
        <div class="proof-card glass-card rounded-2xl p-8 gsap-reveal">
          <div class="text-5xl font-display font-bold text-[#22D3EE] mb-1">+8h</div>
          <div class="text-[#22D3EE] text-sm font-semibold mb-5">livres por dia</div>
          <p class="text-[#94A3B8] text-sm leading-relaxed mb-6 italic">"Antes eu passava o dia inteiro atendendo clientes. Agora a IA cuida disso e eu foco 100% na estrategia."</p>
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-[#2563EB] to-[#22D3EE] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">AS</div>
            <div><p class="text-[#F0F4FF] font-semibold text-sm">Alexandre Sampaio</p><p class="text-[#475569] text-xs">CEO · Olore</p></div>
          </div>
          <div class="flex gap-0.5"><i class="fas fa-star text-yellow-400 text-xs"></i><i class="fas fa-star text-yellow-400 text-xs"></i><i class="fas fa-star text-yellow-400 text-xs"></i><i class="fas fa-star text-yellow-400 text-xs"></i><i class="fas fa-star text-yellow-400 text-xs"></i></div>
        </div>
        <div class="proof-card glass-card rounded-2xl p-8 gsap-reveal">
          <div class="text-5xl font-display font-bold text-[#25D366] mb-1">+20h</div>
          <div class="text-[#25D366] text-sm font-semibold mb-5">livres por semana</div>
          <p class="text-[#94A3B8] text-sm leading-relaxed mb-6 italic">"Passava horas explicando prazos e documentos para cada cliente. Hoje a IA faz isso automaticamente. Meu tempo ficou para o que realmente importa."</p>
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-[#059669] to-[#22D3EE] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">OM</div>
            <div><p class="text-[#F0F4FF] font-semibold text-sm">Osvaldo de Melo</p><p class="text-[#475569] text-xs">Advogado · Matos de Melo Advocacia</p></div>
          </div>
          <div class="flex gap-0.5"><i class="fas fa-star text-yellow-400 text-xs"></i><i class="fas fa-star text-yellow-400 text-xs"></i><i class="fas fa-star text-yellow-400 text-xs"></i><i class="fas fa-star text-yellow-400 text-xs"></i><i class="fas fa-star text-yellow-400 text-xs"></i></div>
        </div>
        <div class="proof-card glass-card rounded-2xl p-8 gsap-reveal">
          <div class="text-5xl font-display font-bold text-[#E040FB] mb-1">24/7</div>
          <div class="text-[#E040FB] text-sm font-semibold mb-5">vendas toda madrugada</div>
          <p class="text-[#94A3B8] text-sm leading-relaxed mb-6 italic">"Antes eu so vendia quando estava online. Hoje a IA vende enquanto eu durmo."</p>
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#E040FB] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">EO</div>
            <div><p class="text-[#F0F4FF] font-semibold text-sm">Eduarda Oliveira</p><p class="text-[#475569] text-xs">Dona · Little Loja Infantil</p></div>
          </div>
          <div class="flex gap-0.5"><i class="fas fa-star text-yellow-400 text-xs"></i><i class="fas fa-star text-yellow-400 text-xs"></i><i class="fas fa-star text-yellow-400 text-xs"></i><i class="fas fa-star text-yellow-400 text-xs"></i><i class="fas fa-star text-yellow-400 text-xs"></i></div>
        </div>
      </div>
    </div>
    <div class="text-center mt-12 gsap-reveal">
      <p class="text-[#475569] mb-3 text-sm">Voce tambem pode ter esses resultados.</p>
      <a id="proof-wa-btn" href="#" target="_blank" rel="noopener"
         class="inline-flex items-center gap-2 text-[#25D366] hover:text-[#1ebe5d] font-semibold transition-colors text-sm"
         onclick="WA && WA.track('social_proof')">
        <i class="fab fa-whatsapp"></i> Falar no WhatsApp agora
      </a>
    </div>
  </div>
</section>
```

- [ ] **Step 2: CSS proof cards**

```css
.proof-cards-track { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; }
@media (max-width:1023px) {
  .proof-cards-wrapper { overflow-x:auto; padding-bottom:16px; }
  .proof-cards-track { display:flex; scroll-snap-type:x mandatory; gap:16px; -webkit-overflow-scrolling:touch; }
  .proof-card { flex:0 0 300px; scroll-snap-align:start; }
}
```

- [ ] **Step 3: Commit**
```bash
git add index.html css/styles.css
git commit -m "feat: S5 Prova Social — cards com numeros e scroll snap mobile"
```

---

### Task 13: S6 — Como Funciona (3 passos + linha SVG animada)

**Files:**
- Modify: `index.html` (template page-home)

- [ ] **Step 1: Adicionar HTML da S6**

```html
<section class="s6-how py-24 lg:py-36 px-5">
  <div class="max-w-5xl mx-auto">
    <div class="text-center mb-16 gsap-reveal">
      <h2 class="font-display font-bold text-[#F0F4FF] mb-3" style="font-size:clamp(1.75rem,4vw,2.75rem);">
        Simples de comecar. <span class="gradient-text">Poderoso de usar.</span>
      </h2>
      <p class="text-[#94A3B8]">Do diagnostico ao seu Agente ativo em 7 dias.</p>
    </div>
    <div class="how-steps-wrapper relative">
      <svg class="how-connector hidden lg:block absolute top-12 left-0 w-full" height="4" viewBox="0 0 1000 4" preserveAspectRatio="none" aria-hidden="true">
        <line id="connector-line" x1="0" y1="2" x2="1000" y2="2" stroke="url(#connGrad)" stroke-width="2" stroke-dasharray="1000" stroke-dashoffset="1000"/>
        <defs><linearGradient id="connGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#E040FB"/><stop offset="50%" stop-color="#7C3AED"/><stop offset="100%" stop-color="#22D3EE"/></linearGradient></defs>
      </svg>
      <div class="grid lg:grid-cols-3 gap-8 lg:gap-12 relative">
        <div class="how-step gsap-reveal text-center">
          <div class="w-24 h-24 rounded-full border-2 border-[rgba(224,64,251,0.4)] bg-[rgba(224,64,251,0.08)] flex items-center justify-center mx-auto mb-6 relative z-10">
            <span class="font-display font-bold text-[#E040FB] text-3xl">1</span>
          </div>
          <h3 class="font-display font-bold text-[#F0F4FF] text-xl mb-3">Diagnostico</h3>
          <p class="text-[#94A3B8] text-sm leading-relaxed">1 conversa de 30 minutos.<br>Entendemos seu negocio.</p>
        </div>
        <div class="how-step gsap-reveal text-center">
          <div class="w-24 h-24 rounded-full border-2 border-[rgba(124,58,237,0.4)] bg-[rgba(124,58,237,0.08)] flex items-center justify-center mx-auto mb-6 relative z-10">
            <span class="font-display font-bold text-[#7C3AED] text-3xl">2</span>
          </div>
          <h3 class="font-display font-bold text-[#F0F4FF] text-xl mb-3">Configuracao</h3>
          <p class="text-[#94A3B8] text-sm leading-relaxed">Montamos e treinamos<br>seu Agente em 7 dias.</p>
        </div>
        <div class="how-step gsap-reveal text-center">
          <div class="w-24 h-24 rounded-full border-2 border-[rgba(34,211,238,0.4)] bg-[rgba(34,211,238,0.08)] flex items-center justify-center mx-auto mb-6 relative z-10">
            <span class="font-display font-bold text-[#22D3EE] text-3xl">3</span>
          </div>
          <h3 class="font-display font-bold text-[#F0F4FF] text-xl mb-3">Resultado</h3>
          <p class="text-[#94A3B8] text-sm leading-relaxed">Voce ativa.<br>Ele trabalha. Para sempre.</p>
        </div>
      </div>
    </div>
    <div class="text-center mt-14 gsap-reveal">
      <a id="how-wa-btn" href="#" target="_blank" rel="noopener"
         class="inline-flex items-center gap-2 text-[#22D3EE] hover:text-[#F0F4FF] font-semibold transition-colors"
         onclick="WA && WA.track('how_it_works')">
        <i class="fab fa-whatsapp text-[#25D366]"></i> Comecar em 7 dias
      </a>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Commit**
```bash
git add index.html
git commit -m "feat: S6 Como Funciona — 3 passos e linha SVG"
```

---

### Task 14: S7 — Planos (6 cards com CTAs dinâmicos)

**Files:**
- Modify: `index.html` (template page-home)
- Modify: `css/styles.css`

- [ ] **Step 1: Adicionar HTML da S7 com 6 planos**

```html
<section class="s7-plans py-24 lg:py-36 px-5">
  <div class="max-w-7xl mx-auto">
    <div class="text-center mb-16 gsap-reveal">
      <h2 class="font-display font-bold text-[#F0F4FF] mb-3" style="font-size:clamp(1.75rem,4vw,2.75rem);">
        Escolha o <span class="gradient-text">Genio certo</span> para o seu negocio
      </h2>
      <p class="text-[#475569] text-sm">Todos incluem 7 dias de garantia · Sem fidelidade</p>
    </div>
    <div class="plans-track">
      <div class="plan-card glass-card rounded-2xl p-6 gsap-reveal"><div class="text-[#94A3B8] text-xs font-semibold uppercase tracking-widest mb-3">Essencial</div><div class="text-[#F0F4FF] font-display font-bold text-3xl mb-1">R$490<span class="text-[#475569] text-sm font-normal">/mes</span></div><div class="text-[#475569] text-xs mb-5">+ R$699 implantacao</div><ul class="space-y-2 mb-7 text-sm text-[#94A3B8]"><li class="flex items-center gap-2"><i class="fas fa-check text-[#22D3EE] text-xs"></i>Atendimento 24/7</li><li class="flex items-center gap-2"><i class="fas fa-check text-[#22D3EE] text-xs"></i>1.500 atendimentos/mes</li><li class="flex items-center gap-2"><i class="fas fa-check text-[#22D3EE] text-xs"></i>Coleta de leads</li></ul><a class="plan-wa-btn block text-center py-3 rounded-xl border border-[rgba(99,102,241,0.2)] text-[#94A3B8] hover:border-[rgba(124,58,237,0.4)] hover:text-[#F0F4FF] transition-all text-sm font-semibold" data-plan="Essencial" href="#" target="_blank" onclick="WA&&WA.track('plans')">Quero este plano</a></div>
      <div class="plan-card glass-card rounded-2xl p-6 gsap-reveal"><div class="text-[#94A3B8] text-xs font-semibold uppercase tracking-widest mb-3">Avancado</div><div class="text-[#F0F4FF] font-display font-bold text-3xl mb-1">R$690<span class="text-[#475569] text-sm font-normal">/mes</span></div><div class="text-[#475569] text-xs mb-5">+ R$1.200 implantacao</div><ul class="space-y-2 mb-7 text-sm text-[#94A3B8]"><li class="flex items-center gap-2"><i class="fas fa-check text-[#22D3EE] text-xs"></i>2.500 atendimentos/mes</li><li class="flex items-center gap-2"><i class="fas fa-check text-[#22D3EE] text-xs"></i>Agendamento automatico</li><li class="flex items-center gap-2"><i class="fas fa-check text-[#22D3EE] text-xs"></i>2 agendas</li></ul><a class="plan-wa-btn block text-center py-3 rounded-xl border border-[rgba(99,102,241,0.2)] text-[#94A3B8] hover:border-[rgba(124,58,237,0.4)] hover:text-[#F0F4FF] transition-all text-sm font-semibold" data-plan="Avancado" href="#" target="_blank" onclick="WA&&WA.track('plans')">Quero este plano</a></div>
      <div class="plan-card plan-card--featured glass-card rounded-2xl p-6 gsap-reveal relative"><div class="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#E040FB] to-[#22D3EE] text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">Mais escolhido</div><div class="text-[#E040FB] text-xs font-semibold uppercase tracking-widest mb-3 mt-2">Performance</div><div class="text-[#F0F4FF] font-display font-bold text-3xl mb-1">R$990<span class="text-[#475569] text-sm font-normal">/mes</span></div><div class="text-[#475569] text-xs mb-5">+ R$1.800 implantacao</div><ul class="space-y-2 mb-7 text-sm text-[#94A3B8]"><li class="flex items-center gap-2"><i class="fas fa-check text-[#E040FB] text-xs"></i>4.000 atendimentos/mes</li><li class="flex items-center gap-2"><i class="fas fa-check text-[#E040FB] text-xs"></i>Follow-up automatico</li><li class="flex items-center gap-2"><i class="fas fa-check text-[#E040FB] text-xs"></i>5 agendas</li></ul><a class="plan-wa-btn block text-center py-3 rounded-xl bg-gradient-to-r from-[#E040FB] to-[#22D3EE] text-white font-bold hover:opacity-90 transition text-sm" data-plan="Performance" href="#" target="_blank" onclick="WA&&WA.track('plans')">Quero este plano</a></div>
      <div class="plan-card glass-card rounded-2xl p-6 gsap-reveal"><div class="text-[#94A3B8] text-xs font-semibold uppercase tracking-widest mb-3">Premium</div><div class="text-[#F0F4FF] font-display font-bold text-3xl mb-1">R$1.490<span class="text-[#475569] text-sm font-normal">/mes</span></div><div class="text-[#475569] text-xs mb-5">+ R$2.500 implantacao</div><ul class="space-y-2 mb-7 text-sm text-[#94A3B8]"><li class="flex items-center gap-2"><i class="fas fa-check text-[#22D3EE] text-xs"></i>8.000 atendimentos/mes</li><li class="flex items-center gap-2"><i class="fas fa-check text-[#22D3EE] text-xs"></i>Cobranca automatica</li><li class="flex items-center gap-2"><i class="fas fa-check text-[#22D3EE] text-xs"></i>10 agendas</li></ul><a class="plan-wa-btn block text-center py-3 rounded-xl border border-[rgba(99,102,241,0.2)] text-[#94A3B8] hover:border-[rgba(124,58,237,0.4)] hover:text-[#F0F4FF] transition-all text-sm font-semibold" data-plan="Premium" href="#" target="_blank" onclick="WA&&WA.track('plans')">Quero este plano</a></div>
      <div class="plan-card glass-card rounded-2xl p-6 gsap-reveal"><div class="text-[#94A3B8] text-xs font-semibold uppercase tracking-widest mb-3">Elite</div><div class="text-[#F0F4FF] font-display font-bold text-3xl mb-1">R$2.490<span class="text-[#475569] text-sm font-normal">/mes</span></div><div class="text-[#475569] text-xs mb-5">+ R$3.500 implantacao</div><ul class="space-y-2 mb-7 text-sm text-[#94A3B8]"><li class="flex items-center gap-2"><i class="fas fa-check text-[#22D3EE] text-xs"></i>15.000 atendimentos/mes</li><li class="flex items-center gap-2"><i class="fas fa-check text-[#22D3EE] text-xs"></i>Dashboard estrategico</li><li class="flex items-center gap-2"><i class="fas fa-check text-[#22D3EE] text-xs"></i>Pipeline de vendas</li></ul><a class="plan-wa-btn block text-center py-3 rounded-xl border border-[rgba(99,102,241,0.2)] text-[#94A3B8] hover:border-[rgba(124,58,237,0.4)] hover:text-[#F0F4FF] transition-all text-sm font-semibold" data-plan="Elite" href="#" target="_blank" onclick="WA&&WA.track('plans')">Quero este plano</a></div>
      <div class="plan-card glass-card rounded-2xl p-6 gsap-reveal"><div class="text-[#94A3B8] text-xs font-semibold uppercase tracking-widest mb-3">Enterprise</div><div class="text-[#F0F4FF] font-display font-bold text-3xl mb-1">Sob consulta</div><div class="text-[#475569] text-xs mb-5">Implantacao a partir de R$14.900</div><ul class="space-y-2 mb-7 text-sm text-[#94A3B8]"><li class="flex items-center gap-2"><i class="fas fa-check text-[#22D3EE] text-xs"></i>Sem limites</li><li class="flex items-center gap-2"><i class="fas fa-check text-[#22D3EE] text-xs"></i>Integracoes complexas</li><li class="flex items-center gap-2"><i class="fas fa-check text-[#22D3EE] text-xs"></i>SLA dedicado</li></ul><a class="plan-wa-btn block text-center py-3 rounded-xl border border-[rgba(99,102,241,0.2)] text-[#94A3B8] hover:border-[rgba(124,58,237,0.4)] hover:text-[#F0F4FF] transition-all text-sm font-semibold" data-plan="Enterprise" href="#" target="_blank" onclick="WA&&WA.track('plans')">Falar sobre Enterprise</a></div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: CSS planos**

```css
.plans-track { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
.plan-card--featured { box-shadow:0 0 24px 4px rgba(180,0,166,0.35),0 0 48px 8px rgba(180,0,166,0.15); border-color:rgba(124,58,237,0.35) !important; transform:scale(1.02); }
@media (max-width:1279px) { .plans-track { grid-template-columns:repeat(2,1fr); } }
@media (max-width:767px) {
  .plans-track { display:flex; overflow-x:auto; scroll-snap-type:x mandatory; gap:16px; padding:8px 4px 16px; -webkit-overflow-scrolling:touch; }
  .plan-card { flex:0 0 280px; scroll-snap-align:start; }
}
```

- [ ] **Step 3: Verificar — card Performance destacado, scroll snap no mobile**

- [ ] **Step 4: Commit**
```bash
git add index.html css/styles.css
git commit -m "feat: S7 Planos — 6 cards com destaque Performance e scroll snap"
```

---

### Task 15: S8 — CTA Final + limpar seções antigas

**Files:**
- Modify: `index.html` (template page-home)

- [ ] **Step 1: Adicionar HTML da S8 como último elemento do template page-home**

```html
<section class="s8-final relative py-36 px-5 overflow-hidden text-center">
  <div class="s8-bg-pulse absolute inset-0 pointer-events-none" style="background:radial-gradient(ellipse at center,rgba(124,58,237,0.15) 0%,transparent 65%);animation:bgPulse 4s ease-in-out infinite;"></div>
  <div class="relative max-w-3xl mx-auto" style="z-index:var(--z-content,10);">
    <h2 class="font-display font-bold text-[#F0F4FF] mb-6 gsap-reveal" style="font-size:clamp(2rem,5vw,3.5rem);line-height:1.15;">
      Seu concorrente<br><span class="gradient-text">ja esta usando IA.</span>
    </h2>
    <p class="text-[#94A3B8] mb-10 gsap-reveal" style="font-size:clamp(1rem,2vw,1.2rem);line-height:1.7;">
      Cada dia sem automacao e dinheiro deixado na mesa.<br>A conversa e gratuita. A decisao e sua.
    </p>
    <div class="gsap-reveal">
      <a id="final-wa-btn" href="#" target="_blank" rel="noopener"
         class="inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold rounded-xl transition-all duration-300 pulse-cta mx-auto"
         style="padding:20px 48px;font-size:1.2rem;min-width:300px;max-width:480px;width:100%;"
         onclick="WA && WA.track('final')">
        <i class="fab fa-whatsapp text-2xl"></i>
        Falar com a AutoGenius agora
      </a>
    </div>
    <div class="gsap-reveal mt-6 flex items-center justify-center gap-4 text-[#475569] text-xs flex-wrap">
      <span class="flex items-center gap-1"><i class="fas fa-lock text-green-400"></i> Garantia de 7 dias</span>
      <span>·</span><span>Sem fidelidade</span><span>·</span><span>Implementacao em 7 dias</span>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Remover seções antigas do template page-home**

Dentro do `<template id="page-home">`, deletar completamente:
- Seção "Human Empowerment Results" (`<!-- Human Empowerment Results Section -->`)
- Seção "Visionary Testimonials" (`<!-- Visionary Testimonials Section -->`)
- Seção "Visionary Leadership" (`id="sobre"`)
- Seção "ROI Calculator"
- Seção "Certifications & Awards"

- [ ] **Step 3: Verificar — home tem exatamente S1 a S8 em sequência**

- [ ] **Step 4: Commit**
```bash
git add index.html
git commit -m "feat: S8 CTA Final + remocao de secoes antigas da home"
```

---

## FASE 5 — JS: Orquestração e Counters

### Task 16: initializeHomeScrollAnimations

**Files:**
- Modify: `js/main.js`

- [ ] **Step 1: Criar função initializeHomeScrollAnimations**

```js
function initializeHomeScrollAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  // Reveals genéricos
  gsap.utils.toArray('.gsap-reveal').forEach(el => {
    gsap.fromTo(el, { opacity:0, y:30 },
      { opacity:1, y:0, duration:0.7, ease:'power3.out',
        scrollTrigger:{ trigger:el, start:'top 85%', toggleActions:'play none none none' } });
  });

  // S2: pain lines stagger (runs on all screen sizes — simple fade-in, no pin)
  gsap.utils.toArray('.pain-line').forEach(el => {
    gsap.fromTo(el, { opacity:0, x:-30 },
      { opacity:1, x:0, duration:0.6, ease:'power2.out',
        scrollTrigger:{ trigger:el, start:'top 85%', toggleActions:'play none none none' } });
  });

  // S3: flash + reveal (runs on all screen sizes — simple reveal, no pin)
  const s3 = document.querySelector('.s3-break');
  if (s3) {
    const flash = s3.querySelector('.s3-flash-overlay');
    const glow  = s3.querySelector('.s3-bg-glow');
    const q     = s3.querySelector('.s3-question');
    if (flash && glow && q) {
      gsap.set(q, { opacity:0, scale:0.92 });
      ScrollTrigger.create({ trigger:s3, start:'top 60%', once:true,
        onEnter: () => {
          gsap.to(flash, { opacity:0.15, duration:0.15, yoyo:true, repeat:1 });
          gsap.to(glow,  { opacity:1, duration:0.8, ease:'power2.out', delay:0.1 });
          gsap.to(q,     { opacity:1, scale:1, duration:1, ease:'power3.out', delay:0.2 });
        }
      });
    }
  }

  // S2 + S3 SCROLL PINS — desktop only (≥640px)
  // On mobile these sections use the simple stagger/reveal above (no pin: true)
  // because scroll-jail on mobile causes broken UX. The matchMedia wrapper
  // ensures pins are never created on viewports < 640px.
  ScrollTrigger.matchMedia({
    '(min-width: 640px)': function() {
      // S2: pin the pain section for 300px so lines stagger in while scrolling
      const s2 = document.querySelector('.s2-pain');
      if (s2) {
        ScrollTrigger.create({
          trigger: s2,
          start: 'top top',
          end: '+=300',
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
        });
      }
      // S3: brief pin so the break phrase lands before user scrolls past
      if (s3) {
        ScrollTrigger.create({
          trigger: s3,
          start: 'top top',
          end: '+=200',
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
        });
      }
    }
  });

  // S6: SVG connector line
  const line = document.getElementById('connector-line');
  if (line) {
    gsap.to(line, { strokeDashoffset:0, duration:1.5, ease:'power2.inOut',
      scrollTrigger:{ trigger:'.how-steps-wrapper', start:'top 70%' } });
  }

  // CTAs dinâmicos WhatsApp (section-level — hero btn wired in initializeHeroAnimations)
  if (typeof WA === 'undefined') return;
  const ids = { 'proof-wa-btn':'social', 'how-wa-btn':'howItWorks', 'final-wa-btn':'final' };
  Object.entries(ids).forEach(([id, key]) => {
    const el = document.getElementById(id);
    if (el) el.href = WA.url(key);
  });
  document.querySelectorAll('.plan-wa-btn[data-plan]').forEach(btn => {
    btn.href = WA.url('plans', btn.dataset.plan);
  });
}
```

- [ ] **Step 2: Verificar animações de scroll em sequência do hero até o CTA final**

- [ ] **Step 3: Commit**
```bash
git add js/main.js
git commit -m "feat: initializeHomeScrollAnimations — GSAP reveals, S3 flash, S6 SVG, CTAs WA"
```

---

### Task 17: Stats counters animados

**Files:**
- Modify: `js/main.js`

- [ ] **Step 1: Reescrever initializeAnimatedCounters**

```js
function initializeAnimatedCounters() {
  if (typeof gsap === 'undefined') return;
  document.querySelectorAll('.counter[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    gsap.fromTo(el, { innerText:0 },
      { innerText:target, duration:1.5, ease:'power2.out', snap:{ innerText:1 },
        scrollTrigger:{ trigger:el, start:'top 90%', toggleActions:'play none none none' },
        onUpdate() { el.textContent = Math.round(parseFloat(el.innerText)); }
      });
  });
}
```

- [ ] **Step 2: Verificar — 50+, 300%, 7d contam a partir de 0 ao entrar na viewport**

- [ ] **Step 3: Commit**
```bash
git add js/main.js
git commit -m "feat: stats counters animados com GSAP ScrollTrigger"
```

---

## FASE 6 — noscript + Página #contato

### Task 18: noscript e CTA WhatsApp na página contato

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Substituir bloco noscript dentro do main**

```html
<noscript>
  <div style="padding:2rem;color:#F0F4FF;background:#03061A;max-width:900px;margin:0 auto;font-family:sans-serif;text-align:center;">
    <h1 style="font-size:2rem;margin-bottom:1rem;">Enquanto voce dormia, um concorrente respondeu o seu cliente.</h1>
    <p style="color:#94A3B8;margin-bottom:2rem;">Agentes de IA que respondem, qualificam e fecham vendas no WhatsApp 24/7.</p>
    <a href="https://wa.me/5581991471765?text=Ola!%20Quero%20automatizar%20meu%20atendimento%20com%20IA."
       style="display:inline-block;background:#25D366;color:white;padding:16px 32px;border-radius:12px;font-weight:bold;text-decoration:none;font-size:1.1rem;">
      Falar agora no WhatsApp
    </a>
  </div>
</noscript>
```

- [ ] **Step 2: Adicionar CTA WhatsApp primário no template page-contato (antes do formulário)**

```html
<div class="text-center mb-12 py-8">
  <p class="text-[#94A3B8] mb-4 text-sm">Prefere uma resposta mais rapida?</p>
  <a href="https://wa.me/5581991471765?text=Ola!%20Quero%20saber%20mais%20sobre%20a%20AutoGenius."
     target="_blank" rel="noopener"
     class="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold px-8 py-4 rounded-xl transition-all duration-300"
     onclick="WA && WA.track('contact_page')">
    <i class="fab fa-whatsapp text-xl"></i> Falar no WhatsApp agora
  </a>
  <p class="text-[#475569] text-xs mt-3">Ou preencha o formulario abaixo</p>
</div>
```

- [ ] **Step 3: Verificar noscript — desabilitar JS no browser, recarregar, confirmar CTA visível**

- [ ] **Step 4: Commit**
```bash
git add index.html
git commit -m "feat: noscript navy + CTA WhatsApp primario na pagina contato"
```

---

## FASE 7 — QA Final

### Task 19: QA Mobile + acessibilidade + GA4

- [ ] **Step 1: Testar 375px (iPhone SE)**
  - [ ] Hero: headline em 3 linhas, botão WA largura total
  - [ ] S2: frases legíveis
  - [ ] S4: demo WA 3 mensagens, layout coluna única
  - [ ] S5: scroll snap nos cards
  - [ ] S7: scroll snap nos planos
  - [ ] S8: botão CTA largura total
  - [ ] Float WA: visível, não sobrepõe conteúdo

- [ ] **Step 2: Testar prefers-reduced-motion**

  DevTools → Rendering → Emulate: `prefers-reduced-motion: reduce`
  - [ ] Animações decorativas desabilitadas
  - [ ] Botão WA flutuante mostra ring estático

- [ ] **Step 3: Verificar zero console errors**

- [ ] **Step 4: Verificar GA4 — clicar em cada CTA, confirmar evento whatsapp_click**

  Seções esperadas: `hero`, `social_proof`, `how_it_works`, `plans`, `final`, `float`, `nav`

- [ ] **Step 5: Commit final + tag**

```bash
git add .
git commit -m "chore: QA final — mobile, acessibilidade, GA4 verificados"
git tag -a v2.0.0 -m "feat: redesign completo dark navy storytelling WhatsApp"
```

---

## Checklist de Conclusão

- [ ] Fundo navy `#03061A` — não preto quente
- [ ] Gradiente espelha a logo (magenta → roxo → azul → cyan)
- [ ] Three.js removido do head global
- [ ] Lenis ativo na home, parado nas páginas secundárias
- [ ] Cada CTA WhatsApp tem mensagem diferente e encodada
- [ ] Card Osvaldo sem linguagem comercial (OAB-safe)
- [ ] Stats contam de 0 ao valor ao entrar na viewport
- [ ] Demo WhatsApp roda em loop
- [ ] Linha SVG da S6 se desenha no scroll
- [ ] Planos com scroll snap mobile
- [ ] CTA final pulsando
- [ ] Botão flutuante: tooltip desktop, sem tooltip touch
- [ ] GA4 `whatsapp_click` com `section` correto
- [ ] prefers-reduced-motion respeitado
- [ ] noscript com CTA WhatsApp visível
- [ ] Zero console errors
