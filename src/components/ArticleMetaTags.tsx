
import { useEffect } from 'react';
import { Tables } from '@/integrations/supabase/types';

type Article = Tables<'articles'>;

interface ArticleMetaTagsProps {
  article: Article;
}

const ArticleMetaTags = ({ article }: ArticleMetaTagsProps) => {
  useEffect(() => {
    if (!article) return;

    console.log('🚀 ArticleMetaTags: Iniciando atualização para:', article.title);

    // Função melhorada para validar imagens
    const validateImage = async (url: string): Promise<boolean> => {
      return new Promise((resolve) => {
        const img = new Image();
        const timeout = setTimeout(() => {
          console.log('⏰ Timeout na validação da imagem:', url);
          resolve(false);
        }, 5000);

        img.onload = () => {
          clearTimeout(timeout);
          console.log('✅ Imagem validada:', url);
          resolve(true);
        };
        
        img.onerror = () => {
          clearTimeout(timeout);
          console.log('❌ Erro ao carregar imagem:', url);
          resolve(false);
        };
        
        // Adicionar cache busting para forçar revalidação
        const cacheBuster = `?v=${Date.now()}`;
        img.src = url.includes('?') ? `${url}&t=${Date.now()}` : `${url}${cacheBuster}`;
      });
    };

    // Função para criar ou atualizar meta tags
    const updateMetaTag = (property: string, content: string, isProperty = true) => {
      const selector = isProperty ? `meta[property="${property}"]` : `meta[name="${property}"]`;
      let metaTag = document.querySelector(selector) as HTMLMetaElement;
      
      if (!metaTag) {
        metaTag = document.createElement('meta');
        if (isProperty) {
          metaTag.setAttribute('property', property);
        } else {
          metaTag.setAttribute('name', property);
        }
        document.head.appendChild(metaTag);
      }
      
      metaTag.setAttribute('content', content);
      console.log(`📝 Meta tag atualizada: ${property} = "${content.substring(0, 50)}..."`);
    };

    // Função para forçar atualização de cache
    const bustCache = () => {
      // Adicionar timestamp para forçar revalidação
      const timestamp = Date.now();
      
      // Atualizar URL com timestamp
      const url = new URL(window.location.href);
      url.searchParams.set('_t', timestamp.toString());
      history.replaceState({}, '', url.toString());
      
      // Tentar invalidar cache do navegador
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
          registrations.forEach(registration => {
            registration.update();
          });
        });
      }
    };

    // Função principal para atualizar todas as meta tags
    const updateAllMetaTags = async () => {
      console.log('🔄 Iniciando atualização completa das meta tags...');
      
      // Atualizar título da página
      const pageTitle = `${article.title} - Blog Fala Pelizer`;
      document.title = pageTitle;
      console.log('📄 Título da página:', pageTitle);

      // Criar descrição otimizada para redes sociais
      let socialDescription = '';
      if (article.summary) {
        socialDescription = article.summary.length > 160 
          ? article.summary.substring(0, 157) + '...'
          : article.summary;
      } else {
        socialDescription = `${article.title} - Leia este artigo completo no Blog Fala Pelizer sobre educação política e cidadania.`;
      }
      
      console.log('📝 Descrição social:', socialDescription);

      // Determinar a melhor imagem com validação melhorada
      let finalImage = 'https://i.postimg.cc/mgpyvymp/PONTO-DE-VISTA-3.png'; // Fallback
      
      if (article.cover_image) {
        console.log('🖼️ Validando imagem do artigo:', article.cover_image);
        const isValidImage = await validateImage(article.cover_image);
        if (isValidImage) {
          finalImage = article.cover_image;
          console.log('✅ Usando imagem do artigo');
        } else {
          console.log('❌ Imagem inválida, usando fallback');
        }
      }

      const currentUrl = window.location.href;
      console.log('🔗 URL atual:', currentUrl);

      // Atualizar meta description
      updateMetaTag('description', socialDescription, false);

      // Atualizar Open Graph tags (Facebook, WhatsApp, LinkedIn)
      updateMetaTag('og:title', article.title);
      updateMetaTag('og:description', socialDescription);
      updateMetaTag('og:type', 'article');
      updateMetaTag('og:url', currentUrl);
      updateMetaTag('og:site_name', 'Blog Fala Pelizer');
      updateMetaTag('og:image', finalImage);
      updateMetaTag('og:image:alt', article.title);
      updateMetaTag('og:image:width', '1200');
      updateMetaTag('og:image:height', '630');
      updateMetaTag('og:image:type', 'image/jpeg');
      updateMetaTag('og:locale', 'pt_BR');

      // Atualizar Twitter Cards
      updateMetaTag('twitter:card', 'summary_large_image');
      updateMetaTag('twitter:site', '@vpelizerpereira');
      updateMetaTag('twitter:creator', '@vpelizerpereira');
      updateMetaTag('twitter:title', article.title);
      updateMetaTag('twitter:description', socialDescription);
      updateMetaTag('twitter:image', finalImage);
      updateMetaTag('twitter:image:alt', article.title);

      // Atualizar dados estruturados (JSON-LD)
      const structuredData = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": article.title,
        "description": socialDescription,
        "image": {
          "@type": "ImageObject",
          "url": finalImage,
          "width": 1200,
          "height": 630
        },
        "author": {
          "@type": "Person",
          "name": article.author || "Vanderlei Pelizer"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Blog Fala Pelizer",
          "logo": {
            "@type": "ImageObject",
            "url": "https://i.postimg.cc/BZF3Sqj1/PL.png"
          }
        },
        "datePublished": article.published_at || article.created_at,
        "dateModified": article.updated_at,
        "url": currentUrl,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": currentUrl
        }
      };

      // Remover script JSON-LD anterior
      const existingScript = document.querySelector('script[type="application/ld+json"]');
      if (existingScript) {
        existingScript.remove();
      }

      // Adicionar novo script
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);

      // Atualizar canonical URL
      let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', currentUrl);

      // Forçar atualização de cache
      bustCache();

      console.log('🎉 Meta tags atualizadas com sucesso!');
      console.log('🖼️ Imagem final:', finalImage);
      
      // Log final para debug
      console.log('🔍 Debug info:', {
        title: article.title,
        description: socialDescription,
        image: finalImage,
        url: currentUrl,
        hasValidImage: finalImage !== 'https://i.postimg.cc/mgpyvymp/PONTO-DE-VISTA-3.png'
      });
    };

    // Executar com pequeno delay para garantir que a página carregou
    const timeoutId = setTimeout(updateAllMetaTags, 100);

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      console.log('🧹 Limpando ArticleMetaTags...');
    };
  }, [article]);

  return null;
};

export default ArticleMetaTags;
