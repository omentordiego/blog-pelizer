
// Utilitário para debugar meta tags de redes sociais

export interface MetaTagInfo {
  name: string;
  content: string;
  found: boolean;
}

export interface SocialMetaDebugInfo {
  title: string;
  description: string;
  image: string;
  url: string;
  ogTags: MetaTagInfo[];
  twitterTags: MetaTagInfo[];
  structuredData: any;
}

export const debugSocialMetaTags = (): SocialMetaDebugInfo => {
  const getMetaContent = (selector: string): string => {
    const element = document.querySelector(selector) as HTMLMetaElement;
    return element ? element.content : '';
  };

  const checkMetaTag = (selector: string, name: string): MetaTagInfo => {
    const element = document.querySelector(selector) as HTMLMetaElement;
    return {
      name,
      content: element ? element.content : '',
      found: !!element
    };
  };

  const ogTags = [
    checkMetaTag('meta[property="og:title"]', 'og:title'),
    checkMetaTag('meta[property="og:description"]', 'og:description'),
    checkMetaTag('meta[property="og:image"]', 'og:image'),
    checkMetaTag('meta[property="og:url"]', 'og:url'),
    checkMetaTag('meta[property="og:type"]', 'og:type'),
    checkMetaTag('meta[property="og:site_name"]', 'og:site_name'),
    checkMetaTag('meta[property="og:image:width"]', 'og:image:width'),
    checkMetaTag('meta[property="og:image:height"]', 'og:image:height'),
    checkMetaTag('meta[property="og:locale"]', 'og:locale'),
  ];

  const twitterTags = [
    checkMetaTag('meta[property="twitter:card"]', 'twitter:card'),
    checkMetaTag('meta[property="twitter:title"]', 'twitter:title'),
    checkMetaTag('meta[property="twitter:description"]', 'twitter:description'),
    checkMetaTag('meta[property="twitter:image"]', 'twitter:image'),
    checkMetaTag('meta[property="twitter:site"]', 'twitter:site'),
    checkMetaTag('meta[property="twitter:creator"]', 'twitter:creator'),
  ];

  // Obter dados estruturados
  let structuredData = null;
  const jsonLdScript = document.querySelector('script[type="application/ld+json"]');
  if (jsonLdScript) {
    try {
      structuredData = JSON.parse(jsonLdScript.textContent || '');
    } catch (error) {
      console.error('Erro ao parsear JSON-LD:', error);
    }
  }

  return {
    title: document.title,
    description: getMetaContent('meta[name="description"]'),
    image: getMetaContent('meta[property="og:image"]'),
    url: window.location.href,
    ogTags,
    twitterTags,
    structuredData
  };
};

// Função para validar URLs de imagem
export const validateImageUrl = async (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
    
    // Timeout após 5 segundos
    setTimeout(() => resolve(false), 5000);
  });
};

// Função para gerar relatório de debug
export const generateDebugReport = async (): Promise<string> => {
  const debug = debugSocialMetaTags();
  const imageValid = await validateImageUrl(debug.image);
  
  let report = `
=== RELATÓRIO DE DEBUG - META TAGS SOCIAIS ===

📄 Informações Básicas:
- Título: ${debug.title}
- Descrição: ${debug.description}
- URL: ${debug.url}
- Imagem: ${debug.image}
- Imagem válida: ${imageValid ? '✅ Sim' : '❌ Não'}

🔵 Open Graph Tags (Facebook, WhatsApp, LinkedIn):
`;

  debug.ogTags.forEach(tag => {
    report += `- ${tag.name}: ${tag.found ? '✅' : '❌'} "${tag.content}"\n`;
  });

  report += `
🐦 Twitter Tags:
`;

  debug.twitterTags.forEach(tag => {
    report += `- ${tag.name}: ${tag.found ? '✅' : '❌'} "${tag.content}"\n`;
  });

  report += `
📊 Dados Estruturados (JSON-LD):
${debug.structuredData ? '✅ Presentes' : '❌ Ausentes'}
`;

  if (debug.structuredData) {
    report += `
- Tipo: ${debug.structuredData['@type']}
- Título: ${debug.structuredData.headline}
- Autor: ${debug.structuredData.author?.name}
`;
  }

  report += `
🔗 URLs para Teste:
- Facebook Debugger: https://developers.facebook.com/tools/debug/?q=${encodeURIComponent(debug.url)}
- Twitter Card Validator: https://cards-dev.twitter.com/validator
- LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/

📝 Recomendações:
${!imageValid ? '⚠️  Imagem não está acessível - verifique a URL\n' : ''}
${!debug.ogTags.find(t => t.name === 'og:image:width')?.found ? '⚠️  Considere adicionar og:image:width\n' : ''}
${!debug.ogTags.find(t => t.name === 'og:image:height')?.found ? '⚠️  Considere adicionar og:image:height\n' : ''}
${debug.description.length > 160 ? '⚠️  Descrição muito longa para algumas redes sociais\n' : ''}
${debug.description.length < 50 ? '⚠️  Descrição muito curta - considere expandir\n' : ''}
`;

  return report;
};

// Função para usar no console do navegador
export const debugToConsole = async () => {
  const report = await generateDebugReport();
  console.log(report);
  return debugSocialMetaTags();
};

// Disponibilizar globalmente para debug
if (typeof window !== 'undefined') {
  (window as any).debugSocialMeta = debugToConsole;
}
