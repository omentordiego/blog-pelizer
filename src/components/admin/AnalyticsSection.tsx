
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useArticles } from '@/contexts/ArticlesContext';
import { useCategories } from '@/contexts/CategoriesContext';
import { useNewsletter } from '@/contexts/NewsletterContext';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsData {
  total_views: number;
  daily_views: number;
  weekly_views: number;
  monthly_views: number;
  total_articles: number;
  published_articles: number;
  total_subscribers: number;
}

const AnalyticsSection = () => {
  const { articles } = useArticles();
  const { categories } = useCategories();
  const { subscribers } = useNewsletter();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    total_views: 0,
    daily_views: 0,
    weekly_views: 0,
    monthly_views: 0,
    total_articles: 0,
    published_articles: 0,
    total_subscribers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        console.log('Carregando dados completos de analytics...');
        
        // Calcular estatísticas dos artigos
        const totalViews = articles.reduce((sum, article) => sum + (article.views || 0), 0);
        const publishedArticles = articles.filter(article => article.is_published).length;

        // Configurar datas para consultas
        const today = new Date().toISOString().split('T')[0];
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const weekAgoStr = weekAgo.toISOString().split('T')[0];
        
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        const monthAgoStr = monthAgo.toISOString().split('T')[0];

        console.log('Buscando analytics para período:', { today, weekAgoStr, monthAgoStr });

        // Buscar dados de analytics com tratamento de erro mais robusto
        let dailyViews = 0;
        let weeklyViews = 0;
        let monthlyViews = 0;

        try {
          // Views do dia
          const { data: dailyData, error: dailyError } = await supabase
            .from('analytics_data')
            .select('metric_value')
            .eq('metric_name', 'article_views')
            .eq('date', today);

          if (!dailyError && dailyData) {
            dailyViews = dailyData.reduce((sum, item) => sum + item.metric_value, 0);
            console.log('Views hoje:', dailyViews);
          }

          // Views da semana
          const { data: weeklyData, error: weeklyError } = await supabase
            .from('analytics_data')
            .select('metric_value')
            .eq('metric_name', 'article_views')
            .gte('date', weekAgoStr)
            .lte('date', today);

          if (!weeklyError && weeklyData) {
            weeklyViews = weeklyData.reduce((sum, item) => sum + item.metric_value, 0);
            console.log('Views esta semana:', weeklyViews);
          }

          // Views do mês
          const { data: monthlyData, error: monthlyError } = await supabase
            .from('analytics_data')
            .select('metric_value')
            .eq('metric_name', 'article_views')
            .gte('date', monthAgoStr)
            .lte('date', today);

          if (!monthlyError && monthlyData) {
            monthlyViews = monthlyData.reduce((sum, item) => sum + item.metric_value, 0);
            console.log('Views este mês:', monthlyViews);
          }
        } catch (analyticsError) {
          console.warn('Erro ao buscar dados de analytics, usando dados dos artigos:', analyticsError);
        }

        const finalAnalyticsData = {
          total_views: totalViews,
          daily_views: dailyViews,
          weekly_views: weeklyViews,
          monthly_views: monthlyViews,
          total_articles: articles.length,
          published_articles: publishedArticles,
          total_subscribers: subscribers.length
        };

        setAnalyticsData(finalAnalyticsData);

        console.log('Analytics completos carregados:', finalAnalyticsData);

      } catch (error) {
        console.error('Erro geral ao buscar dados de analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [articles, subscribers]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blog-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas Principais */}
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

      {/* Estatísticas Adicionais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 font-heading">Total de Artigos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{analyticsData.total_articles}</div>
            <p className="text-xs text-gray-500 mt-1">{analyticsData.published_articles} publicados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 font-heading">Assinantes Newsletter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{analyticsData.total_subscribers}</div>
            <p className="text-xs text-gray-500 mt-1">Total de inscritos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 font-heading">Categorias Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">{categories.length}</div>
            <p className="text-xs text-gray-500 mt-1">Total de categorias</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Artigos Mais Lidos */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Artigos Mais Lidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {articles
                .filter(article => article.views && article.views > 0)
                .sort((a, b) => (b.views || 0) - (a.views || 0))
                .slice(0, 5)
                .map((article, index) => (
                  <div key={article.id} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-blog-accent rounded-full flex items-center justify-center text-blog-primary text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm font-heading line-clamp-1">{article.title}</div>
                      <div className="text-xs text-gray-500">{(article.views || 0).toLocaleString()} visualizações</div>
                    </div>
                  </div>
                ))}
              
              {articles.filter(article => article.views && article.views > 0).length === 0 && (
                <div className="text-center py-4">
                  <p className="text-gray-500 text-sm">Nenhuma visualização registrada ainda</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Performance por Categoria */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Performance por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categories.map((category) => {
                const categoryArticles = articles.filter(a => a.category_id === category.id);
                const totalViews = categoryArticles.reduce((sum, article) => sum + (article.views || 0), 0);
                const publishedCount = categoryArticles.filter(a => a.is_published).length;
                return (
                  <div key={category.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 font-heading">{category.name}</div>
                      <div className="text-sm text-gray-500">{publishedCount}/{categoryArticles.length} artigos publicados</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900 font-heading">{totalViews.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">visualizações</div>
                    </div>
                  </div>
                );
              })}
              
              {categories.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-gray-500 text-sm">Nenhuma categoria encontrada</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsSection;
