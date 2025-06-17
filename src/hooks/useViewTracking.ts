
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useViewTracking = (articleId: string, slug: string) => {
  const hasTracked = useRef(false);

  useEffect(() => {
    const trackView = async () => {
      // Evitar tracking múltiplo
      if (hasTracked.current) return;
      
      try {
        console.log(`Iniciando tracking de visualização para artigo: ${slug} (${articleId})`);
        
        // Verificar se já foi visualizado nesta sessão
        const sessionKey = `viewed_${articleId}`;
        const hasViewed = sessionStorage.getItem(sessionKey);
        
        if (!hasViewed) {
          console.log('Primeira visualização nesta sessão, atualizando contador...');
          
          // Buscar o artigo atual para obter o número de views
          const { data: currentArticle, error: fetchError } = await supabase
            .from('articles')
            .select('views')
            .eq('id', articleId)
            .single();

          if (fetchError) {
            console.error('Erro ao buscar artigo atual:', fetchError);
            return;
          }

          if (currentArticle) {
            const newViews = (currentArticle.views || 0) + 1;
            console.log(`Atualizando views de ${currentArticle.views || 0} para ${newViews}`);
            
            // Atualizar views no artigo
            const { error: updateError } = await supabase
              .from('articles')
              .update({ views: newViews })
              .eq('id', articleId);

            if (updateError) {
              console.error('Erro ao atualizar views do artigo:', updateError);
              return;
            }

            console.log('Views do artigo atualizadas com sucesso');

            // Registrar no analytics_data para tracking histórico
            const { error: analyticsError } = await supabase
              .from('analytics_data')
              .insert({
                metric_name: 'article_views',
                metric_value: 1,
                date: new Date().toISOString().split('T')[0]
              });

            if (analyticsError) {
              console.error('Erro ao registrar analytics:', analyticsError);
            } else {
              console.log('Analytics registrado com sucesso');
            }

            // Marcar como visualizado nesta sessão
            sessionStorage.setItem(sessionKey, 'true');
            hasTracked.current = true;
            
            console.log(`View tracked com sucesso para artigo ${slug} - Novo total: ${newViews}`);
          }
        } else {
          console.log(`Artigo ${slug} já foi visualizado nesta sessão`);
        }
      } catch (error) {
        console.error('Erro inesperado ao rastrear visualização:', error);
      }
    };

    if (articleId && slug && !hasTracked.current) {
      // Aguardar um pouco antes de rastrear para garantir que a página carregou
      const timer = setTimeout(() => {
        trackView();
      }, 1500);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [articleId, slug]);

  // Reset quando mudar de artigo
  useEffect(() => {
    hasTracked.current = false;
  }, [articleId]);
};
