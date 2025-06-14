
import { useState, useEffect } from 'react';
import { Advertisement, AdvertisementPosition } from '@/types/advertisement';
import { advertisementService } from '@/services/advertisementService';
import { sampleAdsService } from '@/services/sampleAdsService';

export const useAdvertisementQueries = () => {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAdvertisements = async () => {
    try {
      const data = await advertisementService.fetchAll();
      setAdvertisements(data);
    } catch (error) {
      console.error('💥 Erro crítico ao buscar anúncios:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getActiveAdvertisements = async (position?: AdvertisementPosition) => {
    try {
      return await advertisementService.getActiveByPosition(position);
    } catch (error) {
      console.error('💥 Erro crítico ao buscar anúncios ativos:', error);
      return [];
    }
  };

  const initializeAds = async () => {
    await sampleAdsService.createSampleAds();
    await fetchAdvertisements();
  };

  useEffect(() => {
    initializeAds();
  }, []);

  return {
    advertisements,
    loading,
    setAdvertisements,
    fetchAdvertisements,
    getActiveAdvertisements
  };
};
