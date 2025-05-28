
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useArticles } from '@/contexts/ArticlesContext';
import { useCategories } from '@/contexts/CategoriesContext';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsData {
  total_views: number;
  daily_views: number;
  weekly_views: number;
  monthly_views: number;
}

const AnalyticsSection = () => {
  const { articles } = useArticles();
  const { categories } = useCategories();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    total_views: 0,
    daily_views: 0,
    weekly_views: 0,
    monthly_views: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        // Buscar total de visualizações de todos os artigos
        const { data: articlesData, error: articlesError } = await supabase
          .from('articles')
          .select('views');

        if (articlesError) throw articlesError;

        const totalViews = articlesData?.reduce((sum, article) => sum + (article.views || 0), 0) || 0;

        // Buscar dados de analytics por período
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);

        // Views do dia
        const { data: dailyData } = await supabase
          .from('analytics_data')
          .select('metric_value')
          .eq('metric_name', 'article_views')
          .eq('date', today.toISOString().split('T')[0]);

        // Views da semana
        const { data: weeklyData } = await supabase
          .from('analytics_data')
          .select('metric_value')
          .eq('metric_name', 'article_views')
          .gte('date', weekAgo.toISOString().split('T')[0]);

        // Views do mês
        const { data: monthlyData } = await supabase
          .from('analytics_data')
          .select('metric_value')
          .eq('metric_name', 'article_views')
          .gte('date', monthAgo.toISOString().split('T')[0]);

        setAnalyticsData({
          total_views: totalViews,
          daily_views: dailyData?.reduce((sum, item) => sum + item.metric_value, 0) || 0,
          weekly_views: weeklyData?.reduce((sum, item) => sum + item.metric_value, 0) || 0,
          monthly_views: monthlyData?.reduce((sum, item) => sum + item.metric_value, 0) || 0
        });

        console.log('Analytics carregados:', {
          total_views: totalViews,
          daily_views: dailyData?.reduce((sum, item) => sum + item.metric_value, 0) || 0,
          weekly_views: weeklyData?.reduce((sum, item) => sum + item.metric_value, 0) || 0,
          monthly_views: monthlyData?.reduce((sum, item) => sum + item.metric_value, 0) || 0
        });

      } catch (error) {
        console.error('Erro ao buscar dados de analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blog-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas de Visualizações */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 font-heading">Total de Visualizações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blog-primary">{analyticsData.total_views.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">Todas as visualizações</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 font-heading">Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{analyticsData.daily_views.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">Visualizações hoje</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 font-heading">Esta Semana</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{analyticsData.weekly_views.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">Últimos 7 dias</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 font-heading">Este Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{analyticsData.monthly_views.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">Últimos 30 dias</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Artigos Mais Lidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {articles
                .sort((a, b) => (b.views || 0) - (a.views || 0))
                .slice(0, 5)
                .map((article, index) => (
                  <div key={article.id} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-blog-accent rounded-full flex items-center justify-center text-blog-primary text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm font-heading">{article.title}</div>
                      <div className="text-xs text-gray-500">{(article.views || 0).toLocaleString()} visualizações</div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Categorias por Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categories.map((category) => {
                const categoryArticles = articles.filter(a => a.category_id === category.id);
                const totalViews = categoryArticles.reduce((sum, article) => sum + (article.views || 0), 0);
                return (
                  <div key={category.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 font-heading">{category.name}</div>
                      <div className="text-sm text-gray-500">{categoryArticles.length} artigos</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900 font-heading">{totalViews.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">visualizações</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsSection;
