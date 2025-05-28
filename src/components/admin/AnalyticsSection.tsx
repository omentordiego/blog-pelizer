
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useArticles } from '@/contexts/ArticlesContext';
import { useCategories } from '@/contexts/CategoriesContext';

const AnalyticsSection = () => {
  const { articles } = useArticles();
  const { categories } = useCategories();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Artigos Mais Lidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {articles
              .sort((a, b) => (b.views || 0) - (a.views || 0))
              .slice(0, 5)
              .map((article, index) => (
                <div key={article.id} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blog-accent rounded-full flex items-center justify-center text-blog-primary text-sm font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 text-sm font-heading">{article.title}</div>
                    <div className="text-xs text-gray-500">{article.views || 0} visualizações</div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Categorias por Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categories.map((category) => {
              const categoryArticles = articles.filter(a => a.category_id === category.id);
              const totalViews = categoryArticles.reduce((sum, article) => sum + (article.views || 0), 0);
              return (
                <div key={category.id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 font-heading">{category.name}</div>
                    <div className="text-sm text-gray-500">{categoryArticles.length} artigos</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900 font-heading">{totalViews}</div>
                    <div className="text-sm text-gray-500">visualizações</div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsSection;
