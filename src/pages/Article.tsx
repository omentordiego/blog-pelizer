
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Eye, User, ArrowLeft, Share2, Facebook, Twitter, Linkedin, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleCard from '@/components/ArticleCard';
import { markdownToHtml } from '@/data/mockData';
import { useArticles } from '@/contexts/ArticlesContext';
import { useCategories } from '@/contexts/CategoriesContext';
import { Tables } from '@/integrations/supabase/types';

// Use the actual Supabase types
type Article = Tables<'articles'>;

const Article = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const [showComments, setShowComments] = useState(false);
  const { articles } = useArticles();
  const { categories } = useCategories();
  
  const article = slug ? articles.find(a => a.slug === slug) || null : null;
  
  if (!article) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Artigo não encontrado</h1>
          <Link to="/blog">
            <Button>Voltar ao Blog</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const category = article.category_id ? categories.find(c => c.id === article.category_id) || null : null;
  const formattedDate = new Date(article.published_at || article.created_at).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const relatedArticles = articles
    .filter(a => a.id !== article.id && a.category_id === article.category_id)
    .slice(0, 3);

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = article.title;
    
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        toast({
          title: "Link copiado!",
          description: "O link do artigo foi copiado para a área de transferência",
        });
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  // Process article content - convert Markdown to HTML if needed
  const processedContent = article.content ? markdownToHtml(article.content) : '';

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-muted py-4">
        <div className="container mx-auto px-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-blog-secondary">Início</Link>
            <span>/</span>
            <Link to="/blog" className="hover:text-blog-secondary">Blog</Link>
            {category && (
              <>
                <span>/</span>
                <Link to={`/categorias/${category.slug}`} className="hover:text-blog-secondary">
                  {category.name}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-gray-900">{article.title}</span>
          </nav>
        </div>
      </div>

      {/* Article Header */}
      <article className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <Link to="/blog" className="inline-flex items-center text-blog-secondary hover:text-blog-primary mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao blog
            </Link>

            {/* Category Badge */}
            {category && (
              <Badge className="bg-blog-primary text-white mb-4">
                {category.name}
              </Badge>
            )}

            {/* Title */}
            <h1 className="text-3xl lg:text-4xl font-serif font-bold text-gray-900 mb-4 leading-tight">
              {article.title}
            </h1>

            {/* Summary */}
            {article.summary && (
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                {article.summary}
              </p>
            )}

            {/* Meta Information */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 pb-6 border-b border-gray-200">
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4 sm:mb-0">
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
                  <span>{article.views || 0} visualizações</span>
                </div>
              </div>

              {/* Share Buttons */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 mr-2">Compartilhar:</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleShare('facebook')}
                  className="text-blue-600 hover:bg-blue-50"
                >
                  <Facebook className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleShare('twitter')}
                  className="text-blue-400 hover:bg-blue-50"
                >
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleShare('linkedin')}
                  className="text-blue-700 hover:bg-blue-50"
                >
                  <Linkedin className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleShare('copy')}
                  className="text-gray-600 hover:bg-gray-50"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Featured Image */}
            {article.cover_image && (
              <div className="mb-8">
                <img
                  src={article.cover_image}
                  alt={article.title}
                  className="w-full h-64 lg:h-96 object-cover rounded-lg"
                />
              </div>
            )}

            {/* Article Content - Now with proper formatting */}
            <div 
              className="article-content prose prose-lg max-w-none mb-12"
              dangerouslySetInnerHTML={{ __html: processedContent }}
            />

            {/* Author Info */}
            <div className="bg-muted rounded-lg p-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-blog-primary rounded-full flex items-center justify-center text-white font-bold text-xl">
                  VP
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Vanderlei Pelizer
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Vanderlei Pelizer é reconhecido por sua dedicação ao desenvolvimento de Uberlândia, tanto no setor tecnológico quanto no cenário político,
                  </p>
                  <Link to="/sobre">
                    <Button variant="outline" size="sm">
                      Saiba mais sobre o autor
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="border-t border-gray-200 pt-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Comentários
                </h3>
                <Button
                  variant="outline"
                  onClick={() => setShowComments(!showComments)}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {showComments ? 'Ocultar' : 'Mostrar'} comentários
                </Button>
              </div>

              {showComments && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-gray-600 text-center">
                    Os comentários serão carregados aqui. Esta seção pode ser integrada com 
                    Disqus, Giscus ou outro sistema de comentários.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="py-12 bg-muted">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-serif font-bold text-center text-blog-primary mb-8">
              Artigos Relacionados
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {relatedArticles.map((relatedArticle) => (
                <ArticleCard key={relatedArticle.id} article={relatedArticle} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default Article;
