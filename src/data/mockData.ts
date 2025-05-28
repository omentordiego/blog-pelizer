// This file is kept for backward compatibility but most data now comes from Supabase
// Only keeping helper functions that might still be useful

export interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  cover_image: string;
  author: string;
  category_id: string;
  published_at: string;
  seo_title: string;
  seo_description: string;
  is_published: boolean;
  views: number;
  read_time?: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  name?: string;
  subscribed_at: string;
  is_active: boolean;
}

// Helper functions for data processing
export const getArticleBySlug = (articles: Article[], slug: string): Article | undefined => {
  return articles.find(article => article.slug === slug);
};

export const getArticlesByCategory = (articles: Article[], categoryId: string): Article[] => {
  return articles.filter(article => article.category_id === categoryId);
};

export const getFeaturedArticles = (articles: Article[]): Article[] => {
  return articles.filter(article => article.is_published).slice(0, 3);
};

export const getCategoryBySlug = (categories: Category[], slug: string): Category | undefined => {
  return categories.find(category => category.slug === slug);
};

export const getCategoryById = (categories: Category[], id: string): Category | undefined => {
  return categories.find(category => category.id === id);
};

export const calculateReadTime = (content: string): number => {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};
