
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Advertisement, AdvertisementPosition } from '@/types/advertisement';
import { useAdvertisements } from '@/hooks/useAdvertisements';

// Declare global AdSense interface
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface AdDisplayProps {
  position: AdvertisementPosition;
  className?: string;
}

const AdDisplay: React.FC<AdDisplayProps> = ({ position, className = '' }) => {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adSenseReady, setAdSenseReady] = useState(false);
  const adContainerRef = useRef<HTMLDivElement>(null);
  const { getActiveAdvertisements, trackImpression, trackClick } = useAdvertisements();

  // Verificar se AdSense está pronto
  const checkAdSenseReady = useCallback(() => {
    const isReady = !!(window.adsbygoogle && Array.isArray(window.adsbygoogle));
    console.log(`🔍 AdSense ready: ${isReady}`);
    setAdSenseReady(isReady);
    return isReady;
  }, []);

  // Inicializar anúncios AdSense
  const initializeAdSenseAds = useCallback(() => {
    if (!adSenseReady || !adContainerRef.current) return;

    const adsenseElements = adContainerRef.current.querySelectorAll('ins.adsbygoogle');
    console.log(`🎯 Inicializando ${adsenseElements.length} anúncios AdSense para posição: ${position}`);

    adsenseElements.forEach((element, index) => {
      try {
        // Verificar se o anúncio já foi inicializado
        if (element.getAttribute('data-adsbygoogle-status')) {
          console.log(`⚠️ Anúncio ${index} já foi inicializado`);
          return;
        }

        // Inicializar o anúncio
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        console.log(`✅ Anúncio AdSense ${index} inicializado`);
      } catch (error) {
        console.error(`❌ Erro ao inicializar anúncio AdSense ${index}:`, error);
      }
    });
  }, [adSenseReady, position]);

  // Carregar anúncios
  useEffect(() => {
    const loadAds = async () => {
      try {
        console.log(`🔍 Carregando anúncios para posição: ${position}`);
        setLoading(true);
        setError(null);
        
        const activeAds = await getActiveAdvertisements(position);
        console.log(`📊 Anúncios encontrados para ${position}:`, activeAds);
        
        setAds(activeAds);
        
        // Rastrear impressões
        if (activeAds.length > 0) {
          activeAds.forEach(ad => {
            console.log(`👁️ Rastreando impressão para anúncio: ${ad.id} - ${ad.title}`);
            trackImpression(ad.id);
          });
        }
      } catch (err) {
        console.error(`❌ Erro ao carregar anúncios para ${position}:`, err);
        setError('Erro ao carregar anúncios');
      } finally {
        setLoading(false);
      }
    };

    loadAds();
  }, [position, getActiveAdvertisements, trackImpression]);

  // Verificar estado do AdSense
  useEffect(() => {
    checkAdSenseReady();

    // Listener para quando o AdSense for carregado
    const handleAdSenseLoaded = () => {
      console.log('📡 Evento AdSense carregado recebido');
      checkAdSenseReady();
    };

    window.addEventListener('adsense-loaded', handleAdSenseLoaded);

    // Verificar periodicamente se AdSense está pronto
    const interval = setInterval(() => {
      if (!adSenseReady) {
        checkAdSenseReady();
      }
    }, 1000);

    return () => {
      window.removeEventListener('adsense-loaded', handleAdSenseLoaded);
      clearInterval(interval);
    };
  }, [checkAdSenseReady, adSenseReady]);

  // Inicializar anúncios AdSense quando estiver pronto
  useEffect(() => {
    if (adSenseReady && ads.length > 0 && !loading) {
      const adsenseAds = ads.filter(ad => ad.type === 'adsense');
      if (adsenseAds.length > 0) {
        console.log(`🎯 Tentando inicializar ${adsenseAds.length} anúncios AdSense`);
        
        // Aguardar um pouco para garantir que o DOM foi atualizado
        const timeout = setTimeout(() => {
          initializeAdSenseAds();
        }, 500);

        return () => clearTimeout(timeout);
      }
    }
  }, [adSenseReady, ads, loading, initializeAdSenseAds]);

  const handleAdClick = useCallback((ad: Advertisement) => {
    console.log(`🖱️ Clique no anúncio: ${ad.id} - ${ad.title}`);
    trackClick(ad.id);
    if (ad.type === 'banner' && ad.link_url) {
      window.open(ad.link_url, '_blank', 'noopener,noreferrer');
    }
  }, [trackClick]);

  const renderAdSenseAd = useCallback((ad: Advertisement) => {
    console.log(`🎯 Renderizando AdSense: ${ad.title}`);
    
    // Processar conteúdo HTML do anúncio para garantir que está correto
    let adContent = ad.content;
    
    // Se não contém a tag ins, criar uma estrutura básica
    if (!adContent.includes('<ins')) {
      adContent = `
        <ins class="adsbygoogle"
             style="display:block"
             data-ad-client="ca-pub-6206525680408961"
             data-ad-slot="1234567890"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
      `;
    }
    
    return (
      <div 
        key={ad.id}
        className="adsense-ad mb-4"
        dangerouslySetInnerHTML={{ __html: adContent }}
      />
    );
  }, []);

  const renderBannerAd = useCallback((ad: Advertisement) => {
    return (
      <div 
        key={ad.id}
        className={`banner-ad transition-opacity hover:opacity-80 mb-4 ${
          ad.link_url ? 'cursor-pointer' : 'cursor-default'
        }`}
        onClick={() => handleAdClick(ad)}
        role={ad.link_url ? 'button' : 'img'}
        tabIndex={ad.link_url ? 0 : -1}
        onKeyDown={(e) => {
          if (ad.link_url && (e.key === 'Enter' || e.key === ' ')) {
            handleAdClick(ad);
          }
        }}
      >
        <img 
          src={ad.content} 
          alt={ad.title}
          className="w-full h-auto max-w-full"
          loading="lazy"
          onError={(e) => {
            console.error(`❌ Erro ao carregar imagem do banner: ${ad.title}`);
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
      </div>
    );
  }, [handleAdClick]);

  if (loading) {
    return (
      <div className={`ad-container ${className}`}>
        <div className="animate-pulse bg-gray-200 h-32 rounded-lg mb-2"></div>
        <div className="text-xs text-gray-500 text-center">
          Carregando anúncios...
        </div>
      </div>
    );
  }

  if (error) {
    console.warn(`⚠️ Erro na exibição de anúncios para ${position}: ${error}`);
    return null;
  }

  if (ads.length === 0) {
    console.log(`📭 Nenhum anúncio ativo encontrado para posição: ${position}`);
    return null;
  }

  console.log(`🎨 Renderizando ${ads.length} anúncios para posição: ${position}`);

  return (
    <div ref={adContainerRef} className={`ad-container ${className}`}>
      {ads.map((ad) => (
        <div key={ad.id} className="ad-item">
          {ad.type === 'adsense' ? renderAdSenseAd(ad) : renderBannerAd(ad)}
          <div className="text-xs text-gray-500 text-center mb-2">
            Publicidade
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdDisplay;
