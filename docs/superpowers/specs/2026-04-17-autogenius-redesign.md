# AutoGenius AI — Redesign Spec
**Data:** 2026-04-17
**Objetivo:** Transformar o site em uma carta de vendas interativa que guia o visitante do problema à conversão via WhatsApp, com experiência visual premium estilo Lando Norris / Aino Agency.

---

## Contexto

O site atual é uma SPA com roteamento por hash. A home está fragmentada em seções repetitivas sem narrativa progressiva. O hero usa Three.js (pesado no mobile). Há dois CTAs paralelos (formulário + WhatsApp) diluindo a conversão.

**Decisões tomadas:**
- Arquitetura híbrida: home vira scroll único, páginas secundárias mantêm templates separados
- CTA primário exclusivo: WhatsApp direto (`wa.me/5581991471765`)
- Formulário `#contato` mantido como fallback secundário (não promovido ativamente)
- Prova social: depoimentos curtos + números de resultado
- Globo Three.js removido → canvas de partículas leve + reativo ao mouse
- **Paleta: sai do preto quente → entra dark navy azul profundo** (mais profissional, menos tech)

---

## Identidade Visual — Nova Direção de Cores

### Referência: Logo AutoGenius
A logo usa gradiente **magenta → roxo → azul → ciano** (da esquerda para a direita/baixo).
Toda a paleta do site espelha esse gradiente.

### Paleta de Cores

**Backgrounds (dark navy — substitui o preto atual):**
```css
--bg-base:     #03061A   /* fundo principal — navy quase preto, claramente azul */
--bg-surface:  #070D28   /* cards e superfícies elevadas */
--bg-card:     rgba(7, 13, 40, 0.75)   /* glassmorphism */
--bg-section:  #050A22   /* alternância de seção */
```

