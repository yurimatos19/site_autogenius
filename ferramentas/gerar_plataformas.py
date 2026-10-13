# -*- coding: utf-8 -*-
"""Gera as páginas de plataforma do site da AutoGenius (padrão V3).

Por que um gerador: o site é HTML estático, e copiar cabeçalho, rodapé,
medição e dados estruturados à mão em cada página já fez as páginas se
desencontrarem. Aqui o molde é um só; cada página é só conteúdo.

Uso:  python3 ferramentas/gerar_plataformas.py
"""
import json
import pathlib
import re

RAIZ = pathlib.Path(__file__).resolve().parent.parent
SITE = 'https://useautogenius.com'


def esc(t):
    return t.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace('"', '&quot;')


def sem_tags(t):
    return re.sub(r'<[^>]+>', '', t)


# ═════════════════════════════════ Molde ═════════════════════════════════

MOLDE = '''<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<script>document.documentElement.classList.add('js')</script>

<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-P2BXGG04RL"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){{dataLayer.push(arguments);}}
  gtag('js', new Date());
  gtag('config', 'G-P2BXGG04RL');
</script>

<title>{title}</title>
<meta name="description" content="{description}">
<meta name="theme-color" content="#06080D">
<meta name="color-scheme" content="dark">
<link rel="canonical" href="{url}">
<meta property="og:type" content="website">
<meta property="og:locale" content="pt_BR">
<meta property="og:site_name" content="AutoGenius">
<meta property="og:url" content="{url}">
<meta property="og:title" content="{og_title}">
<meta property="og:description" content="{description}">
<meta property="og:image" content="{site}/image/og-image.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/png" href="/image/nova_logo.png">
<link rel="alternate" type="text/plain" title="AutoGenius — contexto para assistentes de IA" href="/llms.txt">
{schemas}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sora:wght@500..800&family=Geist:wght@300..600&family=Geist+Mono:wght@400;500&family=Poppins:wght@600&display=swap">
<link rel="stylesheet" href="/css/ag.css">
<link rel="stylesheet" href="/css/plataforma.css">
{css_extra}
<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{{if(f.fbq)return;n=f.fbq=function(){{n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)}};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '2464162037434399');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" alt="" style="display:none" src="https://www.facebook.com/tr?id=2464162037434399&ev=PageView&noscript=1"/></noscript>
<!-- End Meta Pixel Code -->
</head>
<body style="--v:{cor}" data-assunto="{assunto}"{segmento_attr}>

<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <defs>
    <linearGradient id="gfio" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#1F5BFF"/><stop offset="1" stop-color="#19D3F5"/></linearGradient>
  </defs>
</svg>

<header class="topo">
  <div class="wrap">
    <a class="logo" href="/" aria-label="AutoGenius, página inicial">Auto<b>Genius</b></a>
    <nav class="menu" aria-label="Principal">
      <a href="/#como">Como trabalhamos</a>
      <a href="/agentes-de-atendimento/"{atual_agentes}>Atendimento com IA</a>
      <a href="/ia-trafego-pago/"{atual_trafego}>Ads AI</a>
      <a href="/#quem">Quem somos</a>
    </nav>
    <a class="btn sm" href="#agendar">{cta_curto} <span class="seta" aria-hidden="true">→</span></a>
    <button class="burger" type="button" aria-label="Abrir menu" aria-expanded="false"><span></span></button>
  </div>
</header>
<nav class="gaveta" aria-label="Menu">
  <a href="/">Início</a>
  <a href="/#como">Como trabalhamos</a>
  <a href="/agentes-de-atendimento/">Atendimento com IA</a>
  <a href="/ia-trafego-pago/">Ads AI</a>
  <a href="/#quem">Quem somos</a>
  <a class="btn" href="#agendar">{cta_curto} <span class="seta" aria-hidden="true">→</span></a>
</nav>

<main>
{conteudo}
</main>

<footer class="rodape">
  <div class="wrap">
    <div class="rodape-grid">
      <div>
        <a class="logo" href="/">Auto<b>Genius</b></a>
        <p class="assina">Implantação de inteligência artificial, do diagnóstico ao sistema rodando.</p>
        <address>Empresarial Rio Capibaribe, sala 203<br>Rua Capitão José da Luz, 58 · Ilha do Leite<br>Recife · PE · 50070-540</address>
        <a class="btn sm" href="#agendar" data-agendar="raiox">Agendar conversa <span class="seta" aria-hidden="true">→</span></a>
      </div>
      <div>
        <h4>Soluções</h4>
        <ul>
          <li><a href="/#como">Raio-X de IA</a></li>
          <li><a href="/#como">Implantação</a></li>
          <li><a href="/#como">Operação contínua</a></li>
          <li><a href="#agendar" data-agendar="palestra">Palestras e formação</a></li>
        </ul>
      </div>
      <div>
        <h4>Plataformas</h4>
        <ul>
          <li><a href="/agentes-de-atendimento/">Agentes de atendimento</a></li>
          <li><a href="/ia-trafego-pago/">AutoGenius Ads AI</a></li>
        </ul>
      </div>
      <div>
        <h4>Setores</h4>
        <ul>
          <li><a href="/clinicas/">Clínicas</a></li>
          <li><a href="/escolas/">Escolas</a></li>
          <li><a href="/imoveis/">Imobiliárias</a></li>
          <li><a href="/autos/">Concessionárias</a></li>
        </ul>
      </div>
      <div>
        <h4>Conteúdo</h4>
        <ul>
          <li><a href="/duvidas/">Dúvidas frequentes</a></li>
          <li><a href="/chatbot-vs-agente-de-ia/">Chatbot ou agente de IA?</a></li>
          <li><a href="/ia-para-meta-ads/">IA para Meta Ads</a></li>
          <li><a href="/alternativa-a-gestor-de-trafego/">Alternativa a gestor de tráfego</a></li>
        </ul>
      </div>
      <div>
        <h4>Empresa</h4>
        <ul>
          <li><a href="/sobre/">Sobre</a></li>
          <li><a href="/#quem">Quem somos</a></li>
          <li><a href="#agendar">Fale conosco</a></li>
          <li><a href="https://www.instagram.com/useautogenius/">Instagram</a></li>
          <li><a href="https://www.linkedin.com/in/yuri-matos2002/">LinkedIn</a></li>
          <li><a href="mailto:contato@useautogenius.com">E-mail</a></li>
        </ul>
      </div>
    </div>
    <p class="rodape-frase" aria-hidden="true">IA que trabalha dentro da sua empresa.</p>
    <div class="rodape-base">
      <span>© 2026 Auto Genius Soluções Inteligentes Ltda · CNPJ 61.383.608/0001-37</span>
      <span>Feito em Recife, Pernambuco</span>
    </div>
  </div>
</footer>
{js_extra}
<script src="/js/plataforma.js" defer></script>
<script src="/js/ag.js" defer></script>
</body>
</html>
'''


# ═══════════════════════════════ Seções ═══════════════════════════════

def hero(p):
    specs = ''.join('<span><b>%s</b> · %s</span>' % s for s in p.get('specs', []))
    rel = ''
    if p.get('relogio'):
        r = p['relogio']
        rel = ('<div class="relogio entra" style="animation-delay:.6s" data-abre="%d" data-fecha="%d" data-sabado="%d" data-quem="%s">'
               '<b>--:--</b><span>Esta é a hora aí onde você está.<br><span data-estado>verificando o horário…</span></span></div>'
               % (r['abre'], r['fecha'], r['sabado'], esc(r['quem'])))
    fluts = ''.join('<div class="flut f%d" aria-hidden="true"><span class="ic">%s</span><div><b>%s</b><small>%s</small></div></div>' % (i + 1, *f)
                    for i, f in enumerate(p.get('fluts', [])))
    lado = p.get('lado_html') or (
        '<div class="palco entra" style="animation-delay:.35s">'
        '<figure class="tela"><div class="tela-barra" aria-hidden="true"><i></i><i></i><i></i></div>'
        '<img src="%s" width="1280" height="853" alt="%s" fetchpriority="high"></figure>%s</div>'
        % (p['tela'], esc(p['tela_alt']), fluts))
    return '''
<section class="hp">
  <div class="wrap hp-grid">
    <div>
      <span class="migalha entra">%s</span>
      <span class="rotulo entra" style="animation-delay:.05s">%s</span>
      <h1 class="entra" style="animation-delay:.15s"><span class="l">%s</span> <span class="l g">%s</span></h1>
      <p class="lead entra" style="animation-delay:.3s">%s</p>
      <div class="hp-cta entra" style="animation-delay:.42s">
        <a class="btn" href="#agendar">%s <span class="seta" aria-hidden="true">→</span></a>
        <a class="btn-2" href="#como">Como funciona</a>
      </div>
      <div class="specs entra" style="animation-delay:.52s">%s</div>
      %s
    </div>
    %s
  </div>
</section>''' % (p['migalha'], p['rotulo'], p['h1'][0], p['h1'][1], p['lead'], p['cta'], specs, rel, lado)


