
import { useEffect } from 'react';
import { Tables } from '@/integrations/supabase/types';

type Article = Tables<'articles'>;

interface ArticleMetaTagsProps {
  article: Article;
}

const ArticleMetaTags = ({ article }: ArticleMetaTagsProps) => {
  useEffect(() => {
    if (!article) return;

    console.log('ArticleMetaTags: Atualizando meta tags para artigo:', article.title);
    console.log('ArticleMetaTags: Imagem de capa:', article.cover_image);

    // Função para validar se imagem existe e é acessível
    const validateImage = (url: string): Promise<boolean> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          console.log('Imagem validada com sucesso:', url);
          resolve(true);
        };
        img.onerror = () => {
          console.log('Imagem não pôde ser carregada:', url);
          resolve(false);
        };
        img.src = url;
        
        // Timeout após 3 segundos
        setTimeout(() => {
          console.log('Timeout na validação da imagem:', url);
          resolve(false);
        }, 3000);
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
      console.log(`Meta tag atualizada: ${property} = "${content}"`);
    };

    // Função principal para atualizar todas as tags
    const updateAllMetaTags = async () => {
      // Atualizar título da página
      const pageTitle = `${article.title} - Blog Fala Pelizer`;
      document.title = pageTitle;
      console.log('Título da página atualizado:', pageTitle);

      // Criar descrição otimizada
      const socialDescription = article.summary 
        ? article.summary.length > 160 
          ? article.summary.substring(0, 157) + '...'
          : article.summary
        : `${article.title} - Leia este artigo completo no Blog Fala Pelizer sobre educação política e cidadania.`;

      // Determinar a melhor imagem
      let finalImage = 'https://i.postimg.cc/mgpyvymp/PONTO-DE-VISTA-3.png'; // Fallback padrão
      
      if (article.cover_image) {
        console.log('Validando imagem do artigo...');
        const isValidImage = await validateImage(article.cover_image);
        if (isValidImage) {
          finalImage = article.cover_image;
          console.log('Usando imagem do artigo:', finalImage);
        } else {
          console.log('Imagem do artigo inválida, usando fallback padrão');
        }
      } else {
        console.log('Artigo sem imagem de capa, usando fallback padrão');
      }

      const currentUrl = window.location.href;

      // Atualizar meta description
      updateMetaTag('description', socialDescription, false);

      // Atualizar Open Graph tags (Facebook, WhatsApp, LinkedIn, etc.)
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

      // Adicionar dados estruturados (JSON-LD)
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
          "name": article.author || "Vanderlei Pelizer",
          "url": "https://your-domain.com/sobre"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Blog Fala Pelizer",
          "logo": {
            "@type": "ImageObject",
            "url": "https://i.postimg.cc/BZF3Sqj1/PL.png",
            "width": 60,
            "height": 60
          }
        },
        "datePublished": article.published_at || article.created_at,
        "dateModified": article.updated_at,
        "url": currentUrl,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": currentUrl
        },
        "articleSection": "Política",
        "wordCount": article.content ? article.content.length : 0
      };

      // Remover script JSON-LD anterior se existir
      const existingScript = document.querySelector('script[type="application/ld+json"]');
      if (existingScript) {
        existingScript.remove();
      }

      // Adicionar novo script com dados estruturados
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

      console.log('Todas as meta tags foram atualizadas com sucesso!');
      console.log('Imagem final usada:', finalImage);
      console.log('URL canonical:', currentUrl);
      
      // Forçar atualização do cache do navegador
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
          registrations.forEach(registration => {
            registration.update();
          });
        });
      }
    };

    // Executar atualização
    updateAllMetaTags();

    // Cleanup function para restaurar valores padrão
    return () => {
      console.log('ArticleMetaTags: Limpando meta tags...');
      
      document.title = 'Blog Fala Pelizer - Educação Política e Cidadania';
      
      // Restaurar meta tags padrão
      updateMetaTag('description', 'Educação política com opinião, clareza e posicionamento. Conteúdo que forma cidadãos conscientes e participativos.', false);
      updateMetaTag('og:title', 'Blog Fala Pelizer - Educação Política e Cidadania');
      updateMetaTag('og:description', 'Educação política com opinião, clareza e posicionamento. Conteúdo que forma cidadãos conscientes e participativos.');
      updateMetaTag('og:type', 'website');
      updateMetaTag('og:image', 'https://i.postimg.cc/mgpyvymp/PONTO-DE-VISTA-3.png');
      updateMetaTag('og:image:alt', 'Blog Fala Pelizer - Educação Política e Cidadania');
      updateMetaTag('twitter:title', 'Blog Fala Pelizer - Educação Política e Cidadania');
      updateMetaTag('twitter:description', 'Educação política com opinião, clareza e posicionamento. Conteúdo que forma cidadãos conscientes e participativos.');
      updateMetaTag('twitter:image', 'https://i.postimg.cc/mgpyvymp/PONTO-DE-VISTA-3.png');
      updateMetaTag('twitter:card', 'summary_large_image');

      // Remover dados estruturados
      const script = document.querySelector('script[type="application/ld+json"]');
      if (script) {
        script.remove();
      }
    };
  }, [article]);

  return null;
};

export default ArticleMetaTags;
