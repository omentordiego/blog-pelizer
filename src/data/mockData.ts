

// This file is kept for backward compatibility but most data now comes from Supabase
// Helper functions updated to work with actual Supabase types

import { Tables } from '@/integrations/supabase/types';

// Use the actual Supabase types
export type Article = Tables<'articles'>;
export type Category = Tables<'categories'>;
export type NewsletterSubscriber = Tables<'newsletter_subscribers'>;

// Helper functions for data processing - updated to handle optional properties
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