def faixa(palavras):
    um = ''.join('<span>%s</span><em></em>' % w for w in palavras)
    return '<div class="faixa" aria-hidden="true"><div class="trilho">%s%s</div></div>' % (um, um)


def cab(rotulo, h2, lead='', classe=''):
    return ('<div class="cab %s"><span class="rotulo rv">%s</span><h2 class="rv">%s</h2>%s</div>'
            % (classe, rotulo, h2, ('<p class="lead rv d1">%s</p>' % lead) if lead else ''))


def linha_do_tempo(d):
    itens = ''.join(
        '<div class="tl-item rv%s"><span class="tl-time">%s</span><div><h3>%s</h3><p>%s</p></div></div>'
        % (' mau' if it[3] else '', it[0], it[1], it[2]) for it in d['itens'])
    return '<section><div class="wrap">%s<div class="tl">%s</div></div></section>' % (cab(d['rotulo'], d['h2'], d['lead']), itens)


def capacidades(d):
    caps = ''.join('<article class="cap rv%s"><span class="n">%02d</span><h3>%s</h3><p>%s</p></article>'
                   % ((' d%d' % (i % 3)) if i % 3 else '', i + 1, c[0], c[1]) for i, c in enumerate(d['caps']))
    integra = ''
    if d.get('integra'):
        integra = '<div class="integra rv"><small>Integrações prontas</small>%s</div>' % ''.join('<span>%s</span>' % x for x in d['integra'])
    return '<section id="%s" style="padding-top:0"><div class="wrap">%s<div class="caps">%s</div>%s</div></section>' % (
        d.get('id', 'capacidades'), cab(d['rotulo'], d['h2'], d.get('lead', '')), caps, integra)


def numeros(lista):
    return '<div class="wrap"><div class="num-grid">%s</div></div>' % ''.join(
        '<div class="num rv%s"><b class="g">%s</b><span>%s</span></div>' % ((' d%d' % i) if i else '', n[0], n[1]) for i, n in enumerate(lista))


def prova(d):
    if not d:
        return ''
    return ('<section style="padding-top:clamp(56px,7vw,96px)"><div class="wrap"><div class="prova-faixa rv"><b class="g">%s</b><div><p>%s</p><small>%s</small></div></div></div></section>'
            % (d[0], d[1], d[2]))


def passos(d):
    ps = ''.join('<div class="passo rv%s"><span class="n">%02d</span><h3>%s</h3><p>%s</p></div>'
                 % ((' d%d' % i) if i else '', i + 1, p[0], p[1]) for i, p in enumerate(d['passos']))
    return '<section class="claro" id="como"><div class="wrap">%s<div class="passos3">%s</div></div></section>' % (
        cab(d['rotulo'], d['h2'], d.get('lead', '')), ps)


def faq(lista):
    if not lista:
        return ''
    itens = ''.join('<details class="rv"><summary>%s</summary><p>%s</p></details>' % q for q in lista)
    return '<section id="duvidas"><div class="wrap">%s<div class="faq">%s</div></div></section>' % (
        cab('Dúvidas', 'O que perguntam <span class="g">antes de começar.</span>'), itens)


def final(d):
    return '''
<section class="final">
  <div class="final-fundo" aria-hidden="true"><img src="/image/v2/recife-capibaribe.jpg" width="2400" height="1600" alt="" loading="lazy"></div>
  <div class="wrap">
    <span class="rotulo rv">%s</span>
    <h2 class="rv">%s</h2>
    <p class="lead rv d1">%s</p>
    <div class="cta rv d2">
      <a class="btn" href="#agendar">%s <span class="seta" aria-hidden="true">→</span></a>
      <a class="btn-2" href="#agendar">Falar com o Yuri</a>
    </div>
  </div>
</section>''' % (d['rotulo'], d['h2'], d['lead'], d['cta'])


def montar(secoes):
    out = []
    for s in secoes:
        tipo, dado = s
        out.append({'hero': hero, 'faixa': faixa, 'tempo': linha_do_tempo, 'caps': capacidades, 'numeros': numeros,
                    'prova': prova, 'passos': passos, 'faq': faq, 'final': final, 'html': lambda h: h}[tipo](dado))
    return '\n'.join(out)


# ═══════════════════════ Conteúdo compartilhado ═══════════════════════

PASSOS_AGENTE = lambda quem, terceiro, texto3: {
    'rotulo': 'Como funciona', 'h2': 'Sua parte é uma conversa <span class="g">de 15 minutos.</span>',
    'lead': 'O resto é com a gente — treinamento, integrações e acompanhamento depois que o agente entra no ar.',
    'passos': [('Diagnóstico', 'Olhamos o WhatsApp da %s e mostramos, com as suas próprias conversas, quantos contatos ficaram sem resposta e quanto tempo os outros esperaram.' % quem),
               ('Implantação', 'Treinamos o agente com as regras, os serviços e o jeito de falar da %s, e conectamos à agenda e ao sistema. Nada técnico do seu lado.' % quem),
               (terceiro, texto3)]}

NUMEROS_AGENTE = [('&lt;3s', 'para responder, a qualquer hora'), ('24/7', 'inclusive feriado e madrugada'),
                  ('7 dias', 'da primeira conversa ao ar'), ('+50', 'empresas com nossos agentes em produção')]


def pagina_segmento(c):
    return [
        ('hero', {
            'migalha': '<a href="/agentes-de-atendimento/">Atendimento com IA</a> · %s' % c['nome'],
            'rotulo': c['rotulo'], 'h1': c['h1'], 'lead': c['lead'], 'cta': 'Ver funcionando em 15 min',
            'specs': [('&lt;3s', 'para responder'), ('24h', 'de plantão'), ('7 dias', 'para entrar no ar')],
            'relogio': c['relogio'], 'tela': c['tela'], 'tela_alt': c['tela_alt'], 'fluts': c['fluts']}),
        ('faixa', c['faixa']),
        ('tempo', c['tempo']),
        ('caps', {'rotulo': 'O que o agente faz sozinho', 'h2': 'Não é um <span class="g">menu de opções.</span>',
                  'lead': c['caps_lead'], 'caps': c['caps'], 'integra': c['integra']}),
        ('numeros', NUMEROS_AGENTE),
        ('prova', c.get('prova')),
        ('passos', PASSOS_AGENTE(c['quem_artigo'], c['passo3'][0], c['passo3'][1])),
        ('faq', c['faq']),
        ('final', {'rotulo': 'Comece hoje', 'h2': c['final_h2'],
                   'lead': 'Em 15 minutos você vê o agente atendendo com o cenário da sua %s — sem compromisso e sem apresentação de slides.' % c['quem_artigo'],
                   'cta': 'Ver funcionando em 15 min'}),
    ]


# ═══════════════════════════════ Páginas ═══════════════════════════════

