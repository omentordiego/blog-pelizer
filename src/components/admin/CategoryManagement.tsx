
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { articles } from '@/data/mockData';
import AddCategoryModal from './AddCategoryModal';
import { useCategories } from '@/contexts/CategoriesContext';

const CategoryManagement = () => {
  const { categories, deleteCategory } = useCategories();

  const handleDelete = (categoryId: string) => {
    deleteCategory(categoryId);
  };

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
            const categoryArticles = articles.filter(a => a.categoryId === category.id);
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
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryManagement;
