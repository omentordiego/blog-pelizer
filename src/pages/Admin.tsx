
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  FileText, 
  Users, 
  Mail, 
  Plus, 
  Edit, 
  Eye, 
  Trash2,
  TrendingUp,
  Calendar,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import { articles, categories, newsletterSubscribers } from '@/data/mockData';

type ChangeType = 'positive' | 'negative' | 'neutral';

interface StatItem {
  title: string;
  value: string;
  icon: any;
  change: string;
  changeType: ChangeType;
}

const Admin = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Simular autenticação (em produção, seria verificado no backend)
  const isAuthenticated = true; // Para demonstração

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acesso Restrito</h1>
          <p className="text-gray-600 mb-4">Você precisa fazer login para acessar o painel administrativo.</p>
          <Link to="/login">
            <Button>Fazer Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  const stats: StatItem[] = [
    {
      title: 'Total de Artigos',
      value: articles.length.toString(),
      icon: FileText,
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Visualizações Totais',
      value: articles.reduce((sum, article) => sum + article.views, 0).toLocaleString(),
      icon: Eye,
      change: '+23%',
      changeType: 'positive'
    },
    {
      title: 'Inscritos Newsletter',
      value: newsletterSubscribers.length.toString(),
      icon: Mail,
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Categorias Ativas',
      value: categories.length.toString(),
      icon: BarChart3,
      change: '0%',
      changeType: 'neutral'
    }
  ];

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getChangeColor = (changeType: ChangeType) => {
    switch (changeType) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      case 'neutral':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Admin Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
              <p className="text-gray-600">Gerencie conteúdo e acompanhe métricas do blog</p>
            </div>
            <Button className="bg-blog-primary hover:bg-blog-secondary">
              <Plus className="w-4 h-4 mr-2" />
              Novo Artigo
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className="p-3 bg-blog-accent rounded-lg">
                    <stat.icon className="w-6 h-6 text-blog-primary" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className={`text-sm font-medium ${getChangeColor(stat.changeType)}`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-600 ml-1">vs. mês anterior</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="articles" className="space-y-6">
          <TabsList className="grid w-full lg:w-auto grid-cols-4">
            <TabsTrigger value="articles">Artigos</TabsTrigger>
            <TabsTrigger value="categories">Categorias</TabsTrigger>
            <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Articles Management */}
          <TabsContent value="articles" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Gerenciar Artigos</CardTitle>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Buscar artigos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
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
          </TabsContent>

          {/* Categories Management */}
          <TabsContent value="categories" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Gerenciar Categorias</CardTitle>
                  <Button className="bg-blog-primary hover:bg-blog-secondary">
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Categoria
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((category) => {
                    const categoryArticles = articles.filter(a => a.categoryId === category.id);
                    return (
                      <Card key={category.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-gray-900">{category.name}</h3>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm">
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                          <div className="text-xs text-gray-500">
                            {categoryArticles.length} artigos
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Newsletter Management */}
          <TabsContent value="newsletter" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Gerenciar Newsletter</CardTitle>
                  <Button className="bg-blog-primary hover:bg-blog-secondary">
                    Exportar Lista
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <Users className="w-8 h-8 text-blog-primary mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-900">{newsletterSubscribers.length}</div>
                        <div className="text-sm text-gray-600">Total de Inscritos</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-900">15</div>
                        <div className="text-sm text-gray-600">Novos esta semana</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <Mail className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-900">95%</div>
                        <div className="text-sm text-gray-600">Taxa de abertura</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="border border-gray-200 rounded-lg">
                    <div className="p-4 border-b border-gray-200 bg-gray-50">
                      <h4 className="font-semibold text-gray-900">Inscritos Recentes</h4>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {newsletterSubscribers.map((subscriber) => (
                        <div key={subscriber.id} className="p-4 flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900">{subscriber.email}</div>
                            <div className="text-sm text-gray-500">
                              Inscrito em {new Date(subscriber.subscriptionDate).toLocaleDateString('pt-BR')}
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Artigos Mais Lidos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {articles
                      .sort((a, b) => b.views - a.views)
                      .slice(0, 5)
                      .map((article, index) => (
                        <div key={article.id} className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-blog-accent rounded-full flex items-center justify-center text-blog-primary text-sm font-medium">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 text-sm">{article.title}</div>
                            <div className="text-xs text-gray-500">{article.views} visualizações</div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Categorias por Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categories.map((category) => {
                      const categoryArticles = articles.filter(a => a.categoryId === category.id);
                      const totalViews = categoryArticles.reduce((sum, article) => sum + article.views, 0);
                      return (
                        <div key={category.id} className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900">{category.name}</div>
                            <div className="text-sm text-gray-500">{categoryArticles.length} artigos</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-gray-900">{totalViews}</div>
                            <div className="text-sm text-gray-500">visualizações</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