**Por que navy e não preto:**
- Preto puro (#000 ou #06050e) parece "hacker" / heavy metal
- Navy escuro (#03061A) parece Palantir, Linear, Vercel — autoridade tecnológica premium
- A logo tem azul como cor dominante — o fundo precisa ressoar com ela

**Gradiente de marca (espelha a logo):**
```css
--gradient-brand: linear-gradient(135deg, #E040FB 0%, #7C3AED 40%, #2563EB 70%, #22D3EE 100%);
--gradient-text:  linear-gradient(90deg, #E040FB 0%, #7C3AED 50%, #22D3EE 100%);
```

**Cores de acento:**
```css
--accent-magenta: #E040FB   /* logo cor 1 — CTAs secundários, badges */
--accent-purple:  #7C3AED   /* logo cor 2 — borders, glows */
--accent-blue:    #2563EB   /* logo cor 3 — destaques de texto */
--accent-cyan:    #22D3EE   /* logo cor 4 — stats, ícones, links */
--accent-green:   #25D366   /* WhatsApp — exclusivo para CTAs WhatsApp */
```

**Texto:**
```css
--text-primary:   #F0F4FF   /* quase branco com toque azul frio */
--text-secondary: #94A3B8   /* cinza azulado */
--text-muted:     #475569   /* para labels e textos pequenos */
```

**Borders:**
```css
--border-subtle:  rgba(99, 102, 241, 0.12)   /* borda azul quase invisível */
--border-active:  rgba(124, 58, 237, 0.35)   /* borda iluminada em hover */
```

### Glow Effects (navy-aware)
Em fundo navy, glows azuis/roxos funcionam melhor que os purpura quentes do site atual:
```css
--glow-purple: 0 0 40px rgba(124, 58, 237, 0.3), 0 0 80px rgba(124, 58, 237, 0.1);
--glow-blue:   0 0 40px rgba(37, 99, 235, 0.25), 0 0 80px rgba(37, 99, 235, 0.08);
--glow-brand:  0 0 60px rgba(224, 64, 251, 0.2), 0 0 120px rgba(34, 211, 238, 0.1);
```

### Fluência Visual entre Seções
O background não muda abruptamente entre seções — usa gradiente contínuo vertical:
```css
body {
  background: linear-gradient(
    to bottom,
    #03061A 0%,      /* S1 Hero */
    #050A22 25%,     /* S2 Dor */
    #040818 40%,     /* S3 Quebra */
    #050D24 55%,     /* S4 Solução */
    #03061A 70%,     /* S5 Prova */
    #060F28 85%,     /* S6-S7 */
    #03061A 100%     /* S8 CTA Final */
  );
  background-attachment: fixed;
}
```
Cada seção "emerge" do mesmo fundo contínuo em vez de ter blocos de cor separados — isso é o que cria a sensação de fluxo dos sites de referência.

### Referências de Estilo com Este Tom
- **Linear.app** — dark navy, tipo limpo, gradientes sutis
- **Vercel.com** — navy profundo, espaço negativo, CTAs azuis
- **Palantir.com** — autoridade, premium, sem excessos visuais
- **Stripe.com** — gradient de marca fluindo pelo conteúdo

O diferencial da AutoGenius: **os mesmos princípios premium, mas com o gradiente vibrante da logo** (magenta → cyan) como assinatura visual em títulos, CTAs e elementos de destaque.

---

## WhatsApp como Canal Central (CRÍTICO)

O WhatsApp precisa estar presente e visível em **todo momento** da navegação:

### 1. Botão Flutuante Fixo
- Canto inferior direito, sempre visível
- Verde #25D366, ícone WhatsApp, tamanho 64px (mobile: 60px)
- Animação de pulso suave a cada 4s para chamar atenção
- Tooltip ao hover desktop: "Fale agora — resposta em minutos"
- Link: `https://wa.me/5581991471765?text=Olá!%20Vi%20o%20site%20e%20quero%20saber%20mais%20sobre%20os%20Agentes%20de%20IA.`

### 2. CTA Hero (primário)
- Botão verde, texto: **"→ Falar agora no WhatsApp"**
- Ocupa largura total no mobile
- Pulsa suavemente (keyframe scale 1 → 1.03 → 1)
- Mensagem pré-preenchida: "Olá! Quero automatizar meu atendimento com IA."

### 3. CTAs Intermediários (Seções 5, 6)
- Após depoimentos: `"Quero resultados assim → WhatsApp"`
- Após Como Funciona: `"Começar em 7 dias → WhatsApp"`
- Estilo: texto com seta, sem botão cheio — não compete com o CTA principal

### 4. CTA Final (Seção 8)
- Botão verde gigante, centralizado, pulsando
- Texto: **"Falar com a AutoGenius agora →"**
- Subtexto abaixo: "Resposta em minutos · Sem compromisso"

### 5. Barra de Anúncio (topo)
- Manter barra atual mas simplificar copy:
  `⚡ Agentes de IA 24/7 · Implementação em 7 dias · Fale agora no WhatsApp`
- Toda a barra clicável → abre WhatsApp

### 6. Mensagens Pré-preenchidas por Contexto
Cada CTA envia uma mensagem diferente para qualificar o lead:
- Hero: "Quero automatizar meu atendimento com IA."
- Depoimentos: "Vi os resultados de outros clientes e quero saber mais."
- Planos: "Quero conhecer o plano [X] da AutoGenius."
- CTA Final: "Estou pronto para começar. Quero falar com a equipe."

---

## Implementação Técnica — Detalhes Críticos

### Lenis + GSAP ScrollTrigger (integração obrigatória)
Lenis deve ser inicializado **antes** do GSAP, e o ScrollTrigger deve usar o proxy do Lenis:
```js
const lenis = new Lenis({ lerp: 0.08, duration: 1.2 });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```
Versão a usar: `lenis` (pacote `lenis@1.x` via CDN — **não** `@studio-freight/lenis`).
CDN: `https://cdn.jsdelivr.net/npm/lenis@1.1.14/dist/lenis.min.js`

Lenis deve ser **pausado/destruído** quando o router carrega uma página secundária, e **reinicializado** ao retornar para home:
```js
// no navigate():
if (templateId === 'page-home') { lenis.start(); }
else { lenis.stop(); }
```

Qualquer chamada `window.scrollTo(0, 0)` no router deve ser substituída por:
```js
lenis.scrollTo(0, { immediate: true });
```

### Scroll Pins — Mobile
ScrollTrigger pins (`pinType: "fixed"`) são **desabilitados abaixo de 640px**:
```js
ScrollTrigger.matchMedia({
  "(min-width: 640px)": function() {
    // criar ScrollTriggers com pin: true aqui
  }
});
```
No mobile, S2 e S3 recebem `fade-in` simples sem pin.

### Three.js — Remoção Limpa
A tag `<script src="three.min.js">` fica no `<head>` global — deve ser **removida do head**. Se alguma página secundária precisar (verificar), adicionar como script dinâmico inline naquele template.

### WhatsApp CTAs — URLs Codificadas
**Todas** as mensagens pré-preenchidas devem usar URLs com `encodeURIComponent` geradas em JS, não hardcoded no HTML:
```js
const WA_BASE = 'https://wa.me/5581991471765?text=';
const WA_MESSAGES = {
  hero:        encodeURIComponent('Olá! Quero automatizar meu atendimento com IA.'),
  social:      encodeURIComponent('Vi os resultados de outros clientes e quero saber mais.'),
  howItWorks:  encodeURIComponent('Quero começar em 7 dias. Como funciona?'),
  final:       encodeURIComponent('Estou pronto para começar. Quero falar com a equipe.'),
  float:       encodeURIComponent('Olá! Vi o site e quero saber mais sobre os Agentes de IA.'),
};
// Para planos, dinâmico:
function waPlanUrl(planName) {
  return WA_BASE + encodeURIComponent(`Quero conhecer o plano ${planName} da AutoGenius.`);
}
```
Cada botão de plano deve ter `data-plan="Essencial"` (ou o nome correto) e um listener único:
```js
document.querySelectorAll('[data-plan]').forEach(btn => {
  btn.href = waPlanUrl(btn.dataset.plan);
});
```

### GA4 — Mapa de Eventos
```js
// Padrão para todos os cliques WhatsApp:
gtag('event', 'whatsapp_click', {
  section: 'hero' | 'pain' | 'solution' | 'social_proof' | 'how_it_works' | 'plans' | 'final' | 'float'
});
```

### Canvas Partículas — Performance
- `requestAnimationFrame` pausado quando `document.visibilityState === 'hidden'` (Page Visibility API)
- Frame rate cap: `if (elapsed < 16) return;` (máx 60fps)
- `will-change: contents` no `<canvas>`
- Fallback: se `canvas.getContext('2d')` retornar null, renderizar gradiente CSS simples

### Transição S3 — GPU Safe
A mudança de background **não** anima a propriedade `background` diretamente. Usa uma div absolutamente posicionada atrás do conteúdo:
```html
<div class="s3-bg-overlay" style="position:absolute; inset:0; opacity:0; background: radial-gradient(...)"></div>
```
GSAP anima apenas `opacity` desse overlay.

### Z-Index Stack
```
canvas particles:     z-index: 0
section content:      z-index: 10
sticky nav:           z-index: 100
floating WA button:   z-index: 200
WA tooltip:           z-index: 210
transition overlays:  z-index: 300
mobile menu:          z-index: 400
```

### Planos — Cards Mobile Scroll
```css
.plans-track {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  gap: 16px;
  padding: 0 16px;
  -webkit-overflow-scrolling: touch;
}
.plan-card {
  flex: 0 0 280px;
  scroll-snap-align: start;
}
```

### Stats Counter
Usar GSAP `innerText` tween, ativado por ScrollTrigger:
```js
gsap.to(el, {
  innerText: targetValue,
  duration: 1.5,
  ease: "power2.out",
  snap: { innerText: 1 },
  scrollTrigger: { trigger: el, start: "top 90%" }
});
```

### Font Loading
Space Grotesk já está no `<head>` atual. Confirmar que inclui `wght@700` para S3. Se não, adicionar ao link existente do Google Fonts.

### Demo WhatsApp (S4)
- `role="presentation"` no container + `aria-label="Demonstração de conversa com Agente de IA"` no elemento pai
- Mobile: mostrar apenas 3 mensagens via `@media (max-width: 639px) { .demo-msg:nth-child(n+4) { display: none; } }`
- Dimensões: `max-width: 380px`, `height: auto`, `overflow: hidden`

### Tooltip WA — Touch
```css
@media (pointer: coarse) { .wa-tooltip { display: none; } }
```

### prefers-reduced-motion
```css
@media (prefers-reduced-motion: reduce) {
  /* Decorativas: desabilitar */
  .gsap-reveal, .hero-particle-canvas, .s2-stagger, .s3-flash { animation: none !important; transition: none !important; }
  /* Funcionais: substituir por alternativa estática */
  .wa-pulse { animation: none; box-shadow: 0 0 0 3px rgba(37, 211, 102, 0.4); }
}
```

### noscript Fallback
O bloco `<noscript>` existente deve incluir:
- H1 estático da S1 com o copy novo
- Botão WhatsApp visível com link completo
- `opacity: 1; transform: none` via `.no-js` class no `<html>`

### Página #contato
A página `#contato` mantém o formulário existente, mas:
- O link de navegação "Contato" no nav é removido e substituído por um botão WhatsApp direto no nav
- Dentro da página #contato: o botão primário do formulário passa a ser secundário; é adicionado um CTA WhatsApp acima do formulário como opção principal

### Pulse Keyframe (único, compartilhado)
```css
@keyframes wa-pulse {
  0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.4); }
  50% { transform: scale(1.03); box-shadow: 0 0 0 8px rgba(37, 211, 102, 0); }
}
.pulse-cta { animation: wa-pulse 2s ease-in-out infinite; }
```
Aplicar em: botão flutuante, CTA hero, CTA final.

### box-shadow glow-purple (valor real)
```css
box-shadow: 0 0 24px 4px rgba(180, 0, 166, 0.35), 0 0 48px 8px rgba(180, 0, 166, 0.15);
```

---

## Arquitetura

### Stack mantida
- HTML/CSS/JS puro (sem framework)
- Tailwind CSS via CDN (manter por compatibilidade)
- GSAP 3.12 + ScrollTrigger (já instalado)
- Font Awesome 6 (já instalado)

### Adições
- **Lenis** (smooth scroll) — via CDN, ~8KB gzip
- Three.js **removido** da home (mantido apenas se necessário em outras páginas)
- Canvas API nativa para partículas (sem dependência externa)

### Roteamento
- Home (`#home` ou `/`) → scroll único com 8 seções
- Páginas secundárias (`#consultoria`, `#treinamentos`, `#tecnologia`, `#cases`, `#faq`, `#sobre`, `#contato`) → templates separados mantidos
- `#termos` e `#privacidade` → mantidos

---

## Seções da Home (ordem e fluxo)

### S1 — HERO
**Objetivo:** Hook imediato. Fazer o visitante reconhecer o problema em 3 segundos.

**Layout:**
- Viewport 100vh, tipografia domina 70% da tela
- Fundo: `#06050e` com canvas de partículas escuras reagindo ao cursor
- Grid de linhas sutis (purple/cyan, 3% opacidade) como background texture

**Copy:**
```
[badge] ● Referência em IA no Brasil

[H1 — reveal linha por linha, GSAP]
"Enquanto você dormia,
um concorrente respondeu
o seu cliente."

[subtítulo — aparece 0.5s depois]
Agentes de IA que respondem, qualificam e fecham vendas
no WhatsApp — 24 horas por dia, 7 dias por semana.

[CTA — aparece 0.3s depois do subtítulo]
[→ Falar agora no WhatsApp]   (verde, pulsando)

[stats — aparecem por último]
50+ empresas   |   300% ROI médio   |   7 dias para ativar
```

**Animações:**
- H1: cada linha entra com `clipPath: inset(0 0 100% 0)` → `inset(0 0 0% 0)`, stagger 0.2s
- Subtítulo: `opacity 0 → 1`, `y: 20 → 0`, duration 0.6s
- CTA: `scale: 0.95 → 1`, `opacity 0 → 1`
- Stats: contador numérico animado (de 0 ao valor final)
- Partículas: canvas 2D, ~80 pontos, velocidade baixa, conectam com linhas ao se aproximar, reagem ao mouse

**Mobile:**
- H1 em 3 linhas, `font-size: clamp(2rem, 8vw, 4rem)`
- Botão WhatsApp: width 100%, height 56px
- Partículas: densidade reduzida (40 pontos), sem reação ao mouse

---

### S2 — DOR
**Objetivo:** Amplificar o problema. O visitante se reconhece em cada frase.

**Transição:** Scroll pin por 300px enquanto as frases aparecem. Fundo escurece progressivamente.

**Layout:** Centro da tela. Uma frase por vez. Sem imagens.

**Copy (frases aparecem em sequência no scroll, stagger):**
```
✗  Você responde clientes quando pode. Não quando eles precisam.
✗  Seu WhatsApp acumula mensagens enquanto você dorme.
✗  Leads que você pagou para atrair esfriaram antes de você responder.
✗  Você sabe que perde vendas. Só não sabe quantas.
✗  Seu negócio é bom. Seu atendimento não acompanha.
```

**Visual:**
- Texto branco/cinza claro, ícone `✗` em vermelho coral (#FF4444)
- Cada frase: `opacity 0 → 1` + `x: -30 → 0`, stagger conforme scroll
- Fundo vai de `#06050e` para `#0a0008` (levemente mais quente/tenso)

**Mobile:** Uma frase por vez, fonte grande (20px), espaçamento generoso.

---

### S3 — QUEBRA DE PADRÃO
**Objetivo:** Virada emocional. Do problema para a possibilidade.

**Transição:** Flash de luz (overlay branco, opacidade 0 → 0.15 → 0, 400ms) + fundo muda de preto para roxo escuro.

**Layout:** Viewport inteira. Uma frase no centro. Nada mais.

**Copy:**
```
"E se cada mensagem não respondida
virasse uma venda fechada?"
```

**Visual:**
- Fonte: Space Grotesk, bold, `clamp(2rem, 6vw, 4.5rem)`
- Gradiente animado no texto (purple → cyan), animação 3s loop
- Fundo: `radial-gradient(ellipse at center, rgba(180,0,166,0.15) 0%, #06050e 70%)`
- Texto surge do centro com scale `0.9 → 1` + fade in

---

### S4 — SOLUÇÃO
**Objetivo:** Explicar o que é o AutoGenius em linguagem humana. Mostrar o produto em ação.

**Layout:** Grid 50/50 no desktop. Stack no mobile.

**Esquerda — Copy:**
```
[label] O que é um Agente de IA?

Um chatbot responde perguntas.
O seu Agente toma decisões.

→ Qualifica o lead
→ Agenda na sua agenda
→ Envia proposta
→ Faz follow-up
→ Cobra. Confirma. Fecha.

Tudo no WhatsApp. Sem você precisar estar lá.
```

**Direita — Demo WhatsApp animado:**
- Mockup de interface do WhatsApp (CSS puro, sem imagem)
- Mensagens aparecem em sequência simulando conversa real:
  ```
  Cliente: "Oi, quanto custa uma consulta?"
  [digitando...]
  Agente: "Olá! A consulta inicial custa R$150. Posso verificar disponibilidade agora. Qual seu nome?"
  Cliente: "João"
  Agente: "Perfeito, João! Temos horário na quinta às 14h ou sexta às 10h. Qual prefere?"
  Cliente: "Quinta"
  Agente: "✅ Agendado! Você receberá uma confirmação em instantes."
  ```
- Loop infinito com delay de 3s entre ciclos
- Animação CSS: mensagens surgem com `translateY(8px) → 0` + fade in

**Transição para próxima seção:** Fade suave, fundo retorna ao escuro neutro.

---

### S5 — PROVA SOCIAL
**Objetivo:** Eliminar dúvida. Mostrar resultados reais de pessoas reais.

**Layout:** 3 cards em grid (desktop) / scroll horizontal snap (mobile).

**Cada card — copy final:**

**Card 1 — Alexandre Sampaio, CEO · Olore** *(azul/cyan)*
```
+8h livres por dia

"Antes eu passava o dia inteiro atendendo clientes.
Agora a IA cuida disso e eu foco 100% na estratégia."

★★★★★
```

**Card 2 — Osvaldo de Melo, Advogado · Matos de Melo Advocacia** *(verde/emerald)*
```
+20h livres por semana

"Passava horas explicando prazos e documentos para
cada cliente. Hoje a IA faz isso automaticamente.
Meu tempo ficou para o que realmente importa."

★★★★★
```
⚠️ **OAB compliance** — este card deve NUNCA usar: "leads", "qualificação de clientes",
"fechar casos", "clientes que valem a pena", "ROI", "faturamento", "captar".
Foco exclusivo em: **tempo liberado + automatização de explicações de processo**.

**Card 3 — Eduarda Oliveira, Dona · Little Loja Infantil** *(roxo/pink)*
```
Vendas toda madrugada

"Antes eu só vendia quando estava online.
Hoje a IA vende enquanto eu durmo."

★★★★★
```

**Paleta por card:**
- Card 1 (Alexandre): azul/cyan, `border-blue-500/30`
- Card 2 (Osvaldo): verde/emerald, `border-green-500/30`
- Card 3 (Eduarda): roxo/pink, `border-purple-500/30`

**Animação:** Cards entram da direita com stagger 0.15s quando entram na viewport.

**CTA intermediário abaixo dos cards:**
```
Você também pode ter esses resultados.
[→ Falar no WhatsApp agora]  (link, não botão cheio)
```

---

### S6 — COMO FUNCIONA
**Objetivo:** Remover a objeção "parece complicado."

**Layout:** 3 passos em linha com conector animado entre eles.

**Copy:**
```
PASSO 1              PASSO 2              PASSO 3
DIAGNÓSTICO     →    CONFIGURAÇÃO    →    RESULTADO
                                          
1 conversa de        Montamos e           Você ativa.
30 minutos.          treinamos seu        Ele trabalha.
Entendemos           Agente               Para sempre.
seu negócio.         em 7 dias.           
```

**Animação:**
- A linha conectora se desenha da esquerda para a direita conforme o scroll (SVG stroke-dashoffset)
- Cada passo aparece em sequência: stagger 0.2s, `opacity 0 → 1` + `y: 20 → 0`

**CTA abaixo:**
```
[→ Começar em 7 dias · WhatsApp]
```

---

### S7 — PLANOS
**Objetivo:** Mostrar opções de forma clara. Ancoragem no plano mais popular.

**Layout:** Cards em linha com scroll horizontal (mobile). Destaque visual no Performance.

**Copy acima:**
```
Escolha o Gênio certo para o seu negócio.
Todos incluem 7 dias de garantia.
```

**Cards (resumidos, 6 planos):**
```
Essencial   Avançado   [PERFORMANCE ⭐]   Premium   Elite   Enterprise
R$490/mês   R$690/mês   R$990/mês          R$1490    R$2490  Consulta
```

**Card destaque (Performance):**
- Borda: `border-brand-purple`, `box-shadow: glow-purple`
- Badge: "Mais escolhido"
- Levemente maior (scale 1.02)

**CTA em cada card:** `[Quero este plano →]` → abre WhatsApp com mensagem pré-preenchida referenciando o plano.

---

### S8 — CTA FINAL
**Objetivo:** Fazer o visitante agir agora. Urgência real, sem artificialidade.

**Layout:** Viewport inteira. Centralizado.

**Copy:**
```
[headline grande]
"Seu concorrente já está usando IA."

[subtítulo]
Cada dia sem automação é dinheiro
deixado na mesa. A conversa é gratuita.
A decisão é sua.

[CTA GIGANTE — verde, pulsando]
→ Falar com a AutoGenius agora

[segurança abaixo]
🔒 Garantia de 7 dias · Sem fidelidade · Implementação em 7 dias
```

**Visual:**
- Fundo: gradiente roxo pulsando suavemente (keyframe: opacidade oscila entre 0.15 e 0.25)
- Botão: verde #25D366, `width: clamp(280px, 60%, 480px)`, `height: 64px`
- Texto segurança: cinza claro, `font-size: 13px`

---

## Regras de Animação (Global)

### Performance
- Usar apenas `transform` e `opacity` (GPU-accelerated)
- `will-change: transform` apenas em elementos críticos
- `prefers-reduced-motion`: todas as animações desativadas se ativo
- Lenis: `lerp: 0.08` (suavidade), `duration: 1.2`

### Timing padrão
- Micro-interações (hover, click): 150-200ms
- Reveals de seção: 600-800ms, `ease: power3.out`
- Stagger entre elementos: 0.1-0.2s
- Transições de seção: 400-600ms

### Scroll Triggers (GSAP)
- `start: "top 80%"` para a maioria dos elementos
- `toggleActions: "play none none none"` (só executa uma vez)
- Pins apenas nas seções S2 (Dor) e S3 (Quebra)

---

## Mobile First — Regras Específicas

- Breakpoint principal: `640px` (sm)
- Fonte mínima: `16px` para body, `14px` para labels
- Touch targets: mínimo `44x44px` em todos os botões
- Botão WhatsApp flutuante: `bottom: 20px`, `right: 16px`
- Espaçamento entre seções: `80px` mobile, `120px` desktop
- Sem animações de parallax no mobile
- Demo WhatsApp (S4): simplificado no mobile, mostra apenas 3 mensagens

---

## Copywriting — Princípios

1. **Clareza acima de tudo** — se precisar de duas leituras, reescreve
2. **Benefício antes de feature** — "Vende de madrugada" > "Atendimento 24/7"
3. **Linguagem humana** — proibido "solução inovadora", "transformação digital", "ecossistema"
4. **Frases curtas** — máximo 15 palavras por frase
5. **Presente do indicativo** — "Ele responde. Ele agenda. Ele fecha."

---

## O que NÃO Fazer

- ❌ Dois botões de CTA lado a lado (formulário + WhatsApp) — WhatsApp é o único
- ❌ Three.js na home — muito pesado
- ❌ Seções duplicadas (Humanos Empoderados + Humanos Transformados) — fundidas na S5
- ❌ Textos longos em parágrafos corridos — máximo 3 linhas por bloco
- ❌ Animações que bloqueiam o scroll
- ❌ Auto-play de qualquer mídia

---

## Páginas Secundárias (sem alteração de estrutura)

`#consultoria`, `#treinamentos`, `#tecnologia`, `#cases`, `#faq`, `#sobre`, `#contato` — mantêm a estrutura atual. Ajustes de copy e WhatsApp como CTA primário são aplicados onde necessário.

---

## Métricas de Sucesso

- Cliques no botão WhatsApp flutuante (evento GA4: `whatsapp_float_click`)
- Cliques nos CTAs de seção (evento GA4: `whatsapp_section_click` com parâmetro `section`)
- Scroll depth (25%, 50%, 75%, 100%) — GA4 padrão
- Bounce rate mobile (meta: < 60%)
