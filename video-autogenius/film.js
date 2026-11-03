// film.js — "AutoGenius em 1 minuto" (Dark Tech Keynote)
// Uma escada de zoom: a planta da empresa vista de cima → o Raio-X → as áreas → os produtos → 50 empresas.
import * as E from './engine.js';
const { W, H, PAL, clamp, lerp, seg, ss, eo, ei, eio, back, spring, mulberry, hash, TAU, rr, font, rgba, mix, glow, panel, litShape, caret, toast, camera, scramble, lightReveal, buf } = E;

E.setAccent('#2F86FF');
PAL.cool = '#1F5BFF';
PAL.red = '#FF5C5C';
const ACC = () => PAL.accent;

let TL = null, LINES = [], DURS = {}, MARCA = null;
export function setup(tl, lines, durs, marca) { TL = tl; LINES = lines; DURS = durs; MARCA = marca; build(); }
export const dur = () => TL.dur;
const K = () => TL.K;

// ───────────────────────── O mundo: a planta da empresa ─────────────────────────
const AREAS = [
  { id: 'atd', name: 'ATENDIMENTO', x: 230, y: 150, w: 680, h: 360 },
  { id: 'com', name: 'COMERCIAL', x: 1010, y: 150, w: 680, h: 360 },
  { id: 'ops', name: 'OPERAÇÃO', x: 230, y: 580, w: 680, h: 360 },
  { id: 'fin', name: 'FINANCEIRO', x: 1010, y: 580, w: 680, h: 360 },
];
const LABELS = {
  atd: ['47 mensagens sem resposta', 'Cliente esperando · 2 h', 'Áudio não ouvido', 'Lead sem retorno', '“Ainda tem horário?”', 'Pedido de orçamento',
        'Mensagem de sábado', '12 conversas abertas', 'Cliente perguntou de novo', 'Retorno prometido', 'Fila no WhatsApp', 'Dúvida sobre prazo',
        'Lead de anúncio · 23h', 'Reclamação sem resposta', 'Agendamento manual', 'Confirmação pendente', '“Alguém aí?”', 'Contato perdido'],
  com: ['Proposta parada · 6 dias', 'CRM desatualizado', 'Custo por lead +38%', 'Campanha sem análise', 'Follow-up esquecido', 'Relatório de mídia',
        'Lead frio', 'Planilha de comissões', 'Reunião sem ata', 'Verba no conjunto errado', 'Anúncio saturado', 'Meta do mês ?',
        'Funil sem dados', 'Proposta v4_final', 'Retorno do cliente', 'Público repetido', 'Pipeline manual', 'Contato duplicado'],
  ops: ['planilha_v7_FINAL.xlsx', 'Processo sem dono', 'Relatório de sexta', 'Pedido atrasado', 'Retrabalho', 'Estoque conferido à mão',
        'E-mail com 14 respostas', 'Checklist no papel', 'Ordem de serviço', 'Escala da semana', 'Aprovação parada', 'Indicador de ontem ?',
        'Copiar e colar · 3 sistemas', 'Pendência do fornecedor', 'Manual desatualizado', 'Chamado reaberto', 'Inventário', 'Passo esquecido'],
  fin: ['Conciliação pendente', 'Nota fiscal manual', 'Fluxo de caixa · ontem?', 'Boleto vencido', 'Relatório da diretoria', 'Extrato em PDF',
        'Cobrança atrasada', 'Contas a pagar', 'Lançamento duplicado', 'Fechamento do mês', 'Planilha de custos', 'Reembolso parado',
        'Centro de custo ?', 'DRE manual', 'Previsão de receita', 'Pagamento sem aprovação', 'Imposto do mês', 'Conferência de notas'],
};
const KIND = { atd: 'msg', com: 'alert', ops: 'file', fin: 'file' };
const RED_EVERY = { atd: 2, com: 3, ops: 4, fin: 3 };
const OPP = [
  { area: 0, n: '01', t: 'Atender e agendar 24 h', s: 'ATENDIMENTO' },
  { area: 1, n: '02', t: 'Campanhas olhadas todo dia', s: 'COMERCIAL' },
  { area: 3, n: '03', t: 'Conciliação automática', s: 'FINANCEIRO' },
];
let CHIPS = [], EVS = [];
const IA_TILE = { x: 960, y: 545, w: 330, h: 70 };

function build() {
  const R = mulberry(20261103);
  CHIPS = [];
  const per = 18, cols = 3, cw = 206, ch = 42, gx = 14, gy = 12;
  AREAS.forEach((A, ai) => {
    for (let k = 0; k < per; k++) {
      const c = k % cols, r = Math.floor(k / cols);
      const x = A.x + 22 + c * (cw + gx) + (R() - 0.5) * 18, y = A.y + 52 + r * (ch + gy) * 0.86 + (R() - 0.5) * 12;
      // snap: 6 × 3 tiles uniformes no rodapé da área
      const sc = k % 6, sr = Math.floor(k / 6), tw = 98, th = 34;
      CHIPS.push({ ai, k, label: LABELS[A.id][k], kind: KIND[A.id], red: k % RED_EVERY[A.id] === 0, x, y, w: cw, h: ch, rot: (R() - 0.5) * 0.06,
        tx: A.x + 16 + sc * (tw + 10.4), ty: A.y + A.h - 22 - (3 - sr) * (th + 9), tw, th, ord: R() });
    }
  });
  // nascimento acelerando (cada vez mais rápido), quantizado em semicolcheias
  const order = CHIPS.map((c, i) => i).sort((a, b) => CHIPS[a].ord - CHIPS[b].ord);
  const t0 = K().pull, t1 = K().hush - 0.45, s16 = TL.beat / 4;
  order.forEach((ci, j) => { const u = j / (order.length - 1); CHIPS[ci].born = Math.round((t0 + 0.3 + (t1 - t0 - 0.3) * Math.sqrt(u)) / s16) * s16; });
  // snap por área: cada área no seu tempo (quando a palavra é dita)
  CHIPS.forEach(c => { const ts = K().snap[c.ai]; c.fly = ts - 0.18 + (c.ty - 150) * 0.0004 + (c.k % 6) * 0.025; });
  EVS = buildEvents();
}

// ───────────────────────── Câmera ─────────────────────────
function camAt(t) {
  const k = K();
  let x = IA_TILE.x, y = IA_TILE.y, z = 3.2, rot = 0, sx = 0, sy = 0;
  if (t < k.pull) { z = lerp(3.4, 3.1, ss(t / k.pull)); }
  else if (t < k.hush) {
    const u = seg(t, k.pull, k.wobble + 0.6); z = Math.exp(lerp(Math.log(3.1), Math.log(0.98), eio(u)));
    x = lerp(IA_TILE.x, 960, eio(u)); y = lerp(IA_TILE.y, 545, eio(u));
    const wob = seg(t, k.wobble, k.hush); rot = wob * 0.018 * Math.sin(t * 1.7); sx = wob * 7 * Math.sin(t * 5.3); sy = wob * 5 * Math.cos(t * 4.1);
  } else if (t < k.opps) { z = lerp(0.98, 1.03, ss(seg(t, k.scan, k.opps))); x = lerp(930, 990, ss(seg(t, k.scan, k.scanEnd))); }
  else if (t < k.dive) { z = lerp(1.03, 1.14, eio(seg(t, k.opps, k.dive))); x = lerp(990, 960, eio(seg(t, k.opps, k.dive))); y = lerp(545, 520, eio(seg(t, k.opps, k.dive))); }
  else if (t < k.num) { z = 1.14; x = 960; y = 520; } else { z = lerp(1.0, 0.96, ss(seg(t, k.plan, k.chat))); x = 960; y = 545; }
  return camera({ x, y, zoom: z, rot, sx, sy });
}

