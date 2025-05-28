
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
      const { data, error } = await supabase
        .from('advertisements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAdvertisements(data || []);
    } catch (error) {
      console.error('Erro ao buscar anúncios:', error);
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
      let query = supabase
        .from('advertisements')
        .select('*')
        .eq('is_active', true);

      if (position) {
        query = query.eq('position', position);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      return data?.filter(ad => {
        const now = new Date();
        const startDate = ad.start_date ? new Date(ad.start_date) : null;
        const endDate = ad.end_date ? new Date(ad.end_date) : null;
        
        return (!startDate || startDate <= now) && (!endDate || endDate >= now);
      }) || [];
    } catch (error) {
      console.error('Erro ao buscar anúncios ativos:', error);
      return [];
    }
  };

  const createAdvertisement = async (advertisement: Omit<Advertisement, 'id' | 'created_at' | 'updated_at' | 'click_count' | 'impression_count'>) => {
    try {
      const { data, error } = await supabase
        .from('advertisements')
        .insert([advertisement])
        .select()
        .single();

      if (error) throw error;

      setAdvertisements(prev => [data, ...prev]);
      toast({
        title: "Sucesso",
        description: "Anúncio criado com sucesso",
      });

      return data;
    } catch (error) {
      console.error('Erro ao criar anúncio:', error);
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
      const { data, error } = await supabase
        .from('advertisements')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setAdvertisements(prev => 
        prev.map(ad => ad.id === id ? { ...ad, ...data } : ad)
      );

      toast({
        title: "Sucesso",
        description: "Anúncio atualizado com sucesso",
      });

      return data;
    } catch (error) {
      console.error('Erro ao atualizar anúncio:', error);
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
      const { error } = await supabase
        .from('advertisements')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAdvertisements(prev => prev.filter(ad => ad.id !== id));
      toast({
        title: "Sucesso",
        description: "Anúncio excluído com sucesso",
      });
    } catch (error) {
      console.error('Erro ao excluir anúncio:', error);
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
      // Incrementar impressões na tabela principal
      await supabase.rpc('increment', {
        table_name: 'advertisements',
        row_id: advertisementId,
        column_name: 'impression_count'
      });

      // Registrar na tabela de estatísticas
      const today = new Date().toISOString().split('T')[0];
      const { error } = await supabase
        .from('advertisement_stats')
        .upsert({
          advertisement_id: advertisementId,
          date: today,
          impressions: 1
        }, {
          onConflict: 'advertisement_id,date',
          count: 'exact'
        });

      if (error) console.error('Erro ao registrar impressão:', error);
    } catch (error) {
      console.error('Erro ao rastrear impressão:', error);
    }
  };

  const trackClick = async (advertisementId: string) => {
    try {
      // Incrementar cliques na tabela principal
      await supabase.rpc('increment', {
        table_name: 'advertisements',
        row_id: advertisementId,
        column_name: 'click_count'
      });

      // Registrar na tabela de estatísticas
      const today = new Date().toISOString().split('T')[0];
      const { error } = await supabase
        .from('advertisement_stats')
        .upsert({
          advertisement_id: advertisementId,
          date: today,
          clicks: 1
        }, {
          onConflict: 'advertisement_id,date',
          count: 'exact'
        });

      if (error) console.error('Erro ao registrar clique:', error);
    } catch (error) {
      console.error('Erro ao rastrear clique:', error);
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
