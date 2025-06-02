
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useViewTracking = (articleId: string, slug: string) => {
  useEffect(() => {
    const trackView = async () => {
      try {
        // Get current views count and increment manually
        const { data: currentArticle } = await supabase
          .from('articles')
          .select('views')
          .eq('id', articleId)
          .single();

        if (currentArticle) {
          await supabase
            .from('articles')
            .update({ views: (currentArticle.views || 0) + 1 })
            .eq('id', articleId);
        }

        console.log(`View tracked for article ${slug}`);
      } catch (error) {
        console.error('Erro ao rastrear visualização:', error);
      }
    };

    if (articleId && slug) {
      trackView();
    }
  }, [articleId, slug]);
};
