
import { Tables } from '@/integrations/supabase/types';

// Type aliases for better readability
export type Article = Tables<'articles'>;
export type Category = Tables<'categories'>;

// Mock articles data
export const mockArticles: Article[] = [
  {
    id: '1',
    title: 'O Papel da Democracia no Brasil Contemporâneo',
    slug: 'papel-democracia-brasil-contemporaneo',
    summary: 'Uma análise profunda sobre os desafios e oportunidades da democracia brasileira no século XXI.',
    content: `# O Papel da Democracia no Brasil Contemporâneo

A democracia brasileira, consolidada após décadas de luta e transformação, enfrenta hoje novos desafios que exigem reflexão crítica e participação ativa da sociedade civil.

## Contexto Histórico

O Brasil passou por um longo processo de redemocratização que teve início na década de 1980. Desde então, construímos instituições sólidas que garantem a alternância de poder e a representatividade política.

## Desafios Atuais

Entre os principais desafios que enfrentamos hoje, podemos destacar:

- A polarização política crescente
- A desinformação e fake news
- A crise de representatividade
- Os ataques às instituições democráticas

## Caminhos para o Fortalecimento

Para fortalecer nossa democracia, é fundamental:

1. **Educação Política**: Investir na formação de cidadãos conscientes
2. **Transparência**: Garantir acesso à informação de qualidade
3. **Participação**: Incentivar o engajamento cívico
4. **Diálogo**: Promover o debate respeitoso e construtivo

A democracia não é um sistema perfeito, mas é o melhor que conhecemos para garantir liberdade, igualdade e justiça social.`,
    author: 'Vanderlei Pelizer',
    category_id: '1',
    cover_image: 'https://images.unsplash.com/photo-1494790108755-2616c041946b?w=800',
    is_published: true,
    published_at: '2024-01-15T10:00:00Z',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    views: 1250,
    read_time: 8,
    seo_title: 'O Papel da Democracia no Brasil Contemporâneo - Ponto de Vista',
    seo_description: 'Uma análise profunda sobre os desafios e oportunidades da democracia brasileira no século XXI.'
  },
  {
    id: '2',
    title: 'Educação Política: Formando Cidadãos Conscientes',
    slug: 'educacao-politica-formando-cidadaos-conscientes',
    summary: 'A importância da educação política na formação de uma sociedade mais justa e participativa.',
    content: `# Educação Política: Formando Cidadãos Conscientes

A educação política é fundamental para o desenvolvimento de uma sociedade democrática sólida e participativa.

## O Que É Educação Política?

Educação política não se trata de partidarismo ou doutrinação. É sobre:

- Compreender como funcionam as instituições
- Conhecer direitos e deveres cívicos
- Desenvolver pensamento crítico
- Entender a importância da participação democrática

## Por Que É Importante?

Uma sociedade com cidadãos politicamente educados:

1. Toma decisões mais informadas
2. Participa ativamente dos processos democráticos
3. Cobra transparência dos governantes
4. Resiste à manipulação e desinformação

## Como Promover?

A educação política deve começar cedo e continuar ao longo da vida:

- **Na escola**: Disciplinas de cidadania e educação cívica
- **Na família**: Discussões respeitosas sobre temas sociais
- **Na mídia**: Jornalismo responsável e educativo
- **Na sociedade**: Debates públicos e fóruns de discussão

Investir em educação política é investir no futuro da democracia.`,
    author: 'Vanderlei Pelizer',
    category_id: '2',
    cover_image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800',
    is_published: true,
    published_at: '2024-01-10T14:30:00Z',
    created_at: '2024-01-10T14:30:00Z',
    updated_at: '2024-01-10T14:30:00Z',
    views: 892,
    read_time: 6,
    seo_title: 'Educação Política: Formando Cidadãos Conscientes - Ponto de Vista',
    seo_description: 'A importância da educação política na formação de uma sociedade mais justa e participativa.'
  }
];

// Mock categories data
export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Análise Política',
    slug: 'analise-politica',
    description: 'Análises profundas sobre o cenário político nacional e internacional.',
    color: '#0A1D56',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Educação Cívica',
    slug: 'educacao-civica',
    description: 'Conteúdos educativos sobre cidadania, direitos e deveres.',
    color: '#2563EB',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

// Helper functions updated to handle optional/nullable properties safely
export const getArticleBySlug = (articles: Article[], slug: string): Article | null => {
  return articles.find(article => article.slug === slug) || null;
};

export const getCategoryById = (categories: Category[], id: string | null): Category | null => {
  if (!id) return null;
  return categories.find(category => category.id === id) || null;
};

export const getCategoryBySlug = (categories: Category[], slug: string): Category | null => {
  return categories.find(category => category.slug === slug) || null;
};

export const getArticlesByCategory = (articles: Article[], categoryId: string): Article[] => {
  return articles.filter(article => article.category_id === categoryId);
};

export const markdownToHtml = (markdown: string): string => {
  // Simple markdown to HTML conversion
  return markdown
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$2</h2>')
    .replace(/^### (.*$)/gim, '<h3>$3</h3>')
    .replace(/^\- (.*$)/gim, '<li>$1</li>')
    .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/\n/gim, '<br>');
};
