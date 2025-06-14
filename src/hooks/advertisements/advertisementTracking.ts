
import { useCallback } from 'react';
import { advertisementService } from '@/services/advertisementService';

export const useAdvertisementTracking = () => {
  const trackImpression = useCallback(async (advertisementId: string) => {
    try {
      await advertisementService.trackImpression(advertisementId);
      console.log(`✅ Impressão rastreada com sucesso para: ${advertisementId}`);
    } catch (error) {
      console.error('❌ Erro ao rastrear impressão:', error);
      // Fail silently for tracking to not break user experience
    }
  }, []);

  const trackClick = useCallback(async (advertisementId: string) => {
    try {
      await advertisementService.trackClick(advertisementId);
      console.log(`✅ Clique rastreado com sucesso para: ${advertisementId}`);
    } catch (error) {
      console.error('❌ Erro ao rastrear clique:', error);
      // Fail silently for tracking to not break user experience
    }
  }, []);

  return {
    trackImpression,
    trackClick
  };
};
