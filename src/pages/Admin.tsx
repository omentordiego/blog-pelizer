
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import AdminStats from '@/components/admin/AdminStats';
import ArticleManagement from '@/components/admin/ArticleManagement';
import CategoryManagement from '@/components/admin/CategoryManagement';
import NewsletterManagement from '@/components/admin/NewsletterManagement';
import AnalyticsSection from '@/components/admin/AnalyticsSection';
import AddArticleModal from '@/components/admin/AddArticleModal';

const Admin = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Simular autenticação (em produção, seria verificado no backend)
  const isAuthenticated = true; // Para demonstração

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 font-heading">Acesso Restrito</h1>
          <p className="text-gray-600 mb-4">Você precisa fazer login para acessar o painel administrativo.</p>
          <Link to="/login">
            <button className="bg-blog-primary hover:bg-blog-secondary transition-all duration-200 hover:scale-105 text-white px-4 py-2 rounded">
              Fazer Login
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Admin Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-heading">Painel Administrativo</h1>
              <p className="text-gray-600">Gerencie conteúdo e acompanhe métricas do blog</p>
            </div>
            <AddArticleModal />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <AdminStats />

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
            <ArticleManagement 
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
          </TabsContent>

          {/* Categories Management */}
          <TabsContent value="categories" className="space-y-6">
            <CategoryManagement />
          </TabsContent>

          {/* Newsletter Management */}
          <TabsContent value="newsletter" className="space-y-6">
            <NewsletterManagement />
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
