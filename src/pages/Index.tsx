
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, Target, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleCard from '@/components/ArticleCard';
import AdDisplay from '@/components/AdDisplay';
import DebugAds from '@/components/DebugAds';
import { useArticles } from '@/contexts/ArticlesContext';
import { useCategories } from '@/contexts/CategoriesContext';

const Index = () => {
  const { articles } = useArticles();
  const { categories } = useCategories();
  
  const { featuredArticles, recentArticles, publishedCount } = useMemo(() => {
    const published = articles.filter(article => article.is_published);
    return {
      featuredArticles: published.slice(0, 3),
      recentArticles: published.slice(0, 6),
      publishedCount: published.length
    };
  }, [articles]);

  const stats = useMemo(() => [
    { icon: BookOpen, label: 'Artigos Publicados', value: `${publishedCount}+` },
    { icon: Users, label: 'Leitores Mensais', value: '15K+' },
    { icon: Target, label: 'Anos de Experiência', value: '25+' },
    { icon: TrendingUp, label: 'Inscritos Newsletter', value: '3K+' },
  ], [publishedCount]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Header Advertisement */}
      <AdDisplay position="header" className="bg-gray-50 py-2" />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blog-primary to-blog-secondary text-white py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-heading font-bold mb-6 animate-fade-in">
              Fala Pelizer
            </h1>
            <p className="text-xl lg:text-2xl text-blue-100 mb-4 font-heading">
              Por Vanderlei Pelizer
            </p>
            <p className="text-lg lg:text-xl text-blue-200 mb-8 max-w-3xl mx-auto font-heading">
              Educação política com opinião, clareza e posicionamento. 
              Análises profundas sobre o cenário político brasileiro que formam cidadãos conscientes.
            </p>
            <div className="flex justify-center">
              <Link to="/blog">
                <Button 
                  size="lg" 
                  className="bg-white text-blog-primary hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl font-heading text-lg px-8 py-6"
                >
                  Explorar Artigos
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blog-accent rounded-lg mb-3">
                  <stat.icon className="w-6 h-6 text-blog-primary" />
                </div>
                <div className="text-2xl font-bold text-blog-primary mb-1 font-heading">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 font-heading">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-heading font-bold text-blog-primary mb-4">
                Artigos em Destaque
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto font-heading">
                Análises profundas e reflexões importantes sobre o cenário político atual
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 justify-center">
                {featuredArticles.slice(0, 2).map((article, index) => (
                  <div key={article.id}>
                    <ArticleCard article={article} featured />
                    {index === 0 && (
                      <div className="mt-8 lg:hidden">
                        <AdDisplay position="between_articles" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Advertisement between featured articles */}
              <div className="my-8 hidden lg:block">
                <AdDisplay position="between_articles" className="text-center" />
              </div>
              
              {featuredArticles.length > 2 && (
                <div className="mt-8 flex justify-center">
                  <div className="w-full lg:w-1/2">
                    <ArticleCard article={featuredArticles[2]} featured />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Recent Articles */}
      {recentArticles.length > 0 && (
        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-heading font-bold text-blog-primary mb-2">
                  Artigos Recentes
                </h2>
                <p className="text-gray-600 font-heading">
                  Acompanhe as últimas análises e reflexões
                </p>
              </div>
              <Link to="/blog">
                <Button variant="outline" className="font-heading">
                  Ver Todos
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentArticles.map((article, index) => (
                <div key={article.id}>
                  <ArticleCard article={article} />
                  {(index + 1) % 3 === 0 && index < recentArticles.length - 1 && (
                    <div className="col-span-full mt-6 mb-6">
                      <AdDisplay position="between_articles" className="text-center" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories Preview */}
      {categories.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-heading font-bold text-blog-primary mb-4">
                Categorias
              </h2>
              <p className="text-lg text-gray-600 font-heading">
                Explore nossos temas principais
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.slice(0, 6).map((category) => (
                <Link
                  key={category.id}
                  to={`/categorias/${category.slug}`}
                  className="group p-6 bg-white rounded-lg border border-gray-200 hover:border-blog-accent hover:shadow-md transition-all duration-300"
                >
                  <h3 className="text-xl font-semibold text-blog-primary group-hover:text-blog-secondary mb-2 transition-colors font-heading">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 font-heading">
                    {category.description}
                  </p>
                  <span className="text-blog-secondary text-sm font-medium font-heading">
                    Explorar categoria →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-16 bg-blog-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
            Junte-se à Comunidade
          </h2>
          <p className="text-lg text-blue-200 mb-8 max-w-2xl mx-auto font-heading">
            Receba análises exclusivas e participe de um debate político qualificado e construtivo
          </p>
          <Link to="/newsletter">
            <Button 
              size="lg" 
              className="bg-white text-blog-primary hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl font-heading text-lg px-8 py-6"
            >
              Inscrever-se na Newsletter
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Site Footer Advertisement */}
      <AdDisplay position="site_footer" className="bg-gray-50 py-4" />

      <Footer />
      
      {/* Debug component - only visible in development */}
      {process.env.NODE_ENV === 'development' && <DebugAds />}
    </div>
  );
};

export default Index;
