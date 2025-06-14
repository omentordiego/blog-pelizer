
import { useAdvertisementQueries } from './advertisements/advertisementQueries';
import { useAdvertisementMutations } from './advertisements/advertisementMutations';
import { useAdvertisementTracking } from './advertisements/advertisementTracking';

export const useAdvertisements = () => {
  const {
    advertisements,
    loading,
    setAdvertisements,
    fetchAdvertisements,
    getActiveAdvertisements
  } = useAdvertisementQueries();

  const {
    createAdvertisement,
    updateAdvertisement,
    deleteAdvertisement
  } = useAdvertisementMutations(setAdvertisements);

  const {
    trackImpression,
    trackClick
  } = useAdvertisementTracking();

  return {
    advertisements,
    loading,
    fetchAdvertisements,
    getActiveAdvertisements,
    createAdvertisement,
    updateAdvertisement,
    deleteAdvertisement,
    trackImpression,
    trackClick
  };
};