CLINICAS = {
    'nome': 'Clínicas', 'rotulo': 'IA para clínicas e consultórios', 'quem_artigo': 'clínica',
    'h1': ('Sua recepção fecha às 18h.', 'O paciente, não.'),
    'lead': 'Um agente de IA no WhatsApp da clínica que tira as dúvidas de sempre, <strong>agenda direto na sua agenda</strong> e confirma a consulta antes do dia — de madrugada, no domingo, no feriado. Para clínicas médicas, odontológicas, de estética e veterinárias.',
    'relogio': {'abre': 8, 'fecha': 18, 'sabado': 12, 'quem': 'a recepção'},
    'tela': '/image/produto-clinicas.jpg', 'tela_alt': 'Tela real da plataforma AutoGenius para clínicas: caixa de conversas e um agendamento feito pela IA',
    'fluts': [('✓', 'Consulta agendada', 'sábado, 21:52'), ('⚕', 'Convênio conferido', 'antes de marcar o horário'), ('↻', 'Confirmação enviada', 'na véspera, sem ninguém lembrar')],
    'faixa': ['Agenda', 'Convênio', 'Confirmação', 'Triagem', 'Retorno', 'Reativação'],
    'tempo': {'rotulo': 'O que acontece hoje', 'h2': 'O paciente não desiste do tratamento. <span class="g">Desiste de esperar.</span>',
              'lead': 'Todo horário vago na sua agenda começou com uma mensagem sem resposta. Esta é a linha do tempo de um paciente que você nunca soube que perdeu.',
              'itens': [('21:47 SÁB', 'A mensagem chega', 'Um sintoma que incomoda, a dúvida sobre o convênio, a vontade de finalmente resolver. É o momento de maior intenção — e acontece fora do expediente.', False),
                        ('21:52', 'Ele manda para mais duas clínicas', 'Ninguém pesquisa uma clínica só. Quem responder primeiro define onde ele vai — antes de comparar preço, currículo ou estrutura.', False),
                        ('22:10', 'A concorrente responde', 'Não precisa ser melhor que a sua. Precisa estar acordada.', True),
                        ('08:30 SEG', 'Sua recepção abre o WhatsApp', 'Responde com educação, oferece horário — e recebe um “obrigada, já resolvi”. A conversa fica no histórico como se nada tivesse acontecido.', True)]},
    'caps_lead': 'Nada de “digite 1 para agendar”. O agente lê a mensagem como ela foi escrita, decide o que fazer e executa — inclusive escrever na sua agenda.',
    'caps': [('Atende 24 horas por dia', 'Valor, convênio, endereço, preparo do exame, o que o especialista trata. As dúvidas de sempre, respondidas em segundos.'),
             ('Agenda de verdade', 'Consulta o horário livre, marca, reagenda e cancela direto no seu sistema. Sem planilha no meio e sem ninguém digitar depois.'),
             ('Confirma e lembra', 'Puxa a confirmação na véspera e libera o horário quando o paciente desmarca — com tempo de encaixar outro no lugar.'),
             ('Faz a triagem', 'Convênio ou particular, tipo de atendimento, urgência, primeira vez ou retorno. O paciente chega classificado na mão da equipe.'),
             ('Reativa quem sumiu', 'Retorno vencido, tratamento interrompido, limpeza semestral: traz de volta a receita que já era sua.'),
             ('Passa o bastão na hora certa', 'Caso delicado, reclamação ou dúvida clínica: o agente para e chama uma pessoa. Ele sabe o que não é dele.')],
    'integra': ['Clinicorp', 'Feegow', 'Dental Office', 'Trinks', 'Clínica nas Nuvens', 'iClinic', 'Simples Vet', 'Google Agenda'],
    'prova': ('+90%', 'de consultas confirmadas na <strong>Laser Dream</strong>, rede de clínicas de estética: “As pacientes tiram dúvidas de procedimentos 24 horas e agendam direto. A IA reduziu drasticamente o tempo de resposta e o no-show.”', 'Resultado relatado pelo cliente.'),
    'passo3': ('No ar', 'Ele assume o plantão. Sua equipe passa a receber paciente agendado em vez de responder a mesma pergunta pela vigésima vez.'),
    'faq': [('Quanto custa?', 'Depende do porte da clínica e do volume de conversas. Na conversa de diagnóstico apresentamos o valor junto do retorno estimado na sua operação.'),
            ('Minha recepção já agenda. Por que eu preciso disso?', 'O agente não entra no lugar dela. Ele cobre as horas em que ela não está e tira dela o trabalho repetitivo durante o expediente — para a recepção cuidar de quem está na clínica.'),
            ('O paciente percebe que é uma IA?', 'Ele percebe que foi atendido rápido e bem. O agente se apresenta como atendimento da clínica, não finge ser profissional de saúde e chama uma pessoa sempre que a conversa sai do operacional.'),
            ('E os dados dos pacientes?', 'Tratamento conforme a LGPD, com dados criptografados e acesso restrito. O agente não dá diagnóstico, não opina sobre conduta clínica e não trata dado de saúde além do necessário para agendar.'),
            ('Funciona com o meu sistema?', 'Integramos com Clinicorp, Feegow, iClinic, Trinks, Dental Office, entre outros. Se o seu não estiver na lista, avaliamos a integração no diagnóstico.')],
    'final_h2': 'Nenhum paciente sem resposta. <span class="g">Nem às 22h de sábado.</span>',
}

ESCOLAS = {
    'nome': 'Escolas', 'rotulo': 'IA para escolas e instituições de ensino', 'quem_artigo': 'escola',
    'h1': ('A matrícula se decide às 22h.', 'Sua secretaria fechou às 17h.'),
    'lead': 'Um agente de IA no WhatsApp da escola que responde a família no momento em que ela está decidindo, <strong>qualifica, agenda a visita</strong> e não deixa ninguém sumir no meio do funil.',
    'relogio': {'abre': 7, 'fecha': 17, 'sabado': 12, 'quem': 'a secretaria'},
    'tela': '/image/produto-escolas.jpg', 'tela_alt': 'Tela real da plataforma AutoGenius para escolas: conversas com famílias e visitas agendadas pela IA',
    'fluts': [('✓', 'Visita agendada', 'terça, 22:31'), ('★', 'Família qualificada', '2 filhos · 6º ano · integral'), ('↻', 'Rematrícula puxada', 'antes da temporada')],
    'faixa': ['Matrícula', 'Visita', 'Rematrícula', 'Vagas', 'Bolsas', 'Funil'],
    'tempo': {'rotulo': 'O que acontece na temporada', 'h2': 'A escola não perde a família na visita. <span class="g">Perde antes dela.</span>',
              'lead': 'Matrícula não é decisão de horário comercial. Esta é a linha do tempo de uma família que você não soube que perdeu.',
              'itens': [('22:14 TER', 'A mãe pesquisa depois que as crianças dormem', 'É o único horário em que ela consegue parar para pensar em escola — exatamente quando a sua secretaria não está.', False),
                        ('22:20', 'Ela manda para quatro escolas de uma vez', 'Mesma mensagem, mesmo minuto. A partir daí é uma corrida — e a primeira resposta define quem recebe a visita.', False),
                        ('08:40 QUA', 'Sua secretaria responde no meio do pico', 'Junto com outras sessenta mensagens iguais, a fila do balcão e o telefone tocando. A resposta sai tarde, curta e sem nenhuma pergunta de volta.', True),
                        ('SEXTA', 'A família já visitou a outra escola', 'Não porque ela era melhor. Porque marcou primeiro, enquanto a decisão ainda estava aberta.', True)]},
    'caps_lead': 'Nada de “digite 1 para matrículas”. O agente responde com a informação certa da sua escola e leva a família até a visita.',
    'caps': [('Atende os responsáveis 24 horas', 'Vaga, valor, período, material, horário, transporte, projeto pedagógico — à noite e no fim de semana.'),
             ('Qualifica a família', 'Série, idade, período, quantos filhos, de onde vem. A coordenação recebe o contexto pronto, em vez de descobrir tudo na visita.'),
             ('Agenda a visita guiada', 'Marca direto na agenda da coordenação, respeitando os horários que você abriu — e confirma na véspera.'),
             ('Persegue o funil', 'Visitou e não voltou? Pediu a proposta e sumiu? O agente retoma no tempo certo, sem planilha de controle.'),
             ('Puxa a rematrícula', 'Fala com a base atual antes da temporada, resolve a dúvida que trava a renovação e reduz a evasão.'),
             ('Passa o bastão na hora certa', 'Negociação de bolsa, caso pedagógico, reclamação: o agente para e chama a coordenação.')],
    'integra': ['Sponte', 'SophiA', 'TOTVS Educacional', 'Gennera', 'WPensar', 'Google Agenda'],
    'prova': ('0', 'famílias sem resposta na temporada. É a meta real da captação: não deixar nenhuma mensagem passar em branco no mês que decide o ano inteiro da escola.', 'Meta de operação, acompanhada semana a semana.'),
    'passo3': ('Pronto antes do pico', 'Ele entra em campo atendendo, qualificando e agendando — e a secretaria volta a fazer o que fecha matrícula: falar com quem já está interessado.'),
    'faq': [('Quanto custa?', 'Depende do porte da escola e do volume de conversas. Na conversa de diagnóstico apresentamos o valor junto do retorno estimado — inclusive em condição anual, para ter o agente pronto antes da temporada.'),
            ('Só preciso disso na temporada?', 'A temporada é onde ele mais se paga, mas o agente trabalha o ano inteiro: rematrícula, dúvidas do dia a dia dos pais, captação fora de época. Ligar só em outubro é chegar sem ele treinado.'),
            ('Ele substitui a minha secretaria?', 'Não. Ele cobre o horário em que ela não está e tira dela a parte repetitiva. Fechar matrícula continua sendo conversa de gente — com a família já informada e a visita marcada.'),
            ('E se a família perguntar algo que ele não sabe?', 'Ele não inventa. Diz que vai confirmar e passa para a coordenação, sinalizando a conversa. Toda pergunta nova vira ajuste no treinamento.'),
            ('Funciona com o meu sistema de gestão?', 'Integramos com Sponte, SophiA, TOTVS Educacional, Gennera e WPensar, entre outros. Se o seu não estiver na lista, avaliamos no diagnóstico.')],
    'final_h2': 'Prepare a captação <span class="g">antes que o pico chegue.</span>',
}

