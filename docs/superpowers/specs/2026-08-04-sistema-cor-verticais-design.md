# Sistema de cor por vertical — Auto Genius

**Data:** 2026-08-04
**Status:** Aprovado (opção A)

## Problema

A Auto Genius vende para quatro verticais — Educação, Clínicas, Imóveis e Autos — mas o site trata todas com a mesma identidade azul. O cliente não reconhece imediatamente que existe um produto para o segmento dele.

A decisão é dar a cada vertical uma cor própria, mantendo a Auto Genius como marca conectora.

## Arquitetura

| Vertical | Palavra | Cor |
|---|---|---|
| Educação | Crescimento | Verde-menta tecnológico |
| Clínicas | Confiança | Azul chapado |
| Imóveis | Conquista | Roxo violeta |
| Autos | Movimento | Laranja |

## Decisão central: gradiente é marca, chapado é produto

O logo da Auto Genius **é** o gradiente azul→ciano — ele atravessa o cérebro e a palavra "Genius". A definição original de "Clínicas = azul + ciano" clonava a marca: das quatro verticais, três ficariam reconhecíveis e a mais institucional ficaria invisível.

A separação passa a ser de **forma**, não de matiz:

- **Gradiente azul→ciano** é exclusivo da Auto Genius: logo, navegação, rodapé, páginas institucionais.
- **Cor chapada** identifica produto. Nenhuma vertical usa gradiente como cor primária.

Clínicas mantém o azul, porque a intenção original — confiança, saúde, tecnologia — está correta. O que ela perde é o direito ao gradiente e ao ciano como cor primária; o ciano sobrevive apenas como detalhe fino (bordas, ícones pequenos, sublinhados).

Alternativas descartadas: mover Clínicas para teal `#14B8A6` (separa melhor, mas contraria a definição do segmento) e remover o ciano de Clínicas por completo (entrega a versão mais pesada e menos tecnológica do azul).

## Tokens

Cada vertical tem quatro degraus: `deep` para fundos e superfícies, `mid` para estados sólidos, `core` como cor de identidade, `lite` para texto e detalhe sobre fundo escuro.

### Marca

```css
--brand-grad: linear-gradient(135deg, #1d4ed8, #2563EB, #06b6d4);
--brand-deep: #1d4ed8;
--brand-cy:   #06b6d4;
```

### Educação — verde-menta

```css
--edu-deep: #053D2C;
--edu-mid:  #0F9E70;
--edu:      #1FE3A0;   /* core */
--edu-lite: #7CFFD1;
--edu-on-light: #047857;
```

Verde de alta luminosidade com viés ciano, para escapar do verde hospitalar e do verde ambiental.

### Clínicas — azul

```css
--cli-deep: #0B2E6B;
--cli-mid:  #2563EB;
--cli:      #3B82F6;   /* core */
--cli-cy:   #22D3EE;   /* detalhe apenas */
--cli-on-light: #1D4ED8;
```

### Imóveis — roxo

```css
--imo-deep: #2E1065;
--imo-mid:  #6D28D9;
--imo:      #8B5CF6;   /* core */
--imo-lite: #C4B5FD;
--imo-on-light: #6D28D9;
```

Violeta puxado para o azul. O magenta anterior (`#d946ef`) fica proibido: é o que leva a leitura para "místico".

### Autos — laranja

```css
--aut-deep: #7C2D12;
--aut-mid:  #EA580C;
--aut:      #F97316;   /* core */
--aut-lite: #FDBA74;
--aut-on-light: #C2410C;
```

## Regras de aplicação

1. **Uma vertical por tela.** Duas cores de produto nunca dividem a mesma seção. A home usa a marca; as páginas de vertical usam a cor do produto.
2. **Gradiente só na marca.** Botões, cards e badges de produto usam cor chapada.
3. **O CTA continua verde WhatsApp.** Todo botão de conversão do site é `#25D366`. A cor da vertical nunca é aplicada ao CTA principal — ela vive em badge, headline destacada, métrica e borda.
4. **Educação exige vigilância.** `#1FE3A0` é frio e claro o bastante para não competir com `#25D366`, mas não pode escorregar em direção ao verde do WhatsApp. Na página de Educação, verificar lado a lado antes de publicar.
5. **Fundo claro usa a variante `on-light`.** O `core` só tem contraste suficiente sobre fundo escuro. Educação é a vertical mais crítica: `#1FE3A0` desaparece em branco e precisa cair para `#047857` em texto e botão.

## Estado do código

`index.html` define os próprios tokens no `:root` (linha 105) e já carrega dois dos quatro: `--vt #7C3AED` (violeta) e `--or #f97316` (laranja). Imóveis e Autos não precisam de cor nova, precisam de promoção a cor de produto.

`css/styles.css` contém `--brand-purple: #d946ef` e `--brand-cyan: #22d3ee` — código morto. `index.html` não referencia esses tokens e `#d946ef` não aparece nenhuma vez no arquivo. Remover na implementação.

## Pendências

Duas coisas travam os valores finais:

1. **Referência do verde.** `#1FE3A0` é proposta, não tonalidade fornecida. Quando a referência chegar, a rampa de Educação é recalibrada em cima dela.
2. **Arquivo do logo.** Nenhum asset em `image/` corresponde ao logo atual: `logo.png` é dourado, `icon.png` é magenta, `logo.webp` é azul-marinho com vermelho. Os hex do gradiente da marca acima vêm do `--grad` do `index.html`, não do arquivo do logo. Substituir os assets e confirmar os valores.

## Fora de escopo

Este documento define cor. Não define tipografia, layout, estrutura de navegação nem a decisão sobre clarear o site — a queixa de origem ("o site é escuro") é tratada separadamente, e o sistema acima já prevê variantes para fundo claro quando essa decisão for tomada.
