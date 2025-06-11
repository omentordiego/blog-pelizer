
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleCard from '@/components/ArticleCard';
import { useArticles } from '@/contexts/ArticlesContext';
import { useCategories } from '@/contexts/CategoriesContext';

const Category = () => {
  const { slug } = useParams<{ slug: string }>();
  const [sortBy, setSortBy] = useState<string>('date');
  
  const { articles } = useArticles();
  const { categories } = useCategories();
  
  const category = slug ? categories.find(c => c.slug === slug) || null : null;
  const categoryArticles = category ? articles.filter(article => article.category_id === category.id) : [];

  if (!category) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Categoria não encontrada</h1>
          <Link to="/categorias">
            <Button>Voltar às Categorias</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Sort articles
  const sortedArticles = [...categoryArticles].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime();
      case 'views':
        return (b.views || 0) - (a.views || 0);
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const totalViews = categoryArticles.reduce((sum, article) => sum + (article.views || 0), 0);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-muted py-4">
        <div className="container mx-auto px-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-blog-secondary">Início</Link>
            <span>/</span>
            <Link to="/categorias" className="hover:text-blog-secondary">Categorias</Link>
            <span>/</span>
            <span className="text-gray-900">{category.name}</span>
          </nav>
        </div>
      </div>

      {/* Category Header */}
      <section className="py-16 bg-gradient-to-r from-blog-primary to-blog-secondary text-white">
        <div className="container mx-auto px-4">
          <Link to="/categorias" className="inline-flex items-center text-blue-200 hover:text-white mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar às categorias
          </Link>
          
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-serif font-bold mb-4">
              {category.name}
            </h1>
            <p className="text-lg lg:text-xl text-blue-100 mb-6">
              {category.description || 'Categoria sem descrição'}
            </p>
            
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="text-blue-200">
                <span className="font-semibold text-white">{categoryArticles.length}</span> artigos
              </div>
              <div className="text-blue-200">
                <span className="font-semibold text-white">{totalViews.toLocaleString()}</span> visualizações totais
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-6 bg-muted border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {sortedArticles.length} artigo{sortedArticles.length !== 1 ? 's' : ''} encontrado{sortedArticles.length !== 1 ? 's' : ''}
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Ordenar por:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Data</SelectItem>
                  <SelectItem value="views">Visualizações</SelectItem>
                  <SelectItem value="title">Título</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {sortedArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhum artigo encontrado
              </h3>
              <p className="text-gray-600 mb-4">
                Esta categoria ainda não possui artigos publicados
              </p>
              <Link to="/blog">
                <Button>
                  Explorar Todos os Artigos
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Related Categories */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-serif font-bold text-blog-primary mb-6">
            Explore Outras Categorias
          </h2>
          <Link to="/categorias">
            <Button variant="outline" size="lg">
              Ver Todas as Categorias
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Category;
