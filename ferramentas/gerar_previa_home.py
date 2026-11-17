# -*- coding: utf-8 -*-
"""Monta a home da AutoGenius.

  python3 ferramentas/gerar_previa_home.py            → /preview/index.html (fora do índice, sem GA/Pixel)
  python3 ferramentas/gerar_previa_home.py --producao → /index.html (com GA4, Meta Pixel e SEO)

Fontes:
  ferramentas/home_base.html ...... <head>, rodapé e as seções reaproveitadas (segurança, fundador, fechamento)
  ferramentas/home_nova_main.html . conteúdo da home
  css/home.css, js/home.js ........ estilos e comportamento da home
"""
import pathlib, re, sys

R = pathlib.Path(__file__).resolve().parent.parent
PROD = '--producao' in sys.argv
base = (R / 'ferramentas' / 'home_base.html').read_text(encoding='utf-8')
main = (R / 'ferramentas' / 'home_nova_main.html').read_text(encoding='utf-8')


def bloco(ini, fim='</section>'):
    a = base.index(ini); b = base.index(fim, a) + len(fim)
    return base[a:b]


cab = base[:base.index('<main>')]
pe = base[base.index('</main>') + len('</main>'):]

if not PROD:
    # prévia: fora do índice e sem medição
    cab = re.sub(r'<!-- Google Analytics -->.*?gtag\(\'config\', \'G-P2BXGG04RL\'\);\s*</script>', '', cab, count=1, flags=re.S)
    cab = re.sub(r'<!-- Meta Pixel Code -->.*?<!-- End Meta Pixel Code -->', '', cab, count=1, flags=re.S)
    cab = cab.replace('<meta name="viewport" content="width=device-width,initial-scale=1">',
                      '<meta name="viewport" content="width=device-width,initial-scale=1">\n<meta name="robots" content="noindex,nofollow">', 1)

# a foto do topo é a do fundador no escritório em Recife
cab = re.sub(r'<link rel="preload" as="image" href="/image/v2/recife-capibaribe[^>]*>\n?', '', cab)
cab = cab.replace('<link rel="stylesheet" href="/css/ag.css">',
                  '<link rel="preload" as="image" href="/image/v3/yuri-recife.jpg" media="(min-width:768px)" fetchpriority="high">\n'
                  '<link rel="preload" as="image" href="/image/v3/yuri-recife-m.jpg" media="(max-width:767px)" fetchpriority="high">\n'
                  '<link rel="stylesheet" href="/css/ag.css">', 1)
cab = cab.replace('</head>', '<link rel="stylesheet" href="/css/home.css">\n</head>', 1)

main = main.replace('<!--SEGURANCA-->', bloco('<section id="seguranca"'))
main = main.replace('<!--FUNDADOR-->', bloco('<section id="quem"'))
main = main.replace('<!--FINAL-->', bloco('<section class="final">').replace(
    'Em 14 dias, você sabe <span class="g">onde a IA paga a conta</span> na sua empresa.',
    'Comece pelo Raio-X. <span class="g">Em 14 dias, você tem o plano.</span>'))

# sem rótulos acima dos títulos nas seções reaproveitadas
main = re.sub(r'\s*<span class="rotulo[^"]*">.*?</span>', '', main)
main = re.sub(r'\s*<p class="rotulo[^"]*">.*?</p>', '', main)

# o script em linha da home antiga cuidava do console e das linhas de luz, que saíram
pe = re.sub(r'<script>\s*\(function \(\) \{\s*\'use strict\';\s*var calm.*?\}\)\(\);\s*</script>', '', pe, count=1, flags=re.S)
pe = pe.replace('<script src="/js/ag.js" defer></script>',
                '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" integrity="sha384-g4NTh/Iv5PPU4xPyhEWqPcwtNXOvdaDI8LLnyYfyNZOjKJeYQyjzQ9X5275eBjpt" crossorigin="anonymous" referrerpolicy="no-referrer" defer></script>\n'
                '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js" integrity="sha384-Z3REaz79l2IaAZqJsSABtTbhjgOUYyV3p90XNnAPCSHg3EMTz1fouunq9WZRtj3d" crossorigin="anonymous" referrerpolicy="no-referrer" defer></script>\n'
                '<script src="/js/ag.js" defer></script>\n<script src="/js/home.js" defer></script>', 1)

html = cab + main + pe
destino = R / ('index.html' if PROD else 'preview/index.html')
destino.write_text(html, encoding='utf-8')
print('ok', destino.relative_to(R), len(html) // 1024, 'KB',
      '| GA4:', 'G-P2BXGG04RL' in html, '| Pixel:', '2464162037434399' in html, '| noindex:', 'noindex' in html)
