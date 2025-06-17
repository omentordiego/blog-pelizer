
import { useEffect } from 'react';
import { Tables } from '@/integrations/supabase/types';

type Article = Tables<'articles'>;

interface ArticleMetaTagsProps {
  article: Article;
}

const ArticleMetaTags = ({ article }: ArticleMetaTagsProps) => {
  useEffect(() => {
    if (!article) return;

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
    };

    // Atualizar meta description
    const description = article.summary || article.seo_description || 'Leia este artigo no Blog Fala Pelizer';
    updateMetaTag('description', description, false);

    // Atualizar Open Graph tags
    updateMetaTag('og:title', article.title);
    updateMetaTag('og:description', description);
    updateMetaTag('og:type', 'article');
    updateMetaTag('og:url', window.location.href);
    
    if (article.cover_image) {
      updateMetaTag('og:image', article.cover_image);
      updateMetaTag('og:image:alt', article.title);
    }

    // Atualizar Twitter tags
    updateMetaTag('twitter:title', article.title);
    updateMetaTag('twitter:description', description);
    
    if (article.cover_image) {
      updateMetaTag('twitter:image', article.cover_image);
      updateMetaTag('twitter:card', 'summary_large_image');
    }

    // Atualizar canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', window.location.href);

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
    };
  }, [article]);

  return null; // Este componente não renderiza nada visualmente
};

export default ArticleMetaTags;
