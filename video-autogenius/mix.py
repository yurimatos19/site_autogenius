"""mix.py — efeitos + ambiente + voz + trilha → out/mix.wav
Desordem soa espalhada (cada fonte num timbre, fora do tom, pans soltos); a AutoGenius soa como um conjunto só
(feltro e vidro, afinados em Ré, centrados). Voz por cima: música −8 dB e efeitos −4 dB sob a fala.
Uso: $LIB/.venv/bin/python mix.py
"""
import os, sys, json, numpy as np, soundfile as sf
from scipy.signal import resample_poly
from scipy.ndimage import uniform_filter1d
D = os.path.dirname(os.path.abspath(__file__))
LIB = os.environ.get('LIB', os.path.expanduser('~/lemo-opuscar')); sys.path.insert(0, LIB)
from core.audio.sfx import SR, t_, env_exp, bp, lp, hp, noise, norm, brown, add, compress, limit

TL = json.load(open(os.path.join(D, 'timeline.json'))); K = TL['K']; DUR = TL['dur']
EV = json.load(open(os.path.join(D, 'events.json')))['ev']
LINES = json.load(open(os.path.join(D, 'lines.json'))); DURS = json.load(open(os.path.join(D, 'voice', 'dur.json')))
rng = np.random.default_rng(2026)
N = int(DUR * SR); fol = np.zeros((N, 2)); amb = np.zeros((N, 2)); vox = np.zeros((N, 2))
hz = lambda m: 440 * 2 ** ((m - 69) / 12)
D_KEY = [74, 76, 78, 81, 83, 86, 88, 90, 93]

def sine(f, d, tau, ph=0): return np.sin(2 * np.pi * f * t_(d) + ph) * env_exp(d, tau)
def tick(v=1.0): d = .03; return norm(bp(noise(d), 1500, 3200) * env_exp(d, .0025) + sine(2100, d, .004) * .6) * v
def key(v=1.0): d = .07; p = 1 + rng.uniform(-.08, .08); return norm(bp(noise(d), 1400 * p, 5200 * p) * env_exp(d, .004) + sine(180 * p, d, .012) * .45) * v
def glass(f, v=1.0, d=.5, bright=1.0):
    x = sine(f, d, d * .35) + sine(2 * f, d, d * .18) * .35 * bright + sine(2.76 * f, d, d * .1) * .22 * bright + hp(noise(d), 5000) * env_exp(d, .002) * .3
    return norm(x) * v
def felt(v=1.0, f=320): d = .09; return norm(sine(f, d, .018) + lp(noise(d), 1400) * env_exp(d, .006) * .7 + sine(f * 2.01, d, .01) * .3) * v
def whoosh(d=.3, lo=500, hi=4000, v=1.0, up=True):
    n = noise(d); out = np.zeros_like(n); L = len(n); step = 480
    for i in range(0, L, step):
        u = i / L; u = u if up else 1 - u; f = lo * (hi / lo) ** u; w = min(step, L - i)
        out[i:i + w] = bp(n[max(0, i - 1500):i + w], f * .75, min(f * 1.3, SR / 2 - 100))[-w:]
    return norm(out * np.sin(np.pi * t_(d) / d) ** 1.5) * v
def plop(v=1.0): d = .08; tt = t_(d); f = 320 * (1 - .5 * tt / d); return norm(np.sin(2 * np.pi * np.cumsum(f) / SR) * env_exp(d, .02) + bp(noise(d), 2000, 6000) * env_exp(d, .003) * .4) * v
def pop(v=1.0, f=900): d = .12; tt = t_(d); fr = f * (1 + .6 * np.exp(-tt / .01)); return norm(np.sin(2 * np.pi * np.cumsum(fr) / SR) * env_exp(d, .03)) * v
def buzz(v=1.0): d = .22; tt = t_(d); x = np.sign(np.sin(2 * np.pi * 220 * tt)) + np.sign(np.sin(2 * np.pi * 233 * tt)); return norm(lp(x, 1400) * env_exp(d, .08)) * v
def doom(v=1.0):
    d = 2.6; tt = t_(d); f = 40 + 15 * np.exp(-tt / .35)
    sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * env_exp(d, .55)
    mallet = lp(noise(d), 700) * env_exp(d, .012) * .9 + sine(140, d, .05) * .5 + sine(95, d, .12) * .5
    return norm(sub + mallet + lp(noise(d), 900) * env_exp(d, .5) * .05) * v