IMOVEIS = {
    'nome': 'Imobiliárias', 'rotulo': 'IA para imobiliárias e corretores', 'quem_artigo': 'imobiliária',
    'h1': ('O portal manda lead no domingo.', 'Sua equipe volta na segunda.'),
    'lead': 'Um agente de IA no WhatsApp da imobiliária que responde ZAP, VivaReal e Instagram em segundos, <strong>descobre intenção e orçamento</strong>, separa curioso de comprador e só coloca visita na agenda do corretor quando vale a viagem.',
    'relogio': {'abre': 9, 'fecha': 18, 'sabado': 13, 'quem': 'o plantão'},
    'tela': '/image/produto-imoveis.jpg', 'tela_alt': 'Tela real da plataforma AutoGenius para imobiliárias: atendimento enviando opções de imóvel pelo WhatsApp',
    'fluts': [('✓', 'Visita agendada', 'domingo, 10:12'), ('R$', 'Orçamento confirmado', 'entrada + FGTS'), ('⌂', '3 imóveis enviados', 'compatíveis com o perfil')],
    'faixa': ['Portais', 'Intenção', 'Orçamento', 'Visita', 'Carteira', 'CRM'],
    'tempo': {'rotulo': 'O que acontece hoje', 'h2': 'Você perde duas vezes: no lead que esfria <span class="g">e na visita que não vira nada.</span>',
              'lead': 'O portal entrega volume, não intenção. Esta é a linha do tempo de um comprador de verdade que escapou.',
              'itens': [('09:12 DOM', 'O lead entra pelo portal', 'ZAP, VivaReal, OLX, Instagram. O casal está procurando junto, com tempo e disposição — e a imobiliária está fechada.', False),
                        ('09:15', 'O mesmo imóvel tem cinco anúncios', 'O portal mostra o prédio anunciado por várias imobiliárias. Ele manda para todas — e a primeira resposta define quem mostra o imóvel.', False),
                        ('11:30', 'Outro corretor responde e marca a visita', 'Sem saber nada do orçamento, mas marcou. E quem marca primeiro conduz a negociação inteira daí em diante.', True),
                        ('SÁBADO', 'Seu corretor gasta a manhã com quem não tem entrada', 'Três imóveis, duas horas de trânsito, e a conversa sobre financiamento só acontece no fim — quando já não dava.', True)]},
    'caps_lead': 'O agente conhece a sua carteira, faz as perguntas que o corretor faria e só ocupa a agenda dele quando a visita se justifica.',
    'caps': [('Responde os portais na hora, 24/7', 'ZAP, VivaReal, OLX, Instagram e o WhatsApp da imobiliária. Todo canal, todo horário — inclusive domingo.'),
             ('Descobre a intenção', 'Compra, aluguel ou investimento; primeira moradia ou troca; prazo para se mudar. Muda tudo no atendimento.'),
             ('Qualifica o orçamento', 'Faixa de preço, entrada, FGTS, financiamento aprovado. A conversa difícil acontece antes da visita, não depois.'),
             ('Separa curioso de comprador', 'Quem só está olhando continua bem atendido. Quem pode comprar vai para a agenda do corretor hoje.'),
             ('Manda opções compatíveis', 'Consulta a carteira, envia o que cabe no perfil e sugere alternativa quando o anunciado já saiu.'),
             ('Agenda a visita e registra no CRM', 'Marca na agenda do corretor certo, confirma na véspera e grava o histórico inteiro.')],
    'integra': ['Vista CRM', 'Kenlo', 'ZAP Imóveis', 'VivaReal', 'Universal Software', 'Tecimob', 'Google Agenda'],
    'passo3': ('Plantão de fim de semana', 'Ele assume os portais. A equipe chega na segunda com visitas marcadas e o perfil de cada cliente já levantado.'),
    'faq': [('Quanto custa?', 'Depende do volume de leads e do tamanho da equipe. Na conversa de diagnóstico apresentamos o valor junto do retorno estimado.'),
            ('Já tenho corretor de plantão. Por que eu preciso disso?', 'O plantão cobre o horário comercial e responde na ordem em que consegue. O agente responde todos ao mesmo tempo, em segundos, no domingo — e entrega só quem já disse intenção, prazo e orçamento.'),
            ('Ele vai espantar o cliente perguntando de dinheiro logo de cara?', 'Não. Ele chega no orçamento depois de entender o que a pessoa procura, do jeito que um corretor experiente faz — e quem não quer responder continua sendo atendido.'),
            ('Funciona para locação também?', 'Sim. Muda a triagem: em vez de entrada e financiamento, ele levanta prazo, renda, garantia e pets — o que trava a locação depois da visita.'),
            ('Funciona com o meu sistema?', 'Integramos com Vista CRM, Kenlo, Universal Software e Tecimob, além de ZAP, VivaReal e Google Agenda. Se o seu não estiver na lista, avaliamos no diagnóstico.')],
    'final_h2': 'Chegue na segunda com a agenda cheia <span class="g">de quem compra.</span>',
}

AUTOS = {
    'nome': 'Concessionárias', 'rotulo': 'IA para lojas de carro e concessionárias', 'quem_artigo': 'loja',
    'h1': ('O lead das 3h da manhã', 'compra de quem responde.'),
    'lead': 'Um agente de IA no WhatsApp da loja que responde cada lead em segundos, <strong>qualifica troca e financiamento</strong>, agenda o test-drive e não deixa proposta morrer sem retomada.',
    'relogio': {'abre': 8, 'fecha': 18, 'sabado': 13, 'quem': 'o time de vendas'},
    'tela': '/image/produto-autos.jpg', 'tela_alt': 'Tela real da plataforma AutoGenius para revendas: atendimento com avaliação da troca e test-drive',
    'fluts': [('✓', 'Test-drive agendado', 'domingo, 03:18'), ('↔', 'Troca avaliada', 'Onix 2019 · faixa enviada'), ('%', 'Parcela simulada', 'antes de chegar à loja')],
    'faixa': ['Estoque', 'Troca', 'Financiamento', 'Test-drive', 'Proposta', 'CRM'],
    'tempo': {'rotulo': 'O que acontece hoje', 'h2': 'Você não perde a venda no fechamento. <span class="g">Perde na demora.</span>',
              'lead': 'Ninguém pesquisa carro no horário comercial. Esta é a linha do tempo de um lead que morreu na sua caixa de entrada.',
              'itens': [('03:14 DOM', 'O lead entra pelo portal', 'Webmotors, OLX, Instagram. Ele está com o celular na mão, comparando anúncio — o pico da intenção e o vale do seu plantão.', False),
                        ('03:15', 'Ele dispara para outras cinco lojas', 'O mesmo carro está anunciado em todo lugar. A diferença entre você e o concorrente não é o preço: é quem responde primeiro.', False),
                        ('03:40', 'Uma loja responde', 'Pode ser um robô simples, pode ser o dono sem sono. A conversa começou lá — e é ela que está negociando.', True),
                        ('09:20 SEG', 'Seu vendedor abre o WhatsApp', 'Manda “bom dia, o carro está disponível!” para quem já viu o carro de outra loja ontem à tarde. Duas mensagens depois, o lead para de responder.', True)]},
    'caps_lead': 'O agente conhece o seu estoque, negocia o que dá para negociar e entrega o cliente pronto para a equipe fechar.',
    'caps': [('Responde em segundos, 24/7', 'Webmotors, OLX, Instagram, Meta Ads, WhatsApp da loja. Todo canal, todo horário, sempre antes do concorrente.'),
             ('Conhece o estoque ao vivo', 'Identifica modelo, versão, ano e km do anúncio, confirma disponibilidade e sugere alternativa quando o carro já saiu.'),
             ('Avalia a troca e simula', 'Puxa os dados do usado, devolve uma faixa de avaliação e adianta a simulação de financiamento.'),
             ('Agenda o test-drive', 'Marca direto na agenda do vendedor certo, confirma na véspera e avisa quando o cliente está a caminho.'),
             ('Persegue a proposta', 'Proposta enviada e sem resposta não morre em silêncio: o agente retoma no tempo certo e reaquece o lead.'),
             ('Entrega quente e registra', 'Passa o cliente qualificado para o vendedor com o histórico inteiro e grava tudo no CRM.')],
    'integra': ['Syonet', 'AutoCerto', 'Linx', 'Webmotors', 'OLX Autos', 'Google Agenda', 'WhatsApp API'],
    'passo3': ('Plantão 24h no ar', 'Ele assume a linha de frente. A equipe chega na segunda com os test-drives da semana já marcados na agenda.'),
    'faq': [('Quanto custa?', 'Depende do volume de leads da loja. Na conversa de diagnóstico apresentamos o valor junto do retorno estimado.'),
            ('Já tenho vendedor. Por que eu preciso disso?', 'Seu vendedor dorme, o agente não. Ele cobre madrugada, domingo e feriado, e durante o expediente filtra o curioso do comprador.'),
            ('Ele dá desconto sozinho?', 'Só até onde você autorizar. Você define o piso de negociação, a faixa de avaliação da troca e o que exige aprovação. Fora disso, ele chama o vendedor.'),
            ('Funciona com seminovos e consignados?', 'Sim. A lógica de lead, avaliação de troca e test-drive é a mesma para revenda, concessionária, seminovos e consignação — muda o estoque com que o agente é treinado.'),
            ('Funciona com o meu sistema?', 'Integramos com Syonet, AutoCerto, Linx, Webmotors e OLX Autos, além do Google Agenda e da API oficial do WhatsApp. Se o seu não estiver na lista, avaliamos no diagnóstico.')],
    'final_h2': 'Todo mundo tem IA. <span class="g">A sua entende de revenda?</span>',
}

