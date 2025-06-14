
import { supabase } from '@/integrations/supabase/client';

export const sampleAdsService = {
  async createSampleAds() {
    console.log('🎯 Verificando se há anúncios de exemplo...');
    
    const { data: existingAds } = await supabase
      .from('advertisements')
      .select('id')
      .limit(1);

    if (existingAds && existingAds.length > 0) {
      console.log('📋 Anúncios já existem, pulando criação de exemplos');
      return;
    }

    console.log('➕ Criando anúncios de exemplo...');
    
    const sampleAds = [
      {
        title: 'Anúncio AdSense Header',
        type: 'adsense' as const,
        content: `
          <ins class="adsbygoogle"
               style="display:block"
               data-ad-client="ca-pub-6206525680408961"
               data-ad-slot="1234567890"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
        `,
        position: 'header' as const,
        is_active: true
      },
      {
        title: 'Anúncio AdSense Entre Artigos',
        type: 'adsense' as const,
        content: `
          <ins class="adsbygoogle"
               style="display:block; text-align:center;"
               data-ad-layout="in-article"
               data-ad-format="fluid"
               data-ad-client="ca-pub-6206525680408961"
               data-ad-slot="0987654321"></ins>
        `,
        position: 'between_articles' as const,
        is_active: true
      },
      {
        title: 'Anúncio AdSense Sidebar',
        type: 'adsense' as const,
        content: `
          <ins class="adsbygoogle"
               style="display:block"
               data-ad-client="ca-pub-6206525680408961"
               data-ad-slot="5555555555"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
        `,
        position: 'sidebar' as const,
        is_active: true
      },
      {
        title: 'Anúncio AdSense Rodapé do Artigo',
        type: 'adsense' as const,
        content: `
          <ins class="adsbygoogle"
               style="display:block"
               data-ad-client="ca-pub-6206525680408961"
               data-ad-slot="7777777777"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
        `,
        position: 'article_footer' as const,
        is_active: true
      },
      {
        title: 'Anúncio AdSense Rodapé do Site',
        type: 'adsense' as const,
        content: `
          <ins class="adsbygoogle"
               style="display:block"
               data-ad-client="ca-pub-6206525680408961"
               data-ad-slot="9999999999"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
        `,
        position: 'site_footer' as const,
        is_active: true
      }
    ];

    try {
      const { error } = await supabase
        .from('advertisements')
        .insert(sampleAds);

      if (error) {
        console.error('❌ Erro ao criar anúncios de exemplo:', error);
      } else {
        console.log('✅ Anúncios de exemplo criados com sucesso');
      }
    } catch (error) {
      console.error('💥 Erro crítico ao criar anúncios de exemplo:', error);
    }
  }
};
