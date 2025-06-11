
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

// Use the actual Supabase types
type Article = Tables<'articles'>;

interface ArticlesContextType {
  articles: Article[];
  isLoading: boolean;
  addArticle: (article: Omit<TablesInsert<'articles'>, 'id' | 'slug' | 'views' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateArticle: (id: string, article: TablesUpdate<'articles'>) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;
  refreshArticles: () => Promise<void>;
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
  const { toast } = useToast();

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  const fetchArticles = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar artigos:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os artigos.",
          variant: "destructive",
        });
        return;
      }

      setArticles(data || []);
    } catch (error) {
      console.error('Erro ao buscar artigos:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao carregar artigos.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addArticle = async (articleData: Omit<TablesInsert<'articles'>, 'id' | 'slug' | 'views' | 'created_at' | 'updated_at'>) => {
    try {
      const slug = generateSlug(articleData.title);
      const read_time = articleData.content ? calculateReadTime(articleData.content) : 1;
      
      const insertData = {
        ...articleData,
        slug,
        read_time,
        views: 0,
        published_at: articleData.is_published ? new Date().toISOString() : null
      };

      const { data, error } = await supabase
        .from('articles')
        .insert([insertData])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar artigo:', error);
        throw error;
      }

      setArticles(prev => [data, ...prev]);
      toast({
        title: "Sucesso",
        description: "Artigo criado com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao criar artigo:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o artigo.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateArticle = async (id: string, articleData: TablesUpdate<'articles'>) => {
    try {
      const updateData = { ...articleData };
      
      if (articleData.title) {
        updateData.slug = generateSlug(articleData.title);
      }
      
      if (articleData.content) {
        updateData.read_time = calculateReadTime(articleData.content);
      }

      if (articleData.is_published && !articleData.published_at) {
        updateData.published_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('articles')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar artigo:', error);
        throw error;
      }

      setArticles(prev => prev.map(article => article.id === id ? data : article));
      toast({
        title: "Sucesso",
        description: "Artigo atualizado com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao atualizar artigo:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o artigo.",
        variant: "destructive",
      });
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

      setArticles(prev => prev.filter(article => article.id !== id));
      toast({
        title: "Sucesso",
        description: "Artigo deletado com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao deletar artigo:', error);
      toast({
        title: "Erro",
        description: "Não foi possível deletar o artigo.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const refreshArticles = async () => {
    await fetchArticles();
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const value = {
    articles,
    isLoading,
    addArticle,
    updateArticle,
    deleteArticle,
    refreshArticles
  };

  return (
    <ArticlesContext.Provider value={value}>
      {children}
    </ArticlesContext.Provider>
  );
};
