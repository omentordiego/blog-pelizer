
import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getArticlesByCategory } from '@/data/mockData';
import { useArticles } from '@/contexts/ArticlesContext';
import { useCategories } from '@/contexts/CategoriesContext';

const Categories = () => {
  const { articles } = useArticles();
  const { categories } = useCategories();

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blog-primary to-blog-secondary text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-serif font-bold mb-4">
              Categorias
            </h1>
            <p className="text-lg lg:text-xl text-blue-100">
              Explore nossos temas de análise política e educação para cidadania
            </p>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              const categoryArticles = getArticlesByCategory(articles, category.id);
              const totalViews = categoryArticles.reduce((sum, article) => sum + article.views, 0);

              return (
                <Link key={category.id} to={`/categorias/${category.slug}`}>
                  <Card className="group hover:shadow-lg transition-all duration-300 h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-blog-accent rounded-lg">
                          <BookOpen className="w-6 h-6 text-blog-primary" />
                        </div>
                        <Badge variant="secondary" className="bg-muted text-gray-600">
                          {categoryArticles.length} artigos
                        </Badge>
                      </div>

                      <h3 className="text-xl font-serif font-bold text-gray-900 group-hover:text-blog-secondary transition-colors mb-3">
                        {category.name}
                      </h3>

                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                        {category.description}
                      </p>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          <span>{totalViews} visualizações</span>
                        </div>
                        <span className="text-blog-secondary font-medium group-hover:text-blog-primary">
                          Explorar →
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-serif font-bold text-blog-primary mb-4">
            Não encontrou o que procurava?
          </h2>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Explore todos os nossos artigos ou use a busca para encontrar conteúdo específico
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/blog">
              <button className="bg-blog-primary text-white px-6 py-3 rounded-lg hover:bg-blog-secondary transition-colors">
                Ver Todos os Artigos
              </button>
            </Link>
            <Link to="/newsletter">
              <button className="border border-blog-primary text-blog-primary px-6 py-3 rounded-lg hover:bg-blog-primary hover:text-white transition-colors">
                Assinar Newsletter
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Categories;
