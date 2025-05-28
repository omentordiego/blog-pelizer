
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { useArticles } from '@/contexts/ArticlesContext';
import AddCategoryModal from './AddCategoryModal';
import { useCategories } from '@/contexts/CategoriesContext';

const CategoryManagement = () => {
  const { categories, deleteCategory, isLoading } = useCategories();
  const { articles } = useArticles();

  const handleDelete = async (categoryId: string) => {
    if (confirm('Tem certeza que deseja deletar esta categoria?')) {
      try {
        await deleteCategory(categoryId);
      } catch (error) {
        console.error('Erro ao deletar categoria:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blog-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando categorias...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-heading">Gerenciar Categorias</CardTitle>
          <AddCategoryModal />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => {
            const categoryArticles = articles.filter(a => a.category_id === category.id);
            return (
              <Card key={category.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 font-heading">{category.name}</h3>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="hover:bg-blue-50 hover:text-blog-primary transition-all duration-200 hover:scale-110"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete(category.id)}
                        className="hover:bg-red-50 hover:text-red-600 transition-all duration-200 hover:scale-110"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                  <div className="text-xs text-gray-500">
                    {categoryArticles.length} artigos
                  </div>
                </CardContent>
              </Card>
            );
          })}
          
          {categories.length === 0 && (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">Nenhuma categoria encontrada.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryManagement;
