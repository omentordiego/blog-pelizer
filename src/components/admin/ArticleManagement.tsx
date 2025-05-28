
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Edit, Eye, Trash2, Calendar } from 'lucide-react';
import { useArticles } from '@/contexts/ArticlesContext';
import { useCategories } from '@/contexts/CategoriesContext';
import AddArticleModal from './AddArticleModal';

interface ArticleManagementProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const ArticleManagement = ({ searchTerm, onSearchChange }: ArticleManagementProps) => {
  const { articles, deleteArticle, isLoading } = useArticles();
  const { categories } = useCategories();

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (articleId: string) => {
    if (confirm('Tem certeza que deseja deletar este artigo?')) {
      try {
        await deleteArticle(articleId);
      } catch (error) {
        console.error('Erro ao deletar artigo:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blog-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando artigos...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-heading">Gerenciar Artigos</CardTitle>
          <div className="flex gap-2">
            <Input
              placeholder="Buscar artigos..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-64"
            />
            <AddArticleModal />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredArticles.map((article) => {
            const category = categories.find(c => c.id === article.category_id);
            return (
              <div key={article.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900 font-heading">{article.title}</h3>
                    {article.is_published && (
                      <Badge className="bg-green-100 text-green-800">Publicado</Badge>
                    )}
                    {!article.is_published && (
                      <Badge variant="outline">Rascunho</Badge>
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
                      {new Date(article.created_at).toLocaleDateString('pt-BR')}
                    </span>
                    <span>
                      <Eye className="w-3 h-3 inline mr-1" />
                      {article.views} visualizações
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="hover:bg-blue-50 hover:text-blog-primary transition-all duration-200 hover:scale-110"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="hover:bg-green-50 hover:text-green-600 transition-all duration-200 hover:scale-110"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDelete(article.id)}
                    className="hover:bg-red-50 hover:text-red-600 transition-all duration-200 hover:scale-110"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
          
          {filteredArticles.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhum artigo encontrado.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ArticleManagement;
