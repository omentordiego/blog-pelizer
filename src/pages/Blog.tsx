
import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleCard from '@/components/ArticleCard';
import LazyAdDisplay from '@/components/LazyAdDisplay';
import { useArticles } from '@/contexts/ArticlesContext';
import { useCategories } from '@/contexts/CategoriesContext';

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');
  
  const { articles } = useArticles();
  const { categories } = useCategories();

  // Filter and sort articles
  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (article.summary || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category_id === selectedCategory;
    
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
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

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Header Advertisement */}
      <LazyAdDisplay position="header" className="bg-gray-50 py-2" />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blog-primary to-blog-secondary text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-serif font-bold mb-4">
              Blog
            </h1>
            <p className="text-lg lg:text-xl text-blue-100">
              Análises políticas, reflexões sobre democracia e educação para a cidadania
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-muted border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              {/* Search */}
              <div className="relative flex-1 lg:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar artigos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-4 w-full lg:w-auto">
              <span className="text-sm text-gray-600 whitespace-nowrap">Ordenar por:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-40">
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

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            {filteredArticles.length} artigo{filteredArticles.length !== 1 ? 's' : ''} encontrado{filteredArticles.length !== 1 ? 's' : ''}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex gap-8">
            {/* Main Content */}
            <div className="flex-1">
              {filteredArticles.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredArticles.map((article, index) => (
                      <div key={article.id}>
                        <ArticleCard article={article} />
                        {/* Advertisement between articles */}
                        {(index + 1) % 6 === 0 && index < filteredArticles.length - 1 && (
                          <div className="col-span-full mt-6 mb-6">
                            <LazyAdDisplay position="between_articles" className="text-center" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-6 h-6 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Nenhum artigo encontrado
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Tente ajustar os filtros ou termos de busca
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('all');
                      setSortBy('date');
                    }}
                  >
                    Limpar filtros
                  </Button>
                </div>
              )}
            </div>

            {/* Sidebar - Hidden on mobile */}
            <div className="hidden lg:block w-80">
              <div className="sticky top-4 space-y-6">
                <LazyAdDisplay position="sidebar" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Site Footer Advertisement */}
      <LazyAdDisplay position="site_footer" className="bg-gray-50 py-4" />

      <Footer />
    </div>
  );
};

export default Blog;
