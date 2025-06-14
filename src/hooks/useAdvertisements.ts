
import { useState, useEffect } from 'react';
import { Advertisement, AdvertisementPosition } from '@/types/advertisement';
import { useToast } from '@/hooks/use-toast';
import { advertisementService } from '@/services/advertisementService';
import { sampleAdsService } from '@/services/sampleAdsService';

export const useAdvertisements = () => {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAdvertisements = async () => {
    try {
      const data = await advertisementService.fetchAll();
      setAdvertisements(data);
    } catch (error) {
      console.error('💥 Erro crítico ao buscar anúncios:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os anúncios",
        variant: "destructive",
      });
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

  const createAdvertisement = async (advertisement: Omit<Advertisement, 'id' | 'created_at' | 'updated_at' | 'click_count' | 'impression_count'>) => {
    try {
      const data = await advertisementService.create(advertisement);
      setAdvertisements(prev => [data, ...prev]);
      toast({
        title: "Sucesso",
        description: "Anúncio criado com sucesso",
      });
      return data;
    } catch (error) {
      console.error('❌ Erro ao criar anúncio:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o anúncio",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateAdvertisement = async (id: string, updates: Partial<Advertisement>) => {
    try {
      const data = await advertisementService.update(id, updates);
      setAdvertisements(prev => 
        prev.map(ad => ad.id === id ? { ...ad, ...data } as Advertisement : ad)
      );
      toast({
        title: "Sucesso",
        description: "Anúncio atualizado com sucesso",
      });
      return data;
    } catch (error) {
      console.error('❌ Erro ao atualizar anúncio:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o anúncio",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteAdvertisement = async (id: string) => {
    try {
      await advertisementService.delete(id);
      setAdvertisements(prev => prev.filter(ad => ad.id !== id));
      toast({
        title: "Sucesso",
        description: "Anúncio excluído com sucesso",
      });
    } catch (error) {
      console.error('❌ Erro ao excluir anúncio:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o anúncio",
        variant: "destructive",
      });
      throw error;
    }
  };

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

  useEffect(() => {
    const initializeAds = async () => {
      await sampleAdsService.createSampleAds();
      await fetchAdvertisements();
    };
    
    initializeAds();
  }, []);

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
