# -*- coding: utf-8 -*-
"""Gera as páginas de conteúdo do site (Sobre, Dúvidas e artigos) no padrão V3.

Usa o mesmo molde das páginas de plataforma (cabeçalho, rodapé, medição),
para que o site inteiro tenha uma cara só.

Uso:  python3 ferramentas/gerar_conteudo.py
"""
import json
import re
import sys

sys.path.insert(0, str(__import__('pathlib').Path(__file__).resolve().parent))
from gerar_plataformas import MOLDE, RAIZ, SITE, esc, sem_tags, numeros, final  # noqa: E402

HOJE = '2026-10-13'
ORG = {"@type": "Organization", "name": "AutoGenius", "legalName": "Auto Genius Soluções Inteligentes Ltda", "url": SITE + "/",
       "logo": SITE + "/image/nova_logo.png"}
YURI = {"@type": "Person", "name": "Yuri Matos", "jobTitle": "Fundador e CEO", "worksFor": {"@type": "Organization", "name": "AutoGenius"}}


def id_de(t):
    t = sem_tags(t).lower()
    for a, b in zip('áàâãéêíóôõúç', 'aaaaeeiooouc'):
        t = t.replace(a, b)
    return re.sub(r'[^a-z0-9]+', '-', t).strip('-')[:48]


def com_ids(html):
    """Dá id aos <h2> do corpo e devolve (html, [(id, título)])."""
    titulos = []

    def troca(m):
        i = id_de(m.group(1))
        titulos.append((i, sem_tags(m.group(1))))
        return '<h2 id="%s">%s</h2>' % (i, m.group(1))
    return re.sub(r'<h2>(.*?)</h2>', troca, html), titulos


def detalhes(lista):
    return '<div class="faq">%s</div>' % ''.join('<details><summary>%s</summary><p>%s</p></details>' % q for q in lista)


def migalha(trilha):
    partes = ['<a href="/">Início</a>'] + [('<a href="%s">%s</a>' % (h, t)) if h else t for t, h in trilha]
    return '<nav class="migalha" aria-label="Você está aqui">%s</nav>' % ' · '.join(partes)


def lateral(titulos, assunto, convite):
    sumario = ''
    if titulos:
        sumario = '<nav class="sumario" aria-label="Nesta página"><small>Nesta página</small><ol>%s</ol></nav>' % ''.join(
            '<li><a href="#%s">%s</a></li>' % t for t in titulos)
    return '''<aside class="lateral">%s
  <div class="conversa">
    <div class="quem"><img src="/image/v2/yuri-busto.jpg" width="48" height="60" alt="Yuri Matos" loading="lazy"><div><b>Yuri Matos</b><small>Fundador e CEO</small></div></div>
    <p>%s</p>
    <a class="btn sm" href="#agendar" data-agendar="%s">Agendar conversa <span class="seta" aria-hidden="true">→</span></a>
  </div>
</aside>''' % (sumario, convite, assunto)


def leia(itens):
    return '<nav class="leia" aria-label="Leia também"><small>Leia também</small><div class="leia-grid">%s</div></nav>' % ''.join(
        '<a href="%s"><span>%s</span><b>%s →</b></a>' % i for i in itens)


def topo(trilha, rotulo, h1, resposta='', lead=''):
    r = ('<div class="resposta rv d2"><small>Resposta direta</small><p>%s</p></div>' % resposta) if resposta else ''
    l = ('<p class="lead rv d1">%s</p>' % lead) if lead else ''
    return '''<section class="ha"><div class="wrap">
  %s
  <span class="rotulo rv">%s</span>
  <h1 class="rv">%s</h1>%s%s
</div></section>''' % (migalha(trilha), rotulo, h1, l, r)


