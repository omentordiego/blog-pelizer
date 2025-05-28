
import React, { useState, Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import Header from '@/components/Header';
import AdminStats from '@/components/admin/AdminStats';
import AddArticleModal from '@/components/admin/AddArticleModal';
import { useAuth } from '@/contexts/AuthContext';

// Lazy load components para melhor performance
const ArticleManagement = lazy(() => import('@/components/admin/ArticleManagement'));
const CategoryManagement = lazy(() => import('@/components/admin/CategoryManagement'));
const NewsletterManagement = lazy(() => import('@/components/admin/NewsletterManagement'));
const AnalyticsSection = lazy(() => import('@/components/admin/AnalyticsSection'));
const AdvertisementManagement = lazy(() => import('@/components/admin/AdvertisementManagement'));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blog-primary"></div>
  </div>
);

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
          <TabsList className="grid w-full lg:w-auto grid-cols-5">
            <TabsTrigger value="articles" className="font-heading">Artigos</TabsTrigger>
            <TabsTrigger value="categories" className="font-heading">Categorias</TabsTrigger>
            <TabsTrigger value="advertisements" className="font-heading">Anúncios</TabsTrigger>
            <TabsTrigger value="newsletter" className="font-heading">Newsletter</TabsTrigger>
            <TabsTrigger value="analytics" className="font-heading">Analytics</TabsTrigger>
          </TabsList>

          {/* Articles Management */}
          <TabsContent value="articles" className="space-y-6">
            <Suspense fallback={<LoadingSpinner />}>
              <ArticleManagement 
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
              />
            </Suspense>
          </TabsContent>

          {/* Categories Management */}
          <TabsContent value="categories" className="space-y-6">
            <Suspense fallback={<LoadingSpinner />}>
              <CategoryManagement />
            </Suspense>
          </TabsContent>

          {/* Advertisements Management */}
          <TabsContent value="advertisements" className="space-y-6">
            <Suspense fallback={<LoadingSpinner />}>
              <AdvertisementManagement />
            </Suspense>
          </TabsContent>

          {/* Newsletter Management */}
          <TabsContent value="newsletter" className="space-y-6">
            <Suspense fallback={<LoadingSpinner />}>
              <NewsletterManagement />
            </Suspense>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <Suspense fallback={<LoadingSpinner />}>
              <AnalyticsSection />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
