
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useViewTracking = (articleId: string, articleSlug?: string) => {
  useEffect(() => {
    const trackView = async () => {
      try {
        // Incrementar visualizações do artigo
        const { error: updateError } = await supabase
          .from('articles')
          .update({ 
            views: supabase.sql`views + 1` 
          })
          .eq('id', articleId);

        if (updateError) {
          console.error('Erro ao incrementar visualizações:', updateError);
          return;
        }

        // Registrar na tabela de analytics
        const today = new Date().toISOString().split('T')[0];
        const { error: analyticsError } = await supabase
          .from('analytics_data')
          .upsert({
            metric_name: 'article_views',
            metric_value: 1,
            date: today
          }, {
            onConflict: 'metric_name,date'
          });

        if (analyticsError) {
          console.error('Erro ao registrar analytics:', analyticsError);
        }

        console.log(`Visualização registrada para artigo: ${articleSlug || articleId}`);
      } catch (error) {
        console.error('Erro ao rastrear visualização:', error);
      }
    };

    // Aguardar um pouco antes de registrar a visualização para evitar contagens falsas
    const timer = setTimeout(trackView, 2000);

    return () => clearTimeout(timer);
  }, [articleId, articleSlug]);
};
