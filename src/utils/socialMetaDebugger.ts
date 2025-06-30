
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
  imageValidation: {
    url: string;
    isValid: boolean;
    error?: string;
  };
}

export const debugSocialMetaTags = async (): Promise<SocialMetaDebugInfo> => {
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

  const imageUrl = getMetaContent('meta[property="og:image"]');
  const imageValidation = await validateImageUrl(imageUrl);

  return {
    title: document.title,
    description: getMetaContent('meta[name="description"]'),
    image: imageUrl,
    url: window.location.href,
    ogTags,
    twitterTags,
    structuredData,
    imageValidation
  };
};

// Função melhorada para validar URLs de imagem
export const validateImageUrl = async (url: string): Promise<{url: string; isValid: boolean; error?: string}> => {
  if (!url) {
    return { url: '', isValid: false, error: 'URL não fornecida' };
  }

  return new Promise((resolve) => {
    const img = new Image();
    const timeout = setTimeout(() => {
      resolve({ url, isValid: false, error: 'Timeout - imagem demorou muito para carregar' });
    }, 10000);

    img.onload = () => {
      clearTimeout(timeout);
      resolve({ url, isValid: true });
    };
    
    img.onerror = () => {
      clearTimeout(timeout);
      resolve({ url, isValid: false, error: 'Erro ao carregar imagem' });
    };
    
    img.src = url;
  });
};

// Função para gerar relatório detalhado
export const generateDebugReport = async (): Promise<string> => {
  const debug = await debugSocialMetaTags();
  
  let report = `
=== 🔍 RELATÓRIO DE DEBUG - META TAGS SOCIAIS ===

📄 Informações Básicas:
- Título: ${debug.title}
- Descrição: ${debug.description}
- URL: ${debug.url}
- Imagem: ${debug.image}
- Imagem válida: ${debug.imageValidation.isValid ? '✅ Sim' : '❌ Não'}
${debug.imageValidation.error ? `- Erro da imagem: ${debug.imageValidation.error}` : ''}

🔵 Open Graph Tags (Facebook, WhatsApp, LinkedIn):
`;

  debug.ogTags.forEach(tag => {
    const status = tag.found ? '✅' : '❌';
    const content = tag.content ? `"${tag.content}"` : '(vazio)';
    report += `- ${tag.name}: ${status} ${content}\n`;
  });

  report += `
🐦 Twitter Tags:
`;

  debug.twitterTags.forEach(tag => {
    const status = tag.found ? '✅' : '❌';
    const content = tag.content ? `"${tag.content}"` : '(vazio)';
    report += `- ${tag.name}: ${status} ${content}\n`;
  });

  report += `
📊 Dados Estruturados (JSON-LD):
${debug.structuredData ? '✅ Presentes' : '❌ Ausentes'}
`;

  if (debug.structuredData) {
    report += `
- Tipo: ${debug.structuredData['@type'] || 'Não especificado'}
- Título: ${debug.structuredData.headline || 'Não especificado'}
- Autor: ${debug.structuredData.author?.name || 'Não especificado'}
`;
  }

  report += `
🔗 URLs para Teste e Validação:
- Facebook Debugger: https://developers.facebook.com/tools/debug/?q=${encodeURIComponent(debug.url)}
- Twitter Card Validator: https://cards-dev.twitter.com/validator
- LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/
- WhatsApp Business API: https://developers.facebook.com/tools/debug/

📱 Específico para WhatsApp:
- Cache muito agressivo - pode levar até 7 dias para atualizar
- Usa principalmente og:title, og:description e og:image
- Requer imagens com pelo menos 300x157px (recomendado: 1200x630px)

📝 Recomendações e Alertas:
`;

  // Alertas específicos
  if (!debug.imageValidation.isValid) {
    report += '⚠️  CRÍTICO: Imagem não está acessível - isto impedirá o compartilhamento correto\n';
  }
  
  if (!debug.ogTags.find(t => t.name === 'og:image:width')?.found) {
    report += '⚠️  Considere adicionar og:image:width para melhor compatibilidade\n';
  }
  
  if (!debug.ogTags.find(t => t.name === 'og:image:height')?.found) {
    report += '⚠️  Considere adicionar og:image:height para melhor compatibilidade\n';
  }
  
  if (debug.description.length > 160) {
    report += '⚠️  Descrição muito longa para algumas redes sociais (máx. 160 caracteres)\n';
  }
  
  if (debug.description.length < 50) {
    report += '⚠️  Descrição muito curta - considere expandir (mín. 50 caracteres)\n';
  }

  if (!debug.ogTags.find(t => t.name === 'og:type')?.found) {
    report += '⚠️  Adicione og:type para melhor categorização\n';
  }

  report += `
🚀 Dicas para Forçar Atualização no WhatsApp:
1. Use o Facebook Debugger para limpar o cache
2. Adicione parâmetros à URL (?v=timestamp)
3. Aguarde até 7 dias para atualização natural
4. Teste com diferentes números de telefone

⏰ Timestamp desta análise: ${new Date().toLocaleString('pt-BR')}
`;

  return report;
};

// Função para debug no console
export const debugToConsole = async () => {
  console.log('🔍 Iniciando debug das meta tags...');
  const report = await generateDebugReport();
  console.log(report);
  return debugSocialMetaTags();
};

// Disponibilizar globalmente
if (typeof window !== 'undefined') {
  (window as any).debugSocialMeta = debugToConsole;
  console.log('🛠️ Debug disponível globalmente: window.debugSocialMeta()');
}
