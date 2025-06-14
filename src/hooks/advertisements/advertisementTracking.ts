
import { useCallback } from 'react';
import { advertisementService } from '@/services/advertisementService';

export const useAdvertisementTracking = () => {
  const trackImpression = useCallback(async (advertisementId: string) => {
    try {
      await advertisementService.trackImpression(advertisementId);
    } catch (error) {
      console.error('❌ Erro ao rastrear impressão:', error);
    }
  }, []);

  const trackClick = useCallback(async (advertisementId: string) => {
    try {
      await advertisementService.trackClick(advertisementId);
    } catch (error) {
      console.error('❌ Erro ao rastrear clique:', error);
    }
  }, []);

  return {
    trackImpression,
    trackClick
  };
};
