
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Eye, User } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Article, Category } from '@/data/mockData';
import { useCategories } from '@/contexts/CategoriesContext';
import OptimizedImage from '@/components/OptimizedImage';

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, featured = false }) => {
  const { categories } = useCategories();
  
  // Safely find category, handling optional category_id
  const category = article.category_id 
    ? categories.find(c => c.id === article.category_id) || null 
    : null;
    
  const formattedDate = new Date(article.published_at || article.created_at).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 overflow-hidden ${
      featured ? 'lg:col-span-2 lg:row-span-2' : ''
    }`}>
      <div className="relative overflow-hidden">
        <OptimizedImage
          src={article.cover_image || '/placeholder.svg'}
          alt={article.title}
          className={featured ? 'h-64 lg:h-80' : 'h-48'}
          priority={featured}
        />
        <div className="absolute top-4 left-4">
          {category && (
            <Badge className="bg-blog-primary text-white">
              {category.name}
            </Badge>
          )}
        </div>
        {featured && (
          <div className="absolute top-4 right-4">
            <Badge variant="secondary" className="bg-blog-accent text-blog-primary">
              Destaque
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-6">
        <Link to={`/artigo/${article.slug}`}>
          <h3 className={`font-serif font-bold text-gray-900 group-hover:text-blog-secondary transition-colors line-clamp-2 ${
            featured ? 'text-xl lg:text-2xl mb-3' : 'text-lg mb-2'
          }`}>
            {article.title}
          </h3>
        </Link>
        
        <p className={`text-gray-600 line-clamp-3 ${
          featured ? 'text-base mb-4' : 'text-sm mb-3'
        }`}>
          {article.summary || 'Resumo não disponível'}
        </p>

        <div className="flex items-center gap-4 text-sm text-gray-500">
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
            <span>{article.views || 0}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-6 pb-6">
        <Link
          to={`/artigo/${article.slug}`}
          className="text-blog-secondary hover:text-blog-primary font-medium text-sm transition-colors border-b border-transparent hover:border-blog-primary"
        >
          Ler artigo completo →
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ArticleCard;
