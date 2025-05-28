
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  created_at: string;
  updated_at: string;
}

interface CategoriesContextType {
  categories: Category[];
  isLoading: boolean;
  addCategory: (category: Omit<Category, 'id' | 'slug' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  refreshCategories: () => Promise<void>;
}

const CategoriesContext = createContext<CategoriesContextType | null>(null);

export const useCategories = () => {
  const context = useContext(CategoriesContext);
  if (!context) {
    throw new Error('useCategories deve ser usado dentro de um CategoriesProvider');
  }
  return context;
};

export const CategoriesProvider = ({ children }: { children: React.ReactNode }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) {
        console.error('Erro ao buscar categorias:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as categorias.",
          variant: "destructive",
        });
        return;
      }

      setCategories(data || []);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao carregar categorias.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addCategory = async (categoryData: Omit<Category, 'id' | 'slug' | 'created_at' | 'updated_at'>) => {
    try {
      const slug = generateSlug(categoryData.name);
      
      const { data, error } = await supabase
        .from('categories')
        .insert([{
          ...categoryData,
          slug
        }])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar categoria:', error);
        throw error;
      }

      setCategories(prev => [...prev, data]);
      toast({
        title: "Sucesso",
        description: "Categoria criada com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a categoria.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateCategory = async (id: string, categoryData: Partial<Category>) => {
    try {
      const updateData = { ...categoryData };
      if (categoryData.name) {
        updateData.slug = generateSlug(categoryData.name);
      }

      const { data, error } = await supabase
        .from('categories')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar categoria:', error);
        throw error;
      }

      setCategories(prev => prev.map(cat => cat.id === id ? data : cat));
      toast({
        title: "Sucesso",
        description: "Categoria atualizada com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a categoria.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar categoria:', error);
        throw error;
      }

      setCategories(prev => prev.filter(cat => cat.id !== id));
      toast({
        title: "Sucesso",
        description: "Categoria deletada com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao deletar categoria:', error);
      toast({
        title: "Erro",
        description: "Não foi possível deletar a categoria.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const refreshCategories = async () => {
    await fetchCategories();
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const value = {
    categories,
    isLoading,
    addCategory,
    updateCategory,
    deleteCategory,
    refreshCategories
  };

  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
};