// ───────────────────────── Peças ─────────────────────────
function areaFrame(g, A, t, lit = 0, alpha = 1) {
  g.save(); g.globalAlpha *= alpha;
  g.strokeStyle = lit > 0 ? mix('#2a3140', PAL.accent, lit) : 'rgba(255,255,255,.10)'; g.lineWidth = 1;
  if (lit > 0) { g.shadowColor = rgba(PAL.accent, 0.6 * lit); g.shadowBlur = 18 * lit; }
  rr(g, A.x + 0.5, A.y + 0.5, A.w, A.h, 18); g.stroke(); g.shadowColor = 'transparent';
  // cantos marcados
  g.strokeStyle = 'rgba(255,255,255,.22)';
  for (const [cx, cy, dx, dy] of [[A.x, A.y, 1, 1], [A.x + A.w, A.y, -1, 1], [A.x, A.y + A.h, 1, -1], [A.x + A.w, A.y + A.h, -1, -1]]) {
    g.beginPath(); g.moveTo(cx + dx * 18, cy + 0.5 * dy); g.lineTo(cx + dx * 0.5, cy + 0.5 * dy); g.lineTo(cx + dx * 0.5, cy + dy * 18); g.stroke();
  }
  g.font = font(13, 500, 'mono'); g.fillStyle = lit > 0.5 ? PAL.text : PAL.mute; g.textBaseline = 'alphabetic';
  if (g.letterSpacing !== undefined) g.letterSpacing = '2.6px';
  g.fillText(A.name, A.x + 22, A.y + 32);
  if (g.letterSpacing !== undefined) g.letterSpacing = '0px';
  g.restore();
}

function chipDraw(g, c, x, y, o = {}) {
  const { a = 1, red = c.red, morph = 0, xray = 0, dim = 0 } = o;
  const w = lerp(c.w, c.tw, morph), h = lerp(c.h, c.th, morph);
  g.save(); g.globalAlpha *= a * (1 - dim * 0.65);
  panel(g, x, y, w, h, { r: lerp(10, 9, morph), fill: '#171B25', cheap: true, shadow: 0.8 });
  if (morph < 0.85) {
    g.globalAlpha *= 1 - seg(morph, 0.2, 0.75);
    // ícone por tipo
    const ix = x + 12, iy = y + h / 2;
    if (c.kind === 'msg') { g.fillStyle = 'rgba(255,255,255,.22)'; g.beginPath(); g.ellipse(ix + 7, iy - 1, 8, 6.5, 0, 0, TAU); g.fill(); }
    else if (c.kind === 'file') { g.fillStyle = 'rgba(255,255,255,.2)'; g.beginPath(); g.moveTo(ix, iy - 9); g.lineTo(ix + 9, iy - 9); g.lineTo(ix + 13, iy - 5); g.lineTo(ix + 13, iy + 9); g.lineTo(ix, iy + 9); g.closePath(); g.fill(); }
    else { g.strokeStyle = 'rgba(255,255,255,.3)'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(ix, iy + 6); g.lineTo(ix + 5, iy); g.lineTo(ix + 9, iy + 3); g.lineTo(ix + 14, iy - 6); g.stroke(); }
    g.font = font(13, 500); g.fillStyle = PAL.dim; g.textBaseline = 'middle';
    g.fillText(fit(g, c.label, w - 52), x + 34, y + h / 2 + 0.5);
    if (red) { g.fillStyle = PAL.red; g.shadowColor = rgba(PAL.red, 0.6); g.shadowBlur = 8; g.beginPath(); g.arc(x + w - 12, y + 10, 4.5, 0, TAU); g.fill(); g.shadowColor = 'transparent'; }
    if (xray > 0) { // marca do Raio-X: onde a IA entra
      g.globalAlpha = a * xray; g.strokeStyle = rgba(PAL.accent, 0.85); g.lineWidth = 1; rr(g, x + 0.5, y + 0.5, w - 1, h - 1, 10); g.stroke();
      g.fillStyle = PAL.accent; g.beginPath(); g.arc(x + w - 12, y + h - 10, 3, 0, TAU); g.fill();
    }
  }
  if (morph > 0.4) { // vira tile uniforme da IA
    g.globalAlpha = a * seg(morph, 0.4, 1);
    g.strokeStyle = rgba(PAL.accent, 0.5); g.lineWidth = 1; rr(g, x + 0.5, y + 0.5, w - 1, h - 1, 9); g.stroke();
    g.fillStyle = PAL.accent; g.shadowColor = rgba(PAL.accent, .8); g.shadowBlur = 8; g.beginPath(); g.arc(x + 14, y + h / 2, 3.2, 0, TAU); g.fill(); g.shadowColor = 'transparent';
    g.fillStyle = 'rgba(255,255,255,.12)'; rr(g, x + 26, y + h / 2 - 3, w * 0.5, 6, 3); g.fill();
  }
  g.restore();
}
const _fitCache = {};
function fit(g, s, w) {
  const key = s + '|' + Math.round(w); if (_fitCache[key]) return _fitCache[key];
  let out = s; while (out.length > 4 && g.measureText(out).width > w) out = out.slice(0, -2) + '…';
  return (_fitCache[key] = out);
}

function iaTile(g, t, x, y, o = {}) {
  const { on = 0, a = 1, blink = 1 } = o;
  const { w, h } = IA_TILE;
  g.save(); g.globalAlpha *= a;
  panel(g, x - w / 2, y - h / 2, w, h, { r: 16, fill: '#151924', shadow: 1 });
  if (on > 0) { g.strokeStyle = rgba(PAL.accent, 0.75 * on); g.shadowColor = rgba(PAL.accent, 0.6 * on); g.shadowBlur = 24 * on; rr(g, x - w / 2 + .5, y - h / 2 + .5, w - 1, h - 1, 16); g.stroke(); g.shadowColor = 'transparent'; }
  // selo IA
  const bx = x - w / 2 + 16, by = y - 18;
  if (on > 0.02) litShape(g, roundPath(bx, by, 36, 36, 10), { accent: true, alpha: on, glowR: 18, bbox: [bx, by, 36, 36] });
  g.globalAlpha = a * (1 - on); panel(g, bx, by, 36, 36, { r: 10, fill: '#222734', shadow: 0 }); g.globalAlpha = a;
  g.font = font(15, 700); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = on > 0.5 ? '#fff' : PAL.mute; g.fillText('IA', bx + 18, by + 18.5);
  g.textAlign = 'left';
  g.font = font(12, 500, 'mono'); if (g.letterSpacing !== undefined) g.letterSpacing = '1.6px';
  const st = on > 0.5 ? 'IA · TRABALHANDO' : 'LICENÇA ATIVA';
  g.fillStyle = on > 0.5 ? PAL.text : PAL.dim; g.fillText(st, bx + 52, y - 9);
  g.fillStyle = on > 0.5 ? PAL.accent : PAL.mute; g.fillText(on > 0.5 ? 'EM TODAS AS ÁREAS' : '0 USOS HOJE', bx + 52, y + 12);
  if (g.letterSpacing !== undefined) g.letterSpacing = '0px';
  // ponto de status: pisca na batida (é o metrônomo)
  const dotOn = on > 0.5 ? 1 : (Math.floor(t / TL.beat) % 2 === 0 ? 1 : 0.25) * blink;
  g.fillStyle = on > 0.5 ? PAL.accent : '#5C6272'; g.globalAlpha = a * dotOn; g.beginPath(); g.arc(x + w / 2 - 22, y, 4, 0, TAU); g.fill();
  g.restore();
}
function roundPath(x, y, w, h, r) { const p = new Path2D(); p.roundRect(x, y, w, h, r); return p; }

function oppRect(i) { const o = OPP[i], c = CHIPS.find(c => c.ai === o.area && c.k === [4, 2, 0][i]); return { x: c.x - 30, y: c.y - 14, w: 300, h: 74, c }; }