SEGMENTOS = [('clinicas', CLINICAS, '#3B82F6'), ('escolas', ESCOLAS, '#1FE3A0'), ('imoveis', IMOVEIS, '#8B5CF6'), ('autos', AUTOS, '#F97316')]


# ─────────────────────── Agentes de atendimento ───────────────────────

CONVERSA = [('ele', 'Oi, vi o Corolla 2022 no site. Ainda tá disponível?', '22:47'),
            ('ia', 'Oi, Marcos! Tá sim 🚗 Corolla XEi 2022, 41 mil km. Você tem carro na troca?', '22:47'),
            ('ele', 'Tenho um Onix 2019', '22:49'),
            ('ia', 'Perfeito, avalio na visita. Prefere financiar ou à vista?', '22:49'),
            ('ele', 'Financiado, entrada de uns 40', '22:51'),
            ('ia', 'Com R$ 40 mil de entrada e o Onix na troca, a parcela fica em torno de <b>R$ 1.480 em 48x</b>. Agendo sua visita amanhã às 10h?', '22:51'),
            ('ele', 'Pode ser 👍', '22:52'),
            ('ia', 'Agendado ✅ Corolla separado e avaliação do Onix marcada.', '22:52')]

BLOCO_CONVERSA = '''
<section id="como-atende">
  <div class="wrap duas">
    <div>
      %s
      <div class="batidas">
        <div class="batida rv"><span class="t">2s</span><div><b>Respondeu antes de esfriar</b><span>O lead chegou fora do horário. O agente atendeu na hora, com o estoque real na mão.</span></div></div>
        <div class="batida rv d1"><span class="t">4 perguntas</span><div><b>Qualificou sozinho</b><span>Troca, entrada, forma de pagamento e urgência — sem formulário e sem afastar o cliente.</span></div></div>
        <div class="batida rv d2"><span class="t">1 resposta</span><div><b>Agendou a visita</b><span>Consultou a agenda, ofereceu horário e confirmou. O vendedor acordou com a reunião marcada.</span></div></div>
        <div class="batida rv d3"><span class="t">08:00</span><div><b>Entregou pronto</b><span>Resumo no CRM: veículo de interesse, carro na troca, entrada e parcela simulada.</span></div></div>
      </div>
    </div>
    <div class="zap rv" aria-label="Exemplo de conversa real de uma concessionária atendida pelo agente">
      <div class="zap-top"><span class="zap-av">AG</span><div><b>Atendimento · Vendas</b><small>online</small></div></div>
      <div class="zap-corpo">%s</div>
    </div>
  </div>
</section>''' % (cab('O agente em ação', 'É exatamente isto que <span class="g">o seu cliente recebe.</span>',
                     'Uma conversa de uma concessionária às 22h47 de um sábado. Sem ninguém de plantão.'),
                 ''.join('<div class="msg %s">%s<span class="h">%s</span></div>' % m for m in CONVERSA))

BLOCO_SEGMENTOS = '''
<section style="padding-top:0">
  <div class="wrap">
    %s
    <div class="segmentos">%s</div>
  </div>
</section>''' % (cab('Já treinado para o seu mercado', 'Quatro segmentos. <span class="g">Quatro agentes especialistas.</span>',
                     'Um agente genérico faz perguntas genéricas. O seu já sabe o que perguntar — e com quais sistemas conversar.'),
                 ''.join('<a class="segmento rv%s" href="/%s/" style="--sv:%s"><div class="img"><img src="%s" width="1280" height="853" loading="lazy" alt="Tela da plataforma para %s"></div>'
                         '<div class="txt"><span class="rotulo">%s</span><h3>%s</h3><p>%s</p><span class="ir">Ver a solução →</span></div></a>'
                         % ((' d%d' % (i % 2)) if i % 2 else '', slug, cor, c['tela'], c['nome'].lower(), c['nome'], sem_tags(c['h1'][0] + ' ' + c['h1'][1]),
                            {'clinicas': 'Agenda, convênio, confirmação e triagem — direto no sistema da clínica.',
                             'escolas': 'Captação, visita guiada e rematrícula — antes do pico da temporada.',
                             'imoveis': 'Portais, intenção, orçamento e visita — só quando vale a viagem.',
                             'autos': 'Estoque, troca, financiamento e test-drive — antes do concorrente.'}[slug])
                         for i, (slug, c, cor) in enumerate(SEGMENTOS)))

AGENTES = [
    ('hero', {'migalha': '<a href="/">Início</a> · Plataformas', 'rotulo': 'Plataforma de atendimento com IA',
              'h1': ('Atende, qualifica e agenda.', 'Enquanto sua equipe dorme.'),
              'lead': 'Agentes de IA no WhatsApp que entendem a conversa como ela foi escrita, <strong>executam tarefas nos seus sistemas</strong> — agenda, CRM, estoque — e passam para a equipe só o que precisa de uma pessoa.',
              'cta': 'Ver funcionando em 15 min',
              'specs': [('&lt;3s', 'para responder'), ('1M+', 'mensagens processadas'), ('+50', 'empresas em produção')],
              'tela': '/image/produto-clinicas.jpg', 'tela_alt': 'Tela real da plataforma de atendimento AutoGenius: caixa de conversas, agenda e CRM',
              'fluts': [('✓', 'Consulta agendada', '22:47 · sem ninguém de plantão'), ('↗', 'Lead qualificado', 'enviado ao CRM com o histórico'), ('3s', 'Tempo de resposta', 'a qualquer hora do dia')]}),
    ('faixa', ['Atende', 'Qualifica', 'Agenda', 'Confirma', 'Retoma', 'Registra']),
    ('html', BLOCO_CONVERSA),
    ('caps', {'id': 'capacidades', 'rotulo': 'Não é chatbot', 'h2': 'Um agente que <span class="g">executa.</span>',
              'lead': 'Chatbot segue menu. O agente entende, decide e faz — dentro das regras que a sua empresa definir.',
              'caps': [('Responde em segundos, 24/7', 'WhatsApp, Instagram e portais. A qualquer hora, sem fila — inclusive feriado e madrugada.'),
                       ('Entende como as pessoas escrevem', 'Áudio, gíria, erro de digitação, mensagem picada. Ele lê a conversa como ela vem.'),
                       ('Qualifica sem formulário', 'Faz as perguntas que o seu melhor vendedor faria, no tempo certo, sem afastar o cliente.'),
                       ('Agenda, confirma e remarca', 'Direto na sua agenda ou sistema — e lembra o cliente na véspera.'),
                       ('Retoma quem sumiu', 'Proposta sem resposta, orçamento esquecido, retorno vencido: ele volta no momento certo.'),
                       ('Passa para a equipe com o histórico', 'Quando o assunto sai das regras, transfere para uma pessoa com a conversa inteira.')],
              'integra': ['RD Station', 'HubSpot', 'Kommo', 'Pipedrive', 'Google Agenda', 'Feegow', 'Syonet', 'Vista CRM', 'Sponte', 'WhatsApp Business API']}),
    ('html', BLOCO_SEGMENTOS),
    ('numeros', [('+50', 'empresas com agentes em produção'), ('1M+', 'mensagens processadas'), ('+90%', 'consultas confirmadas · Laser Dream'), ('+8h', 'livres por dia · Olore Parfum')]),
    ('passos', {'rotulo': 'Como funciona', 'h2': 'No ar em <span class="g">7 dias.</span>',
                'lead': 'Sua parte é uma conversa de 15 minutos. O resto é com a gente.',
                'passos': [('Diagnóstico', 'Olhamos o seu WhatsApp e mostramos, com as suas próprias conversas, quantos contatos ficaram sem resposta e quanto tempo os outros esperaram.'),
                           ('Implantação', 'Treinamos o agente com os seus serviços, regras e jeito de falar, e conectamos agenda, CRM e sistemas.'),
                           ('No ar e evoluindo', 'Ele assume o plantão; nós acompanhamos as conversas e ajustamos o treinamento toda semana.')]}),
    ('faq', [('Qual a diferença entre chatbot e agente de IA?', 'O chatbot segue um roteiro fixo de perguntas e respostas. O agente entende a conversa em linguagem natural e executa tarefas em sistemas reais, como agendar, consultar estoque e registrar no CRM.'),
             ('A IA entende áudio e erro de digitação?', 'Sim. Ela transcreve áudios em segundos e entende gírias, erros e mensagens picadas, como uma pessoa faria.'),
             ('E se a IA não souber responder?', 'Ela não inventa. Quando o assunto sai das regras definidas, transfere para a equipe com todo o histórico da conversa.'),
             ('Integra com o meu sistema?', 'Conectamos por API e webhooks com os principais CRMs e agendas. Se o seu não estiver na lista, avaliamos a integração no diagnóstico.'),
             ('Meus dados e os dos meus clientes estão seguros?', 'As conversas são criptografadas e o tratamento segue a LGPD. Os dados dos seus clientes não são revendidos nem compartilhados.'),
             ('Quanto tempo leva para entrar no ar?', 'Em média 7 dias úteis, dependendo das integrações.')]),
    ('final', {'rotulo': 'Comece hoje', 'h2': 'Nenhum cliente sem resposta. <span class="g">A qualquer hora.</span>',
               'lead': 'Em 15 minutos você vê o agente atendendo com o cenário da sua empresa — sem compromisso e sem apresentação de slides.',
               'cta': 'Ver funcionando em 15 min'}),
]


