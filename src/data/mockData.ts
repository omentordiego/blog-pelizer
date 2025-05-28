
export interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage: string;
  author: string;
  categoryId: string;
  publishDate: string;
  seoTitle: string;
  seoDescription: string;
  featured: boolean;
  views: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscriptionDate: string;
}

export const categories: Category[] = [
  {
    id: '1',
    name: 'Política Nacional',
    slug: 'politica-nacional',
    description: 'Análises sobre o cenário político brasileiro'
  },
  {
    id: '2',
    name: 'Economia',
    slug: 'economia',
    description: 'Debates sobre políticas econômicas e impactos sociais'
  },
  {
    id: '3',
    name: 'Democracia',
    slug: 'democracia',
    description: 'Reflexões sobre instituições democráticas'
  },
  {
    id: '4',
    name: 'Educação Política',
    slug: 'educacao-politica',
    description: 'Conteúdo educativo sobre cidadania e política'
  },
  {
    id: '5',
    name: 'Internacional',
    slug: 'internacional',
    description: 'Análises sobre política internacional'
  }
];

export const articles: Article[] = [
  {
    id: '1',
    title: 'O Futuro da Democracia Brasileira: Desafios e Oportunidades',
    slug: 'futuro-democracia-brasileira',
    summary: 'Uma análise profunda sobre os rumos da democracia no Brasil, explorando os principais desafios contemporâneos e as oportunidades de fortalecimento institucional.',
    content: `<p>A democracia brasileira atravessa um momento de profundas transformações e desafios. Em um cenário de polarização crescente e questionamento das instituições, torna-se fundamental refletir sobre os caminhos que se abrem para o fortalecimento do regime democrático no país.</p>

<h2>Os Desafios Contemporâneos</h2>
<p>Entre os principais desafios que enfrentamos, destacam-se a desinformação nas redes sociais, o enfraquecimento do debate público qualificado e a crescente desconfiança nas instituições democráticas. Esses fenômenos não são exclusivos do Brasil, mas aqui assumem contornos particulares que merecem atenção especial.</p>

<h2>Oportunidades de Fortalecimento</h2>
<p>Por outro lado, observamos também oportunidades importantes para o fortalecimento democrático. A participação cidadã tem se diversificado, novos atores políticos emergem e a sociedade civil mantém-se ativa na defesa dos direitos fundamentais.</p>

<h2>O Papel da Educação Política</h2>
<p>A educação política surge como elemento central nesse processo. É através da formação de uma cidadania mais consciente e participativa que poderemos construir uma democracia mais sólida e representativa.</p>`,
    coverImage: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&h=400&fit=crop',
    author: 'Vanderlei Pelizer',
    categoryId: '3',
    publishDate: '2024-01-15',
    seoTitle: 'O Futuro da Democracia Brasileira: Análise Completa',
    seoDescription: 'Análise profunda sobre os desafios e oportunidades para o fortalecimento da democracia brasileira.',
    featured: true,
    views: 1250
  },
  {
    id: '2',
    title: 'Reforma Tributária: Impactos na Sociedade Brasileira',
    slug: 'reforma-tributaria-impactos',
    summary: 'Análise detalhada da proposta de reforma tributária e seus possíveis impactos na vida dos brasileiros, com foco na justiça fiscal e desenvolvimento econômico.',
    content: `<p>A reforma tributária representa uma das mais importantes transformações estruturais em discussão no Brasil. Compreender seus impactos é fundamental para o debate democrático qualificado.</p>

<h2>O Sistema Tributário Atual</h2>
<p>O Brasil possui um dos sistemas tributários mais complexos do mundo, com dezenas de tributos sobrepostos que geram insegurança jurídica e elevados custos de conformidade para empresas e cidadãos.</p>

<h2>Propostas em Discussão</h2>
<p>As principais propostas em tramitação no Congresso Nacional buscam simplificar o sistema, reduzindo a quantidade de tributos e criando um imposto sobre valor agregado mais moderno e eficiente.</p>`,
    coverImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop',
    author: 'Vanderlei Pelizer',
    categoryId: '2',
    publishDate: '2024-01-10',
    seoTitle: 'Reforma Tributária: Análise dos Impactos Sociais',
    seoDescription: 'Entenda os impactos da reforma tributária na sociedade brasileira e suas implicações econômicas.',
    featured: true,
    views: 890
  },
  {
    id: '3',
    title: 'Educação Política: A Base da Cidadania Consciente',
    slug: 'educacao-politica-cidadania',
    summary: 'Reflexão sobre a importância da educação política na formação de cidadãos conscientes e participativos na vida democrática do país.',
    content: `<p>A educação política é fundamental para o exercício pleno da cidadania. Em uma democracia, todos os cidadãos têm o direito e o dever de participar das decisões que afetam a vida em sociedade.</p>

<h2>Por que Educação Política?</h2>
<p>A educação política vai além do conhecimento sobre partidos e eleições. Envolve compreender como funcionam as instituições, quais são os direitos e deveres dos cidadãos, e como participar ativamente da vida pública.</p>`,
    coverImage: 'https://images.unsplash.com/photo-1427751840561-9852520f8ce8?w=800&h=400&fit=crop',
    author: 'Vanderlei Pelizer',
    categoryId: '4',
    publishDate: '2024-01-05',
    seoTitle: 'Educação Política: Formando Cidadãos Conscientes',
    seoDescription: 'A importância da educação política na formação de uma cidadania ativa e consciente.',
    featured: false,
    views: 654
  },
  {
    id: '4',
    title: 'Política Internacional: O Brasil no Cenário Global',
    slug: 'brasil-cenario-global',
    summary: 'Análise da posição do Brasil no cenário internacional e os desafios da política externa em um mundo multipolar.',
    content: `<p>O Brasil ocupa uma posição estratégica no cenário internacional, sendo a maior economia da América Latina e uma das principais democracias do hemisfério sul.</p>

<h2>Desafios da Política Externa</h2>
<p>Os desafios incluem o fortalecimento de parcerias estratégicas, a defesa do multilateralismo e a promoção do desenvolvimento sustentável.</p>`,
    coverImage: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&h=400&fit=crop',
    author: 'Vanderlei Pelizer',
    categoryId: '5',
    publishDate: '2024-01-01',
    seoTitle: 'Brasil no Cenário Global: Política Externa em Análise',
    seoDescription: 'Análise da posição do Brasil na política internacional e seus desafios estratégicos.',
    featured: false,
    views: 432
  }
];

export const newsletterSubscribers: NewsletterSubscriber[] = [
  {
    id: '1',
    email: 'leitor1@exemplo.com',
    subscriptionDate: '2024-01-01'
  },
  {
    id: '2',
    email: 'leitor2@exemplo.com',
    subscriptionDate: '2024-01-02'
  }
];

// Funções auxiliares
export const getArticleBySlug = (slug: string): Article | undefined => {
  return articles.find(article => article.slug === slug);
};

export const getArticlesByCategory = (categoryId: string): Article[] => {
  return articles.filter(article => article.categoryId === categoryId);
};

export const getFeaturedArticles = (): Article[] => {
  return articles.filter(article => article.featured);
};

export const getCategoryBySlug = (slug: string): Category | undefined => {
  return categories.find(category => category.slug === slug);
};

export const getCategoryById = (id: string): Category | undefined => {
  return categories.find(category => category.id === id);
};
