# Mundo AG — Experiência 3D interativa da Auto Genius

**Data:** 2026-06-10
**Status:** Aprovado pelo usuário (design conversacional)
**Base:** Fork do [folio-2025 de Bruno Simon](https://github.com/brunosimon/folio-2025) (licença MIT)

## Objetivo

Criar uma experiência 3D dirigível ("Mundo AG") acessível por uma nova aba do site
useautogenius.com. O visitante dirige um carro por uma ilha low-poly noturna e
descobre os serviços, cases e a consultoria da Auto Genius através de zonas
interativas. **O jogo é o pitch de vendas**: cada elemento tem propósito comercial
e o funil termina em CTA de WhatsApp.

## Decisões tomadas

| Decisão | Escolha |
|---|---|
| Papel da experiência | Vender enquanto diverte (jogo = pitch) |
| Mobile | Experiência completa com joystick virtual (já existe no folio) |
| Zonas de conteúdo | Agentes de IA, Cases & Clientes, Minigame de Leads, Consultoria/Fundador |
| Direção de arte | Low-poly (estilo/assets do Bruno) re-pintado com a paleta do site: noturno, roxo, acentos verde-WhatsApp |
| Estratégia | Fork integral + re-skin — usar o que está pronto e adaptar |
| Idioma | PT-BR na v1 (en/es futuramente) |
| URL | `useautogenius.com/mundo/` |

## Arquitetura

### Estrutura de pastas

```
auto_genius/
├── index.html          # site atual — só ganha o link "Mundo AG" no menu
├── css/ js/ image/     # intocados
├── mundo-src/          # fork do folio-2025 (projeto Vite independente)
│   ├── sources/        # engine + jogo (126 arquivos JS)
│   ├── static/         # assets 3D (GLB, KTX, áudio)
│   └── vite.config.js  # base: '/mundo/'
└── mundo/              # build de produção (dist do Vite, commitado)
```

- O site principal continua sem build system; o jogo é um projeto Vite isolado
  em `mundo-src/`, cujo build estático é publicado em `/mundo/`.
- Única mudança no site atual: nova aba **"Mundo AG"** no menu apontando para `/mundo/`.

### Stack (herdada do folio-2025)

- Three.js (renderer WebGPU com fallback WebGL2), TSL para materiais
- Física: Rapier (WASM) — veículo, colisões, objetos derrubáveis
- GSAP (animações), Howler (áudio), Vite (build)
- Assets: GLB comprimidos (draco), texturas KTX2, paleta única de cores

## O mapa

Mantemos a ilha original: terreno, estradas, árvores, água, clima, ciclos.
As áreas de conteúdo pessoal do Bruno são substituídas ou removidas. O sistema
`Areas.js` é um registro `nome → classe` com posições vindas de `areas.glb`,
então a troca é modular.

| Área original | Destino | Conteúdo novo |
|---|---|---|
| Landing (spawn) | **Spawn AG** | Letreiro 3D "AUTO GENIUS" derrubável + headline "Enquanto você dormia, um concorrente respondeu o seu cliente." no chão |
| Career | **Zona Agentes de IA** | Totens interativos por agente (vendas, atendimento, tarefas); cada um abre modal com demo simulada de conversa WhatsApp |
| Projects | **Zona Cases & Clientes** | Outdoors com logos de clientes e números reais; aproximar revela resultado/depoimento |
| Social | **Zona Consultoria & Fundador** | Foto do fundador, credencial Google Cloud Next '25, botão para página de consultoria |
| Lab | **Minigame de Leads** | Ver seção abaixo |
| Bowling | Mantida | Diversão (conquistas adaptadas) |
| Circuit | Mantida | Corrida com cronômetro |
| Jukebox | Mantida | Toca a trilha NCS já usada pelo site ("Spektrem - Shine") |
| Achievements | Mantida (adaptada) | Conquistas AG: "Respondeu 10 leads", "Visitou todas as zonas", strike no boliche etc. |
| Toilet, Altar, TimeMachine, BehindTheScene, Cookie, Easter | **Removidas** | Sem propósito comercial; menos download e menos limpeza |

## Minigame de Leads (dor → solução)

1. Jogador entra na zona e aceita o desafio: leads (envelopes brilhantes) caem
   do céu pelo mapa com um cronômetro.
2. O jogador dirige tentando coletar todos antes do tempo — projetado para ser
   impossível (caem mais rápido do que se coleta).
3. Ao fim, um robô-agente AG aparece e coleta todos os restantes sozinho,
   instantaneamente.
4. Mensagem final: **"Você não precisa correr atrás. O agente corre por você."**
   + CTA WhatsApp.

Reaproveita mecânicas existentes: timer do Circuit, coleta/respawn de objetos,
sistema de Zonas para o gatilho.

## Re-skin visual

- Modo noturno como padrão (sistema de ciclos/clima já existe)
- Paleta: roxos do site (#7c3aed e família) para ambiente; verde WhatsApp
  (#25D366) como cor de destaque de CTAs e caminhos
- Recolorir via paleta de textura única (`palette.png/ktx`) + parâmetros de cor
  já expostos (árvores, iluminação, fog recebem cores como config)
- Postes/neons verdes marcando o caminho entre zonas de venda
- Tela de loading com marca Auto Genius
- UI/modais seguem a tipografia e o tom do site

## Limpeza de conteúdo pessoal (obrigatório antes do ar)

Varredura completa e remoção/substituição de:

- Nome, fotos e voz do Bruno (áudios em `static/`)
- Textos de carreira, projetos, conquistas pessoais
- Links sociais e URLs pessoais (bruno-simon.com, Twitter/X etc.)
- Metadados: title, OG tags, favicons, share images
- Analytics/monitoramento dele (`Monitoring.js`, `Server.js`)
- Easter eggs pessoais (Konami code pode ficar, conteúdo dele não)

## Licença e créditos

- MIT: manter o aviso de copyright do Bruno no código distribuído (license.md)
- Crédito visível no modal de créditos: "Construído sobre o folio-2025 de
  Bruno Simon (MIT)"

## Critérios de sucesso

1. `/mundo/` carrega e roda em desktop e mobile (joystick virtual) sem erros
2. As 4 zonas apresentam conteúdo Auto Genius com CTAs de WhatsApp funcionais
3. Minigame de Leads jogável do início ao fim com a mensagem de conversão
4. Nenhum conteúdo pessoal do Bruno visível (textos, fotos, áudio, links, metadados)
5. Mundo re-pintado: noturno, roxo, acentos verdes — coerente com o site
6. Site principal intocado exceto a aba "Mundo AG" no menu
7. Aviso MIT preservado + crédito no modal

## Fora de escopo (v1)

- Tradução en/es do jogo
- Novas áreas/minigames além dos listados
- Modelagem 3D customizada em Blender
- Multiplayer/placar online (o folio tem `Server.js` — desativar na v1)
- Substituição da trilha sonora além das já disponíveis

## Riscos conhecidos

- **Peso dos assets**: ~196MB brutos no repo; entrega real é menor (draco/KTX),
  mas medir e cortar assets das áreas removidas no build final
- **WebGPU/TSL é recente**: manter fallback WebGL2 funcionando; testar em
  Safari/iOS de geração anterior
- **Textos 3D baked em GLB**: letreiros podem exigir edição de modelo via
  gltf-transform (já é dependência) ou geração de texto via TextCanvas.js —
  validar cedo na implementação
