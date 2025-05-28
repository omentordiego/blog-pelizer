
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { articles, categories } from '@/data/mockData';

const AnalyticsSection = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Artigos Mais Lidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {articles
              .sort((a, b) => b.views - a.views)
              .slice(0, 5)
              .map((article, index) => (
                <div key={article.id} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blog-accent rounded-full flex items-center justify-center text-blog-primary text-sm font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 text-sm">{article.title}</div>
                    <div className="text-xs text-gray-500">{article.views} visualizações</div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Categorias por Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categories.map((category) => {
              const categoryArticles = articles.filter(a => a.categoryId === category.id);
              const totalViews = categoryArticles.reduce((sum, article) => sum + article.views, 0);
              return (
                <div key={category.id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{category.name}</div>
                    <div className="text-sm text-gray-500">{categoryArticles.length} artigos</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">{totalViews}</div>
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