// ───────────────────────── Cena 1–7: a planta ─────────────────────────
function drawPlan(g, t) {
  const k = K(), cam = camAt(t);
  E.bg(g, { lift: 1, cool: 1 });
  const s = cam.apply(g, 0);
  // grade presa ao mundo
  g.setTransform(1, 0, 0, 1, 0, 0);
  const p0 = cam.proj(0, 0, 0); E.grid(g, { ox: p0.x, oy: p0.y, scale: p0.s, alpha: 0.9 });
  cam.apply(g, 0);
  const hushA = t >= k.hush && t < k.scan ? 0.55 : 1;
  const linked = ss(seg(t, k.linked, k.linked + 0.5));
  AREAS.forEach((A, i) => {
    const snapLit = t >= k.plan ? ss(seg(t, k.snap[i] + 0.15, k.snap[i] + 0.45)) * (1 - 0.6 * seg(t, k.snap[i] + 0.6, k.snap[i] + 1.4)) + 0.25 * seg(t, k.snap[i] + 0.6, k.snap[i] + 1.4) : 0;
    areaFrame(g, A, t, snapLit, hushA);
  });
  // linhas ligando cada área ao núcleo de IA
  if (linked > 0) {
    g.save(); g.strokeStyle = rgba(PAL.accent, 0.45 * linked); g.lineWidth = 1.2; g.setLineDash([4, 6]); g.lineDashOffset = -t * 30;
    for (const A of AREAS) { const cx = A.x + A.w / 2, cy = A.y + A.h / 2; g.beginPath(); g.moveTo(IA_TILE.x, IA_TILE.y); g.lineTo(lerp(IA_TILE.x, cx, linked), lerp(IA_TILE.y, cy, linked)); g.stroke(); }
    g.restore();
  }
  // chips
  const scanX = t >= k.scan ? lerp(-80, 2000, seg(t, k.scan, k.scanEnd)) : -1e9;
  const oppsOn = t >= k.opps ? 1 : 0;
  for (const c of CHIPS) {
    if (t < c.born) continue;
    let x = c.x, y = c.y, a = 1, rot = c.rot, morph = 0;
    const u = t - c.born;
    if (c.kind === 'msg') { x += (1 - eo(seg(u, 0, 0.24))) * 90; a = seg(u, 0, 0.12); }
    else if (c.kind === 'file') { y -= (1 - back(seg(u, 0, 0.22), 2.2)) * 34; a = seg(u, 0, 0.08); }
    else { const p = back(seg(u, 0, 0.22), 2.4); a = seg(u, 0, 0.06); g.save(); g.translate(x + c.w / 2, y + c.h / 2); g.scale(lerp(.9, 1, p), lerp(.9, 1, p)); g.translate(-x - c.w / 2, -y - c.h / 2); }
    // tremor de tensão no último segundo
    if (t > k.hush - 1 && t < k.hush) { const tr = seg(t, k.hush - 1, k.hush) * 2.2; x += Math.sin(t * 61 + c.k * 7) * tr; y += Math.cos(t * 53 + c.ai * 5) * tr; }
    const cleaned = t >= k.scan && (c.x + c.w / 2) < scanX;          // a luz do Raio-X tira o vermelho
    const xray = cleaned && t < k.plan ? ss(seg(scanX - (c.x + c.w / 2), 0, 260)) * (c.k % 3 !== 1 ? 1 : 0) : 0;
    let dim = 0;
    if (t >= k.opps && t < k.plan) dim = ss(seg(t, k.opps, k.opps + 0.5));
    if (t >= k.plan) { // volta neutro e voa para a grade da área
      const p = seg(t, c.fly, c.fly + 0.34);
      if (p > 0) {
        const f = { x: c.x, y: c.y }, to = { x: c.tx, y: c.ty };
        const q = back(p, 1.35), bend = [-1, 1, -1, 1][c.ai] * 60 * Math.sin(Math.PI * Math.min(1, p * 1.1));
        const dx = to.x - f.x, dy = to.y - f.y, L = Math.hypot(dx, dy) || 1;
        x = lerp(f.x, to.x, q) + (-dy / L) * bend; y = lerp(f.y, to.y, q) + (dx / L) * bend;
        rot = lerp(c.rot, 0, clamp(spring(p * 1.2, 9, .42)));
        morph = ss(seg(p, 0.1, 0.6));
        if (p < 1) { const pts = []; for (let i = 0; i <= 8; i++) { const pp = Math.max(0, p - 0.16 + i * 0.02), qq = back(pp, 1.35), bb = [-1, 1, -1, 1][c.ai] * 60 * Math.sin(Math.PI * Math.min(1, pp * 1.1)); pts.push([lerp(f.x, to.x, qq) + (-dy / L) * bb + c.tw / 2, lerp(f.y, to.y, qq) + (dx / L) * bb + c.th / 2]); } E.trail(g, pts, { width: 3, alpha: 0.7 }); }
      }
    }
    g.save(); g.translate(x + c.w / 2, y + c.h / 2); g.rotate(rot); g.translate(-x - c.w / 2, -y - c.h / 2);
    chipDraw(g, c, x, y, { a: a * hushA, red: c.red && !cleaned && t < k.scan + 6, morph, xray, dim });
    g.restore();
    if (c.kind === 'alert' && u < 0.22) g.restore();
  }
  // as 3 oportunidades sobem e acendem
  if (t >= k.opps && t < k.num) {
    OPP.forEach((o, i) => {
      const t0 = k.opps + 0.3 * i, p = back(seg(t, t0, t0 + 0.3), 1.3); if (p <= 0) return;
      const r = oppRect(i), lift = 14 * p;
      g.save(); g.globalAlpha = clamp(p);
      panel(g, r.x, r.y - lift, r.w, r.h, { r: 16, fill: '#161B27', shadow: 1.2 });
      g.strokeStyle = rgba(PAL.accent, .9); g.shadowColor = rgba(PAL.accent, .7); g.shadowBlur = 22; rr(g, r.x + .5, r.y - lift + .5, r.w - 1, r.h - 1, 16); g.stroke(); g.shadowColor = 'transparent';
      g.font = font(12, 500, 'mono'); g.fillStyle = PAL.accent; if (g.letterSpacing !== undefined) g.letterSpacing = '2px';
      g.fillText('OPORTUNIDADE ' + o.n, r.x + 18, r.y - lift + 26); if (g.letterSpacing !== undefined) g.letterSpacing = '0px';
      g.font = font(19, 600); g.fillStyle = PAL.text; g.fillText(o.t, r.x + 18, r.y - lift + 54);
      g.restore();
    });
  }
  // o núcleo de IA (a licença que ninguém usa → trabalhando)
  const on = ss(seg(t, k.iaOn, k.iaOn + 0.4));
  iaTile(g, t, IA_TILE.x, IA_TILE.y, { on, a: t >= k.opps && t < k.plan ? 1 - 0.6 * ss(seg(t, k.opps, k.opps + .5)) : 1 });
  // marca AutoGenius surge sobre o núcleo quando a luz passa
  const mk = ss(seg(t, k.iaOn + 0.2, k.iaOn + 0.8)) * (1 - ss(seg(t, k.opps - 0.4, k.opps)));
  if (mk > 0) brand(g, IA_TILE.x, IA_TILE.y - 96, 40, mk);
  g.setTransform(1, 0, 0, 1, 0, 0);
  // a banda de luz do Raio-X
  if (t >= k.scan && t < k.scanEnd + 0.3) {
    const sp = cam.proj(scanX, 0, 0); const X = sp ? sp.x : -999;
    g.save(); g.globalCompositeOperation = 'lighter';
    let gr = g.createLinearGradient(X - 320, 0, X + 40, 0);
    gr.addColorStop(0, 'rgba(47,134,255,0)'); gr.addColorStop(0.85, 'rgba(47,134,255,.10)'); gr.addColorStop(1, 'rgba(120,180,255,.18)');
    g.fillStyle = gr; g.fillRect(X - 320, 0, 360, H);
    g.fillStyle = 'rgba(160,200,255,.55)'; g.fillRect(X, 0, 1.5, H);
    g.restore();
    g.font = font(12, 500, 'mono'); g.fillStyle = PAL.accent; if (g.letterSpacing !== undefined) g.letterSpacing = '2px';
    g.fillText('RAIO-X · ' + String(Math.round(seg(t, k.scan, k.scanEnd) * 100)).padStart(3, '0') + '%', X + 12, 64);
    if (g.letterSpacing !== undefined) g.letterSpacing = '0px';
  }
  // status por área depois do snap
  if (t >= k.plan) AREAS.forEach((A, i) => {
    const a = ss(seg(t, k.snap[i] + 0.3, k.snap[i] + 0.6)); if (a <= 0) return;
    const p = cam.proj(A.x + A.w - 22, A.y + 32, 0);
    g.save(); g.globalAlpha = a; g.font = font(12, 500, 'mono'); g.textAlign = 'right'; g.fillStyle = PAL.accent; if (g.letterSpacing !== undefined) g.letterSpacing = '2px';
    g.fillText('● IA ATIVA', p.x, p.y); g.restore();
  });
  E.vignette(g, 0.52);
}

