
import { useEffect } from 'react';
import { Tables } from '@/integrations/supabase/types';

type Article = Tables<'articles'>;

interface ArticleMetaTagsProps {
  article: Article;
}

const ArticleMetaTags = ({ article }: ArticleMetaTagsProps) => {
  useEffect(() => {
    if (!article) return;

    console.log('Atualizando meta tags para artigo:', article.title);
    console.log('Imagem de capa:', article.cover_image);

    // Atualizar título da página
    document.title = `${article.title} - Blog Fala Pelizer`;

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
      console.log(`Meta tag atualizada: ${property} = ${content}`);
    };

    // Criar descrição otimizada para redes sociais
    const socialDescription = article.summary 
      ? article.summary.substring(0, 160)
      : `${article.title} - Leia este artigo completo no Blog Fala Pelizer sobre educação política e cidadania.`;

    // Atualizar meta description
    updateMetaTag('description', socialDescription, false);

    // Atualizar Open Graph tags (Facebook, LinkedIn, etc.)
    updateMetaTag('og:title', article.title);
    updateMetaTag('og:description', socialDescription);
    updateMetaTag('og:type', 'article');
    updateMetaTag('og:url', window.location.href);
    updateMetaTag('og:site_name', 'Blog Fala Pelizer');
    
    // IMPORTANTE: Usar imagem de destaque do artigo se disponível
    if (article.cover_image) {
      updateMetaTag('og:image', article.cover_image);
      updateMetaTag('og:image:alt', article.title);
      updateMetaTag('og:image:width', '1200');
      updateMetaTag('og:image:height', '630');
      updateMetaTag('og:image:type', 'image/jpeg');
      console.log('Imagem do artigo definida para Open Graph:', article.cover_image);
    } else {
      // Fallback para imagem padrão
      updateMetaTag('og:image', 'https://i.postimg.cc/mgpyvymp/PONTO-DE-VISTA-3.png');
      updateMetaTag('og:image:alt', 'Blog Fala Pelizer');
      console.log('Usando imagem padrão para Open Graph');
    }

    // Atualizar Twitter Cards (X/Twitter)
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:site', '@vpelizerpereira');
    updateMetaTag('twitter:creator', '@vpelizerpereira');
    updateMetaTag('twitter:title', article.title);
    updateMetaTag('twitter:description', socialDescription);
    
    if (article.cover_image) {
      updateMetaTag('twitter:image', article.cover_image);
      updateMetaTag('twitter:image:alt', article.title);
      console.log('Imagem do artigo definida para Twitter Card:', article.cover_image);
    } else {
      updateMetaTag('twitter:image', 'https://i.postimg.cc/mgpyvymp/PONTO-DE-VISTA-3.png');
      updateMetaTag('twitter:image:alt', 'Blog Fala Pelizer');
    }

    // Adicionar dados estruturados para melhor SEO
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": article.title,
      "description": socialDescription,
      "image": article.cover_image || "https://i.postimg.cc/mgpyvymp/PONTO-DE-VISTA-3.png",
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
      "url": window.location.href,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": window.location.href
      }
    };

    // Remover script anterior se existir
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
    canonical.setAttribute('href', window.location.href);

    console.log('Meta tags atualizadas com sucesso para redes sociais');

    // Cleanup function para restaurar valores padrão quando o componente for desmontado
    return () => {
      document.title = 'Blog Fala Pelizer - Educação Política e Cidadania';
      
      // Restaurar meta description padrão
      updateMetaTag('description', 'Educação política com opinião, clareza e posicionamento. Conteúdo que forma cidadãos conscientes e participativos.', false);
      
      // Restaurar Open Graph padrão
      updateMetaTag('og:title', 'Blog Fala Pelizer - Educação Política e Cidadania');
      updateMetaTag('og:description', 'Educação política com opinião, clareza e posicionamento. Conteúdo que forma cidadãos conscientes e participativos.');
      updateMetaTag('og:type', 'website');
      updateMetaTag('og:image', 'https://i.postimg.cc/mgpyvymp/PONTO-DE-VISTA-3.png');
      
      // Restaurar Twitter padrão
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

  return null; // Este componente não renderiza nada visualmente
};

export default ArticleMetaTags;