def shimmer(d=1.6, v=1.0):
    x = whoosh(d, 3000, 9500, 1, True) * .7
    for m, a in [(93, .25), (98, .18), (105, .12)]:
        x = x + np.sin(2 * np.pi * hz(m) * t_(d)) * np.sin(np.pi * t_(d) / d) ** 2 * a
    return norm(x) * v
def grains(d=1.0, v=1.0):
    out = np.zeros(int(d * SR)); t = 0.0
    while t < d - .01:
        c = bp(noise(.006), 2500, 9000) * env_exp(.006, .001) * rng.uniform(.4, 1)
        s = int(t * SR); out[s:s + len(c)] += c[:len(out) - s]; t += .045 * (1 - .8 * t / d) + rng.uniform(0, .01)
    return norm(out) * v
def crt_off(v=1.0): d = .5; tt = t_(d); f = 900 * np.exp(-tt / .12) + 120; return norm(np.sin(2 * np.pi * np.cumsum(f) / SR) * env_exp(d, .15) * .5 + whoosh(d, 3000, 300, 1, True) * .6) * v
def scanbed(d): tt = t_(d); return norm(bp(noise(d), 2500, 6000) * (.4 + .6 * np.sin(np.pi * tt / d) ** 2) + np.sin(2 * np.pi * 1760 * tt) * .08 * np.sin(np.pi * tt / d)) * .5

# ─────────── Ambiente ───────────
tt = np.arange(N) / SR
def ramp(a, b, fi=.3, fo=.3):
    e = np.zeros(N); s, e2 = int(a * SR), int(min(b, DUR) * SR); e[s:e2] = 1
    k = int(fi * SR); e[s:s + k] *= np.linspace(0, 1, len(e[s:s + k]))
    k = min(int(fo * SR), e2 - s); e[e2 - k:e2] *= np.linspace(1, 0, k)
    return e
fit = lambda x: np.pad(x, (0, max(0, N - len(x))))[:N]
room = fit(lp(brown(DUR), 220)) * .010
fan = fit(bp(noise(DUR), 280, 1600)) * .03
coil = np.sin(2 * np.pi * (6800 + 30 * np.sin(2 * np.pi * .7 * tt)) * tt) * .004
fanE = np.clip((tt - 8.4) / 3.4, 0, 1) ** 1.6 * (tt < K['hush'])                 # sobe só depois da fala 2
mono = room * (ramp(0, K['hush'], .4, .005) + ramp(K['scan'], DUR - .5, .02, 1.0)) + (fan + coil) * fanE
amb[:, 0] += mono; amb[:, 1] += np.roll(mono, 37)