// ───────────────────────── Marca ─────────────────────────
function gradText(g, txt, x, y, px) {
  const w = g.measureText(txt).width, gr = g.createLinearGradient(x, y - px * .7, x + w, y + px * .3);
  gr.addColorStop(0, '#1F5BFF'); gr.addColorStop(0.55, '#2F86FF'); gr.addColorStop(1, '#19D3F5'); g.fillStyle = gr; g.fillText(txt, x, y); return w;
}
// Logo AutoGenius: símbolo cérebro-lâmpada em degradê + "Auto" branco, "Genius" em degradê.
// stacked=true reproduz o logo empilhado (símbolo em cima, Auto / Genius embaixo).
function brand(g, x, y, px, a = 1, stacked = false) {
  if (a <= 0) return;
  g.save(); g.globalAlpha *= a; g.font = `600 ${px}px Poppins`; g.textBaseline = 'alphabetic';
  if (g.letterSpacing !== undefined) g.letterSpacing = `${-0.02 * px}px`;
  const [c] = MARCA ? tinted() : [null];
  if (stacked) {
    const ms = px * 2.3, mw = c ? ms * c.width / c.height : 0;
    if (c) { g.shadowColor = rgba('#2F86FF', .55); g.shadowBlur = px * 0.9; g.drawImage(c, x - mw / 2, y - ms, mw, ms); g.shadowColor = 'transparent'; }
    g.textAlign = 'left';
    const wA = g.measureText('Auto').width, wG = g.measureText('Genius').width;
    g.fillStyle = PAL.text; g.fillText('Auto', x - wA / 2, y + px * 1.15);
    gradText(g, 'Genius', x - wG / 2, y + px * 2.15, px);
  } else {
    const ms = px * 1.3, mw = c ? ms * c.width / c.height : 0, wA = g.measureText('Auto').width, wG = g.measureText('Genius').width;
    const total = mw + px * 0.34 + wA + wG, x0 = x - total / 2;
    if (c) { g.shadowColor = rgba('#2F86FF', .55); g.shadowBlur = px * 0.5; g.drawImage(c, x0, y - ms / 2, mw, ms); g.shadowColor = 'transparent'; }
    g.fillStyle = PAL.text; g.fillText('Auto', x0 + mw + px * 0.34, y + px * 0.36);
    gradText(g, 'Genius', x0 + mw + px * 0.34 + wA, y + px * 0.36, px);
  }
  g.restore();
}
let _tint = null;
function tinted() {
  if (_tint) return _tint;
  const [c, t] = buf('marca', MARCA.width, MARCA.height);
  t.drawImage(MARCA, 0, 0); t.globalCompositeOperation = 'source-in';
  const gr = t.createLinearGradient(0, 0, MARCA.width, MARCA.height); gr.addColorStop(0, '#1F5BFF'); gr.addColorStop(0.5, '#2F86FF'); gr.addColorStop(1, '#19D3F5');
  t.fillStyle = gr; t.fillRect(0, 0, MARCA.width, MARCA.height);
  // cópia própria (buf é reaproveitado pelo nome)
  const keep = document.createElement('canvas'); keep.width = c.width; keep.height = c.height; keep.getContext('2d').drawImage(c, 0, 0);
  return (_tint = [keep]);
}

// ───────────────────────── Cena 6: "14 dias" ─────────────────────────
function drawNumber(g, t) {
  const k = K();
  E.bg(g, { lift: 1.1, cool: 0.7 }); E.grid(g, { ox: 960, oy: 540, alpha: 0.6 });
  const outP = seg(t, k.numOut, k.plan);                     // fecha como CRT
  const sy = outP > 0 ? lerp(1, 0.004, ei(seg(outP, 0, 0.75))) : 1, sx = outP > 0 ? lerp(1, 0.02, ei(seg(outP, 0.6, 1))) : 1;
  const open = eo(seg(t, k.num, k.num + 0.25));
  g.save(); g.translate(960, 560); g.scale(lerp(0.6, 1, open) * sx, lerp(0.6, 1, open) * sy); g.translate(-960, -560);
  glow(g, 960, 520, 560, PAL.accent, 0.10 * open);
  g.font = font(20, 500, 'mono'); g.fillStyle = PAL.dim; g.textAlign = 'center'; if (g.letterSpacing !== undefined) g.letterSpacing = '6px';
  g.globalAlpha = open; g.fillText('RAIO-X DE IA', 960, 330); if (g.letterSpacing !== undefined) g.letterSpacing = '0px'; g.globalAlpha = 1;
  const s16 = TL.beat / 4, L0 = k.num + 0.6;
  g.font = font(400, 600, 'disp'); const w14 = g.measureText('14').width * 0.97; g.font = font(120, 600, 'disp'); const wD = g.measureText('dias').width;
  const gx0 = 960 - (w14 + 28 + wD) / 2;
  scramble(g, '14', gx0, 690, t, [L0 + s16, L0], { px: 400, color: PAL.accent, align: 'left', tracking: -0.045, start: k.num });
  g.font = font(120, 600, 'disp'); g.textAlign = 'left'; g.fillStyle = PAL.text; g.globalAlpha = ss(seg(t, L0 + s16 * 2, L0 + s16 * 4));
  if (g.letterSpacing !== undefined) g.letterSpacing = '-4px'; g.fillText('dias', gx0 + w14 + 28, 690); if (g.letterSpacing !== undefined) g.letterSpacing = '0px';
  // 14 marcas, uma por semicolcheia
  g.globalAlpha = 1;
  for (let i = 0; i < 14; i++) {
    const ti = L0 + s16 * 4 + i * s16, p = back(seg(t, ti, ti + 0.15), 2);
    const x = 960 - 14 * 30 / 2 + i * 30 + 6, y = 770;
    g.fillStyle = 'rgba(255,255,255,.08)'; rr(g, x, y, 18, 18, 5); g.fill();
    if (p > 0) { g.save(); g.translate(x + 9, y + 9); g.scale(p, p); g.fillStyle = PAL.accent; g.shadowColor = rgba(PAL.accent, .7); g.shadowBlur = 10; rr(g, -9, -9, 18, 18, 5); g.fill(); g.restore(); }
  }
  g.font = font(22, 500); g.fillStyle = PAL.dim; g.textAlign = 'center'; g.globalAlpha = ss(seg(t, L0 + s16 * 18, L0 + s16 * 22));
  g.fillText('para saber onde a IA paga a conta', 960, 850);
  g.restore();
  E.vignette(g, 0.5);
}

// ───────────────────────── Janelas de produto ─────────────────────────
function winShell(g, x, y, w, h, title, open, o = {}) {
  // abre a partir de um ponto de origem (o nó da área)
  const { from = [x + w / 2, y + h / 2] } = o;
  const p = eo(open);
  const cx = lerp(from[0], x + w / 2, p), cy = lerp(from[1], y + h / 2, p), ww = lerp(60, w, p), hh = lerp(30, h, back(clamp(open), 1.2));
  const X = cx - ww / 2, Y = cy - hh / 2;
  panel(g, X, Y, ww, hh, { r: 18, fill: PAL.surf, shadow: 1.2 });
  if (p > 0.6) {
    g.save(); g.globalAlpha = seg(p, 0.6, 1);
    g.fillStyle = 'rgba(255,255,255,.025)'; rr(g, X + 1, Y + 1, ww - 2, 52, 18); g.fill(); g.fillStyle = PAL.line; g.fillRect(X, Y + 52, ww, 1);
    g.fillStyle = PAL.accent; g.beginPath(); g.arc(X + 26, Y + 26, 5, 0, TAU); g.fill();
    g.font = font(16, 600); g.fillStyle = PAL.text; g.textBaseline = 'middle'; g.fillText(title, X + 44, Y + 27);
    g.restore();
  }
  return { X, Y, ww, hh, ready: p > 0.95 };
}
function bubble(g, x, y, text, me, a, o = {}) {
  if (a <= 0) return 0;
  const { px = 21, maxw = 520 } = o;
  g.save(); g.font = font(px, 500); const tw = Math.min(maxw, g.measureText(text).width), w = tw + 40, h = px * 2.3;
  const X = me ? x - w : x, rise = (1 - eo(a)) * 16;
  g.globalAlpha = eo(a);
  if (me) { g.fillStyle = 'rgba(47,134,255,.16)'; rr(g, X, y + rise, w, h, 18); g.fill(); g.strokeStyle = rgba(PAL.accent, .55); g.lineWidth = 1; rr(g, X + .5, y + rise + .5, w - 1, h - 1, 18); g.stroke(); }
  else panel(g, X, y + rise, w, h, { r: 18, fill: PAL.surf3, shadow: 0.6 });
  g.fillStyle = PAL.text; g.textBaseline = 'middle'; g.fillText(text, X + 20, y + rise + h / 2 + 1);
  g.restore(); return h;
}

