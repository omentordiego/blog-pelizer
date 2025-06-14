
import React, { useEffect } from 'react';

const AdSenseScript: React.FC = () => {
  useEffect(() => {
    // Verificar se o script AdSense já foi carregado
    if (document.querySelector('script[src*="adsbygoogle.js"]')) {
      console.log('🎯 Script AdSense já está carregado');
      // Garantir que window.adsbygoogle existe e está inicializado
      if (!window.adsbygoogle) {
        window.adsbygoogle = [];
      }
      // Forçar inicialização dos anúncios existentes
      try {
        (window.adsbygoogle as any[]).push({});
      } catch (e) {
        console.log('AdSense ainda não está pronto, tentando novamente...');
      }
      return;
    }

    console.log('📜 Carregando script AdSense...');
    
    // Criar e inserir o script AdSense
    const script = document.createElement('script');
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6206525680408961';
    script.async = true;
    script.crossOrigin = 'anonymous';
    
    script.onload = () => {
      console.log('✅ Script AdSense carregado com sucesso');
      // Inicializar window.adsbygoogle
      if (!window.adsbygoogle) {
        window.adsbygoogle = [];
        console.log('🎯 window.adsbygoogle inicializado');
      }
      
      // Disparar evento personalizado para notificar outros componentes
      window.dispatchEvent(new CustomEvent('adsense-loaded'));
    };
    
    script.onerror = () => {
      console.error('❌ Erro ao carregar script AdSense');
    };
    
    document.head.appendChild(script);

    return () => {
      // Cleanup: remover script se componente for desmontado
      const existingScript = document.querySelector('script[src*="adsbygoogle.js"]');
      if (existingScript) {
        existingScript.remove();
        console.log('🧹 Script AdSense removido');
      }
    };
  }, []);

  return null;
};

export default AdSenseScript;