# ─────────────────────────────── Ads AI ───────────────────────────────

CSS_ADS = '''<style>
.console{position:relative;border-radius:22px;background:linear-gradient(180deg,rgba(15,19,31,.9),rgba(7,9,15,.95));
  border:1px solid rgba(94,166,255,.2);box-shadow:0 50px 120px -30px rgba(0,0,0,.85),0 0 90px -20px rgba(31,91,255,.4);overflow:hidden}
.console::before{content:"";position:absolute;inset:-1px;border-radius:inherit;padding:1px;pointer-events:none;
  background:linear-gradient(140deg,rgba(31,91,255,.75),transparent 32%,transparent 66%,rgba(25,211,245,.6));
  -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude}
.c-top{display:flex;align-items:center;gap:10px;padding:14px 18px;border-bottom:1px solid var(--linha)}
.c-titulo{font-family:var(--mono);font-size:.68rem;letter-spacing:.08em;color:var(--tx-2);text-transform:uppercase}
.c-vivo{margin-left:auto;display:flex;align-items:center;gap:7px;font-family:var(--mono);font-size:.64rem;letter-spacing:.1em;color:#5EEAD4}
.c-vivo::before{content:"";width:7px;height:7px;border-radius:50%;background:#2DD4BF;box-shadow:0 0 10px #2DD4BF;animation:pulsa 1.6s infinite}
.c-kpis{display:grid;grid-template-columns:repeat(3,1fr);border-bottom:1px solid var(--linha)}
.c-kpi{padding:15px 18px}
.c-kpi + .c-kpi{border-left:1px solid var(--linha)}
.c-kpi small{display:block;font-family:var(--mono);font-size:.58rem;letter-spacing:.1em;text-transform:uppercase;color:var(--tx-3)}
.c-kpi b{display:block;font-family:var(--disp);font-weight:700;font-size:1.45rem;letter-spacing:-.04em;margin-top:4px}
.c-kpi em{font-style:normal;font-family:var(--mono);font-size:.7rem;color:#F87171;margin-left:6px}
.c-chart{padding:14px 16px 4px}
.c-chart svg{width:100%;height:auto;overflow:visible}
.linha-res{fill:none;stroke:url(#gfio);stroke-width:3;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:600;stroke-dashoffset:600;animation:desenhaL 2.4s .6s var(--ease) forwards}
@keyframes desenhaL{to{stroke-dashoffset:0}}
.alvo{opacity:0;animation:aparece .5s 2.8s forwards}
@keyframes aparece{to{opacity:1}}
.alvo-anel{transform-box:fill-box;transform-origin:center;animation:anel 1.8s ease-out infinite}
@keyframes anel{0%{transform:scale(.6);opacity:.9}100%{transform:scale(2.4);opacity:0}}
.c-feed{list-style:none;padding:4px 18px 14px;min-height:200px}
.c-feed li{display:grid;grid-template-columns:auto 1fr;gap:12px;padding:11px 0;border-top:1px solid var(--linha);animation:entraF .5s var(--ease)}
.c-feed li:first-child{border-top:0}
@keyframes entraF{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}
.c-feed .tag{font-family:var(--mono);font-size:.56rem;letter-spacing:.08em;text-transform:uppercase;border-radius:6px;padding:3px 7px;align-self:start;margin-top:2px;white-space:nowrap}
.tag.an{color:#9CC4FF;border:1px solid rgba(94,166,255,.35)}
.tag.al{color:#FCA5A5;border:1px solid rgba(248,113,113,.35)}
.tag.ac{color:#FDE68A;border:1px solid rgba(251,191,36,.35)}
.tag.op{color:#86EFAC;border:1px solid rgba(134,239,172,.35)}
.c-feed p{font-size:13.6px;line-height:1.45;color:var(--tx)}
.c-feed small{display:block;font-size:12.2px;color:var(--tx-3);margin-top:2px}
.c-nota{font-family:var(--mono);font-size:.58rem;letter-spacing:.08em;color:var(--tx-3);text-align:right;padding:0 18px 12px;text-transform:uppercase}
.aut{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:clamp(36px,6vw,96px);align-items:center}
.fontes{display:grid;gap:12px}
.fonte{display:grid;grid-template-columns:auto 1fr;gap:16px;align-items:center;padding:20px 22px;border:1px solid var(--linha);border-radius:18px}
.fonte .n{font-family:var(--mono);font-size:.7rem;color:var(--acc);border:1px solid rgba(94,166,255,.35);border-radius:8px;padding:5px 8px}
.fonte h3{font-size:1.02rem}
.fonte p{font-size:14.5px;margin-top:3px}
.decisao{text-align:center;padding:20px;border-radius:18px;background:var(--marca);color:#fff}
.decisao b{font-family:var(--disp);font-size:1.15rem;letter-spacing:-.02em}
.decisao small{display:block;font-family:var(--mono);font-size:.62rem;letter-spacing:.1em;opacity:.85;margin-top:4px}
.citacao{margin-top:30px;padding:24px 26px;border-left:2px solid var(--acc);background:rgba(255,255,255,.02);border-radius:0 16px 16px 0}
.citacao p{font-family:var(--disp);font-weight:600;font-size:clamp(20px,2vw,26px);letter-spacing:-.03em;line-height:1.3;color:var(--tx)}
.combo{display:grid;grid-template-columns:1fr auto 1fr;gap:16px;align-items:stretch}
.combo-card{padding:30px 28px;border:1px solid var(--linha);border-radius:22px;display:flex;flex-direction:column}
.combo-card h3{font-size:1.4rem;margin:14px 0 8px}
.combo-card p{font-size:15px;margin-bottom:20px}
.combo-card a{margin-top:auto;font-weight:600;color:var(--acc)}
.combo-seta{display:grid;place-items:center;font-size:1.6rem;color:var(--acc)}
.regras{display:flex;flex-wrap:wrap;gap:8px;margin-top:22px}
.regras span{font-family:var(--mono);font-size:.68rem;color:var(--tx-2);padding:8px 12px;border-radius:10px;border:1px solid var(--linha-2)}
.regras b{color:var(--ciano);font-weight:500}
@media(max-width:1020px){.aut{grid-template-columns:1fr}.combo{grid-template-columns:1fr}.combo-seta{transform:rotate(90deg)}}
@media(max-width:700px){.c-kpis{grid-template-columns:1fr 1fr}.c-kpi:nth-child(3){display:none}}
@media(prefers-reduced-motion:reduce){.linha-res{stroke-dashoffset:0;animation:none}.alvo{opacity:1;animation:none}}
</style>'''

CONSOLE_ADS = '''<div class="console entra" style="animation-delay:.35s" aria-label="Exemplo ilustrativo do painel da AutoGenius Ads AI analisando uma conta de anúncios">
      <div class="c-top"><span class="c-titulo">Ads AI · conta Meta Ads</span><span class="c-vivo">analisando</span></div>
      <div class="c-kpis">
        <div class="c-kpi"><small>Investido · 7 dias</small><b>R$ 8.960</b></div>
        <div class="c-kpi"><small>Custo por lead</small><b>R$ 31<em>▲ 47%</em></b></div>
        <div class="c-kpi"><small>Campanhas</small><b>14</b></div>
      </div>
      <div class="c-chart" aria-hidden="true">
        <svg viewBox="0 0 400 130">
          <g stroke="rgba(255,255,255,.05)"><path d="M0 30h400M0 70h400M0 110h400"/></g>
          <g fill="rgba(148,163,184,.16)">
            <rect x="14" y="78" width="34" height="42" rx="4"/><rect x="70" y="76" width="34" height="44" rx="4"/><rect x="126" y="79" width="34" height="41" rx="4"/>
            <rect x="182" y="77" width="34" height="43" rx="4"/><rect x="238" y="78" width="34" height="42" rx="4"/><rect x="294" y="76" width="34" height="44" rx="4"/><rect x="350" y="78" width="34" height="42" rx="4"/>
          </g>
          <path class="linha-res" d="M31 34L87 28L143 32L199 24L255 52L311 82L367 96"/>
          <g class="alvo">
            <circle class="alvo-anel" cx="255" cy="52" r="7" fill="none" stroke="#FBBF24" stroke-width="2"/>
            <circle cx="255" cy="52" r="5" fill="#FBBF24"/>
            <rect x="192" y="4" width="126" height="22" rx="11" fill="rgba(245,158,11,.14)" stroke="rgba(251,191,36,.45)"/>
            <text x="255" y="19" text-anchor="middle" fill="#FDE68A" font-family="Geist Mono, monospace" font-size="9" letter-spacing=".6">IA DETECTOU AQUI</text>
          </g>
        </svg>
      </div>
      <ul class="c-feed"></ul>
      <div class="c-nota">Exemplo ilustrativo</div>
    </div>'''