// Telas reais das plataformas AutoGenius, numa janela desenhada no estilo
let SHOTS = {};
export function setShots(o) { SHOTS = o; }
const _win = {};
function shotWindow(key, title) {
  if (_win[key]) return _win[key];
  const img = SHOTS[key], ww = 1280, bar = 46, hh = 853 + bar;
  const c = document.createElement('canvas'); c.width = ww; c.height = hh; const t = c.getContext('2d');
  t.fillStyle = PAL.surf; rr(t, 0, 0, ww, hh, 22); t.fill();
  t.save(); rr(t, 0, 0, ww, hh, 22); t.clip();
  t.fillStyle = '#151924'; t.fillRect(0, 0, ww, bar); t.fillStyle = 'rgba(255,255,255,.08)'; t.fillRect(0, bar, ww, 1);
  t.fillStyle = PAL.accent; t.beginPath(); t.arc(26, bar / 2, 5, 0, TAU); t.fill();
  t.font = font(17, 600); t.fillStyle = PAL.text; t.textBaseline = 'middle'; t.fillText(title, 44, bar / 2 + 1);
  t.font = font(13, 500, 'mono'); t.fillStyle = PAL.mute; t.textAlign = 'right'; t.fillText('PLATAFORMA AUTOGENIUS · TELA REAL', ww - 24, bar / 2 + 1);
  if (img) t.drawImage(img, 0, bar + 1, ww, 853);
  t.restore();
  t.strokeStyle = 'rgba(255,255,255,.12)'; t.lineWidth = 2; rr(t, 1, 1, ww - 2, hh - 2, 22); t.stroke();
  return (_win[key] = c);
}
function flut(g, x, y, ic, b, s, p) {
  if (p <= 0) return;
  const q = back(p, 1.7), fl = Math.sin((p * 3 + x) * 0.9) * 4;
  g.save(); g.translate(x, y + fl); g.scale(lerp(.85, 1, q), lerp(.85, 1, q)); g.globalAlpha = clamp(p * 3);
  g.font = font(19, 600); const w = Math.max(g.measureText(b).width, (g.font = font(14, 500), g.measureText(s).width)) + 96, h = 72;
  g.shadowColor = 'rgba(0,0,0,.6)'; g.shadowBlur = 40; g.shadowOffsetY = 14;
  g.fillStyle = 'rgba(14,17,25,.94)'; rr(g, 0, 0, w, h, 18); g.fill(); g.shadowColor = 'transparent';
  g.strokeStyle = rgba(PAL.accent, .45); g.lineWidth = 1; rr(g, .5, .5, w - 1, h - 1, 18); g.stroke();
  litShape(g, roundPath(16, 16, 40, 40, 12), { accent: true, glowR: 16, bbox: [16, 16, 40, 40] });
  g.font = font(18, 700); g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(ic, 36, 37); g.textAlign = 'left';
  g.font = font(19, 600); g.fillStyle = PAL.text; g.fillText(b, 72, 28);
  g.font = font(14, 500); g.fillStyle = PAL.dim; g.fillText(s, 72, 51);
  g.restore();
}

function drawChat(g, t) {
  const k = K(), t0 = k.chat;
  drawPlanBehind(g, t);
  const close = seg(t, k.track, k.ads);
  if (close >= 1) return;
  const from = planToScreen(t, AREAS[0].x + AREAS[0].w - 60, AREAS[0].y + 30);
  const open = eo(seg(t, t0, t0 + 0.32));
  const side = back(seg(t, t0 + 0.25, t0 + 0.7), 1.3);
  // câmera: quase travada enquanto a luz revela; depois empurra para a conversa
  const push = eio(seg(t, t0 + 1.6, k.track));
  const zoom = lerp(1, 1.18, push), fx = lerp(960, 1040, push), fy = lerp(470, 460, push);
  g.save();
  g.translate(-eio(close) * 1100, 0);
  g.translate(960, 470); g.scale(zoom, zoom); g.translate(-fx, -fy);
  // as duas telas laterais, giradas, atrás
  const wl = shotWindow('escolas', 'Escolas · Atendimento com IA'), wr = shotWindow('autos', 'Concessionárias · Atendimento com IA');
  if (side > 0) {
    const sw = 760, sh = sw * wl.height / wl.width;
    perspectiveSafe(g, wl, lerp(960, 470, side), 470, sw, sh, lerp(0, 0.42, clamp(side)), 0.5 * clamp(side));
    perspectiveSafe(g, wr, lerp(960, 1450, side), 470, sw, sh, lerp(0, -0.42, clamp(side)), 0.5 * clamp(side));
  }
  // a tela central: imobiliária, revelada pela luz
  const wc = shotWindow('imoveis', 'Imobiliárias · Atendimento com IA');
  const cw = 1060, ch = cw * wc.height / wc.width;
  const cx = lerp(from[0], 960, open), cy = lerp(from[1], 470, open), s = lerp(0.08, 1, open);
  g.save(); g.translate(cx, cy); g.scale(s, s);
  g.shadowColor = 'rgba(0,0,0,.8)'; g.shadowBlur = 120; g.shadowOffsetY = 50; g.fillStyle = '#000'; rr(g, -cw / 2, -ch / 2, cw, ch, 20); g.fill(); g.shadowColor = 'transparent';
  glow(g, 0, 0, 900, PAL.accent, 0.10 * open);
  const rp = seg(t, t0 + 0.3, t0 + 1.6);
  lightReveal(g, wc, -cw / 2, -ch / 2, cw, ch, rp, { base: 0.06, soft: 420, glint: 0.2, angle: 0.5 });
  g.restore();
  g.restore();
  // selos flutuando por cima (como no site), em tela
  g.save(); g.translate(-eio(close) * 1100, 0);
  flut(g, 150, 300, '3s', 'Resposta em segundos', 'a qualquer hora do dia', seg(t, t0 + 1.0, t0 + 1.3));
  flut(g, 1340, 560, '✓', 'Visita agendada', 'domingo · 9h, direto na agenda', seg(t, t0 + 1.3, t0 + 1.6));
  flut(g, 190, 610, '↗', 'Lead qualificado', 'enviado ao CRM com o histórico', seg(t, t0 + 1.6, t0 + 1.9));
  g.restore();
}
function perspectiveSafe(g, src, cx, cy, w, h, rot, a) {
  g.save(); g.globalAlpha = a;
  g.shadowColor = 'rgba(0,0,0,.7)'; g.shadowBlur = 60;
  E.perspective(g, src, cx, cy, w, h, rot, { slices: 80 });
  g.restore();
}