def escrever(slug, conteudo, schemas, *, title, description, assunto='', cta_curto='Agendar conversa'):
    html = MOLDE.format(
        title=esc(title), description=esc(description), og_title=esc(title), url='%s/%s/' % (SITE, slug), site=SITE,
        schemas='\n'.join('<script type="application/ld+json">%s</script>' % json.dumps(s, ensure_ascii=False) for s in schemas),
        cor='#5EA6FF', assunto=assunto, segmento_attr='', atual_agentes='', atual_trafego='', cta_curto=cta_curto,
        conteudo=conteudo, css_extra='<link rel="stylesheet" href="/css/artigo.css">', js_extra='')
    destino = RAIZ / slug
    destino.mkdir(exist_ok=True)
    (destino / 'index.html').write_text(html, encoding='utf-8')
    print('ok', slug, len(html) // 1024, 'KB')


def migalha_schema(slug, trilha):
    itens = [{"@type": "ListItem", "position": 1, "name": "Início", "item": SITE + "/"}]
    for i, (t, h) in enumerate(trilha, 2):
        itens.append({"@type": "ListItem", "position": i, "name": sem_tags(t), "item": SITE + (h or '/%s/' % slug)})
    return {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": itens}


def faq_schema(lista):
    return {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
        {"@type": "Question", "name": sem_tags(q), "acceptedAnswer": {"@type": "Answer", "text": sem_tags(a)}} for q, a in lista]}


# ═══════════════════════════════ Artigos ═══════════════════════════════

def artigo(a):
    corpo, titulos = com_ids(a['corpo'] + '<h2>Perguntas frequentes</h2>' + detalhes(a['faq']))
    conteudo = topo(a['trilha'], a['rotulo'], a['h1'], resposta=a['resposta']) + '''
<section class="corpo" style="padding-bottom:0"><div class="wrap"><div class="corpo-grid">
  <article class="prosa">%s
  %s</article>
  %s
</div></div></section>
%s''' % (corpo, leia(a['leia']), lateral(titulos, a['assunto'], a['convite']), final(a['final']))
    schemas = [
        {"@context": "https://schema.org", "@type": "Article", "headline": sem_tags(a['h1']), "description": a['description'],
         "inLanguage": "pt-BR", "dateModified": HOJE, "author": YURI, "publisher": ORG, "mainEntityOfPage": '%s/%s/' % (SITE, a['slug'])},
        migalha_schema(a['slug'], a['trilha']), faq_schema(a['faq'])]
    escrever(a['slug'], conteudo, schemas, title=a['title'], description=a['description'], assunto=a['assunto'])


CHATBOT = {
    'slug': 'chatbot-vs-agente-de-ia', 'assunto': 'atendimento',
    'title': 'Chatbot ou agente de IA: qual a diferença (e qual resolve seu atendimento)',
    'description': 'Chatbot segue menu fixo; agente de IA entende a conversa e executa tarefas em sistemas reais, como agendar e consultar estoque. Veja a diferença na prática, com exemplos.',
    'trilha': [('Atendimento com IA', '/agentes-de-atendimento/'), ('Chatbot ou agente de IA', '')],
    'rotulo': 'Guia · Atendimento com IA',
    'h1': 'Chatbot ou agente de IA: <span class="g">qual a diferença na prática.</span>',
    'resposta': '<strong>O chatbot responde; o agente de IA resolve.</strong> Um chatbot segue um roteiro fixo de perguntas e respostas — aquele “digite 1 para falar com vendas”. Um agente de IA entende a conversa em linguagem natural, decide o que fazer e executa tarefas em sistemas reais: consulta a agenda, verifica estoque, simula um valor, marca o horário e registra o lead no CRM. Quando o assunto sai das regras da empresa, ele passa o atendimento para uma pessoa com todo o histórico.',
    'corpo': '''<h2>A diferença lado a lado</h2>
<div class="tabela-rolagem"><table class="tabela">
<thead><tr><th>&nbsp;</th><th>Chatbot comum</th><th>Agente de IA</th></tr></thead>
<tbody>
<tr><th>Como conversa</th><td>Menu e botões fixos</td><td>Linguagem natural, entende gírias, áudio e erro de digitação</td></tr>
<tr><th>Sai do roteiro</th><td class="nao">Trava ou repete a pergunta</td><td class="sim">Entende o contexto e segue</td></tr>
<tr><th>Executa tarefas</th><td class="nao">Não: só encaminha</td><td class="sim">Agenda, consulta sistema, registra no CRM</td></tr>
<tr><th>Qualifica o lead</th><td>Formulário engessado</td><td class="sim">Pergunta como um vendedor perguntaria</td></tr>
<tr><th>Passa para humano</th><td>Perde o histórico</td><td class="sim">Transfere com a conversa inteira</td></tr>
<tr><th>Resultado típico</th><td>Cliente desiste no menu</td><td class="sim">Atendimento resolvido ou reunião marcada</td></tr>
</tbody></table></div>
<h2>Um exemplo concreto</h2>
<p>Um cliente manda mensagem às 22h47 de sábado: “vi o Corolla 2022 no site, ainda tá disponível?”.</p>
<ul>
<li><strong>Chatbot:</strong> responde com um menu — “1. Estoque · 2. Financiamento · 3. Falar com vendedor” — e, na melhor das hipóteses, promete que alguém retorna no horário comercial.</li>
<li><strong>Agente de IA:</strong> confirma que o carro está disponível consultando o estoque real, pergunta se há carro na troca, entende que o cliente quer financiar, simula a parcela, oferece um horário e agenda a visita. No domingo de manhã o vendedor acorda com a reunião marcada e o resumo no CRM.</li>
</ul>
<h2>Quando um chatbot simples já basta</h2>
<p>Se o seu atendimento se resume a responder horário de funcionamento e endereço, um chatbot resolve e custa menos. O agente de IA faz diferença quando existe <strong>venda, agendamento ou qualificação</strong> no meio do caminho — ou seja, quando a conversa precisa terminar em uma ação, e não em uma resposta.</p>''',
    'faq': [
        ('Chatbot e agente de IA são a mesma coisa?', 'Não. O chatbot segue um roteiro fixo de perguntas e respostas. O agente de IA entende a conversa em linguagem natural e executa tarefas em sistemas reais, como marcar na agenda, consultar estoque e registrar o lead no CRM.'),
        ('O cliente percebe que está falando com uma IA?', 'O agente se apresenta como atendimento da empresa e conversa de forma natural, sem menu de opções. Quando o assunto sai das regras, ele passa para uma pessoa da equipe com todo o histórico.'),
        ('Dá para migrar de um chatbot que já tenho?', 'Sim. Na prática o fluxo antigo é substituído, e os atendimentos que hoje travam no menu passam a ser resolvidos na conversa.'),
    ],
    'convite': 'Quer ver um agente atendendo com o cenário da sua empresa? Mostramos em uma conversa curta.',
    'leia': [('/agentes-de-atendimento/', 'Plataforma', 'Agentes de IA para atendimento'), ('/duvidas/', 'Dúvidas', 'Dúvidas frequentes'),
             ('/', 'AutoGenius', 'Implantação de IA na sua empresa')],
    'final': {'rotulo': 'Atendimento com IA', 'h2': 'Veja um agente atendendo <span class="g">com o seu cenário.</span>',
              'lead': 'Uma conversa curta, com as perguntas que os seus clientes fazem de verdade.', 'cta': 'Ver funcionando'},
}

META_ADS = {
    'slug': 'ia-para-meta-ads', 'assunto': 'trafego',
    'title': 'IA para Meta Ads: existe uma IA que gerencia campanhas? | AutoGenius',
    'description': 'Sim, existe IA para gerenciar Meta Ads. Veja o que uma IA consegue fazer nas suas campanhas do Facebook e Instagram: monitorar todo dia, achar desperdício, alertar e otimizar dentro das suas regras.',
    'trilha': [('IA para tráfego pago', '/ia-trafego-pago/'), ('IA para Meta Ads', '')],
    'rotulo': 'Guia · Tráfego pago',
    'h1': 'IA para Meta Ads: <span class="g">o que ela consegue fazer nas suas campanhas.</span>',
    'resposta': '<strong>Sim, existe IA para gerenciar Meta Ads.</strong> A <a href="/ia-trafego-pago/">AutoGenius Ads AI</a> conecta-se à sua conta de anúncios do Facebook e do Instagram e passa a analisar as campanhas todos os dias: mede o custo por resultado, identifica público saturado e anúncio que gasta sem converter, avisa quando algo sai do padrão, gera relatório em linguagem simples e executa otimizações dentro dos limites que a sua empresa definir.',
    'corpo': '''<h2>O que a IA analisa na conta</h2>
<ul>
<li><strong>Custo por resultado</strong> por campanha, conjunto e anúncio, comparado com o histórico da própria conta.</li>
<li><strong>Frequência e saturação</strong>: quando o mesmo público já viu o anúncio vezes demais e o custo começa a subir.</li>
<li><strong>Distribuição do orçamento</strong>: o que está consumindo verba sem entregar e o que merece crescer.</li>
<li><strong>Criativos</strong>: quais anúncios seguram o desempenho e quais já cansaram.</li>
<li><strong>Desvios do padrão</strong>: queda de conversão, salto de custo, entrega travada.</li>
</ul>
<h2>O que ela faz com essa análise</h2>
<div class="cartoes">
<div class="cartao"><h3>Alerta na hora</h3><p>Você fica sabendo no dia em que o problema aparece, não no fechamento do mês.</p></div>
<div class="cartao"><h3>Explica o motivo</h3><p>Não é só “o custo subiu”. É “o custo subiu porque a frequência chegou a 4,8 e o público está saturado”.</p></div>
<div class="cartao"><h3>Age dentro das regras</h3><p>Reduzir orçamento, pausar anúncio, escalar campanha — cada ação dentro do limite que você autorizou.</p></div>
<div class="cartao"><h3>Registra tudo</h3><p>Histórico com o que foi alterado, quando e por quê.</p></div>
</div>
<h2>De onde vem o conhecimento dela</h2>
<p>De duas fontes ao mesmo tempo: os <strong>dados reais e o histórico da sua conta</strong> e as <strong>boas práticas oficiais das plataformas de anúncios</strong>. A IA cruza o que está acontecendo na sua conta com o que a plataforma recomenda.</p>
<h2>IA × a automação que já existe no gerenciador</h2>
<div class="tabela-rolagem"><table class="tabela">
<thead><tr><th>&nbsp;</th><th>Regras automáticas do gerenciador</th><th>AutoGenius Ads AI</th></tr></thead>
<tbody>
<tr><th>Como decide</th><td>Gatilho fixo que você configurou antes</td><td>Analisa o contexto da conta e o histórico</td></tr>
<tr><th>Explica a decisão</th><td class="nao">Não</td><td class="sim">Sim, com o motivo por escrito</td></tr>
<tr><th>Encontra oportunidade</th><td class="nao">Não</td><td class="sim">Sim</td></tr>
<tr><th>Relatório para quem não é da área</th><td class="nao">Não</td><td class="sim">Sim</td></tr>
<tr><th>Histórico do que mudou</th><td>Limitado</td><td class="sim">Completo, com justificativa</td></tr>
</tbody></table></div>''',
    'faq': [
        ('A IA mexe na minha conta de anúncios sozinha?', 'Só dentro das regras que você define: limite de variação de orçamento, quais ações ela executa sozinha e o que precisa da sua aprovação. Se preferir, ela funciona apenas alertando e recomendando. Toda alteração fica registrada com o motivo.'),
        ('Preciso entender de tráfego pago para usar?', 'Não. Os relatórios e alertas explicam o que aconteceu, por que aconteceu e o que foi feito, em linguagem de empresário.'),
        ('Funciona com Google Ads?', 'Hoje a AutoGenius Ads AI trabalha com campanhas de Meta Ads (Facebook e Instagram). Se você investe em outras plataformas, avaliamos o seu cenário na conversa de diagnóstico.'),
        ('Preciso trocar de gestor ou de agência para usar?', 'Não. A IA funciona com ou sem gestor. Quando existe um gestor ou uma agência, ela assume o trabalho de acompanhamento e entrega dados prontos para as decisões de estratégia e criativo.'),
    ],
    'convite': 'Quer ver o que a IA enxerga na sua conta de anúncios? A primeira análise mostra o que já acontece hoje.',
    'leia': [('/ia-trafego-pago/', 'Plataforma', 'AutoGenius Ads AI'), ('/alternativa-a-gestor-de-trafego/', 'Guia', 'Alternativa a gestor de tráfego'),
             ('/duvidas/', 'Dúvidas', 'Dúvidas frequentes')],
    'final': {'rotulo': 'AutoGenius Ads AI', 'h2': 'Veja o que a IA <span class="g">enxerga na sua conta.</span>',
              'lead': 'A primeira análise mostra o que já está acontecendo hoje nas suas campanhas.', 'cta': 'Analisar minha conta'},
}

GESTOR = {
    'slug': 'alternativa-a-gestor-de-trafego', 'assunto': 'trafego',
    'title': 'Alternativa a gestor de tráfego: como parar de depender de uma pessoa',
    'description': 'Existe alternativa a contratar um gestor de tráfego: uma IA que acompanha as campanhas todos os dias, alerta quando algo sai do padrão e explica cada decisão. Veja como funciona.',
    'trilha': [('IA para tráfego pago', '/ia-trafego-pago/'), ('Alternativa a gestor de tráfego', '')],
    'rotulo': 'Guia · Tráfego pago',
    'h1': 'Como parar de depender da sorte de encontrar <span class="g">um bom gestor de tráfego.</span>',
    'resposta': '<strong>A alternativa não é trocar de gestor: é colocar uma camada de acompanhamento que não depende de ninguém estar disponível.</strong> A <a href="/ia-trafego-pago/">AutoGenius Ads AI</a> analisa suas campanhas todos os dias, aponta onde o dinheiro está sendo desperdiçado, avisa no mesmo dia em que algo sai do padrão e executa ajustes dentro das regras que você definir. Se você tem gestor, ele continua na estratégia e nos criativos, com mais dados na mão. Se não tem, você deixa de ficar no escuro.',
    'corpo': '''<h2>O problema real não é competência. É tempo.</h2>
<p>Um bom gestor de tráfego sabe exatamente o que olhar. O que ele não tem é o dia inteiro para olhar dezenas de campanhas, todos os dias, em várias contas ao mesmo tempo. Enquanto isso, a plataforma cobra por dia. É nessa distância — entre o gasto diário e a análise semanal — que o dinheiro escapa sem ninguém perceber.</p>
<p>Por isso a pergunta que importa não é “meu gestor é bom?”, e sim: <strong>alguém olhou para as minhas campanhas hoje?</strong></p>
<h2>Três cenários e o que muda em cada um</h2>
<div class="cartoes tres">
<div class="cartao"><h3>Você cuida sozinho</h3><p>Passa a ter análise diária e alertas explicados, sem precisar aprender a interpretar o gerenciador.</p></div>
<div class="cartao"><h3>Você tem um gestor</h3><p>O trabalho operacional sai da mão dele. Ele recebe o diagnóstico pronto e foca em estratégia, oferta e criativo.</p></div>
<div class="cartao"><h3>Você tem uma agência</h3><p>Você ganha uma visão independente da sua própria conta, com histórico de tudo que foi alterado e por quê.</p></div>
</div>
<h2>O que você deixa de terceirizar</h2>
<ul>
<li>Saber se a campanha piorou <strong>hoje</strong>, e não no relatório do fim do mês.</li>
<li>Entender <strong>o motivo</strong> de um resultado bom ou ruim, em português claro.</li>
<li>Ter o <strong>histórico</strong> de cada alteração feita na conta, com justificativa.</li>
<li>Manter o <strong>controle do orçamento</strong>: o que a IA pode fazer sozinha é decisão sua.</li>
</ul>
<h2>Isso não é contra gestores de tráfego</h2>
<p>A IA elimina grande parte do trabalho operacional e reduz a dependência exclusiva de uma pessoa — não a substitui em estratégia, criativo e leitura de mercado. Ela aplica, de forma constante, práticas que dificilmente alguém consegue manter em dezenas de campanhas ao mesmo tempo: não esquece uma regra, não deixa uma campanha passar dias sem análise e não decide porque “acha” que vai funcionar.</p>''',
    'faq': [
        ('A IA substitui completamente o gestor de tráfego?', 'Ela assume grande parte do trabalho operacional — acompanhar, analisar, alertar, reportar e fazer os ajustes de rotina. Estratégia, criativos e a conversa com o time comercial continuam sendo trabalho humano. O que muda é a dependência exclusiva de uma pessoa.'),
        ('Quanto tempo leva para começar a ver diferença?', 'A primeira análise sai logo depois da conexão da conta: ela mostra o que já está acontecendo hoje, antes de qualquer mudança.'),
        ('E se eu não tiver ninguém cuidando das campanhas?', 'Esse é o cenário mais comum entre empresários que anunciam por conta própria. A IA passa a acompanhar todos os dias, avisa quando algo sai do padrão e explica o que fazer.'),
        ('Como sei que a IA não vai estragar uma campanha que vai bem?', 'Porque os limites são seus. Você define até onde ela pode ir sozinha, e tudo que passar disso vira recomendação esperando sua aprovação. Cada alteração fica no histórico com o motivo.'),
    ],
    'convite': 'Quer saber o que está acontecendo hoje na sua conta de anúncios? Mostramos na primeira conversa.',
    'leia': [('/ia-trafego-pago/', 'Plataforma', 'AutoGenius Ads AI'), ('/ia-para-meta-ads/', 'Guia', 'IA para Meta Ads'),
             ('/duvidas/', 'Dúvidas', 'Dúvidas frequentes')],
    'final': {'rotulo': 'AutoGenius Ads AI', 'h2': 'Alguém olhou para as suas campanhas <span class="g">hoje?</span>',
              'lead': 'A IA olha todos os dias — e explica o que viu.', 'cta': 'Analisar minha conta'},
}


# ═══════════════════════════════ Dúvidas ═══════════════════════════════

GRUPOS = [
    ('A AutoGenius', [
        ('O que é a AutoGenius?', 'A AutoGenius (Auto Genius Soluções Inteligentes Ltda) é uma empresa de inteligência artificial de Recife (PE) que coloca a IA para funcionar dentro das empresas, do diagnóstico ao sistema rodando. Trabalha em três frentes: <strong>implantação de IA</strong> (Raio-X, implantação e operação contínua), <strong><a href="/agentes-de-atendimento/">agentes de IA para atendimento</a></strong> e <strong><a href="/ia-trafego-pago/">IA para tráfego pago</a></strong>. Também faz palestras e formação de lideranças.'),
        ('Para que tipo de empresa vocês trabalham?', 'O foco são empresas médias e grandes que querem usar IA no dia a dia do time, e não só testar ferramentas. Para negócios que precisam principalmente de atendimento no WhatsApp, temos plataformas prontas para <a href="/clinicas/">clínicas</a>, <a href="/escolas/">escolas</a>, <a href="/imoveis/">imobiliárias</a> e <a href="/autos/">concessionárias</a>.'),
        ('Quem conduz os projetos?', 'O fundador e CEO, Yuri Matos, participa pessoalmente de cada Raio-X, ao lado do time de engenharia. A AutoGenius já colocou IA em produção em mais de 50 empresas.'),
        ('Atendem empresas fora de Recife?', 'Sim. A sede é em Recife e atendemos empresas de todo o Brasil.'),
    ]),
    ('Como funciona', [
        ('O que é o Raio-X de IA?', 'É o diagnóstico de 14 dias que abre todo projeto. Conversamos com as lideranças, mapeamos as tarefas que mais consomem o tempo do time e entregamos as três oportunidades de IA de maior retorno, com esforço, prazo e impacto de cada uma, e o plano de implantação.'),
        ('Quanto tempo leva a implantação?', 'Depende do escopo. Uma implantação por área costuma levar de 2 a 4 meses, com o time usando desde as primeiras semanas. Um agente de atendimento no WhatsApp entra no ar em cerca de 7 dias.'),
        ('Quanto custa?', 'O investimento é definido depois da conversa inicial, conforme o escopo: quantas áreas, quantos processos e qual o nível de acompanhamento. As condições de cada projeto ficam no contrato.'),
        ('Precisamos ter time de tecnologia?', 'Não. A engenharia é nossa: integramos a IA aos sistemas que a empresa já usa. Do seu lado, o time participa definindo as regras, testando e usando.'),
        ('O que acontece depois que a IA entra no ar?', 'Na operação contínua acompanhamos o que está em produção, medimos a adoção, ajustamos e trazemos novos casos de uso, com relatório mensal de resultado.'),
        ('Vocês fazem palestras e treinamentos?', 'Sim. Palestras e formação de lideranças sobre IA aplicada a negócios, para a diretoria decidir com clareza e para cada time entender o que muda no próprio trabalho.'),
    ]),
    ('Agentes de atendimento', [
        ('A IA entende áudio e erro de digitação?', 'Sim. Ela transcreve áudios em segundos e entende gírias, erros de digitação e o contexto da conversa, como uma pessoa faria.'),
        ('E se a IA não souber responder?', 'Ela trabalha dentro de regras definidas com a sua empresa. Quando o cliente pede algo fora dessas regras, ela transfere o atendimento para a equipe, com todo o histórico da conversa.'),
        ('Integra com o meu CRM e a minha agenda?', 'Sim. A conexão é feita por API com os principais CRMs (como RD Station, HubSpot, Kommo e Pipedrive) e sistemas de agenda e gestão. Na conversa inicial verificamos o seu sistema.'),
        ('Quantos atendimentos ao mesmo tempo?', 'Não há fila. A IA conversa com vários clientes ao mesmo tempo, com resposta em segundos.'),
        ('Qual a diferença entre chatbot e agente de IA?', 'O chatbot segue menus fixos. O agente entende a conversa e executa ações reais, como consultar agenda e marcar horário. Detalhamos em <a href="/chatbot-vs-agente-de-ia/">chatbot ou agente de IA</a>.'),
    ]),
    ('IA para tráfego pago', [
        ('A Ads AI mexe na minha conta sozinha?', 'Só dentro das regras que você define. Se preferir, ela apenas alerta e recomenda. Toda alteração fica registrada com o motivo. Veja <a href="/ia-para-meta-ads/">o que a IA faz no Meta Ads</a>.'),
        ('Quais plataformas ela acompanha?', 'Hoje, campanhas de Meta Ads (Facebook e Instagram).'),
        ('Substitui o gestor de tráfego?', 'Ela assume o trabalho operacional de acompanhar, analisar e alertar. Estratégia e criativo continuam com pessoas. Leia <a href="/alternativa-a-gestor-de-trafego/">alternativa a gestor de tráfego</a>.'),
    ]),
    ('Segurança e dados', [
        ('Os dados da minha empresa treinam a IA?', 'Não. Usamos os modelos de IA por API corporativa, em que os dados enviados não são usados para treinar modelos. Nenhum cliente roda em versão gratuita.'),
        ('Onde ficam os dados?', 'Na infraestrutura da Hetzner, em data centers com certificação ISO 27001, com acesso restrito ao que cada fluxo precisa.'),
        ('Vocês seguem a LGPD?', 'Sim. O tratamento de dados segue a LGPD e todo contrato tem cláusula de confidencialidade.'),
        ('Quem controla o que a IA faz?', 'A sua empresa. Antes de ligar, fica definido por escrito o que a IA faz sozinha e o que passa por aprovação humana. Cada ação da IA fica registrada no histórico.'),
    ]),
]


def duvidas():
    trilha = [('Dúvidas', '')]
    grupos = ''.join('<div class="grupo"><h2 id="%s">%s</h2>%s</div>' % (id_de(g), g, detalhes(qs)) for g, qs in GRUPOS)
    titulos = [(id_de(g), g) for g, _ in GRUPOS]
    conteudo = topo(trilha, 'Dúvidas frequentes', 'O que perguntam <span class="g">antes de começar.</span>',
                    lead='O que é a AutoGenius, como funciona um projeto, quanto tempo leva e como cuidamos dos seus dados. Se a sua dúvida não estiver aqui, fale direto com a gente.') + '''
<section class="corpo" style="padding-bottom:0"><div class="wrap"><div class="corpo-grid">
  <div class="prosa">%s
  %s</div>
  %s
</div></div></section>
%s''' % (grupos, leia([('/', 'AutoGenius', 'Implantação de IA'), ('/agentes-de-atendimento/', 'Plataforma', 'Agentes de atendimento'), ('/ia-trafego-pago/', 'Plataforma', 'AutoGenius Ads AI')]),
         lateral(titulos, 'raiox', 'Não achou a sua dúvida? Responda em uma conversa curta, direto com quem conduz o projeto.'),
         final({'rotulo': 'Próximo passo', 'h2': 'Em 14 dias, você sabe <span class="g">onde a IA paga a conta.</span>',
                'lead': 'O Raio-X é conduzido pelo Yuri, com o time de engenharia, dentro da sua operação.', 'cta': 'Quero um Raio-X de IA'}))
    todas = [q for _, qs in GRUPOS for q in qs]
    escrever('duvidas', conteudo, [faq_schema(todas), migalha_schema('duvidas', trilha)],
             title='Dúvidas frequentes — AutoGenius',
             description='Respostas sobre a AutoGenius: o que é, como funciona o Raio-X e a implantação de IA, agentes de atendimento, IA para tráfego pago, prazos, investimento e segurança dos dados.',
             assunto='raiox', cta_curto='Quero um Raio-X')


# ═══════════════════════════════ Sobre ═══════════════════════════════

def sobre():
    trilha = [('Sobre', '')]
    conteudo = '''
<section class="ha"><div class="wrap sobre-hero">
  <div>
    %s
    <span class="rotulo rv">Sobre a AutoGenius</span>
    <h1 class="rv">A empresa de Recife que coloca a IA <span class="g">para trabalhar.</span></h1>
    <p class="lead rv d1">A AutoGenius implanta IA dentro das empresas — do diagnóstico ao sistema rodando — e constrói plataformas próprias de atendimento e de tráfego pago. Mais de 50 empresas já têm a nossa IA em produção.</p>
  </div>
  <div class="galeria rv d1">
    <figure><img src="/image/v2/yuri-24.jpg" width="900" height="1125" alt="Yuri Matos no escritório da AutoGenius em Recife" style="object-position:72%% 30%%"><figcaption>Escritório · Recife</figcaption></figure>
    <figure><img src="/image/v2/yuri-10.jpg" width="900" height="1125" alt="Yuri Matos, fundador e CEO da AutoGenius" style="object-position:50%% 20%%"></figure>
    <figure class="selo"><b>+50</b><span>empresas com IA em produção</span></figure>
  </div>
</div></section>

%s

<section><div class="wrap corpo-grid" style="grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr)">
  <div><span class="rotulo rv">Por que existimos</span><p class="citacao rv" style="margin-top:22px">“A IA não deve substituir as pessoas. Deve tirar delas o trabalho repetitivo.”</p></div>
  <div class="prosa">
    <p class="rv">A maioria das empresas já paga por alguma ferramenta de IA. O que falta é a IA entrar no trabalho de verdade: no atendimento, no comercial, na operação, no financeiro. É aí que o investimento vira resultado — e é aí que a maioria trava.</p>
    <p class="rv">A AutoGenius nasceu em Recife para resolver esse trecho do caminho. Começamos entendendo como o time trabalha, escolhemos onde a IA paga a conta e construímos a solução dentro dos sistemas que a empresa já usa, com regras claras e gente acompanhando.</p>
  </div>
</div></section>

<section style="padding-top:0"><div class="wrap">
  <div class="cab"><span class="rotulo rv">O que fazemos</span><h2 class="rv">Três frentes, <span class="g">uma engenharia.</span></h2></div>
  <div class="frentes">
    <a class="frente rv" href="/#como"><span class="n">01</span><h3>Implantação de IA</h3><p>Raio-X de 14 dias, implantação por área e operação contínua, com indicadores de adoção medidos semana a semana.</p><span class="ir">Como trabalhamos →</span></a>
    <a class="frente rv d1" href="/agentes-de-atendimento/"><span class="n">02</span><h3>Agentes de atendimento</h3><p>Agentes de IA que atendem, qualificam e agendam no WhatsApp, integrados ao CRM e à agenda.</p><span class="ir">Conhecer os agentes →</span></a>
    <a class="frente rv d2" href="/ia-trafego-pago/"><span class="n">03</span><h3>IA para tráfego pago</h3><p>A AutoGenius Ads AI acompanha as campanhas todos os dias, alerta e otimiza dentro das regras da empresa.</p><span class="ir">Conhecer a Ads AI →</span></a>
  </div>
  <p class="rv" style="margin-top:22px;font-size:15.5px">Também fazemos <strong>palestras e formação de lideranças</strong> sobre IA aplicada a negócios. <a href="#agendar" data-agendar="palestra" style="color:var(--acc);font-weight:600">Levar para a sua empresa →</a></p>
</div></section>

<section style="padding-top:0"><div class="wrap corpo-grid" style="grid-template-columns:minmax(0,1fr) minmax(0,1fr)">
  <div>
    <span class="rotulo rv">Quem conduz</span>
    <h2 class="rv" style="margin:20px 0 22px">Yuri Matos, <span class="g">fundador e CEO.</span></h2>
    <p class="lead rv d1">Formado pela CESAR School, fundou a AutoGenius em Recife e participa pessoalmente de cada Raio-X, ao lado do time de engenharia. Já conduziu a implantação de IA em mais de 50 empresas.</p>
    <div class="creds rv d2"><span><b>CESAR School</b> · formação</span><span><b>NVIDIA</b> · certificação em IA</span><span><b>Google Cloud Next ’25</b> · participante</span></div>
  </div>
  <div>
    <span class="rotulo rv">Na mídia</span>
    <div class="cartoes" style="grid-template-columns:1fr;margin-top:20px">
      <div class="cartao rv"><h3>IA Brasil Notícias</h3><p>“AutoGenius AI amplia atuação e leva agentes de IA para novos segmentos além do atendimento.”</p></div>
      <div class="cartao rv d1"><h3>Blog do Magno</h3><p>“De Recife para o mundo: como a Auto Genius AI está tornando a inteligência artificial uma aliada real das empresas.”</p></div>
    </div>
  </div>
</div></section>

<section style="padding-top:0"><div class="wrap compromissos">
  <div class="cab"><span class="rotulo rv">Compromissos com os seus dados</span><h2 class="rv">IA com regra, <span class="g">desde o primeiro dia.</span></h2></div>
  <ul>
    <li class="rv"><b>LGPD</b><small>Tratamento de dados conforme a lei.</small></li>
    <li class="rv d1"><b>Confidencialidade</b><small>Cláusula em todo contrato.</small></li>
    <li class="rv d2"><b>Seus dados não treinam IA</b><small>Modelos usados por API corporativa.</small></li>
    <li class="rv"><b>Acesso mínimo</b><small>Cada fluxo vê só o que precisa.</small></li>
    <li class="rv d1"><b>Tudo registrado</b><small>Cada ação da IA fica no histórico.</small></li>
    <li class="rv d2"><b>Infraestrutura Hetzner</b><small>Data centers com certificação ISO 27001.</small></li>
  </ul>
  <p class="rv" style="margin-top:22px;font-size:15px;color:var(--tx-3)">Tecnologias com que trabalhamos: OpenAI, Anthropic, Google Cloud, WhatsApp Business API, Supabase, Hetzner, LangChain e n8n.</p>
</div></section>

<section style="padding-top:0"><div class="wrap">
  <div class="cab"><span class="rotulo rv">Onde estamos</span><h2 class="rv">De Recife <span class="g">para o Brasil.</span></h2></div>
  <div class="onde">
    <div class="rv"><small>Endereço</small><p>Empresarial Rio Capibaribe, sala 203<br>Rua Capitão José da Luz, 58 · Ilha do Leite<br>Recife · PE · 50070-540</p></div>
    <div class="rv d1"><small>Contato</small><p><a href="#agendar">Agendar conversa</a><br><a href="mailto:contato@useautogenius.com">contato@useautogenius.com</a><br><a href="https://www.instagram.com/useautogenius/">@useautogenius</a></p></div>
    <div class="rv d2"><small>Empresa</small><p>Auto Genius Soluções Inteligentes Ltda<br>CNPJ 61.383.608/0001-37</p></div>
  </div>
</div></section>
%s''' % (migalha(trilha), '<section style="padding-top:0">%s</section>' % numeros([('+50', 'empresas com IA em produção'), ('1M+', 'mensagens atendidas pela IA'),
                                    ('2', 'plataformas próprias de IA'), ('14 dias', 'para o Raio-X de IA')]),
         final({'rotulo': 'Próximo passo', 'h2': 'Vamos conversar sobre <span class="g">a IA na sua empresa.</span>',
                'lead': 'Uma conversa direta com quem conduz o projeto.', 'cta': 'Agendar conversa'}))
    org = dict(ORG, **{"@context": "https://schema.org", "@type": "Organization", "taxID": "61.383.608/0001-37", "founder": YURI,
                       "address": {"@type": "PostalAddress", "streetAddress": "Rua Capitão José da Luz, 58, sala 203", "addressLocality": "Recife",
                                   "addressRegion": "PE", "postalCode": "50070-540", "addressCountry": "BR"}})
    escrever('sobre', conteudo, [{"@context": "https://schema.org", "@type": "AboutPage", "url": SITE + "/sobre/", "name": "Sobre a AutoGenius", "about": org},
                                 migalha_schema('sobre', trilha)],
             title='Sobre a AutoGenius — empresa de inteligência artificial de Recife',
             description='A AutoGenius implanta inteligência artificial dentro das empresas, do diagnóstico ao sistema rodando, e tem plataformas próprias de atendimento e de tráfego pago. Sede em Recife (PE), fundada por Yuri Matos.',
             assunto='raiox')


if __name__ == '__main__':
    for a in (CHATBOT, META_ADS, GESTOR):
        artigo(a)
    duvidas()
    sobre()
