
import React, { Suspense, useState, useEffect } from 'react';
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
  const [elementRef, setElementRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!elementRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(elementRef);

    return () => observer.disconnect();
  }, [elementRef]);

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
