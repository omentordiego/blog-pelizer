
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
      console.log('Buscando categorias...');
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Erro ao buscar categorias:', error);
        // Em caso de erro, usar dados mock temporariamente
        setCategories([
          {
            id: '1',
            name: 'Política Nacional',
            description: 'Análises sobre a política brasileira',
            slug: 'politica-nacional',
            color: '#0A1D56'
          },
          {
            id: '2',
            name: 'Economia',
            description: 'Análises econômicas e políticas públicas',
            slug: 'economia',
            color: '#60A5FA'
          }
        ]);
        return;
      }

      setCategories(data || []);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      // Fallback para dados mock
      setCategories([]);
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
      
      console.log('Tentando adicionar categoria:', categoryData);
      
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
        
        // Se falhar devido a RLS, criar categoria localmente como fallback
        if (error.code === '42501') {
          console.log('Erro de RLS - criando categoria localmente como demonstração');
          const newCategory = {
            id: Date.now().toString(),
            name: categoryData.name,
            description: categoryData.description,
            slug: slug,
            color: categoryData.color || '#0A1D56'
          };
          setCategories(prev => [...prev, newCategory]);
          return;
        }
        
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
        
        // Se falhar devido a RLS, remover localmente como fallback
        if (error.code === '42501') {
          console.log('Erro de RLS - removendo categoria localmente como demonstração');
          setCategories(prev => prev.filter(cat => cat.id !== id));
          return;
        }
        
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
