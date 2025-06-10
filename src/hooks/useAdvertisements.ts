
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Advertisement, AdvertisementPosition } from '@/types/advertisement';
import { useToast } from '@/hooks/use-toast';

export const useAdvertisements = () => {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAdvertisements = async () => {
    try {
      console.log('🔄 Buscando todos os anúncios...');
      const { data, error } = await supabase
        .from('advertisements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erro ao buscar anúncios:', error);
        throw error;
      }
      
      console.log('📋 Anúncios encontrados:', data?.length || 0);
      setAdvertisements((data || []) as Advertisement[]);
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
      console.log(`🎯 Buscando anúncios ativos para posição: ${position || 'todas'}`);
      
      let query = supabase
        .from('advertisements')
        .select('*')
        .eq('is_active', true);

      if (position) {
        query = query.eq('position', position);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('❌ Erro ao buscar anúncios ativos:', error);
        throw error;
      }
      
      console.log(`📊 Anúncios brutos encontrados: ${data?.length || 0}`);
      
      const filteredAds = (data?.filter(ad => {
        const now = new Date();
        const startDate = ad.start_date ? new Date(ad.start_date) : null;
        const endDate = ad.end_date ? new Date(ad.end_date) : null;
        
        const isActive = (!startDate || startDate <= now) && (!endDate || endDate >= now);
        
        if (!isActive) {
          console.log(`⏰ Anúncio fora do período: ${ad.title} (${ad.start_date} - ${ad.end_date})`);
        }
        
        return isActive;
      }) || []) as Advertisement[];
      
      console.log(`✅ Anúncios filtrados (ativos): ${filteredAds.length}`);
      filteredAds.forEach(ad => {
        console.log(`   • ${ad.title} (${ad.type}) - Posição: ${ad.position}`);
      });
      
      return filteredAds;
    } catch (error) {
      console.error('💥 Erro crítico ao buscar anúncios ativos:', error);
      return [];
    }
  };

  const createAdvertisement = async (advertisement: Omit<Advertisement, 'id' | 'created_at' | 'updated_at' | 'click_count' | 'impression_count'>) => {
    try {
      console.log('➕ Criando novo anúncio:', advertisement.title);
      
      const { data, error } = await supabase
        .from('advertisements')
        .insert([advertisement])
        .select()
        .single();

      if (error) throw error;

      console.log('✅ Anúncio criado com sucesso:', data.id);
      setAdvertisements(prev => [data as Advertisement, ...prev]);
      toast({
        title: "Sucesso",
        description: "Anúncio criado com sucesso",
      });

      return data as Advertisement;
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
      console.log(`📝 Atualizando anúncio: ${id}`);
      
      const { data, error } = await supabase
        .from('advertisements')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      console.log('✅ Anúncio atualizado com sucesso');
      setAdvertisements(prev => 
        prev.map(ad => ad.id === id ? { ...ad, ...data } as Advertisement : ad)
      );

      toast({
        title: "Sucesso",
        description: "Anúncio atualizado com sucesso",
      });

      return data as Advertisement;
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
      console.log(`🗑️ Excluindo anúncio: ${id}`);
      
      const { error } = await supabase
        .from('advertisements')
        .delete()
        .eq('id', id);

      if (error) throw error;

      console.log('✅ Anúncio excluído com sucesso');
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
      console.log(`📈 Rastreando impressão para anúncio: ${advertisementId}`);
      
      // Atualizar contador de impressões
      const { data: currentAd } = await supabase
        .from('advertisements')
        .select('impression_count')
        .eq('id', advertisementId)
        .single();

      if (currentAd) {
        await supabase
          .from('advertisements')
          .update({ impression_count: (currentAd.impression_count || 0) + 1 })
          .eq('id', advertisementId);
        
        console.log(`✅ Impressão registrada. Novo total: ${(currentAd.impression_count || 0) + 1}`);
      }
    } catch (error) {
      console.error('❌ Erro ao rastrear impressão:', error);
    }
  };

  const trackClick = async (advertisementId: string) => {
    try {
      console.log(`🖱️ Rastreando clique para anúncio: ${advertisementId}`);
      
      // Atualizar contador de cliques
      const { data: currentAd } = await supabase
        .from('advertisements')
        .select('click_count')
        .eq('id', advertisementId)
        .single();

      if (currentAd) {
        await supabase
          .from('advertisements')
          .update({ click_count: (currentAd.click_count || 0) + 1 })
          .eq('id', advertisementId);
        
        console.log(`✅ Clique registrado. Novo total: ${(currentAd.click_count || 0) + 1}`);
      }
    } catch (error) {
      console.error('❌ Erro ao rastrear clique:', error);
    }
  };

  useEffect(() => {
    fetchAdvertisements();
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
