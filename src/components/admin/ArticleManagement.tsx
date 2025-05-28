
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Edit, Eye, Trash2, Calendar } from 'lucide-react';
import { articles, categories } from '@/data/mockData';

interface ArticleManagementProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const ArticleManagement = ({ searchTerm, onSearchChange }: ArticleManagementProps) => {
  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Gerenciar Artigos</CardTitle>
          <div className="flex gap-2">
            <Input
              placeholder="Buscar artigos..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-64"
            />
            <Button className="bg-blog-primary hover:bg-blog-secondary">
              <Plus className="w-4 h-4 mr-2" />
              Novo
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredArticles.map((article) => {
            const category = categories.find(c => c.id === article.categoryId);
            return (
              <div key={article.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{article.title}</h3>
                    {article.featured && (
                      <Badge className="bg-blog-accent text-blog-primary">Destaque</Badge>
                    )}
                    {category && (
                      <Badge variant="outline">{category.name}</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{article.summary}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Por {article.author}</span>
                    <span>
                      <Calendar className="w-3 h-3 inline mr-1" />
                      {new Date(article.publishDate).toLocaleDateString('pt-BR')}
                    </span>
                    <span>
                      <Eye className="w-3 h-3 inline mr-1" />
                      {article.views} visualizações
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ArticleManagement;
