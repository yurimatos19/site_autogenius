"""Trilha original de "AutoGenius em 1 minuto" — música de processo, 100 bpm, Ré lídio.

Desordem (pings de marimba desafinados, pans soltos) → zero digital → um acorde abre →
vibrafone aditivo (uma nota por compasso) → tudo pousa no mesmo modo → batida dividida nos produtos →
subtração na regra → cascata afinada nas 50 empresas → um acorde final.
Lê ../timeline.json e ../events.json. Saída: music/score.wav
Uso: $LIB/.venv/bin/python music/score.py
"""
import os, sys, json
import numpy as np, soundfile as sf
HERE = os.path.dirname(os.path.abspath(__file__)); FILM = os.path.dirname(HERE)
LIB = os.environ.get('LIB', os.path.expanduser('~/lemo-opuscar')); sys.path.insert(0, LIB)
from core.audio import sampler as S
from core.audio.sfx import SR, lp, hp

TL = json.load(open(os.path.join(FILM, 'timeline.json'))); K = TL['K']; DUR = TL['dur']; BEAT = TL['beat']
EV = json.load(open(os.path.join(FILM, 'events.json')))['ev']
N = int(DUR * SR); S.seed(20261103); R = np.random.default_rng(7)
LYD = [62, 64, 66, 68, 69, 71, 73]                    # Ré lídio
def mode(i, base=0): o, k = divmod(i, 7); return LYD[k] + 12 * o + base
PENTA = [74, 76, 78, 81, 83, 86, 88, 90, 93]            # notas "da marca" (um só conjunto)
ev = []; E = lambda *a: ev.append(a)

# ── B: desordem — cada cartão que nasce é um ping fora do tom ──
for e in EV:
    if e['type'].startswith('spawn_'):
        m = 60 + R.integers(0, 24) + R.uniform(-0.3, 0.3)           # ±30 cents
        u = (e['t'] - K['pull']) / (K['hush'] - K['pull'])
        inst = {'spawn_msg': 'marimba', 'spawn_alert': 'vibraphone_hard', 'spawn_file': 'marimba'}[e['type']]
        E(e['t'], inst, float(m), 0.4, 0.25 + 0.35 * u, float(np.clip(e['pan'] + R.uniform(-.3, .3), -1, 1)), 0.55)

# ── C: o acorde abre no primeiro som depois do silêncio; vibrafone aditivo ──
E(K['scan'], 'vibraphone_bowed', 'A3', 5.2, .55, -.15); E(K['scan'], 'vibraphone_bowed', 'F#4', 5.2, .5, .15)
E(K['scan'], 'vibraphone_bowed', 'C#5', 5.2, .45, -.05); E(K['scan'], 'vibraphone_bowed', 'E5', 5.2, .4, .1)
E(K['scan'], 'marimba', 'D3', 2.0, .7, 0)
motif = [74, 81, 78, 76, 83, 86]                            # uma nota a mais por compasso
for bar in range(4):
    t0 = K['scan'] + bar * TL['bar']
    for j in range(bar + 2):
        E(t0 + j * BEAT * (4 / (bar + 2)), 'vibraphone', motif[j], 1.2, .42 + .04 * bar, (-.3 + .6 * j / max(1, bar + 1)))
for e in EV:
    if e['type'] == 'opp': E(e['t'], 'glockenspiel', [86, 90, 93][e['i']], 1.5, .45, [-.3, .3, 0][e['i']])
    if e['type'] == 'ia_on': E(e['t'], 'vibraphone', 'D5', 2.5, .55, 0); E(e['t'], 'vibraphone', 'A5', 2.5, .45, 0)

