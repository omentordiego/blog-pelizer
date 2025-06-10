
import React, { useEffect } from 'react';

const AdSenseScript: React.FC = () => {
  useEffect(() => {
    // Verificar se o script AdSense já foi carregado
    if (document.querySelector('script[src*="adsbygoogle.js"]')) {
      console.log('🎯 Script AdSense já está carregado');
      return;
    }

    console.log('📜 Carregando script AdSense...');
    
    // Criar e inserir o script AdSense
    const script = document.createElement('script');
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX';
    script.async = true;
    script.crossOrigin = 'anonymous';
    
    script.onload = () => {
      console.log('✅ Script AdSense carregado com sucesso');
      // Inicializar window.adsbygoogle se não existir
      if (!window.adsbygoogle) {
        window.adsbygoogle = [];
      }
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
      }
    };
  }, []);

  return null; // Este componente não renderiza nada visível
};

export default AdSenseScript;
