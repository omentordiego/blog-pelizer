
import React, { useEffect, useState } from 'react';
import { Advertisement, AdvertisementPosition } from '@/types/advertisement';
import { useAdvertisements } from '@/hooks/useAdvertisements';

interface AdDisplayProps {
  position: AdvertisementPosition;
  className?: string;
}

const AdDisplay: React.FC<AdDisplayProps> = ({ position, className = '' }) => {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const { getActiveAdvertisements, trackImpression, trackClick } = useAdvertisements();

  useEffect(() => {
    const loadAds = async () => {
      const activeAds = await getActiveAdvertisements(position);
      setAds(activeAds);
      
      // Rastrear impressões
      activeAds.forEach(ad => {
        trackImpression(ad.id);
      });
    };

    loadAds();
  }, [position]);

  if (ads.length === 0) {
    return null;
  }

  const handleAdClick = (ad: Advertisement) => {
    trackClick(ad.id);
    if (ad.type === 'banner' && ad.link_url) {
      window.open(ad.link_url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className={`ad-container ${className}`}>
      {ads.map((ad) => (
        <div key={ad.id} className="ad-item mb-4">
          {ad.type === 'adsense' ? (
            <div 
              className="adsense-ad"
              dangerouslySetInnerHTML={{ __html: ad.content }}
            />
          ) : (
            <div 
              className={`banner-ad cursor-pointer transition-opacity hover:opacity-80 ${
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
              />
            </div>
          )}
          <div className="text-xs text-gray-500 mt-1 text-center">
            Publicidade
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdDisplay;