# ── D: o número — travas e marcas sobem a escala ──
for e in EV:
    if e['type'] == 'lock' and e['t'] < K['plan']: E(e['t'], 'glockenspiel', 93, 1.2, .5, 0)
    if e['type'] == 'mark': E(e['t'], 'glockenspiel', mode(e['i'] % 7, 12 + 12 * (e['i'] // 7)), .5, .28, -.4 + e['i'] * .06)
E(K['num'], 'vibraphone_bowed', 'D4', 3.2, .45, 0); E(K['num'], 'vibraphone_bowed', 'A4', 3.2, .4, 0)

# ── E: o snap — cada pouso é uma nota do mesmo conjunto; tudo termina num acorde ──
lands = [e for e in EV if e['type'] == 'land']
for j, e in enumerate(lands):
    E(e['t'], 'vibraphone' if j % 2 else 'marimba', PENTA[(e['i'] + e['area'] * 2) % len(PENTA)], .5, .22, [-.5, .5, -.5, .5][e['area']], .7)
for b in range(int((K['chat'] - K['plan']) / (BEAT / 2))):
    t = K['plan'] + b * BEAT / 2
    E(t, 'marimba', [62, 69, 74, 69, 66, 69, 74, 76][b % 8], .3, .3 + .1 * (b % 2 == 0), 0, .8)
for p in ['D3', 'A3', 'E4', 'F#4', 'C#5']:
    E(K['linked'], 'vibraphone_bowed' if p not in ('D3',) else 'marimba', p, 3.6, .5, 0)

# ── F: produtos — a batida se divide (colcheias → semicolcheias) sem mudar o tempo ──
pat = [62, 69, 74, 76, 74, 69, 71, 69]
t = K['chat']; i = 0
while t < K['rules'] - 1e-6:
    sub = 2 if t < K['ads'] else 4
    E(t, 'marimba', pat[i % 8], .25, .26 + .08 * (i % sub == 0), (-.2 if i % 2 else .2), .75)
    t += BEAT / sub; i += 1
E(K['press'], 'vibraphone_bowed', 'F#4', 2.4, .5, 0); E(K['press'], 'vibraphone_bowed', 'C#5', 2.4, .45, 0); E(K['press'], 'marimba', 'D3', 2.0, .7, 0)
E(K['chat'], 'vibraphone', 'E5', 1.5, .4, .2); E(K['ads'], 'vibraphone', 'F#5', 1.5, .4, -.2)

# ── G: regra — subtração: o padrão perde uma nota por batida até sobrar uma ──
keep = list(range(8))
for b in range(int((K['scale'] - K['rules']) / BEAT)):
    t0 = K['rules'] + b * BEAT
    if b % 1 == 0 and len(keep) > 1 and b > 0: keep.pop(len(keep) // 2)
    for j in keep:
        if j % 4 == 0 or len(keep) > 2: E(t0 + j * BEAT / 8, 'marimba', pat[j], .25, .24, 0, .7)
E(K['rules'] + 1.6, 'vibraphone', 'A4', 3.0, .45, 0)

# ── H: escala — cada empresa que acende é uma nota, de dentro para fora ──
tiles = sorted([e for e in EV if e['type'] == 'tile'], key=lambda e: e['t'])
for j, e in enumerate(tiles):
    E(e['t'], 'glockenspiel' if j % 3 == 0 else 'vibraphone', PENTA[min(len(PENTA) - 1, int(e['d'] / 140))], .6, .16 + .22 * j / len(tiles), float(np.clip((e['i'] % 11 - 5) / 6, -1, 1)), .7)
for p in ['D3', 'A3', 'F#4', 'C#5', 'E5']: E(K['bigNum'], 'vibraphone_bowed' if p != 'D3' else 'marimba', p, 3.2, .5, 0)

# ── I: fim — um acorde, a chamada brilha, tudo se apaga ──
for p in ['D3', 'A3', 'E4', 'F#4', 'C#5', 'E5']: E(K['logo'], 'vibraphone_bowed' if p != 'D3' else 'marimba', p, 6.5, .5, 0)
E(K['cta'], 'glockenspiel', 'A6', 2.0, .4, 0); E(K['cta'] + BEAT / 2, 'glockenspiel', 'F#6', 2.0, .32, .2); E(K['cta'] + BEAT, 'glockenspiel', 'D6', 2.5, .3, -.2)
E(K['off'], 'vibraphone', 'D5', 2.0, .3, 0)

mix = S.render([e for e in ev if e[0] < DUR - 0.05], dur=DUR, master=False)
mix = S.room(mix, size=.42, mix=.2)
# pad sintético (ré) nos trechos ordenados
tt = np.arange(N) / SR
def env(a, b, fi=.6, fo=.8): return np.clip((tt - a) / fi, 0, 1) * np.clip((b - tt) / fo, 0, 1)
pad = (np.sin(2 * np.pi * 73.42 * tt) * .5 + np.sin(2 * np.pi * 110 * tt) * .3 + np.sin(2 * np.pi * 146.83 * tt) * .25 + np.sin(2 * np.pi * 220.0 * tt * 1.002) * .12)
pad = lp(pad, 900) * (env(K['scan'], K['plan'] - .2) * .7 + env(K['plan'], K['scale'], .4, 1.2) * .5 + env(K['end'], DUR - .8, 1.0, 2.0) * .6) * .05
# drone tenso na desordem (sobe e ganha a segunda menor)
dr = (np.sin(2 * np.pi * 73.42 * tt) + np.sin(2 * np.pi * 77.78 * tt) * np.clip((tt - 8) / 4, 0, 1)) * np.clip((tt - K['pull']) / 4, 0, 1) * (tt < K['hush']) * .035
mix[:, 0] += pad + dr; mix[:, 1] += pad + dr
# silêncios: zero digital no "hush" e fim limpo
z0, z1 = int(K['hush'] * SR), int(K['scan'] * SR); mix[z0:z1] = 0
f0 = int((DUR - 1.2) * SR); mix[f0:] *= np.linspace(1, 0, N - f0)[:, None]
mix = hp(mix.T, 35).T
pk = np.abs(mix).max(); mix = mix / pk * 0.8 if pk > 0 else mix
sf.write(os.path.join(HERE, 'score.wav'), mix.astype(np.float32), SR)
open(os.path.join(HERE, 'CREDITS_music.txt'), 'w').write('\n'.join(S.credits(sorted({e[1] for e in ev}))) + '\n')
print('score.wav', DUR, 's, notas:', len(ev))