JS_ADS = '''<script>
(function () {
  var feed = document.querySelector('.c-feed'); if (!feed) return;
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var EV = [['an','Análise','14 campanhas, 41 conjuntos e 126 anúncios revisados.',''],
            ['al','Alerta','“Remarketing · Carrossel”: custo por lead subiu 47% em 3 dias.','Frequência em 4,8 — o público está saturado.'],
            ['ac','Ação','Orçamento do conjunto reduzido em 20%.','Dentro da regra: até 20% por dia sem aprovação.'],
            ['op','Oportunidade','“Vídeo 15s · Semelhante” com lead 32% mais barato.','Sugestão: +15% de orçamento. Aguardando aprovação.'],
            ['an','Relatório','Resumo do dia enviado no seu WhatsApp.','']];
  function item(e){var li=document.createElement('li');var t=document.createElement('span');t.className='tag '+e[0];t.textContent=e[1];
    var d=document.createElement('div');var p=document.createElement('p');p.textContent=e[2];d.appendChild(p);
    if(e[3]){var s=document.createElement('small');s.textContent=e[3];d.appendChild(s);} li.appendChild(t);li.appendChild(d);return li;}
  if (calm) { EV.slice(0,3).forEach(function(e){feed.appendChild(item(e));}); return; }
  var i=0; function prox(){ if(i===0) feed.replaceChildren(); feed.insertBefore(item(EV[i]),feed.firstChild);
    while(feed.children.length>3) feed.removeChild(feed.lastChild); i=(i+1)%EV.length; setTimeout(prox, i===0?4200:2300); }
  setTimeout(prox, 1600);
})();
</script>'''

ADS = [
    ('hero', {'migalha': '<a href="/">Início</a> · Plataformas', 'rotulo': 'AutoGenius Ads AI · IA para tráfego pago',
              'h1': ('Seu tráfego pago não precisa depender', 'de um gestor.'),
              'lead': 'Uma IA acompanhando suas campanhas de Meta Ads <strong>todos os dias</strong>, analisando performance, identificando desperdícios e otimizando dentro das regras da sua empresa.',
              'cta': 'Quero ver na minha conta',
              'specs': [('Diário', 'monitoramento'), ('Imediato', 'alerta'), ('Suas regras', 'otimização')],
              'lado_html': CONSOLE_ADS}),
    ('html', '''
<section class="claro">
  <div class="wrap">
    %s
    <ol class="perguntas">
      <li class="rv"><span>Seu gestor realmente está olhando suas campanhas todos os dias?</span></li>
      <li class="rv"><span>Ele percebe na hora quando uma campanha começa a desperdiçar dinheiro?</span></li>
      <li class="rv"><span>Você sabe exatamente por que uma campanha está indo bem ou mal?</span></li>
      <li class="rv"><span>Ou você só descobre tudo quando recebe o relatório?</span></li>
    </ol>
  </div>
</section>''' % cab('Seja sincero', 'Quem está olhando para <span class="g">o seu dinheiro hoje?</span>')),
    ('html', '''
<section>
  <div class="wrap">
    %s
    <div class="semana rv">
      <div class="sem-head"><span></span><span>SEG</span><span>TER</span><span>QUA</span><span>QUI</span><span>SEX</span><span>SÁB</span><span>DOM</span></div>
      <div class="sem-row"><b>Gestão periódica<small>análise quando dá tempo</small></b>
        <div class="cel gasto">gastou</div><div class="cel gasto">gastou</div><div class="cel gasto">cansou</div><div class="cel gasto">gastou</div><div class="cel gasto">gastou</div><div class="cel gasto">gastou</div><div class="cel tarde">relatório</div></div>
      <div class="sem-row"><b>AutoGenius Ads AI<small>análise todo dia</small></b>
        <div class="cel olhou">analisou</div><div class="cel olhou">analisou</div><div class="cel alerta">alertou</div><div class="cel olhou">ajustou</div><div class="cel olhou">analisou</div><div class="cel olhou">analisou</div><div class="cel olhou">resumo</div></div>
      <div class="sem-conc">
        <div class="ruim"><b>4 dias pagando por uma campanha cansada</b> até alguém abrir o painel. O diagnóstico chega certo — só que atrasado.</div>
        <div class="bom"><b>Percebido no mesmo dia.</b> Alerta na quarta, ajuste dentro das suas regras na quinta e o motivo registrado no histórico.</div>
      </div>
    </div>
  </div>
</section>''' % cab('O que acontece hoje', 'O dinheiro sai todo dia. <span class="g">A análise, não.</span>',
                    'A plataforma cobra por dia; a maioria das análises acontece por semana. Veja a mesma semana de uma campanha que começou a cansar na quarta.')),
    ('caps', {'id': 'como', 'rotulo': 'O que a Ads AI faz', 'h2': 'Uma camada de inteligência <span class="g">permanente sobre a sua mídia.</span>',
              'lead': 'Ela não substitui a sua estratégia. Ela garante que alguém esteja olhando para cada real investido — todos os dias, em todas as campanhas.',
              'caps': [('Monitoramento contínuo', 'Campanhas, conjuntos e anúncios analisados todos os dias. Nenhuma campanha passa dias sem análise.'),
                       ('Identifica desperdício', 'Público saturado, custo subindo, anúncio que gasta e não converte. Ela aponta onde o dinheiro está escapando.'),
                       ('Encontra oportunidades', 'O anúncio acima da média, o público que responde mais barato, o orçamento que merece crescer.'),
                       ('Alerta quando sai do padrão', 'Você fica sabendo quando acontece — não quando o mês fecha.'),
                       ('Relatórios que você entende', 'O que aconteceu, por que aconteceu e o que foi feito. Sem sigla e sem print de painel.'),
                       ('Otimiza dentro das suas regras', 'Você define até onde ela vai sozinha; o resto vira recomendação esperando aprovação — com histórico de cada alteração.')],
              'integra': ['Meta Ads', 'Facebook', 'Instagram', 'Relatório no WhatsApp']}),
    ('html', '''
<section style="padding-top:0">
  <!-- Confirmar antes de publicar: a base de conhecimento da IA usa de fato a documentação oficial da Meta. -->
  <div class="wrap aut">
    <div>
      %s
      <div class="citacao rv"><p>“Ela não esquece uma regra, não deixa uma campanha passar dias sem análise e não decide porque acha que algo vai funcionar. Ela analisa dados.”</p></div>
      <div class="regras rv"><span>orçamento <b>±20%%/dia</b></span><span>pausar anúncio <b>automático</b></span><span>escalar campanha <b>com aprovação</b></span></div>
    </div>
    <div class="fontes">
      <div class="fonte rv"><span class="n">01</span><div><h3>Os números reais da sua conta</h3><p>Investimento, custo por resultado, frequência, alcance e conversões.</p></div></div>
      <div class="fonte rv d1"><span class="n">02</span><div><h3>O histórico das suas campanhas</h3><p>O que já funcionou e o que já falhou no seu negócio.</p></div></div>
      <div class="fonte rv d2"><span class="n">03</span><div><h3>Documentação oficial e boas práticas</h3><p>Materiais técnicos das próprias plataformas, incluindo a documentação da Meta.</p></div></div>
      <div class="decisao rv d3"><b>Decisão baseada em dados</b><small>ALERTA · RECOMENDAÇÃO · AJUSTE REGISTRADO</small></div>
    </div>
  </div>
</section>''' % cab('Não é achismo', 'Dados da sua conta + <span class="g">documentação oficial.</span>',
                    'Enquanto muitos profissionais trabalham apenas com experiência acumulada, a IA cruza os dados da sua conta com conhecimento técnico e documentação oficial das plataformas.')),
    ('html', '''
<section style="padding-top:0">
  <div class="wrap">
    %s
    <div class="vs-wrap rv">
      <div class="vs velho"><span class="rotulo">Como costuma ser</span><h3>Gestão tradicional</h3><ul>
        <li><i>·</i>Uma pessoa</li><li><i>·</i>Horário limitado</li><li><i>·</i>Análise periódica</li><li><i>·</i>Depende da experiência individual</li><li><i>·</i>Relatórios manuais</li><li><i>·</i>Atenção dividida entre várias contas</li></ul></div>
      <div class="vs novo"><span class="rotulo">Com a IA</span><h3>AutoGenius Ads AI</h3><ul>
        <li><i>✓</i>Monitoramento contínuo</li><li><i>✓</i>Análise automática</li><li><i>✓</i>Alertas imediatos</li><li><i>✓</i>Conhecimento técnico estruturado</li><li><i>✓</i>Relatórios automáticos</li><li><i>✓</i>Analisa grandes volumes de dados ao mesmo tempo</li></ul></div>
    </div>
    <p class="lead rv" style="margin-top:26px;max-width:80ch"><strong>Isso não é contra gestor de tráfego.</strong> A IA elimina grande parte do trabalho operacional e reduz a dependência exclusiva de uma pessoa. Se você tem gestor, ele passa a trabalhar com mais dado e menos planilha.</p>
  </div>
</section>''' % cab('Lado a lado', 'O limite nunca foi a competência. <span class="g">É o tempo.</span>')),
    ('html', '''
<section class="claro">
  <div class="wrap">
    %s
    <div class="chips9">
      <div class="rv"><i>✓</i>Menos dependência de gestor de tráfego</div><div class="rv d1"><i>✓</i>Monitoramento contínuo</div><div class="rv d2"><i>✓</i>Menos dinheiro desperdiçado sem perceber</div>
      <div class="rv"><i>✓</i>Relatórios fáceis de entender</div><div class="rv d1"><i>✓</i>Decisões baseadas em dados</div><div class="rv d2"><i>✓</i>Alertas quando algo sai do padrão</div>
      <div class="rv"><i>✓</i>Otimizações muito mais rápidas</div><div class="rv d1"><i>✓</i>Controle sobre orçamento e ações</div><div class="rv d2"><i>✓</i>Histórico do que mudou e por quê</div>
    </div>
    <p class="impacto rv">Não é mais contratar alguém e <span class="g">torcer para ele ser bom.</span></p>
  </div>
</section>''' % cab('Por que um empresário usaria isso?', 'Porque o dinheiro investido <span class="g">é seu.</span>')),
    ('html', '''
<section>
  <div class="wrap">
    %s
    <div class="combo">
      <div class="combo-card rv"><span class="rotulo">AutoGenius Ads AI</span><h3>Cuida da inteligência sobre os anúncios</h3><p>Acompanha, analisa e otimiza as campanhas para trazer mais lead pelo mesmo investimento.</p><a href="#como">Como funciona →</a></div>
      <div class="combo-seta" aria-hidden="true">→</div>
      <div class="combo-card rv d1"><span class="rotulo">Agentes de atendimento</span><h3>Atende, qualifica e acompanha os leads</h3><p>Responde em segundos, 24 horas por dia, faz follow-up e agenda — nenhum lead pago esfria sem resposta.</p><a href="/agentes-de-atendimento/">Conhecer os agentes →</a></div>
    </div>
  </div>
</section>''' % cab('Tráfego + atendimento', 'Da campanha até a conversa <span class="g">com o cliente.</span>')),
    ('faq', [('A IA substitui o meu gestor de tráfego?', 'Ela assume grande parte do trabalho operacional — acompanhar, analisar, alertar, reportar e fazer os ajustes de rotina. Se você tem gestor, ele continua na estratégia e nos criativos, com muito mais informação na mão.'),
             ('Ela vai mexer na minha conta sem eu saber?', 'Não. Você define as regras: quanto o orçamento pode variar, quais ações ela executa sozinha e o que precisa da sua aprovação. Se preferir, ela funciona só alertando e recomendando. Toda alteração fica registrada com o motivo.'),
             ('Quais plataformas ela acompanha?', 'Campanhas de Meta Ads (Facebook e Instagram). Se você investe em outras plataformas, avaliamos o seu cenário na conversa de diagnóstico.'),
             ('Preciso entender de tráfego pago para usar?', 'Não. Os relatórios e alertas explicam o que aconteceu, por que aconteceu e o que foi feito, em linguagem de empresário.'),
             ('Quanto custa?', 'Depende do volume de investimento e do número de contas. Na conversa de diagnóstico olhamos a sua conta e apresentamos o valor junto do que já dá para enxergar de desperdício.')]),
    ('final', {'rotulo': 'Comece hoje', 'h2': 'Seu dinheiro trabalha todos os dias. <span class="g">Sua análise também deveria.</span>',
               'lead': 'Mande uma mensagem e veja o que a IA enxerga na sua conta de anúncios.', 'cta': 'Quero ver na minha conta'}),
]


