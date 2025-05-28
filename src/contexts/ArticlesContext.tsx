
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  cover_image?: string;
  author: string;
  category_id?: string;
  is_published: boolean;
  published_at?: string;
  views: number;
  read_time?: number;
  seo_title?: string;
  seo_description?: string;
  created_at: string;
  updated_at: string;
}

interface ArticlesContextType {
  articles: Article[];
  addArticle: (article: Omit<Article, 'id' | 'slug' | 'created_at' | 'updated_at' | 'views'>) => Promise<void>;
  updateArticle: (id: string, article: Partial<Article>) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;
  refreshArticles: () => Promise<void>;
  isLoading: boolean;
}

const ArticlesContext = createContext<ArticlesContextType | null>(null);

export const useArticles = () => {
  const context = useContext(ArticlesContext);
  if (!context) {
    throw new Error('useArticles deve ser usado dentro de um ArticlesProvider');
  }
  return context;
};

export const ArticlesProvider = ({ children }: { children: React.ReactNode }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar artigos:', error);
        return;
      }

      setArticles(data || []);
    } catch (error) {
      console.error('Erro ao buscar artigos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const addArticle = async (articleData: Omit<Article, 'id' | 'slug' | 'created_at' | 'updated_at' | 'views'>) => {
    try {
      const slug = generateSlug(articleData.title);
      
      const { data, error } = await supabase
        .from('articles')
        .insert([
          {
            ...articleData,
            slug: slug,
            views: 0
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Erro ao adicionar artigo:', error);
        throw error;
      }

      console.log('Novo artigo adicionado:', data);
      await refreshArticles();
    } catch (error) {
      console.error('Erro ao adicionar artigo:', error);
      throw error;
    }
  };

  const updateArticle = async (id: string, articleData: Partial<Article>) => {
    try {
      const updateData: any = { ...articleData };
      if (articleData.title) {
        updateData.slug = generateSlug(articleData.title);
      }

      const { error } = await supabase
        .from('articles')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Erro ao atualizar artigo:', error);
        throw error;
      }

      await refreshArticles();
    } catch (error) {
      console.error('Erro ao atualizar artigo:', error);
      throw error;
    }
  };

  const deleteArticle = async (id: string) => {
    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar artigo:', error);
        throw error;
      }

      await refreshArticles();
    } catch (error) {
      console.error('Erro ao deletar artigo:', error);
      throw error;
    }
  };

  const refreshArticles = async () => {
    console.log('Atualizando artigos...');
    await fetchArticles();
  };

  return (
    <ArticlesContext.Provider value={{
      articles,
      addArticle,
      updateArticle,
      deleteArticle,
      refreshArticles,
      isLoading
    }}>
      {children}
    </ArticlesContext.Provider>
  );
};