function drawAds(g, t) {
  const k = K(), t0 = k.ads, A = AREAS[1];
  drawPlanBehind(g, t, A);
  const x = 400, y = 140, w = 1120, h = 660;
  const open = seg(t, t0 - 0.1, t0 + 0.25);
  const put = (i) => seg(t, k.rules + 0.4 * i, k.rules + 0.4 * i + 0.3);   // desmonte, uma peça por batida
  const sIn = (1 - eio(seg(t, k.track, k.ads))) * 900;
  g.save(); g.translate(sIn, 0);
  const shut = seg(t, k.rules + 1.3, k.rules + 1.6);
  if (shut >= 1) { g.restore(); return; }
  g.translate(x + w / 2, y + h / 2); g.scale(lerp(1, 0.02, ei(seg(shut, 0.55, 1))), lerp(1, 0.006, ei(seg(shut, 0, 0.6)))); g.translate(-x - w / 2, -y - h / 2);
  const s = winShell(g, x, y, w, h, 'Campanhas · IA', open, { from: [x + w / 2, y + h / 2] });
  if (s.ready) {
    const pressed = t >= k.press, fix = ss(seg(t, k.press, k.press + 0.6));
    // gráfico de custo por lead
    const gx = x + 40, gy = y + 90, gw = 520, gh = 250;
    g.save(); g.globalAlpha = 1 - ei(put(0)); g.translate(0, -put(0) * 40);
    panel(g, gx, gy, gw, gh, { r: 14, fill: PAL.surf2, shadow: 0 });
    g.font = font(13, 500, 'mono'); g.fillStyle = PAL.mute; if (g.letterSpacing !== undefined) g.letterSpacing = '2px'; g.fillText('CUSTO POR LEAD · 14 DIAS', gx + 20, gy + 30); if (g.letterSpacing !== undefined) g.letterSpacing = '0px';
    const pts = []; for (let i = 0; i < 14; i++) { const base = 0.35 + 0.05 * Math.sin(i * 1.3); const rise = i >= 10 ? (i - 9) * 0.12 : 0; let v = base + rise; if (i >= 12) v = lerp(v, 0.3, fix); pts.push([gx + 24 + i * (gw - 48) / 13, gy + gh - 30 - v * (gh - 80)]); }
    g.lineWidth = 2.5; g.lineJoin = 'round';
    g.strokeStyle = 'rgba(255,255,255,.35)'; g.beginPath(); pts.slice(0, 11).forEach((p, i) => i ? g.lineTo(...p) : g.moveTo(...p)); g.stroke();
    g.strokeStyle = fix > 0.5 ? PAL.accent : PAL.red; g.shadowColor = g.strokeStyle; g.shadowBlur = 10; g.beginPath(); pts.slice(10).forEach((p, i) => i ? g.lineTo(...p) : g.moveTo(...p)); g.stroke(); g.shadowColor = 'transparent';
    g.restore();
    // cartão de alerta
    const cx = x + 590, cy = y + 90, cw2 = 490;
    g.save(); g.globalAlpha = 1 - ei(put(1)); g.translate(0, -put(1) * 40);
    const ap = back(seg(t, t0 + 0.4, t0 + 0.65), 1.5);
    g.translate(cx + cw2 / 2, cy + 60); g.scale(ap, ap); g.translate(-cx - cw2 / 2, -cy - 60);
    panel(g, cx, cy, cw2, 120, { r: 16, fill: PAL.surf2, shadow: 0.8 });
    if (!pressed || fix < 0.5) { g.fillStyle = PAL.red; g.shadowColor = rgba(PAL.red, .6); g.shadowBlur = 10; g.beginPath(); g.arc(cx + 26, cy + 34, 6, 0, TAU); g.fill(); g.shadowColor = 'transparent'; }
    else { g.fillStyle = PAL.accent; g.beginPath(); g.arc(cx + 26, cy + 34, 6, 0, TAU); g.fill(); }
    g.font = font(22, 600); g.fillStyle = PAL.text; g.textBaseline = 'middle'; g.fillText(fix < 0.5 ? 'Custo por lead +41%' : 'Custo por lead voltando ao normal', cx + 44, cy + 35);
    g.font = font(15, 500); g.fillStyle = PAL.dim; g.fillText('Conjunto “Recife · 25–44” · últimos 3 dias', cx + 44, cy + 72);
    g.restore();
    // sugestão + botão
    const sy0 = y + 240;
    g.save(); g.globalAlpha = (1 - ei(put(2))) * ss(seg(t, t0 + 0.8, t0 + 1.1)); g.translate(0, -put(2) * 40);
    g.font = font(12, 500, 'mono'); g.fillStyle = PAL.accent; if (g.letterSpacing !== undefined) g.letterSpacing = '2px'; g.fillText('SUGESTÃO DA IA', cx, sy0); if (g.letterSpacing !== undefined) g.letterSpacing = '0px';
    g.font = font(19, 500); g.fillStyle = PAL.text; g.fillText('Pausar o anúncio 3 e mover a', cx, sy0 + 36); g.fillText('verba para o conjunto 1.', cx, sy0 + 64);
    // botão Aprovar
    const bx = cx, by = sy0 + 100, bw = 180, bh = 54;
    const wind = seg(t, k.press - 0.5, k.press), hit = seg(t, k.press, k.press + 0.08), rel = seg(t, k.press + 0.08, k.press + 0.6);
    const sc = t < k.press ? 1 - 0.04 * ei(wind) : t < k.press + 0.08 ? 0.9 : lerp(0.9, 1, spring(rel, 9, .4));
    g.save(); g.translate(bx + bw / 2, by + bh / 2); g.scale(sc, sc);
    litShape(g, roundPath(-bw / 2, -bh / 2, bw, bh, 14), { accent: true, glowR: pressed ? 34 : 18, bbox: [-bw / 2, -bh / 2, bw, bh] });
    g.font = font(19, 600); g.fillStyle = '#fff'; g.textAlign = 'center'; g.fillText(pressed ? '✓ Aprovado' : 'Aprovar', 0, 1); g.restore();
    panel(g, bx + bw + 14, by, 170, bh, { r: 14, fill: PAL.surf2, shadow: 0 });
    g.font = font(18, 500); g.fillStyle = PAL.dim; g.textAlign = 'center'; g.fillText('Ver detalhes', bx + bw + 14 + 85, by + bh / 2 + 1); g.textAlign = 'left';
    // cursor: anda até o botão, prepara e aperta
    const cp = eio(seg(t, t0 + 1.8, k.press - 0.5));
    const px0 = lerp(cx + 420, bx + bw * 0.6, cp), py0 = lerp(sy0 + 260, by + bh * 0.6, cp);
    arrowCursor(g, px0, py0, t < k.press ? 1 + 0.12 * ei(wind) : t < k.press + 0.08 ? 0.82 : lerp(0.82, 1, spring(rel, 9, .4)));
    g.restore();
    // registro
    if (pressed) {
      g.save(); g.globalAlpha = (1 - ei(put(3))) * ss(seg(t, k.press + 0.4, k.press + 0.7));
      g.font = font(13, 500, 'mono'); g.fillStyle = PAL.mute; if (g.letterSpacing !== undefined) g.letterSpacing = '2px';
      g.fillText('✓ AJUSTE APLICADO · REGISTRADO NO HISTÓRICO', gx, y + h - 40); if (g.letterSpacing !== undefined) g.letterSpacing = '0px';
      g.restore();
    }
  }
  g.restore();
}
function arrowCursor(g, x, y, s = 1) {
  g.save(); g.translate(x, y); g.scale(s, s);
  g.shadowColor = 'rgba(0,0,0,.5)'; g.shadowBlur = 10; g.shadowOffsetY = 3;
  g.fillStyle = '#F2F4F8'; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 30); g.lineTo(8, 23); g.lineTo(13, 34); g.lineTo(18, 32); g.lineTo(13, 21); g.lineTo(23, 21); g.closePath(); g.fill();
  g.shadowColor = 'transparent'; g.strokeStyle = '#0A0B0F'; g.lineWidth = 1.5; g.stroke(); g.restore();
}

// planta ao fundo, escurecida, com a área em foco
function drawPlanBehind(g, t) {
  const k = K();
  drawPlanStill(g, t);
  g.fillStyle = 'rgba(6,7,10,.72)'; g.fillRect(0, 0, W, H);
}
let _planStill = null;
function drawPlanStill(g, t) {
  // a planta com tudo já organizado (fixa depois do snap)
  if (!_planStill) { const [c, gg] = buf('planStill'); drawPlan(gg, K().linked + 1.0); const keep = document.createElement('canvas'); keep.width = W; keep.height = H; keep.getContext('2d').drawImage(c, 0, 0); _planStill = keep; }
  g.drawImage(_planStill, 0, 0);
}
function planToScreen(t, x, y) { const cam = camAt(K().linked + 1.0); const p = cam.proj(x, y, 0); return [p.x, p.y]; }

