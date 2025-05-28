
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  color?: string;
}

interface CategoriesContextType {
  categories: Category[];
  addCategory: (category: Omit<Category, 'id' | 'slug'>) => Promise<void>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  refreshCategories: () => Promise<void>;
  isLoading: boolean;
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

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Erro ao buscar categorias:', error);
        return;
      }

      setCategories(data || []);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const addCategory = async (categoryData: Omit<Category, 'id' | 'slug'>) => {
    try {
      const slug = generateSlug(categoryData.name);
      
      const { data, error } = await supabase
        .from('categories')
        .insert([
          {
            name: categoryData.name,
            description: categoryData.description,
            slug: slug,
            color: categoryData.color || '#0A1D56'
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Erro ao adicionar categoria:', error);
        throw error;
      }

      console.log('Nova categoria adicionada:', data);
      await refreshCategories();
    } catch (error) {
      console.error('Erro ao adicionar categoria:', error);
      throw error;
    }
  };

  const updateCategory = async (id: string, categoryData: Partial<Category>) => {
    try {
      const updateData: any = { ...categoryData };
      if (categoryData.name) {
        updateData.slug = generateSlug(categoryData.name);
      }

      const { error } = await supabase
        .from('categories')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Erro ao atualizar categoria:', error);
        throw error;
      }

      await refreshCategories();
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
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

      await refreshCategories();
    } catch (error) {
      console.error('Erro ao deletar categoria:', error);
      throw error;
    }
  };

  const refreshCategories = async () => {
    console.log('Atualizando categorias...');
    await fetchCategories();
  };

  return (
    <CategoriesContext.Provider value={{
      categories,
      addCategory,
      updateCategory,
      deleteCategory,
      refreshCategories,
      isLoading
    }}>
      {children}
    </CategoriesContext.Provider>
  );
};
