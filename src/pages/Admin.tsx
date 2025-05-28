
import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import Header from '@/components/Header';
import AdminStats from '@/components/admin/AdminStats';
import ArticleManagement from '@/components/admin/ArticleManagement';
import CategoryManagement from '@/components/admin/CategoryManagement';
import NewsletterManagement from '@/components/admin/NewsletterManagement';
import AnalyticsSection from '@/components/admin/AnalyticsSection';
import AddArticleModal from '@/components/admin/AddArticleModal';
import { useAuth } from '@/contexts/AuthContext';
import { CategoriesProvider } from '@/contexts/CategoriesContext';

const Admin = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { user, logout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blog-primary mx-auto mb-4"></div>
          <p className="text-gray-600 font-heading">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <CategoriesProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />

        {/* Admin Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 font-heading">Painel Administrativo</h1>
                <p className="text-gray-600 font-heading">Bem-vindo, {user.name}</p>
              </div>
              <div className="flex items-center gap-3">
                <AddArticleModal />
                <Button 
                  onClick={handleLogout}
                  variant="outline"
                  className="font-heading"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Stats Cards */}
          <AdminStats />

          {/* Main Content */}
          <Tabs defaultValue="articles" className="space-y-6">
            <TabsList className="grid w-full lg:w-auto grid-cols-4">
              <TabsTrigger value="articles" className="font-heading">Artigos</TabsTrigger>
              <TabsTrigger value="categories" className="font-heading">Categorias</TabsTrigger>
              <TabsTrigger value="newsletter" className="font-heading">Newsletter</TabsTrigger>
              <TabsTrigger value="analytics" className="font-heading">Analytics</TabsTrigger>
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
    </CategoriesProvider>
  );
};

export default Admin;
