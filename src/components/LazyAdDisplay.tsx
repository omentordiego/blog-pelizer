
import React, { Suspense, useState, useEffect, useCallback } from 'react';
import { AdvertisementPosition } from '@/types/advertisement';

// Lazy load the AdDisplay component
const AdDisplay = React.lazy(() => import('./AdDisplay'));

interface LazyAdDisplayProps {
  position: AdvertisementPosition;
  className?: string;
}

const AdDisplaySkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`ad-container ${className}`}>
    <div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
    <div className="text-xs text-gray-500 mt-1 text-center">
      Carregando anúncios...
    </div>
  </div>
);

const LazyAdDisplay: React.FC<LazyAdDisplayProps> = ({ position, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [elementRef, setElementRef] = useState<HTMLDivElement | null>(null);

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry.isIntersecting && !isIntersecting) {
      console.log(`🎯 Anúncio ${position} entrou na viewport - iniciando carregamento`);
      setIsIntersecting(true);
      setIsVisible(true);
    }
  }, [isIntersecting, position]);

  useEffect(() => {
    if (!elementRef) return;

    const observer = new IntersectionObserver(handleIntersection, { 
      threshold: 0.1,
      rootMargin: '50px' // Começar a carregar 50px antes de aparecer
    });

    observer.observe(elementRef);

    return () => {
      observer.disconnect();
    };
  }, [elementRef, handleIntersection]);

  return (
    <div ref={setElementRef} className={className}>
      {isVisible ? (
        <Suspense fallback={<AdDisplaySkeleton className={className} />}>
          <AdDisplay position={position} className={className} />
        </Suspense>
      ) : (
        <AdDisplaySkeleton className={className} />
      )}
    </div>
  );
};

export default LazyAdDisplay;
