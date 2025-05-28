
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

// Helper function to safely render HTML content
export const sanitizeHtml = (html: string): string => {
  // Basic HTML sanitization - in production, consider using a library like DOMPurify
  return html;
};

// Helper function to convert Markdown to HTML
export const markdownToHtml = (markdown: string): string => {
  if (!markdown) return '';
  
  // Basic Markdown to HTML conversion
  let html = markdown
    // Headers
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    // Bold and Italic
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    // Images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')
    // Lists
    .replace(/^\* (.+)$/gm, '<li>$1</li>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    // Blockquotes
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    // Line breaks and paragraphs
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');

  // Wrap in paragraphs if not already wrapped
  if (!html.startsWith('<')) {
    html = '<p>' + html + '</p>';
  }

  // Fix list wrapping
  html = html.replace(/(<li>.*?<\/li>)/gs, (match) => {
    if (!match.includes('<ul>') && !match.includes('<ol>')) {
      return '<ul>' + match + '</ul>';
    }
    return match;
  });

  return html;
};