// ───────────────────────── Cena 10: a regra (selo) ─────────────────────────
function drawRules(g, t) {
  const k = K();
  // a janela de campanhas se desmonta (desenhada por drawAds com put())
  drawAds(g, t);
  const sealIn = back(seg(t, k.rules + 1.6, k.rules + 1.9), 1.6);
  const out = seg(t, k.scale - 0.3, k.scale);   // achata num ponto
  if (sealIn <= 0) return;
  g.save(); g.fillStyle = `rgba(6,7,10,${0.6 * ss(seg(t, k.rules + 1.5, k.rules + 1.9))})`; g.fillRect(0, 0, W, H);
  g.translate(960, 470); g.scale(sealIn * lerp(1, 0.02, ei(seg(out, 0.5, 1))), sealIn * lerp(1, 0.01, ei(seg(out, 0, 0.6))));
  // cadeado
  litShape(g, roundPath(-70, -40, 140, 110, 26), { accent: true, glowR: 40, bbox: [-70, -40, 140, 110] });
  g.strokeStyle = PAL.accent; g.lineWidth = 14; g.lineCap = 'round'; g.shadowColor = rgba(PAL.accent, .6); g.shadowBlur = 18;
  g.beginPath(); g.arc(0, -40, 44, Math.PI, 0); g.stroke(); g.shadowColor = 'transparent';
  g.fillStyle = '#0A0B0F'; g.beginPath(); g.arc(0, 8, 12, 0, TAU); g.fill(); g.fillRect(-5, 8, 10, 30);
  g.restore();
  const items = ['LGPD', 'CONFIDENCIALIDADE EM CONTRATO', 'SEUS DADOS NÃO TREINAM IA'];
  g.save(); g.font = font(22, 500, 'mono'); g.textAlign = 'center'; if (g.letterSpacing !== undefined) g.letterSpacing = '4px';
  items.forEach((s, i) => { const a = ss(seg(t, k.rules + 1.8 + i * 0.25, k.rules + 2.05 + i * 0.25)) * (1 - seg(out, 0, 0.4)); g.globalAlpha = a; g.fillStyle = i === 0 ? PAL.text : PAL.dim; g.fillText(s, 960, 650 + i * 44); });
  g.restore();
}

// ───────────────────────── Cena 11–12: 50 empresas e o fim ─────────────────────────
const COLS = 11, ROWS = 6, TS = 120, TG = 26;
function tilePos(i) { const c = i % COLS, r = Math.floor(i / COLS); return [960 - (COLS * TS + (COLS - 1) * TG) / 2 + c * (TS + TG) + TS / 2, 540 - (ROWS * TS + (ROWS - 1) * TG) / 2 + r * (TS + TG) + TS / 2 - 10]; }
const CENTER_I = 2 * COLS + 5;
function litTime(i) { const [x, y] = tilePos(i), [cx, cy] = tilePos(CENTER_I); const d = Math.hypot(x - cx, y - cy); return K().scale + 0.5 + d / 900 + hash(i * 3.3) * 0.12; }
function miniPlan(g, x, y, s, lit, t, i) {
  panel(g, x - s / 2, y - s / 2, s, s, { r: s * 0.16, fill: '#141822', cheap: true, shadow: 0.7 });
  const q = s * 0.3, gap = s * 0.06;
  for (let a = 0; a < 4; a++) {
    const qx = x - q - gap / 2 + (a % 2) * (q + gap), qy = y - q - gap / 2 + Math.floor(a / 2) * (q + gap);
    const pulse = lit > 0 ? 0.55 + 0.45 * Math.sin(t * 2.2 + i * 0.7 + a) : 0;
    g.fillStyle = lit > 0 ? rgba(PAL.accent, (0.25 + 0.35 * pulse) * lit) : 'rgba(255,255,255,.05)'; rr(g, qx, qy, q, q, q * 0.2); g.fill();
  }
  if (lit > 0) { g.strokeStyle = rgba(PAL.accent, 0.5 * lit); g.lineWidth = 1; rr(g, x - s / 2 + .5, y - s / 2 + .5, s - 1, s - 1, s * 0.16); g.stroke(); }
}
function drawScale(g, t) {
  const k = K();
  const u = seg(t, k.scale, k.scale + 0.8), [cx, cy] = tilePos(CENTER_I);
  const zEnd = t > k.end ? lerp(1, 1.06, ss(seg(t, k.end, k.off))) : 1;
  const z = Math.exp(lerp(Math.log(7.5), Math.log(1), eo(u))) * zEnd;
  const cam = camera({ x: lerp(cx, 960, eo(u)), y: lerp(cy, 530, eo(u)), zoom: z });
  E.bg(g, { lift: 1, cool: 1 });
  const p0 = cam.proj(0, 0, 0); E.grid(g, { ox: p0.x, oy: p0.y, scale: p0.s, alpha: 0.8 });
  cam.apply(g, 0);
  const n = COLS * ROWS;
  const endDim = t > k.end ? 1 - 0.55 * ss(seg(t, k.end, k.logo)) : 1;
  const offP = seg(t, k.off, k.off + 0.8);
  for (let i = 0; i < n; i++) {
    const [x, y] = tilePos(i), lt = i === CENTER_I ? k.scale : litTime(i);
    const lit = ss(seg(t, lt, lt + 0.25)), pop = back(seg(t, lt, lt + 0.25), 2);
    const shrink = 1 - ei(seg(offP, hash(i) * 0.5, hash(i) * 0.5 + 0.4));
    g.save(); g.globalAlpha = endDim * shrink; g.translate(x, y); g.scale(lit > 0 ? lerp(.92, 1, pop) : 1, lit > 0 ? lerp(.92, 1, pop) : 1); g.translate(-x, -y);
    miniPlan(g, x, y, TS, lit, t, i); g.restore();
  }
  g.setTransform(1, 0, 0, 1, 0, 0);
  // +50
  const nIn = seg(t, k.bigNum - 0.3, k.bigNum), nOut = seg(t, k.breath - 0.4, k.breath);
  if (nIn > 0 && nOut < 1) {
    g.fillStyle = `rgba(6,7,10,${0.62 * ss(nIn) * (1 - ss(nOut))})`; g.fillRect(0, 0, W, H);
    g.save(); g.translate(960, 560); g.scale(1, lerp(1, 0.01, ei(nOut))); g.translate(-960, -560);
    glow(g, 960, 500, 520, PAL.accent, 0.12);
    const s16 = TL.beat / 4;
    scramble(g, '+50', 960, 640, t, [k.bigNum, k.bigNum + s16 * 2, k.bigNum + s16], { px: 380, color: PAL.accent, align: 'center', start: k.bigNum - 0.3 });
    g.font = font(16, 500, 'mono'); g.fillStyle = PAL.dim; g.textAlign = 'center'; if (g.letterSpacing !== undefined) g.letterSpacing = '4px';
    g.globalAlpha = ss(seg(t, k.bigNum + 0.1, k.bigNum + 0.3)); g.fillText('EMPRESAS COM IA', 960, 730); g.restore();
  }
  // fim: marca, frase, chamada
  if (t >= k.logo) {
    const a = ss(seg(t, k.logo, k.logo + 0.5)) * (1 - ss(seg(t, k.off, k.off + 0.5)));
    g.save(); g.translate(0, (1 - eo(seg(t, k.logo, k.logo + 0.5))) * 18);
    g.fillStyle = `rgba(6,7,10,${0.5 * a})`; g.fillRect(0, 0, W, H);
    brand(g, 960, 270, 74, a, true);
    g.globalAlpha = a * ss(seg(t, k.tag, k.tag + 0.5)); g.font = font(40, 500); g.fillStyle = PAL.text; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText('IA que trabalha dentro da sua empresa.', 960, 600);
    const cp = back(seg(t, k.cta, k.cta + 0.3), 1.5);
    if (cp > 0) {
      g.globalAlpha = a; g.save(); g.translate(960, 705); g.scale(cp, cp);
      litShape(g, roundPath(-220, -36, 440, 72, 18), { accent: true, glowR: 34, bbox: [-220, -36, 440, 72] });
      g.font = font(24, 600); g.fillStyle = '#fff'; g.fillText('Quero um Raio-X de IA  →', 0, 1); g.restore();
      g.globalAlpha = a * ss(seg(t, k.cta + 0.4, k.cta + 0.8)); g.font = font(18, 500, 'mono'); g.fillStyle = PAL.dim; if (g.letterSpacing !== undefined) g.letterSpacing = '3px';
      g.fillText('USEAUTOGENIUS.COM', 960, 795);
    }
    g.restore();
  }
  // apagar: tudo encolhe num ponto
  if (t > k.off + 0.5) { const p = seg(t, k.off + 0.5, k.off + 0.9); g.fillStyle = `rgba(0,0,0,${ss(p)})`; g.fillRect(0, 0, W, H); }
  E.vignette(g, 0.52);
}

