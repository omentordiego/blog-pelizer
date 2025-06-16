
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useViewTracking = (articleId: string, slug: string) => {
  useEffect(() => {
    const trackView = async () => {
      try {
        // Verificar se já foi visualizado nesta sessão
        const sessionKey = `viewed_${articleId}`;
        const hasViewed = sessionStorage.getItem(sessionKey);
        
        if (!hasViewed) {
          // Get current views count and increment manually
          const { data: currentArticle } = await supabase
            .from('articles')
            .select('views')
            .eq('id', articleId)
            .single();

          if (currentArticle) {
            const newViews = (currentArticle.views || 0) + 1;
            
            // Atualizar views no artigo
            await supabase
              .from('articles')
              .update({ views: newViews })
              .eq('id', articleId);

            // Registrar no analytics_data para tracking histórico
            await supabase
              .from('analytics_data')
              .insert({
                metric_name: 'article_views',
                metric_value: 1,
                date: new Date().toISOString().split('T')[0]
              });

            // Marcar como visualizado nesta sessão
            sessionStorage.setItem(sessionKey, 'true');
            
            console.log(`View tracked for article ${slug} - New total: ${newViews}`);
          }
        }
      } catch (error) {
        console.error('Erro ao rastrear visualização:', error);
      }
    };

    if (articleId && slug) {
      // Aguardar um pouco antes de rastrear para garantir que a página carregou
      const timer = setTimeout(trackView, 1000);
      return () => clearTimeout(timer);
    }
  }, [articleId, slug]);
};
