document.addEventListener('DOMContentLoaded', () => {

    const siteData = {
        plans: [
            { key: 'essencial', name: 'Gênio Essencial', price: 490, setup: 699, tagline: 'Para quem não pode ficar sem atendimento. Autônomos, barbearias pequenas, consultórios solo.', icon: 'fa-play', category: 'essencial', features: { 'Atendimento 24/7': true, 'Respostas Básicas': true, 'Coleta de Leads': true, 'Agendas': '1 agenda/profissional', 'Atendimentos': '1.500/mês', 'Agendamento': false, 'Follow-up': false, 'Cobrança': false, 'Análise de Sentimento': false, 'Dashboard Estratégico': false, 'Pipeline de Vendas': false, 'Integrações Complexas': false, 'SLA Dedicado': false } },
            { key: 'avancado', name: 'Gênio Avançado', price: 690, setup: 1200, tagline: 'Para quem já saiu do básico. Clínicas pequenas (2–3 dentistas), corretoras enxutas, escritórios com poucos profissionais.', icon: 'fa-arrow-up', category: 'essencial', features: { 'Atendimento 24/7': true, 'Respostas Básicas': true, 'Coleta de Leads': true, 'Agendas': '2 agendas/profissionais', 'Atendimentos': '2.500/mês', 'Agendamento': true, 'Follow-up': false, 'Cobrança': false, 'Análise de Sentimento': false, 'Dashboard Estratégico': false, 'Pipeline de Vendas': false, 'Integrações Complexas': false, 'SLA Dedicado': false } },
            { key: 'performance', name: 'Gênio Performance', price: 990, setup: 1800, tagline: 'Para negócios que valorizam relacionamento. Clínicas pequenas (3–5 dentistas), escritórios boutique, corretoras em expansão.', icon: 'fa-star', category: 'execucao', popular: true, features: { 'Atendimento 24/7': true, 'Respostas Básicas': true, 'Coleta de Leads': true, 'Agendas': '5 agendas/profissionais', 'Atendimentos': '4.000/mês', 'Agendamento': true, 'Follow-up': true, 'Cobrança': false, 'Análise de Sentimento': false, 'Dashboard Estratégico': false, 'Pipeline de Vendas': false, 'Integrações Complexas': false, 'SLA Dedicado': false } },
            { key: 'premium', name: 'Gênio Premium', price: 1490, setup: 2500, tagline: 'Para quem não aceita perder dinheiro. Clínicas médias (6–10 dentistas), corretoras com time, escritórios estruturados.', icon: 'fa-rocket', category: 'execucao', features: { 'Atendimento 24/7': true, 'Respostas Básicas': true, 'Coleta de Leads': true, 'Agendas': '10 agendas/profissionais', 'Atendimentos': '8.000/mês', 'Agendamento': true, 'Follow-up': true, 'Cobrança': true, 'Análise de Sentimento': false, 'Dashboard Estratégico': false, 'Pipeline de Vendas': false, 'Integrações Complexas': false, 'SLA Dedicado': false } },
            { key: 'elite', name: 'Gênio Elite', price: 2490, setup: 3500, tagline: 'Para quem lidera no mercado. Clínicas grandes (11–15 dentistas), escritórios regionais, corretoras de alto padrão.', icon: 'fa-crown', category: 'estrategico', features: { 'Atendimento 24/7': true, 'Respostas Básicas': true, 'Coleta de Leads': true, 'Agendas': '15 agendas/profissionais', 'Atendimentos': '15.000/mês', 'Agendamento': true, 'Follow-up': true, 'Cobrança': true, 'Análise de Sentimento': true, 'Dashboard Estratégico': true, 'Pipeline de Vendas': true, 'Integrações Complexas': false, 'SLA Dedicado': false } },
            { key: 'enterprise', name: 'Gênio Enterprise', price: 'Sob Consulta', setup: 'A partir de R$ 14.900', tagline: 'Para quem comanda o jogo. Redes, hospitais, franquias, grandes grupos corporativos.', icon: 'fa-building', category: 'estrategico', features: { 'Atendimento 24/7': true, 'Respostas Básicas': true, 'Coleta de Leads': true, 'Agendas': 'Sem limites', 'Atendimentos': 'Sem limites', 'Agendamento': true, 'Follow-up': true, 'Cobrança': true, 'Análise de Sentimento': true, 'Dashboard Estratégico': true, 'Pipeline de Vendas': true, 'Integrações Complexas': true, 'SLA Dedicado': true } }
        ],
        feature_list: ['Atendimento 24/7', 'Respostas Básicas', 'Coleta de Leads', 'Agendas', 'Atendimentos', 'Agendamento', 'Follow-up', 'Cobrança', 'Análise de Sentimento', 'Dashboard Estratégico', 'Pipeline de Vendas', 'Integrações Complexas', 'SLA Dedicado'],
        cases: [
            { niche_key: 'saude', title: 'Agenda lotada, sem o caos de antes.', niche: 'Clínica de Estética', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2070&auto=format&fit=crop', challenge: 'Sofia, dona de uma clínica em expansão, via suas duas recepcionistas sobrecarregadas com o fluxo de agendamentos, confirmações e reagendamentos via WhatsApp, resultando em erros e pacientes esperando.', results: [{ value: 20, label: 'economizadas por semana', prefix: '+', suffix: 'h' }, { value: 85, label: 'em faltas (no-show)', prefix: '-', suffix: '%' }, { value: 15, label: 'em novos agendamentos', prefix: '+', suffix: '%' }], quote: '"Com o Gênio Executor, nossa agenda roda sozinha. As recepcionistas agora focam em dar uma experiência incrível para quem está na clínica. A automação não tirou o toque humano, ela o potencializou."', author: 'Sofia L., Fundadora', color: 'purple-400', reverse: false },
            { niche_key: 'imobiliario', title: 'Leads qualificados em segundos, não em horas.', niche: 'Imobiliária de Alto Padrão', image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973&auto=format&fit=crop', challenge: 'Ricardo, corretor associado, via leads de anúncios caros "esfriarem" pela demora no primeiro contato. A equipe não conseguia responder a todos com a velocidade e personalização necessárias.', results: [{ value: 4, label: 'mais rápido no 1º contato', prefix: '', suffix: 'x' }, { value: 30, label: 'em visitas agendadas', prefix: '+', suffix: '%' }, { value: 100, label: 'dos leads registrados', prefix: '', suffix: '%' }], quote: '"O Gênio Vendedor mudou o jogo. O Agente qualifica o lead no Instagram e WhatsApp, e já o direciona para o corretor certo com as informações certas. Agora, a conversa com o cliente já começa quente."', author: 'Ricardo G., Corretor Associado', color: 'cyan-400', reverse: true },
            { niche_key: 'ecommerce', title: 'Carrinhos abandonados viraram vendas.', niche: 'E-commerce de Moda', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop', challenge: 'Juliana, gerente de um e-commerce, investia em tráfego, mas via uma alta taxa de abandono de carrinho. O suporte via WhatsApp não dava conta de responder dúvidas sobre tamanho, frete e tecido a tempo.', results: [{ value: 25, label: 'de recuperação de carrinhos', prefix: '+', suffix: '%' }, { value: 90, label: 'no tempo de primeira resposta', prefix: '-', suffix: '%' }, { value: 18, label: 'no faturamento mensal', prefix: '+', suffix: '%' }], quote: '"Com o Gênio Estrategista, não só respondemos dúvidas 24/7, mas entendemos os motivos do abandono. A IA nos deu dados para otimizar a loja e o atendimento. O Agente se pagou no primeiro mês."', author: 'Juliana M., Gerente de E-commerce', color: 'red-400', reverse: false },
            { niche_key: 'educacao', title: 'Matrículas no automático, equipe livre para ensinar.', niche: 'Escola de Idiomas', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop', challenge: 'Marcos, diretor de uma escola de idiomas, via sua equipe perdendo tempo com dúvidas repetitivas sobre preços, horários e metodologia, enquanto leads interessados esperavam respostas.', results: [{ value: 60, label: 'mais matrículas/mês', prefix: '+', suffix: '' }, { value: 40, label: 'no tempo de vendas', prefix: '-', suffix: '%' }, { value: 200, label: 'leads qualificados/mês', prefix: '+', suffix: '' }], quote: '"Nosso Gênio Conversador responde tudo sobre cursos, preços e horários 24h. A equipe agora foca no que importa: preparar aulas incríveis. As matrículas dispararam!"', author: 'Marcos T., Diretor Acadêmico', color: 'green-400', reverse: true },
            { niche_key: 'consultoria', title: 'Agenda de reuniões sempre cheia.', niche: 'Consultoria Empresarial', image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=1926&auto=format&fit=crop', challenge: 'Amanda, consultora especializada em gestão, gastava horas por dia apenas agendando reuniões comerciais e respondendo dúvidas básicas sobre seus serviços.', results: [{ value: 35, label: 'mais reuniões/semana', prefix: '+', suffix: '' }, { value: 80, label: 'no tempo administrativo', prefix: '-', suffix: '%' }, { value: 45, label: 'na taxa de fechamento', prefix: '+', suffix: '%' }], quote: '"Meu Gênio Executor agenda todas as reuniões, qualifica prospects e até envia propostas. Agora tenho tempo para focar no que faço melhor: resolver problemas dos clientes."', author: 'Amanda R., Consultora Sênior', color: 'orange-400', reverse: false },
            { niche_key: 'restaurante', title: 'Pedidos que nunca param de chegar.', niche: 'Rede de Restaurantes', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop', challenge: 'Carlos, proprietário de uma rede de restaurantes, via pedidos perdidos durante o rush, clientes desistindo por demora no atendimento e equipe sobrecarregada.', results: [{ value: 50, label: 'em pedidos perdidos', prefix: '-', suffix: '%' }, { value: 30, label: 'no faturamento', prefix: '+', suffix: '%' }, { value: 95, label: 'de satisfação do cliente', prefix: '', suffix: '%' }], quote: '"Nosso cardápio digital com IA processa pedidos instantaneamente. Durante o rush, é como ter 10 atendentes trabalhando simultaneamente. A operação nunca foi tão fluida!"', author: 'Carlos M., Proprietário', color: 'yellow-400', reverse: true },
            { niche_key: 'advocacia', title: 'Captação inteligente de novos clientes.', niche: 'Escritório de Advocacia', image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2070&auto=format&fit=crop', challenge: 'Dra. Patrícia, advogada especializada em direito empresarial, perdia clientes potenciais que procuravam informações fora do horário comercial, além de gastar horas triando casos.', results: [{ value: 70, label: 'em captação de leads', prefix: '+', suffix: '%' }, { value: 60, label: 'no tempo de triagem', prefix: '-', suffix: '%' }, { value: 25, label: 'novos clientes/mês', prefix: '+', suffix: '' }], quote: '"O Gênio Estrategista faz a triagem inicial dos casos e agenda consultoria apenas com prospects qualificados. Minha agenda está sempre otimizada com os melhores casos."', author: 'Dra. Patrícia S., Advogada', color: 'indigo-400', reverse: false }
        ],
        tech: [
            { title: 'IA Conversacional Avançada', description: 'Nossa IA entende gírias, erros de digitação e até áudios, proporcionando uma conversa fluida e natural que encanta seus clientes.', icon: 'fas fa-brain' },
            { title: 'Integrações por Setor', description: 'Conectamos com CRMs, ERPs, sistemas de pagamento específicos de cada área. De restaurantes a clínicas, nossa IA se integra perfeitamente.', icon: 'fas fa-puzzle-piece' },
            { title: 'Atendimento Multicanal', description: 'WhatsApp, Instagram, Facebook e site. Centralize seu atendimento em uma única plataforma inteligente.', icon: 'fas fa-comments' },
            { title: 'Pagamentos via Pix', description: 'Receba pagamentos automaticamente. O Agente gera QR Code do Pix e confirma pagamento em tempo real.', icon: 'fab fa-pix' },
            { title: 'Dashboards e Análises', description: 'Relatórios visuais sobre conversas, análise de sentimento, performance de campanhas e ROI por setor.', icon: 'fas fa-chart-bar' },
            { title: 'Personalização Total', description: 'Adaptamos a IA para cada setor: desde protocolos médicos até cardápios de restaurantes.', icon: 'fas fa-cogs' }
        ],
        faq: [{ id: 's1', category: 'servico', q: "O que é a AutoGenius AI?", a: "É uma plataforma que transforma chatbots em **Agentes de IA executores**. Em vez de apenas conversar, nossos Agentes realizam tarefas como agendamentos, vendas e análises para automatizar e escalar seu negócio." }, { id: 's2', category: 'servico', q: "A IA consegue entender áudios e erros de digitação?", a: "Sim. Nossa IA é treinada para interpretar variações de linguagem, incluindo erros de digitação comuns, gírias e até mesmo transcrever mensagens de áudio para dar continuidade ao atendimento." }, { id: 's3', category: 'servico', q: "E se a IA não souber responder algo?", a: "Nossa IA é 100% treinada com os dados que você fornece (documentos, planilhas, site). Ela não 'inventa' respostas. Se um assunto não estiver em sua base de conhecimento, ela é instruída a direcionar o cliente para um atendente humano, garantindo consistência e precisão total." }, { id: 't1', category: 'tecnico', q: "Como garantem a segurança e estabilidade do serviço?", a: "Utilizamos infraestrutura robusta e seguimos as melhores práticas de segurança. Nosso sistema é construído com redundância e monitoramento 24/7. Implementamos criptografia de dados e cumprimos rigorosamente as políticas das plataformas de mensageria." }, { id: 't2', category: 'tecnico', q: "Posso integrar com meu sistema de CRM ou planilhas?", a: "Sim. Nossos planos a partir do 'Executor' permitem integrações com as principais ferramentas do mercado. Todos os leads e dados capturados podem ser enviados automaticamente para o seu sistema." }, { id: 't3', category: 'tecnico', q: "Meus dados e os dos meus clientes estão seguros?", a: "Totalmente. Usamos criptografia de ponta a ponta e seguimos as diretrizes da LGPD. Os dados das conversas são confidenciais e acessíveis apenas por você e sua equipe autorizada." }, { id: 'p1', category: 'planos', q: "O que é o 'Crédito de Implantação'?", a: "É um valor de investimento único que cobre todo o trabalho de nossa equipe para configurar, personalizar e treinar o seu Agente de IA, além de realizar as integrações necessárias e garantir que tudo esteja funcionando perfeitamente para o seu negócio." }, { id: 'p2', category: 'planos', q: "Existem custos adicionais além da mensalidade?", a: "Não! Nosso preço é fixo e transparente. Você paga apenas a mensalidade do seu plano e o Crédito de Implantação inicial. Não há taxas por conversa ou custos escondidos." }, { id: 'p3', category: 'planos', q: "Posso cancelar o serviço a qualquer momento?", a: "Sim. Nossos planos são sem fidelidade. Você pode solicitar o cancelamento a qualquer momento, sem multas. O serviço permanecerá ativo até o final do ciclo mensal já pago." }, { id: 't4', category: 'tecnico', q: "Quanto tempo leva para configurar o agente de IA?", a: "O tempo médio de configuração e implantação é de 5 a 10 dias úteis, dependendo da complexidade do seu negócio e das integrações necessárias. Esse prazo inclui: levantamento de requisitos, treinamento do Agente com seus dados, testes de qualidade e ajustes finos. Para planos Enterprise com integrações complexas, o prazo pode ser estendido conforme alinhado em proposta." }, { id: 's4', category: 'servico', q: "A IA fala português brasileiro de forma natural?", a: "Sim, de forma totalmente natural e adaptada à sua marca. Nossos Agentes são treinados para se comunicar em português brasileiro coloquial, entendendo gírias, expressões regionais e variações do idioma. Além disso, a personalidade e o tom de voz do Agente (formal, descontraído, técnico) são configurados de acordo com a identidade do seu negócio, para que seus clientes sintam que estão conversando com a própria equipe da empresa." }, { id: 't5', category: 'tecnico', q: "Funciona no WhatsApp Business e pessoal?", a: "Nosso Agente de IA é compatível com o **WhatsApp Business** (recomendado para empresas, com recursos de catálogo, respostas automáticas e etiquetas). Para volumes maiores e integrações avançadas, utilizamos a API Oficial do WhatsApp Business, garantindo conformidade com as políticas da Meta e maior estabilidade. O uso no WhatsApp pessoal não é recomendado por questões de segurança e termos de uso da plataforma." }]
    };

    const pageContent = document.getElementById('page-content');
    const routes = { '#home': 'page-home', '#consultoria': 'page-consultoria', '#treinamentos': 'page-treinamentos', '#tecnologia': 'page-tecnologia', '#cases': 'page-cases', '#sobre': 'page-sobre', '#contato': 'page-contato', '#faq': 'page-faq', '#termos': 'page-termos', '#privacidade': 'page-privacidade' };

    // Explicitly register GSAP plugin
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    function navigate() {
        const path = window.location.hash || '#home';
        const templateId = routes[path] || 'page-home';

        if (pageContent.dataset.currentPage !== templateId) {
            const template = document.getElementById(templateId);
            if (template) {
                // Clean up only page-content ScrollTriggers to prevent memory leaks when navigating
                if (typeof ScrollTrigger !== 'undefined') {
                    ScrollTrigger.getAll().forEach(t => {
                        if (t.trigger && pageContent.contains(t.trigger)) {
                            t.kill();
                        }
                    });
                }

                pageContent.innerHTML = template.innerHTML;
                pageContent.dataset.currentPage = templateId;
                window.scrollTo(0, 0);
                runPageInitializers(templateId);

                // Highlight active nav link
                document.querySelectorAll('nav a[href^="#"]').forEach(link => {
                    const isActive = routes[link.getAttribute('href')] === templateId;
                    link.classList.toggle('text-white', isActive);
                    link.classList.toggle('border-b-2', isActive);
                    link.classList.toggle('border-brand-cyan', isActive);
                    link.classList.toggle('pb-1', isActive);
                });
            }
        }
    }

    function runPageInitializers(templateId) {
        const initFunctions = {
            'page-home': [initializeGlobe, initializeHeroParticles, initializeWhatsAppDemo, initializeQuiz, initializeROICalculator],
            'page-consultoria': [],
            'page-treinamentos': [],
            'page-tecnologia': [initializeTechPage],
            'page-cases': [initializeCasesPage],
            'page-sobre': [],
            'page-contato': [initializeContactPageForm],
            'page-faq': [initializeFAQPage],
            'page-termos': [],
            'page-privacidade': []
        };

        if (initFunctions[templateId]) {
            initFunctions[templateId].forEach(fn => fn());
        }

        if (typeof gsap !== 'undefined') {
            gsap.utils.toArray('.gsap-reveal').forEach(elem => {
                gsap.fromTo(elem, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: elem, start: "top 85%", toggleActions: "play none none none" } });
            });
        }

        initializeAnimatedCounters();
    }

    window.addEventListener('hashchange', navigate);
    document.body.addEventListener('click', e => {
        const anchor = e.target.closest('a');
        if (!anchor) return;
        const href = anchor.getAttribute('href');
        if (href && href.startsWith('#')) {
            if (routes[href] !== undefined) {
                e.preventDefault();
                window.location.hash = href;
            }
        }
    });
    const header = document.getElementById('main-header');
    ScrollTrigger.create({
        start: 'top top',
        end: 99999,
        onUpdate: self => {
            const isScrolled = self.scroll() > 10;
            header.classList.toggle('bg-gray-900/90', isScrolled);
            header.classList.toggle('backdrop-blur-md', isScrolled);
            header.classList.toggle('shadow-lg', isScrolled);

            // Maintain sticky style, just remove up/down translations so it never disappears on scroll down
            header.style.transform = 'translateY(0)';
        }
    });
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const closeMenuButton = document.getElementById('close-menu');
    let menuOpen = false;
    const toggleMenu = () => {
        menuOpen = !menuOpen;
        if (menuOpen) {
            mobileMenu.classList.remove('opacity-0', 'invisible', 'pointer-events-none');
            mobileMenu.classList.add('opacity-100');
        } else {
            mobileMenu.classList.add('opacity-0', 'invisible', 'pointer-events-none');
            mobileMenu.classList.remove('opacity-100');
        }
        mobileMenuButton.setAttribute('aria-expanded', menuOpen);
        mobileMenuButton.setAttribute('aria-label', menuOpen ? 'Fechar menu' : 'Abrir menu');
    };
    mobileMenuButton.addEventListener('click', toggleMenu);
    closeMenuButton.addEventListener('click', toggleMenu);
    mobileMenu.querySelectorAll('a').forEach(link => { if (routes[link.getAttribute('href')] !== undefined) { link.addEventListener('click', toggleMenu); } });
    const auroraContainer = document.getElementById('aurora-bg');
    const colors = ['#d946ef', '#22d3ee', '#7c3aed'];
    for (let i = 0; i < 5; i++) { const blob = document.createElement('div'); blob.classList.add('aurora-blob'); blob.style.cssText = `width: ${Math.random() * 600 + 400}px; height: ${blob.style.width}; left: ${Math.random() * 100}%; top: ${Math.random() * 100}%; background-color: ${colors[Math.floor(Math.random() * colors.length)]};`; auroraContainer.appendChild(blob); }
    gsap.to(".aurora-blob", { duration: 25, x: "random(-600, 600)", y: "random(-600, 600)", scale: "random(0.8, 1.5)", ease: "none", repeat: -1, yoyo: true });

    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }


    function initializePlansPage() {
        const tabsContainer = document.getElementById('plan-tabs'); const plansContainer = document.getElementById('plans-container'); const modal = document.getElementById('comparison-modal'); const closeModalBtn = document.getElementById('close-modal-btn'); const modalTableContainer = document.getElementById('modal-table-container'); if (!tabsContainer || !plansContainer || !modal) return;['essencial', 'execucao', 'estrategico'].forEach(category => { const tabContent = document.createElement('div'); tabContent.id = `tab-content-${category}`; tabContent.className = 'plan-tab-content grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8'; plansContainer.appendChild(tabContent); }); siteData.plans.forEach(plan => { const planCard = `<div class="glass-card rounded-2xl p-4 md:p-6 flex flex-col text-center transform hover:-translate-y-2 transition-transform duration-300 relative ${plan.popular ? 'border-2 border-purple-500 shadow-[0_0_20px_rgba(180,0,166,0.5)]' : ''}"> ${plan.popular ? '<span class="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase z-10">Mais Popular</span>' : ''} <div class="flex-grow"> <div class="plan-card-icon rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4"> <i class="fas ${plan.icon}"></i> </div> <h3 class="text-xl md:text-2xl font-bold text-white mb-2">${plan.name}</h3> <p class="text-gray-300 text-sm md:text-base mb-3 md:mb-4 leading-tight px-2">${plan.tagline}</p> <div class="plan-price-section mb-4 md:mb-6"> <div class="flex flex-col items-center mb-2"> <p class="font-bold text-2xl md:text-4xl text-white leading-none">${typeof plan.price === 'number' ? `R$ ${plan.price}` : plan.price}</p> ${typeof plan.price === 'number' ? '<p class="text-sm md:text-lg font-normal text-gray-300">/mês</p>' : '<div class="h-6"></div>'} </div> <p class="text-xs md:text-sm text-gray-500 px-2 leading-tight">Crédito de Implantação: ${typeof plan.setup === 'number' ? `R$ ${plan.setup.toLocaleString('pt-BR')}` : plan.setup}</p> </div> </div> <div class="mt-auto space-y-2 md:space-y-3"> <a href="#contato" class="w-full block gradient-bg text-white font-bold py-3 md:py-4 px-4 md:px-6 rounded-lg hover:opacity-90 transition text-sm md:text-lg shadow-lg hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] transform hover:scale-105 duration-300 relative overflow-hidden"><div class="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-500 opacity-0 hover:opacity-20 transition-opacity duration-300"></div><span class="relative z-10">🚀 Quero Este Plano</span></a> <button data-plan-key="${plan.key}" class="open-modal-btn w-full text-cyan-400 font-semibold hover:text-white transition text-sm md:text-base">Ver detalhes e comparar</button> </div> </div>`; document.getElementById(`tab-content-${plan.category}`).innerHTML += planCard; }); const tabs = tabsContainer.querySelectorAll('.plan-tab'); const tabContents = plansContainer.querySelectorAll('.plan-tab-content'); function switchTab(tabKey) { tabs.forEach(tab => tab.classList.toggle('active', tab.dataset.tab === tabKey)); tabContents.forEach(content => content.classList.toggle('active', content.id === `tab-content-${tabKey}`)); } tabs.forEach(tab => { tab.addEventListener('click', () => switchTab(tab.dataset.tab)); }); function openModal(highlightKey = null) {
            let tableHTML = '<div class="p-6"><table class="w-full comparison-table-enhanced"><thead><tr class="border-b border-gray-700"><th class="text-left p-4 text-gray-300 font-semibold">Funcionalidade</th>';
            siteData.plans.forEach(p => tableHTML += `<th id="plan-col-${p.key}" class="text-center p-4 font-semibold ${p.key === highlightKey ? 'plan-highlight-header' : 'text-gray-300'}">${p.name}<br><span class="text-sm font-normal text-gray-500">${typeof p.price === 'number' ? `R$ ${p.price}/mês` : p.price}</span></th>`);
            tableHTML += '</tr></thead><tbody>';
            siteData.feature_list.forEach((feature, index) => {
                tableHTML += `<tr class="border-b border-gray-800/50 hover:bg-gray-800/30 transition ${index % 2 === 0 ? 'bg-gray-900/20' : ''}">`;
                tableHTML += `<td class="p-4 text-gray-300 font-medium">${feature}</td>`;
                siteData.plans.forEach(p => {
                    const hasFeature = p.features[feature];
                    tableHTML += `<td class="text-center p-4 ${p.key === highlightKey ? 'plan-highlight-cell' : ''}">${hasFeature ? '<i class="fas fa-check-circle text-green-400 text-lg"></i>' : '<i class="fas fa-times-circle text-gray-600"></i>'}</td>`;
                });
                tableHTML += '</tr>';
            });
            tableHTML += '</tbody></table></div>';
            modalTableContainer.innerHTML = tableHTML;

            // Adicionar funcionalidade aos botões de navegação rápida
            document.querySelectorAll('.jump-to-plan').forEach(btn => {
                btn.addEventListener('click', () => {
                    const planKey = btn.dataset.plan;
                    const targetCol = document.getElementById(`plan-col-${planKey}`);
                    if (targetCol) {
                        // Remover highlight de todas as colunas
                        document.querySelectorAll('[class*="plan-highlight"]').forEach(el => {
                            el.classList.remove('plan-highlight-header', 'plan-highlight-cell');
                        });

                        // Adicionar highlight na coluna selecionada
                        const colIndex = Array.from(targetCol.parentNode.children).indexOf(targetCol);
                        document.querySelectorAll(`tbody tr`).forEach(row => {
                            const cell = row.children[colIndex];
                            if (cell) cell.classList.add('plan-highlight-cell');
                        });
                        targetCol.classList.add('plan-highlight-header');

                        // Scroll suave para a coluna
                        targetCol.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });

                        // Atualizar estado dos botões
                        document.querySelectorAll('.jump-to-plan').forEach(b => b.classList.remove('bg-purple-600/40'));
                        btn.classList.add('bg-purple-600/40');
                    }
                });
            });

            modal.classList.add('visible');
        }
        document.querySelectorAll('.open-modal-btn').forEach(btn => { btn.addEventListener('click', () => openModal(btn.dataset.planKey)); });
        closeModalBtn.addEventListener('click', () => modal.classList.remove('visible'));
        modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('visible'); });
        switchTab('execucao');
    }
    function initializeAnimatedCounters() {
        gsap.utils.toArray('.animated-metric').forEach(el => {
            const endValue = parseFloat(el.dataset.value);
            const prefix = el.dataset.prefix || '';
            const suffix = el.dataset.suffix || '';
            let proxy = { val: 0 };
            gsap.to(proxy, { val: endValue, duration: 2, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" }, onUpdate: () => { el.textContent = prefix + Math.ceil(proxy.val) + suffix; } });
        });
    }

    function initializeScrollAnimations() {
        if (typeof gsap === 'undefined' || !gsap.plugins.ScrollTrigger) return;

        // Setup initial state for elements to be animated
        gsap.set('.glass-card:not(#comparison-modal-content)', { y: 50, opacity: 0 });
        gsap.set('section h2', { y: 30, opacity: 0 });
        gsap.set('section p.text-xl', { y: 20, opacity: 0 });

        // Animate section headings
        gsap.utils.toArray('section h2').forEach(heading => {
            gsap.to(heading, {
                scrollTrigger: {
                    trigger: heading,
                    start: "top 85%",
                },
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power3.out"
            });
        });

        // Animate section subheadings
        gsap.utils.toArray('section p.text-xl').forEach(text => {
            gsap.to(text, {
                scrollTrigger: {
                    trigger: text,
                    start: "top 85%",
                },
                y: 0,
                opacity: 1,
                duration: 0.8,
                delay: 0.1,
                ease: "power3.out"
            });
        });

        // Staggered animation for glass cards
        gsap.utils.toArray('.grid').forEach(grid => {
            const cards = grid.querySelectorAll('.glass-card:not(#comparison-modal-content)');
            if (cards.length > 0) {
                gsap.to(cards, {
                    scrollTrigger: {
                        trigger: grid,
                        start: "top 80%",
                    },
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: "power3.out"
                });
            }
        });
    }
    function initializeCasesPage() {
        const loadMoreBtn = document.getElementById('load-more-cases');
        if (!loadMoreBtn) return;

        // Cases adicionais que serão carregados
        const additionalCases = [
            {
                title: 'Concessionárias',
                subtitle: 'Marketplace de Autos',
                icon: 'fas fa-car',
                color: 'teal',
                description: 'Acabe com as vendas perdidas no fim de semana. IA qualifica o lead de madrugada, avalia o seminovo e já agenda o test-drive para o vendedor fechar de manhã.',
                modules: 'Catálogo integrado • Simulação básica • Avaliação de seminovo • Agenda',
                implementation: '10 dias',
                kpi: '+80%',
                kpiLabel: 'Test-drives',
                cta: 'Piloto em 1 loja'
            },
            {
                title: 'Distribuidoras',
                subtitle: 'Atacado B2B',
                icon: 'fas fa-truck',
                color: 'gray',
                description: 'Vendedores de carne e osso são caros para tirar pedidos pequenos. A IA tira pedidos 24/7, lê CNPJs, sugere produtos substitutos se algo faltar e vende mais volume automaticamente.',
                modules: 'Catálogo por CNPJ • Política comercial • Substitutos • Recorrência',
                implementation: '10 dias',
                kpi: '95%',
                kpiLabel: 'Pedidos Auto',
                cta: 'Piloto top-20'
            },
            {
                title: 'Farmácias',
                subtitle: 'Drug Delivery',
                icon: 'fas fa-pills',
                color: 'red',
                description: 'Pacientes não podem esperar 2 horas para comprar remédio. O agente tira o pedido em 30 segundos, checa estoque, cobra via Pix e agenda entrega sozinho.',
                modules: 'Catálogo conectado • Regras de entrega • Pagamento • Recorrência',
                implementation: '7 dias',
                kpi: '+45%',
                kpiLabel: 'LTV',
                cta: 'Go-live 100 SKUs'
            },
            {
                title: 'Academias',
                subtitle: 'Studios',
                icon: 'fas fa-dumbbell',
                color: 'pink',
                description: 'IA coach/comercial agenda aula, monitora frequência, ativa quem sumiu e vende add-ons.',
                modules: 'Agendador • Monitor de frequência • Campanhas de ativação • Upsell',
                implementation: '7 dias',
                kpi: '+60%',
                kpiLabel: 'Retenção',
                cta: 'Piloto 2 modalidades'
            },
            {
                title: 'Laboratórios',
                subtitle: 'Análises Clínicas',
                icon: 'fas fa-flask',
                color: 'cyan',
                description: 'IA secretaria por exame: preparo claro, checklist de documentos, agenda multiunidade.',
                modules: 'Biblioteca de preparo • Agendador • Documentos/convênios • Resultado',
                implementation: '14 dias',
                kpi: '-80%',
                kpiLabel: 'No-Show',
                cta: 'Piloto multiunidade'
            },
            {
                title: 'Eventos',
                subtitle: 'Empresas de Eventos',
                icon: 'fas fa-calendar-alt',
                color: 'purple',
                description: 'IA de eventos vende ingresso, confirma presença, faz check-in QR e coordena staff.',
                modules: 'Ticketing/RSVP • Lista VIP • Check-in/credenciamento • Operação',
                implementation: '7-10 dias',
                kpi: '+70%',
                kpiLabel: 'Show-up',
                cta: 'Piloto evento'
            },
            {
                title: 'Políticos',
                subtitle: 'Mandatos e Campanhas',
                icon: 'fas fa-square-check',
                color: 'blue',
                description: 'WhatsApp oficial de escuta e prestação de contas. IA capta, classifica por tema/CEP, protocola e encaminha à secretaria.',
                modules: 'Escuta Inteligente • Protocolo & SLA • Painéis territoriais • Boletins por bairro',
                implementation: '14 dias',
                kpi: '90%',
                kpiLabel: '1ª Resposta',
                cta: 'Pilotar em 14 dias'
            },
            {
                title: 'Restaurantes',
                subtitle: 'Salão e Delivery',
                icon: 'fas fa-utensils',
                color: 'orange',
                description: 'Wi-Fi cativo + QR nas mesas + WhatsApp viram cadastro. IA roda RFM, campanhas automáticas e cardápio conversacional.',
                modules: 'Portal Wi-Fi • Cardápio WhatsApp • Campanhas automáticas • Clube de fidelidade',
                implementation: '7 dias',
                kpi: '+40%',
                kpiLabel: 'Ticket Médio',
                cta: 'Pilotar em 7 dias'
            },
            {
                title: 'Clínicas',
                subtitle: 'Médicas, Estéticas e Odontológicas',
                icon: 'fas fa-user-md',
                color: 'green',
                description: 'IA de recepção qualifica, convence, agenda, confirma e reduz no-show. Scripts por procedimento e elegibilidade de convênios.',
                modules: 'Scripts por procedimento • Agenda integrada • Elegibilidade/convênios • Anti no-show',
                implementation: '10 dias',
                kpi: '-70%',
                kpiLabel: 'No-Show',
                cta: 'Pilotar em 10 dias'
            },
            {
                title: 'Imobiliárias',
                subtitle: 'Pré-qualificação e Visitas',
                icon: 'fas fa-home',
                color: 'purple',
                description: 'IA corretora digital identifica perfil, cruza com estoque, sugere imóveis e agenda visita com confirmação.',
                modules: 'Triagem & perfil • Catálogo integrado • Recomendação por score • Agenda com lembretes',
                implementation: '10 dias',
                kpi: '85%',
                kpiLabel: 'Show-up',
                cta: 'Pilotar em 10 dias'
            },
            {
                title: 'Hotéis & Pousadas',
                subtitle: 'Reservas Diretas',
                icon: 'fas fa-bed',
                color: 'yellow',
                description: 'Motor de reserva conversacional: datas, tarifa, quarto, pagamento, pré-check-in e upsell de experiências.',
                modules: 'Disponibilidade & tarifas • Pagamento por Pix • Pré-check-in • Concierge',
                implementation: '7 dias',
                kpi: '+60%',
                kpiLabel: 'Reservas Diretas',
                cta: 'Pilotar em 7 dias'
            },
            {
                title: 'Educação',
                subtitle: 'Cursos, Escolas e EAD',
                icon: 'fas fa-graduation-cap',
                color: 'indigo',
                description: 'IA secretaria explica curso, simula bolsa/parcelas, agenda prova/entrevista e coleta documentos.',
                modules: 'Triagem & FAQ • Simulador de bolsa • Agendador • Matrícula guiada',
                implementation: '10 dias',
                kpi: '+50%',
                kpiLabel: 'Matrículas',
                cta: 'Go-live em 10 dias'
            }
        ];

        let casesLoaded = 0;

        loadMoreBtn.addEventListener('click', () => {
            const casesGrid = document.querySelector('.grid.md\\:grid-cols-2.lg\\:grid-cols-3');
            if (!casesGrid) return;

            // Carrega 3 cases por vez
            const casesToLoad = additionalCases.slice(casesLoaded, casesLoaded + 3);

            casesToLoad.forEach(caseData => {
                const caseElement = createCaseElement(caseData);
                casesGrid.appendChild(caseElement);
            });

            casesLoaded += casesToLoad.length;

            // Esconde o botão se todos os cases foram carregados
            if (casesLoaded >= additionalCases.length) {
                loadMoreBtn.style.display = 'none';
            }

            // Anima os novos elementos
            gsap.fromTo(casesGrid.children,
                { autoAlpha: 0, y: 50 },
                { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.1 }
            );
        });

        function createCaseElement(caseData) {
            const colorMap = {
                teal: { bgGrad: 'from-teal-900/10 to-cyan-900/10', border: 'border-teal-500/20 hover:border-teal-500/40', text: 'text-teal-400', bg: 'bg-teal-600 hover:bg-teal-700', bgLight: 'bg-teal-500/20', textLight: 'text-teal-300' },
                gray: { bgGrad: 'from-gray-900/10 to-slate-900/10', border: 'border-gray-500/20 hover:border-gray-500/40', text: 'text-gray-400', bg: 'bg-gray-600 hover:bg-gray-700', bgLight: 'bg-gray-500/20', textLight: 'text-gray-300' },
                red: { bgGrad: 'from-red-900/10 to-pink-900/10', border: 'border-red-500/20 hover:border-red-500/40', text: 'text-red-400', bg: 'bg-red-600 hover:bg-red-700', bgLight: 'bg-red-500/20', textLight: 'text-red-300' },
                pink: { bgGrad: 'from-pink-900/10 to-rose-900/10', border: 'border-pink-500/20 hover:border-pink-500/40', text: 'text-pink-400', bg: 'bg-pink-600 hover:bg-pink-700', bgLight: 'bg-pink-500/20', textLight: 'text-pink-300' },
                cyan: { bgGrad: 'from-cyan-900/10 to-blue-900/10', border: 'border-cyan-500/20 hover:border-cyan-500/40', text: 'text-cyan-400', bg: 'bg-cyan-600 hover:bg-cyan-700', bgLight: 'bg-cyan-500/20', textLight: 'text-cyan-300' },
                purple: { bgGrad: 'from-purple-900/10 to-violet-900/10', border: 'border-purple-500/20 hover:border-purple-500/40', text: 'text-purple-400', bg: 'bg-purple-600 hover:bg-purple-700', bgLight: 'bg-purple-500/20', textLight: 'text-purple-300' },
                blue: { bgGrad: 'from-blue-900/10 to-cyan-900/10', border: 'border-blue-500/20 hover:border-blue-500/40', text: 'text-blue-400', bg: 'bg-blue-600 hover:bg-blue-700', bgLight: 'bg-blue-500/20', textLight: 'text-blue-300' },
                orange: { bgGrad: 'from-orange-900/10 to-red-900/10', border: 'border-orange-500/20 hover:border-orange-500/40', text: 'text-orange-400', bg: 'bg-orange-600 hover:bg-orange-700', bgLight: 'bg-orange-500/20', textLight: 'text-orange-300' },
                green: { bgGrad: 'from-green-900/10 to-emerald-900/10', border: 'border-green-500/20 hover:border-green-500/40', text: 'text-green-400', bg: 'bg-green-600 hover:bg-green-700', bgLight: 'bg-green-500/20', textLight: 'text-green-300' },
                yellow: { bgGrad: 'from-yellow-900/10 to-orange-900/10', border: 'border-yellow-500/20 hover:border-yellow-500/40', text: 'text-yellow-400', bg: 'bg-yellow-600 hover:bg-yellow-700', bgLight: 'bg-yellow-500/20', textLight: 'text-yellow-300' },
                indigo: { bgGrad: 'from-indigo-900/10 to-blue-900/10', border: 'border-indigo-500/20 hover:border-indigo-500/40', text: 'text-indigo-400', bg: 'bg-indigo-600 hover:bg-indigo-700', bgLight: 'bg-indigo-500/20', textLight: 'text-indigo-300' }
            };

            const theme = colorMap[caseData.color] || colorMap.blue;

            const caseElement = document.createElement('div');
            caseElement.className = `glass-card p-8 rounded-2xl bg-gradient-to-br ${theme.bgGrad} border ${theme.border} transition-colors duration-300 relative overflow-hidden group`;
            caseElement.innerHTML = `
                    <div class="flex items-center gap-3 mb-4">
                        <div class="w-12 h-12 bg-gradient-to-r ${theme.bg} rounded-full flex items-center justify-center">
                            <i class="${caseData.icon} text-white text-xl"></i>
                        </div>
                        <div>
                            <h3 class="text-lg font-bold text-white">${caseData.title}</h3>
                            <p class="${theme.text} text-sm">${caseData.subtitle}</p>
                        </div>
                    </div>
                    <div class="mb-4">
                        <h4 class="text-white font-semibold mb-2">O que fazemos:</h4>
                        <p class="text-gray-300 text-sm mb-3">${caseData.description}</p>
                        <div class="${theme.bgLight} p-3 rounded-lg">
                            <p class="${theme.textLight} text-xs font-semibold mb-1">Módulos:</p>
                            <p class="text-gray-300 text-xs">${caseData.modules}</p>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-2 mb-4">
                        <div class="text-center">
                            <div class="${theme.text} font-bold text-lg">${caseData.implementation}</div>
                            <div class="text-gray-300 text-xs">Implementação</div>
                        </div>
                        <div class="text-center">
                            <div class="text-green-400 font-bold text-lg">${caseData.kpi}</div>
                            <div class="text-gray-300 text-xs">${caseData.kpiLabel}</div>
                        </div>
                    </div>
                    <a href="#contato" class="w-full ${theme.bg} text-white py-2 px-4 rounded-lg font-bold text-sm transition text-center inline-block">
                        ${caseData.cta}
                    </a>
                `;

            return caseElement;
        }
    }
    function initializeTechPage() { const container = document.getElementById('tech-grid'); if (!container) return; container.innerHTML = siteData.tech.map(feature => `<div class="tech-card glass-card p-8 rounded-xl transform hover:-translate-y-2 transition-transform duration-300"><div class="tech-card-icon flex items-center justify-center w-16 h-16 rounded-full mx-auto mb-4"><i class="${feature.icon} fa-2x"></i></div><h3 class="text-2xl font-bold mb-3 text-white text-center">${feature.title}</h3><p class="text-gray-300 text-center">${feature.description}</p></div>`).join(''); }
    function initializeContactPageForm() {
        const btn = document.getElementById('contact-page-submit');
        if (!btn) return;
        btn.addEventListener('click', () => {
            const form = document.getElementById('contact-form');
            if (!form) return;
            const name = form.querySelector('[name="name"]').value.trim();
            const email = form.querySelector('[name="email"]').value.trim();
            const phone = form.querySelector('[name="phone"]').value.trim();
            if (!name || !email || !phone) {
                showToast('Por favor preencha nome, e-mail e WhatsApp.', 'error');
                return;
            }
            const company = form.querySelector('[name="company"]').value.trim();
            const sector = form.querySelector('[name="sector"]').value;
            const message = form.querySelector('[name="message"]').value.trim();
            const text = `*Novo Contato — AutoGenius AI*\n\n*Nome:* ${name}\n*E-mail:* ${email}\n*WhatsApp:* ${phone}${company ? `\n*Empresa:* ${company}` : ''}${sector ? `\n*Setor:* ${sector}` : ''}${message ? `\n\n*Mensagem:*\n${message}` : ''}`;
            window.open(`https://wa.me/5581991471765?text=${encodeURIComponent(text)}`, '_blank');
            showToast('Abrindo WhatsApp... Aguardamos você! 🚀', 'success');
        });
    }

    function initializeFAQPage() { const containers = { servico: document.querySelector('#faq-servico .faq-accordion'), tecnico: document.querySelector('#faq-tecnico .faq-accordion'), planos: document.querySelector('#faq-planos .faq-accordion') }; const searchInput = document.getElementById('faq-search'); const highlightText = (text, filter) => { if (!filter) return text; const regex = new RegExp(`(${filter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'); return text.replace(regex, '<mark class="faq-highlight">$1</mark>'); }; const renderFAQ = (filter = '') => { let totalFound = 0; Object.keys(containers).forEach(category => { if (containers[category]) { const filteredData = siteData.faq.filter(item => item.category === category && (item.q.toLowerCase().includes(filter) || item.a.toLowerCase().includes(filter))); containers[category].innerHTML = filteredData.map(item => `<div class="glass-card rounded-lg faq-item"><button class="w-full flex justify-between items-center text-left p-5 font-semibold text-white"><span>${highlightText(item.q, filter)}</span><i class="fas fa-chevron-down transition-transform duration-300"></i></button><div class="faq-answer max-h-0 overflow-hidden transition-all duration-500 ease-in-out"><p class="p-5 pt-0 text-gray-300">${highlightText(item.a, filter)}</p></div></div>`).join(''); if (document.getElementById(`faq-${category}`)) document.getElementById(`faq-${category}`).style.display = filteredData.length > 0 ? 'block' : 'none'; totalFound += filteredData.length; } }); if (document.getElementById('faq-no-results')) document.getElementById('faq-no-results').style.display = totalFound === 0 ? 'block' : 'none'; }; renderFAQ(); if (searchInput) { searchInput.addEventListener('input', e => renderFAQ(e.target.value.toLowerCase())); } pageContent.addEventListener('click', e => { const button = e.target.closest('.faq-item button'); if (!button) return; const answer = button.nextElementSibling; const isOpen = answer.style.maxHeight && answer.style.maxHeight !== "0px"; pageContent.querySelectorAll('.faq-answer').forEach(ans => { ans.style.maxHeight = null; if (ans.previousElementSibling.querySelector('i')) ans.previousElementSibling.querySelector('i').classList.remove('rotate-180'); }); if (!isOpen) { answer.style.maxHeight = answer.scrollHeight + "px"; if (button.querySelector('i')) button.querySelector('i').classList.add('rotate-180'); } }); }
    // ROI Calculator Function
    function calculateROI() {
        const leadsPerMonth = parseInt(document.getElementById('leads-per-month').value) || 100;
        const currentConversion = parseInt(document.getElementById('current-conversion').value) || 5;
        const averageTicket = parseInt(document.getElementById('average-ticket').value) || 500;
        const hoursSpent = parseInt(document.getElementById('hours-spent').value) || 40;

        // Calculate improvements with AI
        const newConversion = Math.min(currentConversion * 3, 25); // Max 25% conversion
        const additionalSales = ((leadsPerMonth * newConversion / 100) - (leadsPerMonth * currentConversion / 100)) * averageTicket;
        const timeSaved = Math.round(hoursSpent * 0.8); // 80% time savings
        const monthlyROI = Math.round((additionalSales / 990) * 100); // Based on premium plan
        const totalSavings = additionalSales + (timeSaved * 50); // R$50/hour saved

        // Update display
        document.getElementById('new-conversion').textContent = newConversion + '%';
        document.getElementById('additional-sales').textContent = 'R$ ' + additionalSales.toLocaleString();
        document.getElementById('time-saved').textContent = timeSaved + 'h';
        document.getElementById('monthly-roi').textContent = monthlyROI + '%';
        document.getElementById('total-savings').textContent = 'R$ ' + totalSavings.toLocaleString();

        // Animate the results
        gsap.fromTo('#total-savings', { scale: 1 }, { scale: 1.1, duration: 0.3, yoyo: true, repeat: 1 });
        const btn = document.getElementById('btn-recalcular');
        if (btn) {
            gsap.fromTo(btn, { scale: 0.95 }, { scale: 1, duration: 0.2, ease: "back.out(1.7)" });
        }
    }

    // Initialize ROI calculator on page load
    function initializeROICalculator() {
        calculateROI();

        // Add event listeners to inputs
        ['leads-per-month', 'current-conversion', 'average-ticket', 'hours-spent'].forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', calculateROI);
            }
        });
    }

    function initializeWhatsAppDemo() {
        // Dados das demonstrações
        const demoData = {
            imobiliaria: {
                company: 'Apex Imóveis Premium',
                avatar: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=50&h=50&fit=crop&crop=face',
                conversation: [
                    { sender: 'assistant', text: 'Olá! 👋 Bem-vindo à Apex Imóveis Premium. Vi que você se interessou pelo nosso SkyView Residence. Como posso te ajudar a conhecer seu futuro lar?', intent: 'Saudação', sentiment: 'Neutro', score: 5.0 },
                    { sender: 'user', type: 'options', options: ['Quero agendar uma visita', 'Tenho dúvidas sobre preços'] },
                    { sender: 'assistant', text: 'Perfeito! ✨ O SkyView é nosso lançamento premium com unidades de 3 e 4 suítes. Para personalizar a apresentação, qual sua preferência?', intent: 'Qualificação', sentiment: 'Positivo (75%)', score: 7.5 },
                    { sender: 'user', type: 'options', options: ['3 suítes', '4 suítes'], choiceKey: 'suites' },
                    { sender: 'assistant', text: (data) => `Excelente escolha! 🏠 ${data.suites} tem vista panorâmica. Para enviar plantas e tabela de valores, qual seu e-mail?`, intent: 'Captura de Lead', sentiment: 'Positivo (85%)', score: 8.5 },
                    { sender: 'user', type: 'input', placeholder: 'seu@email.com', inputKey: 'email' },
                    { sender: 'assistant', text: (data) => `📧 Catálogo enviado para ${data.email}! Já reservei um horário com nosso corretor especialista. Qual dia prefere?`, intent: 'Agendamento', sentiment: 'Positivo (90%)', score: 9.2 }
                ]
            },
            clinica: {
                company: 'Clínica Estética Renovar',
                avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=50&h=50&fit=crop&crop=face',
                conversation: [
                    { sender: 'assistant', text: 'Olá! 😊 Sou a assistente virtual da Clínica Renovar. Como posso ajudar você a ficar ainda mais linda(o)?', intent: 'Saudação', sentiment: 'Positivo', score: 6.0 },
                    { sender: 'user', type: 'options', options: ['Quero agendar consulta', 'Dúvidas sobre tratamentos'] },
                    { sender: 'assistant', text: 'Que ótimo! 💆‍♀️ Oferecemos harmonização facial, tratamentos corporais e skincare. Qual área te interessa mais?', intent: 'Qualificação', sentiment: 'Positivo (80%)', score: 7.8 },
                    { sender: 'user', type: 'options', options: ['Harmonização facial', 'Tratamento corporal'] },
                    { sender: 'assistant', text: '✨ Excelente escolha! Temos horários disponíveis esta semana. Para agendar sua avaliação gratuita, preciso do seu nome:', intent: 'Agendamento', sentiment: 'Positivo (88%)', score: 8.8 }
                ]
            },
            ecommerce: {
                company: 'Loja Fashion Online',
                avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
                conversation: [
                    { sender: 'assistant', text: 'Oi! 👗 Vi que você abandonou alguns itens no carrinho. Posso ajudar com alguma dúvida antes de finalizar?', intent: 'Recuperação', sentiment: 'Neutro', score: 4.5 },
                    { sender: 'user', type: 'options', options: ['Dúvida sobre o tamanho', 'Sobre frete e prazo'] },
                    { sender: 'assistant', text: '📏 Sem problemas! Temos guia completo de medidas. Qual peça você gostaria de confirmar o tamanho?', intent: 'Suporte', sentiment: 'Positivo (70%)', score: 7.2 },
                    { sender: 'user', type: 'options', options: ['Vestido azul', 'Blusa branca'] },
                    { sender: 'assistant', text: '✅ Verificando... Baseado no seu histórico, tamanho M seria perfeito! Finalizamos a compra? Frete grátis hoje!', intent: 'Conversão', sentiment: 'Positivo (85%)', score: 8.7 }
                ]
            }
        };

        let currentDemo = 'imobiliaria';
        let currentStep = 0;
        let userChoices = {};

        const chatBox = document.getElementById('whatsapp-chat');
        const optionsBox = document.getElementById('whatsapp-options');
        const intentDisplay = document.getElementById('detected-intent');
        const sentimentDisplay = document.getElementById('detected-sentiment');
        const scoreDisplay = document.getElementById('qualification-score');

        if (!chatBox) return;

        // Inicializar tabs
        const demoTabs = document.querySelectorAll('.demo-tab');
        demoTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                demoTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                currentDemo = tab.dataset.demo;
                resetDemo();
            });
        });

        function resetDemo() {
            currentStep = 0;
            userChoices = {};
            chatBox.innerHTML = '';
            optionsBox.innerHTML = '';
            updateAnalysis('Aguardando...', 'Neutro', '5.0');
            runConversation();
        }

        function updateAnalysis(intent, sentiment, score) {
            if (intentDisplay) intentDisplay.textContent = intent;
            if (sentimentDisplay) sentimentDisplay.textContent = sentiment;
            if (scoreDisplay) scoreDisplay.textContent = score + '/10';

            // Atualizar barra de progresso
            const progressBar = document.querySelector('.bg-purple-400');
            if (progressBar) {
                const percentage = (parseFloat(score) / 10) * 100;
                progressBar.style.width = percentage + '%';
            }
        }

        function addMessage(sender, text) {
            const bubble = document.createElement('div');
            bubble.className = `chat-bubble ${sender}`;
            bubble.innerHTML = text;
            chatBox.appendChild(bubble);

            // Animação de entrada
            gsap.from(bubble, { opacity: 0, y: 20, duration: 0.5 });
            chatBox.scrollTop = chatBox.scrollHeight;
        }

        function showInteraction(interaction) {
            optionsBox.innerHTML = '';

            if (interaction.type === 'options') {
                const buttonContainer = document.createElement('div');
                buttonContainer.className = 'flex flex-wrap gap-2 justify-end';

                interaction.options.forEach(optionText => {
                    const button = document.createElement('button');
                    button.className = 'bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium transition';
                    button.textContent = optionText;
                    button.onclick = () => handleOptionClick(optionText, interaction.choiceKey);
                    buttonContainer.appendChild(button);
                });

                optionsBox.appendChild(buttonContainer);
                gsap.from(buttonContainer.children, { opacity: 0, y: 10, stagger: 0.1, duration: 0.3 });
            }

            if (interaction.type === 'input') {
                const inputWrapper = document.createElement('div');
                inputWrapper.className = 'flex gap-2';

                const input = document.createElement('input');
                input.type = 'email';
                input.placeholder = interaction.placeholder;
                input.className = 'flex-grow border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

                const button = document.createElement('button');
                button.innerHTML = '📧';
                button.className = 'bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition';

                const submitAction = () => {
                    if (input.value.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
                        handleOptionClick(input.value, interaction.inputKey);
                    } else {
                        input.focus();
                    }
                };

                button.onclick = submitAction;
                input.onkeydown = (e) => { if (e.key === 'Enter') submitAction(); };

                inputWrapper.appendChild(input);
                inputWrapper.appendChild(button);
                optionsBox.appendChild(inputWrapper);
                input.focus();
            }
        }

        function handleOptionClick(text, key) {
            addMessage('user', text);
            if (key) userChoices[key] = text;
            currentStep++;
            setTimeout(runConversation, 800);
        }

        function runConversation() {
            const conversation = demoData[currentDemo].conversation;

            if (currentStep >= conversation.length) {
                optionsBox.innerHTML = '<div class="text-center text-gray-500 text-sm py-2">✅ Conversa finalizada!</div>';
                return;
            }

            const currentMessage = conversation[currentStep];

            // Mostrar indicador de digitação
            if (currentMessage.sender === 'assistant') {
                optionsBox.innerHTML = '<div class="flex items-center gap-2 text-gray-300 text-sm"><span class="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span><span>IA está digitando...</span></div>';
            }

            setTimeout(() => {
                if (currentMessage.sender === 'assistant') {
                    const messageText = typeof currentMessage.text === 'function'
                        ? currentMessage.text(userChoices)
                        : currentMessage.text;

                    addMessage('assistant', messageText);

                    // Atualizar análise se disponível
                    if (currentMessage.intent) {
                        updateAnalysis(
                            currentMessage.intent,
                            currentMessage.sentiment,
                            currentMessage.score.toFixed(1)
                        );
                    }

                    currentStep++;
                    runConversation();
                } else {
                    showInteraction(currentMessage);
                }
            }, 1200);
        }

        // Inicializar primeira demonstração
        resetDemo();
    }
    function initializeQuiz() { const quizContainer = document.getElementById('quiz-v2-container'); if (!quizContainer) return; quizContainer.innerHTML = `<div id="q1"><h3 class="text-xl font-semibold text-center mb-6 text-white">1. Qual o momento atual do seu negócio?</h3><div class="space-y-4"><div class="quiz-option p-6 rounded-xl glass-card cursor-pointer border border-transparent hover:border-purple-500 transition" data-value="1"><p class="font-bold text-white">Estou começando ou sou autônomo.</p><p class="text-sm text-gray-300">Preciso de organização e atendimento automático.</p></div><div class="quiz-option p-6 rounded-xl glass-card cursor-pointer border border-transparent hover:border-purple-500 transition" data-value="2"><p class="font-bold text-white">Já tenho uma equipe e canais de venda.</p><p class="text-sm text-gray-300">Quero crescer, unificar o atendimento e ter relatórios.</p></div><div class="quiz-option p-6 rounded-xl glass-card cursor-pointer border border-transparent hover:border-purple-500 transition" data-value="3"><p class="font-bold text-white">Somos uma empresa estabelecida.</p><p class="text-sm text-gray-300">Buscamos o máximo de inteligência e automações.</p></div></div></div><div id="q2" class="hidden"><h3 class="text-xl font-semibold text-center mb-6 text-white">2. Qual seu principal objetivo?</h3><div class="space-y-4"><div class="quiz-option p-6 rounded-xl glass-card cursor-pointer border border-transparent hover:border-purple-500 transition" data-value="1"><p class="font-bold text-white">Parar de perder vendas por demora.</p><p class="text-sm text-gray-300">Quero um atendimento 24h que captura e organiza leads.</p></div><div class="quiz-option p-6 rounded-xl glass-card cursor-pointer border border-transparent hover:border-purple-500 transition" data-value="2"><p class="font-bold text-white">Elevar o nível da minha operação.</p><p class="text-sm text-gray-300">Quero um Agente de IA que execute tarefas (agende, etc.).</p></div><div class="quiz-option p-6 rounded-xl glass-card cursor-pointer border border-transparent hover:border-purple-500 transition" data-value="3"><p class="font-bold text-white">Tomar decisões baseadas em dados.</p><p class="text-sm text-gray-300">Preciso de análises e insights sobre os clientes.</p></div></div></div>`; const userAnswers = { q1: 0, q2: 0 }; quizContainer.addEventListener('click', function (event) { const option = event.target.closest('.quiz-option'); if (!option) return; const questionDiv = option.closest('div[id^="q"]'); const questionId = questionDiv.id; userAnswers[questionId] = parseInt(option.dataset.value, 10); questionDiv.querySelectorAll('.quiz-option').forEach(opt => opt.classList.remove('border-purple-500', 'ring-2', 'ring-purple-500')); option.classList.add('border-purple-500', 'ring-2', 'ring-purple-500'); setTimeout(() => { if (questionId === 'q1') { document.getElementById('q1').style.display = 'none'; document.getElementById('q2').style.display = 'block'; } else { quizContainer.style.display = 'none'; displayResult(); } }, 300); }); function displayResult() { const resultContainer = document.getElementById('result-container'); const score = userAnswers.q1 + userAnswers.q2; const planKeys = { 2: 'essencial', 3: 'avancado', 4: 'performance', 5: 'premium', 6: 'elite' }; const recommendedPlanKey = planKeys[score] || 'essencial'; const p = siteData.plans.find(plan => plan.key === recommendedPlanKey); if (!p) return; resultContainer.innerHTML = `<div class="max-w-4xl mx-auto glass-card p-8 rounded-2xl"><div class="text-center"><h3 class="text-3xl font-bold mb-4 text-white">Seu Gênio ideal é o <span class="animated-gradient-text">${p.name}</span></h3></div><div class="grid md:grid-cols-2 gap-6 items-center mt-6"><div><h4 class="font-bold text-lg mb-3 text-white">Principais Funcionalidades:</h4><ul class="space-y-2">${Object.entries(p.features).filter(([key, value]) => value).map(([key]) => `<li class="flex items-center text-gray-300"><i class="fas fa-check-circle text-green-400 mr-2"></i><span>${key}</span></li>`).join('')}</ul></div><div class="bg-gray-900 p-6 rounded-lg text-center"><p class="text-gray-300">Investimento:</p><p class="text-2xl font-bold text-white my-2">${typeof p.price === 'number' ? `R$ ${p.price}<span class="text-lg font-normal text-gray-300">/mês</span>` : p.price}</p><a href="#contato" class="gradient-bg text-white py-4 px-6 rounded-lg text-center font-bold w-full inline-block hover:opacity-90 transition mt-4 shadow-lg hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] transform hover:scale-105 duration-300 relative overflow-hidden"><div class="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-500 opacity-0 hover:opacity-20 transition-opacity duration-300"></div><span class="relative z-10">🎯 Quero Este Plano Agora</span></a></div></div></div>`; resultContainer.style.display = 'block'; resultContainer.scrollIntoView({ behavior: 'smooth', block: 'center' }); } }

    // Exit Intent Detection - Improved
    function initializeExitIntent() {
        // Check if user has disabled popups
        const popupDisabled = localStorage.getItem('exit-popup-disabled');
        if (popupDisabled === 'true') {
            return;
        }

        let exitIntentShown = false;
        const startTime = Date.now();

        document.addEventListener('mouseleave', function (e) {
            // Only show if:
            // 1. User has been on site for at least 30 seconds
            // 2. Popup hasn't been shown yet
            // 3. User is actually leaving (mouse at top of screen)
            if (e.clientY <= 0 && !exitIntentShown && (Date.now() - startTime) >= 30000) {
                exitIntentShown = true;
                showExitPopup();
            }
        });

        // Also show after 2 minutes if user hasn't interacted much
        setTimeout(() => {
            if (!exitIntentShown && (Date.now() - startTime) >= 120000) {
                exitIntentShown = true;
                showExitPopup();
            }
        }, 120000);
    }

    function showExitPopup() {
        const popup = document.getElementById('exit-popup');
        if (popup) {
            popup.classList.remove('hidden');
            gsap.fromTo(popup, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" });
        }
    }

    function closeExitPopup() {
        const popup = document.getElementById('exit-popup');
        if (popup) {
            gsap.to(popup, {
                opacity: 0, scale: 0.9, duration: 0.2, onComplete: () => {
                    popup.classList.add('hidden');
                }
            });
        }
    }

    function disableExitPopup() {
        localStorage.setItem('exit-popup-disabled', 'true');
        closeExitPopup();
    }

    // Expose to global scope for onclick HTML attributes
    window.closeExitPopup = closeExitPopup;
    window.disableExitPopup = disableExitPopup;

    // Live Chat Functionality - Removed (keeping only WhatsApp)
    function initializeLiveChat() {
        // WhatsApp button functionality is handled by the direct link
        // No additional JavaScript needed
    }

    // Scroll Progress Indicator
    function initializeScrollProgress() {
        const scrollProgress = document.getElementById('scroll-progress');
        const backToTop = document.getElementById('back-to-top');
        if (!scrollProgress) return;

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            scrollProgress.style.width = scrollPercent + '%';

            if (scrollTop > 300) {
                backToTop?.classList.add('visible');
            } else {
                backToTop?.classList.remove('visible');
            }
        });
    }



    // Enhanced Micro-interactions
    function initializeMicroInteractions() {
        // Add premium hover effects to cards
        document.querySelectorAll('.glass-card').forEach(card => {
            card.classList.add('premium-hover');
        });

        // Add premium button effects
        document.querySelectorAll('.gradient-bg').forEach(button => {
            button.classList.add('premium-button');
        });

        // Add glass card premium effects
        document.querySelectorAll('.glass-card').forEach(card => {
            card.classList.add('glass-card-premium');
        });
    }

    // User Feedback Tracking
    function initializeUserFeedback() {
        let maxScroll = 0;
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round((window.pageYOffset / (document.body.scrollHeight - window.innerHeight)) * 100);
            if (scrollPercent > maxScroll) maxScroll = scrollPercent;
        }, { passive: true });
    }

    // Toast Notification System
    function showToast(message, type = 'info', duration = 4000) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
                <div class="flex items-center gap-3">
                    <div class="flex-shrink-0">
                        ${type === 'success' ? '<i class="fas fa-check-circle text-green-400"></i>' :
                type === 'error' ? '<i class="fas fa-exclamation-circle text-red-400"></i>' :
                    '<i class="fas fa-info-circle text-blue-400"></i>'}
                    </div>
                    <div class="flex-1">
                        <p class="text-sm font-medium">${message}</p>
                    </div>
                    <button onclick="this.parentElement.parentElement.remove()" class="text-gray-300 hover:text-white">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;

        container.appendChild(toast);

        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 100);

        // Auto remove
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    // ─── 3D GLOBE with Three.js ───────────────────────────────────────────────
    function initializeGlobe() {
        const canvas = document.getElementById('globe-canvas');
        if (!canvas || typeof THREE === 'undefined') return;

        const container = document.getElementById('globe-container');
        const W = container.offsetWidth;
        const H = container.offsetHeight;

        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setSize(W, H);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 1000);
        camera.position.z = 2.8;

        // Globe geometry — point cloud
        const geo = new THREE.SphereGeometry(1, 64, 64);
        const positions = geo.attributes.position;
        const pts = [];
        for (let i = 0; i < positions.count; i++) {
            pts.push(new THREE.Vector3(positions.getX(i), positions.getY(i), positions.getZ(i)));
        }
        const ptGeo = new THREE.BufferGeometry().setFromPoints(pts);

        // Color array — mix purple & cyan
        const colors = [];
        for (let i = 0; i < pts.length; i++) {
            const t = Math.random();
            if (t < 0.5) {
                colors.push(0.85, 0.27, 0.94); // magenta
            } else {
                colors.push(0.13, 0.83, 0.93); // cyan
            }
        }
        ptGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        const ptMat = new THREE.PointsMaterial({ size: 0.012, vertexColors: true, transparent: true, opacity: 0.85 });
        const globe = new THREE.Points(ptGeo, ptMat);
        scene.add(globe);

        // Bright hot spots (niches)
        const hotspots = [
            [0.6, 0.7, 0.7], [-0.8, 0.3, 0.5], [0.1, -0.9, 0.4],
            [0.9, -0.2, 0.3], [-0.3, 0.8, 0.5], [0.4, 0.1, -0.9],
        ];
        hotspots.forEach(([x, y, z]) => {
            const d = Math.sqrt(x * x + y * y + z * z);
            const sGeo = new THREE.SphereGeometry(0.025, 8, 8);
            const sMat = new THREE.MeshBasicMaterial({ color: 0x00F0FF });
            const dot = new THREE.Mesh(sGeo, sMat);
            dot.position.set(x / d, y / d, z / d);
            scene.add(dot);
        });

        // Mouse-reactive rotation
        let targetRotX = 0, targetRotY = 0;
        document.addEventListener('mousemove', e => {
            targetRotY = ((e.clientX / window.innerWidth) - 0.5) * 0.5;
            targetRotX = ((e.clientY / window.innerHeight) - 0.5) * 0.3;
        });

        let animFrameId;
        const animate = () => {
            animFrameId = requestAnimationFrame(animate);
            globe.rotation.y += 0.003 + (targetRotY - globe.rotation.y) * 0.02;
            globe.rotation.x += (targetRotX - globe.rotation.x) * 0.02;
            renderer.render(scene, camera);
        };
        animate();

        // Cleanup on navigate away
        const observer = new MutationObserver(() => {
            if (!document.getElementById('globe-canvas')) {
                cancelAnimationFrame(animFrameId);
                renderer.dispose();
                observer.disconnect();
            }
        });
        observer.observe(document.getElementById('page-content'), { childList: true });
    }

    // ─── HERO PARTICLE CANVAS ─────────────────────────────────────────────────
    function initializeHeroParticles() {
        const canvas = document.getElementById('hero-particles');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const resize = () => {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const NUM = 80;
        const particles = Array.from({ length: NUM }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 2 + 0.5,
            vx: (Math.random() - 0.5) * 0.3,
            vy: -Math.random() * 0.5 - 0.1,
            color: Math.random() > 0.5 ? 'rgba(217,70,239,' : 'rgba(34,211,238,',
            alpha: Math.random() * 0.4 + 0.1,
        }));

        let rafP;
        const drawParticles = () => {
            rafP = requestAnimationFrame(drawParticles);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.y < -5) { p.y = canvas.height + 5; p.x = Math.random() * canvas.width; }
                if (p.x < -5) p.x = canvas.width + 5;
                if (p.x > canvas.width + 5) p.x = -5;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = p.color + p.alpha + ')';
                ctx.fill();
            });
        };
        drawParticles();

        const observer = new MutationObserver(() => {
            if (!document.getElementById('hero-particles')) {
                cancelAnimationFrame(rafP);
                observer.disconnect();
            }
        });
        observer.observe(document.getElementById('page-content'), { childList: true });
    }

    // Initialize everything
    navigate();
    initializeLiveChat();
    initializeExitIntent();
    initializeScrollProgress();

    initializeMicroInteractions();
    initializeUserFeedback();
});
