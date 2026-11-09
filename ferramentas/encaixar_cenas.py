# -*- coding: utf-8 -*-
"""Encaixa a tela real do CRM AutoGenius (de cada segmento) nas cenas geradas com tela verde,
corrigindo a perspectiva pelos 4 cantos da área verde.
Uso: python3 ferramentas/encaixar_cenas.py   →  image/v3/cena-<segmento>.jpg
Telas de origem: .oil-ui/home-redesign/crm/<segmento>.png (capturas 1440×900 das demos em /demo/)
"""
import pathlib
import numpy as np
from PIL import Image, ImageFilter

R = pathlib.Path(__file__).resolve().parent.parent
O = R / 'image' / 'v3' / 'orig'
TELAS = R / '.oil-ui' / 'home-redesign' / 'crm'


def coefs(dest, orig):
    # coeficientes para Image.transform(PERSPECTIVE): mapeia pontos do destino nos da origem
    A, B = [], []
    for (x, y), (u, v) in zip(dest, orig):
        A.append([x, y, 1, 0, 0, 0, -u * x, -u * y]); B.append(u)
        A.append([0, 0, 0, x, y, 1, -v * x, -v * y]); B.append(v)
    return np.linalg.solve(np.array(A, float), np.array(B, float)).tolist()


def encaixar(seg, larg=1600):
    base = Image.open(O / f'cena-{seg}.png').convert('RGB')
    a = np.asarray(base).astype(int)
    verde = (a[..., 1] - np.maximum(a[..., 0], a[..., 2])).clip(0, 255)
    duro = verde > 90
    ys, xs = np.nonzero(duro)
    s, d = xs + ys, xs - ys
    tl = (xs[s.argmin()], ys[s.argmin()]); br = (xs[s.argmax()], ys[s.argmax()])
    tr = (xs[d.argmax()], ys[d.argmax()]); bl = (xs[d.argmin()], ys[d.argmin()])
    # leva cada canto 2 px para fora, para cobrir a borda anti-serrilhada
    cx, cy = xs.mean(), ys.mean()
    cantos = [(x + (2 if x > cx else -2), y + (2 if y > cy else -2)) for x, y in (tl, tr, br, bl)]
    tela = Image.open(TELAS / f'{seg}.png').convert('RGB')
    w, h = tela.size
    c = coefs(cantos, [(0, 0), (w, 0), (w, h), (0, h)])
    plano = tela.transform(base.size, Image.PERSPECTIVE, c, Image.BICUBIC)
    # um leve brilho de tela e o mesmo tom da cena
    plano = Image.blend(plano, Image.new('RGB', base.size, (255, 248, 236)), .04)
    mascara = Image.fromarray((np.clip(verde * 2.4, 0, 255)).astype('uint8')).filter(ImageFilter.GaussianBlur(.7))
    out = Image.composite(plano, base, mascara)
    # some com o verde que sobrar na borda (despill)
    o = np.asarray(out).astype(int)
    g = o[..., 1]; lim = np.maximum(o[..., 0], o[..., 2])
    o[..., 1] = np.where(g > lim + 18, lim + 18, g)
    out = Image.fromarray(o.clip(0, 255).astype('uint8'))
    hh = int(out.height * larg / out.width)
    out.resize((larg, hh), Image.LANCZOS).save(R / 'image' / 'v3' / f'cena-{seg}.jpg', quality=82, optimize=True, progressive=True)
    print(seg, 'cantos', cantos)


for seg in ['carros', 'clinicas', 'escolas', 'imoveis', 'alimentacao']:
    encaixar(seg)