# ─────────── Eventos ───────────
for e in EV:
    t, ty = e['t'], e['type']
    if ty == 'tick': add(fol, tick(), t, .18, 0)
    elif ty == 'spawn_msg': add(fol, pop(1, 700 * 2 ** (rng.uniform(-.5, .5) / 12) * rng.choice([1, 1.26, 1.5])), t, .10, e['pan'])
    elif ty == 'spawn_file': add(fol, plop(), t, .12, e['pan'])
    elif ty == 'spawn_alert': add(fol, buzz() if e['red'] else pop(1, 1100), t, .07 if e['red'] else .08, e['pan'])
    elif ty == 'shimmer_pre': add(fol, shimmer(1.2), t, .10, 0)                     # J-cut: a luz chega antes da imagem
    elif ty == 'press': add(fol, doom(), t, .5, 0)                                  # primeiro som depois do silêncio
    elif ty == 'scan': add(fol, scanbed(e['d']), t, .06, 0)
    elif ty == 'ia_on': add(fol, glass(hz(86), 1, .9), t, .16, 0); add(fol, felt(1, 290), t, .3, 0)
    elif ty == 'opp': add(fol, glass(hz([86, 90, 93][e['i']]), 1, .6), t, .12, [-.3, .3, 0][e['i']])
    elif ty == 'dive': add(fol, whoosh(.6, 400, 6000, 1, True), t, .14, 0)
    elif ty == 'expand': add(fol, whoosh(.3, 600, 5000, 1, True), t, .12, 0)
    elif ty == 'collapse': add(fol, whoosh(.4, 5000, 500, 1, True), t, .1, 0)
    elif ty == 'grains': add(fol, grains(e['d']), t, .1, 0)
    elif ty == 'lock': add(fol, felt(1, 360), t, .3, 0)
    elif ty == 'mark': add(fol, tick(), t, .12, -.4 + e['i'] * .06)
    elif ty == 'crt': add(fol, crt_off(), t, .16, 0)
    elif ty == 'fly': pass
    elif ty == 'land': add(fol, felt(1, 300 + 20 * e['area']), t, .07, [-.5, .5, -.5, .5][e['area']])
    elif ty == 'area_lit': add(fol, glass(hz(D_KEY[e['area'] * 2]), 1, .7), t, .12, [-.5, .5, -.5, .5][e['area']])
    elif ty == 'linked': add(fol, shimmer(1.4), t, .1, 0)
    elif ty == 'side': add(fol, whoosh(.45, 400, 3000, 1, True), t, .08, 0)
    elif ty == 'reveal': add(fol, shimmer(e['d']), t, .12, 0)
    elif ty == 'flut': add(fol, glass(hz([88, 90, 93][e['i']]), 1, .5), t, .12, [-.5, .5, -.4][e['i']])
    elif ty == 'alert': add(fol, buzz(), t, .08, .2)                                # o último som de problema
    elif ty == 'suggest': add(fol, glass(hz(81), 1, .5), t, .1, .1)
    elif ty == 'cursor_move': add(fol, whoosh(e['d'], 300, 1200, .4, True), t, .04, 0)
    elif ty == 'windup': add(fol, tick(), t, .2, 0)
    elif ty == 'click': add(fol, key(), t, .35, 0); add(fol, doom(), t, .32, 0)
    elif ty == 'approve': add(fol, glass(hz(86), 1, .9), t + .05, .16, 0)
    elif ty == 'retract': add(fol, whoosh(.22, 3000, 600, 1, True), t, .08, 0)
    elif ty == 'seal': add(fol, felt(1, 240), t, .35, 0); add(fol, glass(hz(81), 1, .8), t, .12, 0)
    elif ty == 'seal_line': add(fol, tick(), t, .14, 0)
    elif ty == 'whip': add(fol, whoosh(.5, 6000, 400, 1, True), t, .16, 0)
    elif ty == 'tile': add(fol, felt(1, 420), t, .03, 0)
    elif ty == 'logo': add(fol, doom(), t, .3, 0); add(fol, shimmer(1.6), t - .3, .1, 0)
    elif ty == 'cta': add(fol, key(), t, .25, 0); add(fol, glass(hz(93), 1, .9), t, .12, 0)
    elif ty == 'off': add(fol, crt_off(), t, .16, 0)

# ─────────── Voz ───────────
for L in LINES:
    y, sr = sf.read(os.path.join(D, 'voice', L['id'] + '.wav'), dtype='float64')
    if y.ndim > 1: y = y.mean(1)
    if sr != SR: y = resample_poly(y, SR, sr)
    y = compress(y, thr=.22, ratio=3.2)
    add(vox, y, TL['lines'][L['id']], 1.0, 0)
v = vox.mean(1); vr = np.sqrt(np.mean(v[np.abs(v) > 1e-4] ** 2)); vox *= 0.18 / max(vr, 1e-6)

# ─────────── Trilha + duck ───────────
mus, sr = sf.read(os.path.join(D, 'music', 'score.wav'), dtype='float64')
if sr != SR: mus = resample_poly(mus, SR, sr, axis=0)
mus = np.pad(mus, ((0, max(0, N - len(mus))), (0, 0)))[:N]
mr = np.sqrt(np.mean(mus[np.abs(mus).sum(1) > 1e-4] ** 2)); mus *= (0.18 / 3.16) / max(mr, 1e-6)   # voz ~10 dB acima
lvl = uniform_filter1d(np.abs(vox).mean(1), int(.12 * SR)); act = np.clip(lvl / 0.02, 0, 1)
act = uniform_filter1d(act, int(.25 * SR))
gm = 10 ** (-8 * act / 20); gf = 10 ** (-4 * act / 20)
out = mus * gm[:, None] + fol * 0.9 * gf[:, None] + amb + vox
# silêncio real no "hush" (zero digital em todas as faixas)
z0, z1 = int(K['hush'] * SR), int(K['scan'] * SR) - int(.002 * SR); out[z0:z1] = 0
out = limit(out, .95)
os.makedirs(os.path.join(D, 'out'), exist_ok=True)
sf.write(os.path.join(D, 'out', 'mix.wav'), out.astype(np.float32), SR)
print('mix.wav', round(DUR, 2), 's')
