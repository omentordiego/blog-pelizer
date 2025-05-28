
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, Target, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleCard from '@/components/ArticleCard';
import { articles, getFeaturedArticles, categories } from '@/data/mockData';

const Index = () => {
  const featuredArticles = getFeaturedArticles();
  const recentArticles = articles.slice(0, 6);

  const stats = [
    { icon: BookOpen, label: 'Artigos Publicados', value: '120+' },
    { icon: Users, label: 'Leitores Mensais', value: '15K+' },
    { icon: Target, label: 'Anos de Experiência', value: '25+' },
    { icon: TrendingUp, label: 'Inscritos Newsletter', value: '3K+' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blog-primary to-blog-secondary text-white py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-serif font-bold mb-6 animate-fade-in">
              Ponto de Vista
            </h1>
            <p className="text-xl lg:text-2xl text-blue-100 mb-4">
              Por Vanderlei Pelizer
            </p>
            <p className="text-lg lg:text-xl text-blue-200 mb-8 max-w-3xl mx-auto">
              Educação política com opinião, clareza e posicionamento. 
              Análises profundas sobre o cenário político brasileiro que formam cidadãos conscientes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/blog">
                <Button size="lg" variant="secondary" className="bg-white text-blog-primary hover:bg-gray-100">
                  Explorar Artigos
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/sobre">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blog-primary">
                  Sobre o Autor
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
                <div className="text-2xl font-bold text-blog-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-blog-primary mb-4">
              Artigos em Destaque
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Análises profundas e reflexões importantes sobre o cenário político atual
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {featuredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} featured />
            ))}
          </div>
        </div>
      </section>

      {/* Recent Articles */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-serif font-bold text-blog-primary mb-2">
                Artigos Recentes
              </h2>
              <p className="text-gray-600">
                Acompanhe as últimas análises e reflexões
              </p>
            </div>
            <Link to="/blog">
              <Button variant="outline">
                Ver Todos
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-blog-primary mb-4">
              Categorias
            </h2>
            <p className="text-lg text-gray-600">
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
                <h3 className="text-xl font-semibold text-blog-primary group-hover:text-blog-secondary mb-2 transition-colors">
                  {category.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {category.description}
                </p>
                <span className="text-blog-secondary text-sm font-medium">
                  Explorar categoria →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blog-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-serif font-bold mb-4">
            Junte-se à Comunidade
          </h2>
          <p className="text-lg text-blue-200 mb-8 max-w-2xl mx-auto">
            Receba análises exclusivas e participe de um debate político qualificado e construtivo
          </p>
          <Link to="/newsletter">
            <Button size="lg" variant="secondary" className="bg-white text-blog-primary hover:bg-gray-100">
              Inscrever-se na Newsletter
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
