
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Calendar, User, Clock } from 'lucide-react';
import { useCategories } from '@/contexts/CategoriesContext';
import { markdownToHtml } from '@/data/mockData';

interface Article {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  content?: string;
  cover_image?: string;
  author: string;
  category_id?: string;
  is_published: boolean;
  published_at?: string;
  views: number;
  read_time?: number;
  seo_title?: string;
  seo_description?: string;
  created_at: string;
  updated_at: string;
}

interface ViewArticleModalProps {
  article: Article;
}

const ViewArticleModal = ({ article }: ViewArticleModalProps) => {
  const [open, setOpen] = useState(false);
  const { categories } = useCategories();
  
  const category = article.category_id ? categories.find(c => c.id === article.category_id) : null;
  const formattedDate = new Date(article.published_at || article.created_at).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="hover:bg-blue-50 hover:text-blog-primary transition-all duration-200 hover:scale-110"
        >
          <Eye className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="font-heading text-xl">{article.title}</DialogTitle>
            <div className="flex gap-2">
              {article.is_published ? (
                <Badge className="bg-green-100 text-green-800">Publicado</Badge>
              ) : (
                <Badge variant="outline">Rascunho</Badge>
              )}
              {category && (
                <Badge variant="outline">{category.name}</Badge>
              )}
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Article Meta */}
          <div className="flex items-center gap-6 text-sm text-gray-600 border-b pb-4">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{article.views} visualizações</span>
            </div>
            {article.read_time && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{article.read_time} min de leitura</span>
              </div>
            )}
          </div>

          {/* Cover Image */}
          {article.cover_image && (
            <div className="w-full">
              <img
                src={article.cover_image}
                alt={article.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Summary */}
          {article.summary && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Resumo</h3>
              <p className="text-gray-700 leading-relaxed">{article.summary}</p>
            </div>
          )}

          {/* Content */}
          {article.content && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Conteúdo</h3>
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: markdownToHtml(article.content) 
                }}
              />
            </div>
          )}

          {/* SEO Info */}
          {(article.seo_title || article.seo_description) && (
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-900 mb-3">Informações SEO</h3>
              {article.seo_title && (
                <div className="mb-2">
                  <span className="text-sm font-medium text-gray-600">Título SEO:</span>
                  <p className="text-gray-800">{article.seo_title}</p>
                </div>
              )}
              {article.seo_description && (
                <div>
                  <span className="text-sm font-medium text-gray-600">Descrição SEO:</span>
                  <p className="text-gray-800">{article.seo_description}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={() => setOpen(false)}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewArticleModal;
