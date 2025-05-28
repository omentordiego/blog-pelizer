
import React, { createContext, useContext, useState, useEffect } from 'react';
import { categories as mockCategories } from '@/data/mockData';

interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
}

interface CategoriesContextType {
  categories: Category[];
  addCategory: (category: Omit<Category, 'id' | 'slug'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  refreshCategories: () => void;
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
  const [categories, setCategories] = useState<Category[]>(mockCategories);

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

  const addCategory = (categoryData: Omit<Category, 'id' | 'slug'>) => {
    const newCategory: Category = {
      id: Date.now().toString(),
      slug: generateSlug(categoryData.name),
      ...categoryData,
    };
    
    setCategories(prev => [...prev, newCategory]);
    console.log('Nova categoria adicionada:', newCategory);
  };

  const updateCategory = (id: string, categoryData: Partial<Category>) => {
    setCategories(prev => 
      prev.map(cat => 
        cat.id === id 
          ? { ...cat, ...categoryData, slug: categoryData.name ? generateSlug(categoryData.name) : cat.slug }
          : cat
      )
    );
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== id));
  };

  const refreshCategories = () => {
    // Em uma aplicação real, isso faria uma nova requisição para a API
    console.log('Atualizando categorias...');
  };

  return (
    <CategoriesContext.Provider value={{
      categories,
      addCategory,
      updateCategory,
      deleteCategory,
      refreshCategories
    }}>
      {children}
    </CategoriesContext.Provider>
  );
};
