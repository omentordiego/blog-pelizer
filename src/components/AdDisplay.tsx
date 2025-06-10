
import React, { useEffect, useState } from 'react';
import { Advertisement, AdvertisementPosition } from '@/types/advertisement';
import { useAdvertisements } from '@/hooks/useAdvertisements';

interface AdDisplayProps {
  position: AdvertisementPosition;
  className?: string;
}

const AdDisplay: React.FC<AdDisplayProps> = ({ position, className = '' }) => {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getActiveAdvertisements, trackImpression, trackClick } = useAdvertisements();

  useEffect(() => {
    const loadAds = async () => {
      try {
        console.log(`🔍 Carregando anúncios para posição: ${position}`);
        setLoading(true);
        setError(null);
        
        const activeAds = await getActiveAdvertisements(position);
        console.log(`📊 Anúncios encontrados para ${position}:`, activeAds);
        
        setAds(activeAds);
        
        // Rastrear impressões para anúncios encontrados
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

  const handleAdClick = (ad: Advertisement) => {
    console.log(`🖱️ Clique no anúncio: ${ad.id} - ${ad.title}`);
    trackClick(ad.id);
    if (ad.type === 'banner' && ad.link_url) {
      window.open(ad.link_url, '_blank', 'noopener,noreferrer');
    }
  };

  const renderAdSenseAd = (ad: Advertisement) => {
    console.log(`🎯 Renderizando AdSense: ${ad.title}`, ad.content);
    
    useEffect(() => {
      try {
        // @ts-ignore - AdSense global variable
        if (window.adsbygoogle && Array.isArray(window.adsbygoogle)) {
          window.adsbygoogle.push({});
          console.log('✅ AdSense carregado com sucesso');
        }
      } catch (error) {
        console.error('❌ Erro ao carregar AdSense:', error);
      }
    }, []);

    return (
      <div 
        className="adsense-ad"
        dangerouslySetInnerHTML={{ __html: ad.content }}
      />
    );
  };

  const renderBannerAd = (ad: Advertisement) => {
    return (
      <div 
        className={`banner-ad transition-opacity hover:opacity-80 ${
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
  };

  if (loading) {
    return (
      <div className={`ad-container ${className}`}>
        <div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
        <div className="text-xs text-gray-500 mt-1 text-center">
          Carregando anúncios...
        </div>
      </div>
    );
  }

  if (error) {
    console.warn(`⚠️ Erro na exibição de anúncios para ${position}: ${error}`);
    return null; // Não exibir erro para o usuário final
  }

  if (ads.length === 0) {
    console.log(`📭 Nenhum anúncio ativo encontrado para posição: ${position}`);
    return null;
  }

  console.log(`🎨 Renderizando ${ads.length} anúncios para posição: ${position}`);

  return (
    <div className={`ad-container ${className}`}>
      {ads.map((ad) => (
        <div key={ad.id} className="ad-item mb-4">
          {ad.type === 'adsense' ? renderAdSenseAd(ad) : renderBannerAd(ad)}
          <div className="text-xs text-gray-500 mt-1 text-center">
            Publicidade
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdDisplay;
