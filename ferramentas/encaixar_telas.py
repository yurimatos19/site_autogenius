# -*- coding: utf-8 -*-
"""Encaixa telas reais das plataformas nas fotos de aparelho geradas com tela verde (chroma key).
Uso: python3 ferramentas/encaixar_telas.py
Saída: image/v3/*.jpg (versões web)
"""
import pathlib
import numpy as np
from PIL import Image, ImageFilter

R = pathlib.Path(__file__).resolve().parent.parent
O = R / 'image' / 'v3' / 'orig'


def encaixar(foto, tela, saida, larg):
    base = Image.open(O / foto).convert('RGB')
    a = np.asarray(base).astype(int)
    verde = (a[..., 1] - np.maximum(a[..., 0], a[..., 2])).clip(0, 255)
    m = Image.fromarray((np.clip(verde * 2.2, 0, 255)).astype('uint8')).filter(ImageFilter.GaussianBlur(.8))
    ys, xs = np.where(np.asarray(m) > 128)
    x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
    t = Image.open(tela).convert('RGB')
    alvo = (x1 - x0) / (y1 - y0)
    tw, th = t.size
    if tw / th > alvo:  # recorta largura
        nw = int(th * alvo); t = t.crop(((tw - nw) // 2, 0, (tw - nw) // 2 + nw, th))
    else:
        nh = int(tw / alvo); t = t.crop((0, 0, tw, nh))
    t = t.resize((x1 - x0 + 4, y1 - y0 + 4), Image.LANCZOS)
    camada = base.copy(); camada.paste(t, (x0 - 2, y0 - 2))
    # o brilho da tela: leve escurecimento para casar com a cena noturna
    camada = Image.blend(camada, Image.new('RGB', camada.size, (8, 12, 24)), .06)
    out = Image.composite(camada, base, m)
    h = int(out.height * larg / out.width)
    out.resize((larg, h), Image.LANCZOS).save(R / 'image' / 'v3' / saida, quality=84, optimize=True, progressive=True)
    print(saida, larg, h)


encaixar('notebook-verde.png', R / 'image' / 'produto-imoveis.jpg', 'notebook-imoveis.jpg', 1600)
encaixar('celular-verde.png', O / 'conversa.png', 'celular-conversa.jpg', 900)

for f, larg in [('raiox-oficina.png', 1800), ('area-atendimento.png', 900), ('area-operacao.png', 900), ('area-financeiro.png', 900)]:
    im = Image.open(O / f).convert('RGB'); h = int(im.height * larg / im.width)
    im.resize((larg, h), Image.LANCZOS).save(R / 'image' / 'v3' / f.replace('.png', '.jpg'), quality=82, optimize=True, progressive=True)
    print(f, larg, h)