# ═══════════════════════════════ Saída ═══════════════════════════════

def schemas(slug, titulo, descricao, faqs, servico):
    url = '%s/%s/' % (SITE, slug)
    blocos = [
        {"@context": "https://schema.org", "@type": "Service", "name": servico, "description": descricao, "url": url, "areaServed": "BR",
         "provider": {"@type": "Organization", "name": "AutoGenius", "legalName": "Auto Genius Soluções Inteligentes Ltda", "url": SITE + "/"}},
        {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Início", "item": SITE + "/"},
            {"@type": "ListItem", "position": 2, "name": titulo, "item": url}]},
    ]
    if faqs:
        blocos.append({"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
            {"@type": "Question", "name": sem_tags(q), "acceptedAnswer": {"@type": "Answer", "text": sem_tags(a)}} for q, a in faqs]})
    return '\n'.join('<script type="application/ld+json">%s</script>' % json.dumps(b, ensure_ascii=False) for b in blocos)


def faqs_de(secoes):
    for t, d in secoes:
        if t == 'faq':
            return d
    return []


def escrever(slug, secoes, *, title, description, og_title, servico, cor='#5EA6FF', assunto='atendimento', segmento='', cta_curto='Ver funcionando',
             css_extra='', js_extra=''):
    html = MOLDE.format(
        title=esc(title), description=esc(description), og_title=esc(og_title), url='%s/%s/' % (SITE, slug), site=SITE,
        schemas=schemas(slug, servico, description, faqs_de(secoes), servico), cor=cor, assunto=assunto,
        segmento_attr=(' data-segmento="%s"' % segmento) if segmento else '',
        atual_agentes=' aria-current="page"' if slug == 'agentes-de-atendimento' else '',
        atual_trafego=' aria-current="page"' if slug == 'ia-trafego-pago' else '',
        cta_curto=cta_curto, conteudo=montar(secoes), css_extra=css_extra, js_extra=js_extra)
    destino = RAIZ / slug
    destino.mkdir(exist_ok=True)
    (destino / 'index.html').write_text(html, encoding='utf-8')
    print('ok', slug, len(html) // 1024, 'KB')


if __name__ == '__main__':
    TEXTOS = {
        'clinicas': ('AutoGenius para Clínicas — a recepção que não fecha às 18h', 'Agente de IA no WhatsApp da clínica: tira dúvidas, agenda direto no sistema, confirma consultas e faz triagem de convênio, 24 horas por dia.', 'Agente de IA para clínicas'),
        'escolas': ('AutoGenius para Escolas — a secretaria que atende na hora da decisão', 'Agente de IA no WhatsApp da escola: responde famílias à noite, qualifica, agenda visitas e puxa a rematrícula, 24 horas por dia.', 'Agente de IA para escolas'),
        'imoveis': ('AutoGenius para Imobiliárias — o plantão que atende domingo de manhã', 'Agente de IA no WhatsApp da imobiliária: responde os portais em segundos, qualifica intenção e orçamento e agenda visitas que valem a viagem.', 'Agente de IA para imobiliárias'),
        'autos': ('AutoGenius para Concessionárias — o vendedor que não sai do plantão', 'Agente de IA no WhatsApp da loja: responde leads em segundos, avalia a troca, simula financiamento e agenda test-drive, 24 horas por dia.', 'Agente de IA para concessionárias'),
    }
    for slug, dados, cor in SEGMENTOS:
        t = TEXTOS[slug]
        escrever(slug, pagina_segmento(dados), title=t[0], description=t[1], og_title=t[0], servico=t[2], cor=cor,
                 assunto='atendimento', segmento=dados['nome'], cta_curto='Ver funcionando')
    escrever('agentes-de-atendimento', AGENTES,
             title='Agentes de IA para atendimento no WhatsApp — AutoGenius',
             description='Agentes de IA que atendem, qualificam, agendam e fazem follow-up no WhatsApp, integrados ao seu CRM e à sua agenda. +50 empresas em produção.',
             og_title='AutoGenius — Agentes de IA que atendem, qualificam e agendam', servico='Agentes de IA para atendimento', cta_curto='Ver funcionando')
    escrever('ia-trafego-pago', ADS,
             title='AutoGenius Ads AI — IA para gestão de tráfego pago e Meta Ads',
             description='Seu tráfego pago não precisa depender de um gestor. Uma IA que acompanha suas campanhas de Meta Ads todos os dias, identifica desperdícios, alerta e otimiza dentro das regras da sua empresa.',
             og_title='AutoGenius Ads AI — Seu tráfego pago não precisa depender de um gestor', servico='AutoGenius Ads AI',
             assunto='trafego', cta_curto='Ver na minha conta', css_extra=CSS_ADS, js_extra=JS_ADS)
