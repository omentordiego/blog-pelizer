
import { advertisementService } from '@/services/advertisementService';

export const useAdvertisementTracking = () => {
  const trackImpression = async (advertisementId: string) => {
    try {
      await advertisementService.trackImpression(advertisementId);
    } catch (error) {
      console.error('❌ Erro ao rastrear impressão:', error);
    }
  };

  const trackClick = async (advertisementId: string) => {
    try {
      await advertisementService.trackClick(advertisementId);
    } catch (error) {
      console.error('❌ Erro ao rastrear clique:', error);
    }
  };

  return {
    trackImpression,
    trackClick
  };
};
