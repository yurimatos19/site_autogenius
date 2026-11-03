import * as F from './film.js';
const cv = document.getElementById('c'), g = cv.getContext('2d');
await Promise.all([...[400, 500, 600, 700].flatMap(w => [`${w} 40px Inter`, `${w} 40px InterTight`, `${w} 40px JBMono`]), '600 40px Poppins'].map(f => document.fonts.load(f)));
const get = async (u, d) => { try { const r = await fetch(u); return r.ok ? await r.json() : d; } catch { return d; } };
const img = src => new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => no(new Error('imagem: ' + src)); i.src = src; });
const [tl, lines, durs, marca, imoveis, escolas, autos] = await Promise.all([
  get('timeline.json', null), get('lines.json', []), get('voice/dur.json', {}),
  img('assets/marca.png'), img('assets/produto-imoveis.jpg'), img('assets/produto-escolas.jpg'), img('assets/produto-autos.jpg')]);
F.setShots({ imoveis, escolas, autos });
F.setup(tl, lines, durs, marca);
window.DUR = F.dur();
window.EV = F.events();
window.SUBS = F.subs();
window.TEXTS = t => F.texts(t);
window.render = t => F.render(g, t);
window.READY = true;
