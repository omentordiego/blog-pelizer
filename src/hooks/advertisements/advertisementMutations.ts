
import { Advertisement } from '@/types/advertisement';
import { advertisementService } from '@/services/advertisementService';
import { useToast } from '@/hooks/use-toast';

export const useAdvertisementMutations = (
  setAdvertisements: React.Dispatch<React.SetStateAction<Advertisement[]>>
) => {
  const { toast } = useToast();

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

  return {
    createAdvertisement,
    updateAdvertisement,
    deleteAdvertisement
  };
};