// ───────────────────────── Legendas ─────────────────────────
const NO_SUB = new Set(['l05', 'l10', 'l11']);   // número na tela / texto na tela
function lineAt(id) { const L = LINES.find(l => l.id === id); return { text: L.text, t0: TL.lines[id], t1: TL.lines[id] + Math.max(1.8, (DURS[id] || 2) + 0.6) }; }
export function subs() { return LINES.map(l => { const s = lineAt(l.id); return { t0: s.t0, t1: s.t1, text: s.text }; }); }
function caption(g, t) {
  for (const l of LINES) {
    if (NO_SUB.has(l.id)) continue;
    const s = lineAt(l.id); if (t < s.t0 || t > s.t1) continue;
    const a = Math.min(seg(t, s.t0, s.t0 + 0.16), 1 - seg(t, s.t1 - 0.16, s.t1));
    toast(g, s.text, a, { dense: t > K().wobble && t < K().hush ? 1 : 0, px: 36 });
  }
}

// ───────────────────────── Render ─────────────────────────
export function render(g, t) {
  const k = K();
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
  if (t < k.num) drawPlan(g, t);
  else if (t < k.plan) drawNumber(g, t);
  else if (t < k.chat) drawPlan(g, t);
  else if (t < k.ads) drawChat(g, t);
  else if (t < k.rules) drawAds(g, t);
  else if (t < k.scale) drawRules(g, t);
  else drawScale(g, t);
  // o cartão 01 cresce até virar a tela do número (transição de UI)
  if (t >= k.dive && t < k.num) {
    const cam = camAt(t), o = oppRect(0), a = cam.proj(o.x, o.y - 14, 0), b = cam.proj(o.x + o.w, o.y + o.h - 14, 0);
    const p = ei(seg(t, k.dive, k.num)), X = lerp(a.x, -40, p), Y = lerp(a.y, -40, p), X2 = lerp(b.x, W + 40, p), Y2 = lerp(b.y, H + 40, p);
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.save(); g.shadowColor = rgba(PAL.accent, .5); g.shadowBlur = 40;
    g.fillStyle = mix('#161B27', PAL.bg0, p); rr(g, X, Y, X2 - X, Y2 - Y, lerp(16, 0, p)); g.fill(); g.shadowColor = 'transparent';
    g.strokeStyle = rgba(PAL.accent, .9 * (1 - p)); g.lineWidth = 1.5; rr(g, X + .5, Y + .5, X2 - X - 1, Y2 - Y - 1, lerp(16, 0, p)); g.stroke();
    g.restore();
  }
  g.setTransform(1, 0, 0, 1, 0, 0);
  caption(g, t);
}

export function texts(t) {
  const k = K(), out = [];
  const box = (id, text, x0, y0, x1, y1) => out.push({ id, text, x0, y0, x1, y1 });
  OPP.forEach((o, i) => { if (t >= k.opps + 0.3 * i + 0.3 && t < k.dive) box('opp' + i, o.t, 600, 300, 900, 380); });
  if (t >= k.num + 0.6 + 0.15 * 2 && t < k.numOut) box('num', '14 dias', 560, 380, 1360, 720);
  if (t >= k.chat + 1.3 && t < k.track) box('f1', 'Resposta em segundos', 150, 300, 480, 372);
  if (t >= k.chat + 1.6 && t < k.track) box('f2', 'Visita agendada', 1340, 560, 1700, 632);
  if (t >= k.chat + 1.9 && t < k.track) box('f3', 'Lead qualificado', 190, 610, 560, 682);
  if (t >= k.ads + 0.65 && t < k.press + 0.3) box('a1', 'Custo por lead +41%', 990, 230, 1480, 350);
  if (t >= k.ads + 1.1 && t < k.rules + 0.8) box('a2', 'Pausar o anúncio 3 e mover a verba para o conjunto 1.', 990, 370, 1500, 420);
  ['LGPD', 'CONFIDENCIALIDADE EM CONTRATO', 'SEUS DADOS NÃO TREINAM IA'].forEach((s, i) => { if (t >= k.rules + 2.05 + i * 0.25 && t < k.scale - 0.3) box('r' + i, s, 560, 625 + i * 44, 1360, 660 + i * 44); });
  if (t >= k.bigNum + 0.3 && t < k.breath - 0.4) box('n50', '+50 EMPRESAS COM IA', 600, 400, 1320, 740);
  if (t >= k.logo + 0.5 && t < k.off) box('logo', 'AutoGenius', 760, 90, 1160, 450);
  if (t >= k.tag + 0.5 && t < k.off) box('tag', 'IA que trabalha dentro da sua empresa.', 560, 575, 1360, 625);
  if (t >= k.cta + 0.8 && t < k.off) box('cta', 'Quero um Raio-X de IA → USEAUTOGENIUS.COM', 740, 665, 1180, 810);
  return out;
}

// ───────────────────────── Eventos de som ─────────────────────────
function buildEvents() {
  const k = K(), ev = [], add = (t, type, o = {}) => ev.push({ t: +t.toFixed(4), type, ...o });
  for (let b = 0; b * TL.beat < k.pull; b++) if (b % 2 === 0) add(b * TL.beat, 'tick');
  CHIPS.forEach((c, i) => add(c.born, 'spawn_' + c.kind, { area: c.ai, red: c.red ? 1 : 0, pan: (c.x + c.w / 2 - 960) / 960, i }));
  add(k.scan, 'press'); add(k.scan - 0.4, 'shimmer_pre'); add(k.scan, 'scan', { d: k.scanEnd - k.scan });
  add(k.iaOn, 'ia_on');
  OPP.forEach((o, i) => add(k.opps + 0.3 * i, 'opp', { i }));
  add(k.dive, 'dive'); add(k.num, 'expand');
  const s16 = TL.beat / 4, L0 = k.num + 0.6; add(k.num, 'grains', { d: 0.6 }); add(L0, 'lock'); add(L0 + s16, 'lock');
  for (let i = 0; i < 14; i++) add(L0 + s16 * 4 + i * s16, 'mark', { i });
  add(k.numOut, 'crt');
  CHIPS.forEach(c => { add(c.fly, 'fly', { area: c.ai }); add(c.fly + 0.3, 'land', { area: c.ai, i: c.k }); });
  k.snap.forEach((s, i) => add(s + 0.15, 'area_lit', { area: i }));
  add(k.linked, 'linked');
  add(k.chat, 'expand'); add(k.chat + 0.25, 'side'); add(k.chat + 0.3, 'reveal', { d: 1.3 }); add(k.chat + 1.0, 'flut', { i: 0 }); add(k.chat + 1.3, 'flut', { i: 1 }); add(k.chat + 1.6, 'flut', { i: 2 });
  add(k.track, 'collapse'); add(k.ads - 0.1, 'expand'); add(k.ads + 0.4, 'alert'); add(k.ads + 0.8, 'suggest');
  add(k.ads + 1.8, 'cursor_move', { d: k.press - 0.5 - k.ads - 1.8 }); add(k.press - 0.5, 'windup'); add(k.press, 'click'); add(k.press + 0.05, 'approve');
  for (let i = 0; i < 3; i++) add(k.rules + 0.4 * i, 'retract', { i }); add(k.rules + 1.3, 'crt');
  add(k.rules + 1.6, 'seal'); for (let i = 0; i < 3; i++) add(k.rules + 1.8 + i * 0.25, 'seal_line', { i });
  add(k.scale - 0.3, 'crt'); add(k.scale, 'whip');
  for (let i = 0; i < COLS * ROWS; i++) if (i !== CENTER_I) add(litTime(i), 'tile', { i, d: Math.hypot(tilePos(i)[0] - 960, tilePos(i)[1] - 540) });
  add(k.bigNum - 0.3, 'grains', { d: 0.4 }); add(k.bigNum, 'lock'); add(k.bigNum + s16, 'lock'); add(k.bigNum + s16 * 2, 'lock');
  add(k.breath - 0.4, 'crt');
  add(k.logo, 'logo'); add(k.cta, 'cta'); add(k.off + 0.5, 'off');
  return ev.sort((a, b) => a.t - b.t);
}
export const events = () => EVS;
