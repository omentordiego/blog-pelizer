
import { supabase } from '@/integrations/supabase/client';
import { Advertisement, AdvertisementPosition } from '@/types/advertisement';

export const advertisementService = {
  async fetchAll() {
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
    return (data || []) as Advertisement[];
  },

  async getActiveByPosition(position?: AdvertisementPosition) {
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
  },

  async create(advertisement: Omit<Advertisement, 'id' | 'created_at' | 'updated_at' | 'click_count' | 'impression_count'>) {
    console.log('➕ Criando novo anúncio:', advertisement.title);
    
    const { data, error } = await supabase
      .from('advertisements')
      .insert([advertisement])
      .select()
      .single();

    if (error) throw error;

    console.log('✅ Anúncio criado com sucesso:', data.id);
    return data as Advertisement;
  },

  async update(id: string, updates: Partial<Advertisement>) {
    console.log(`📝 Atualizando anúncio: ${id}`);
    
    const { data, error } = await supabase
      .from('advertisements')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    console.log('✅ Anúncio atualizado com sucesso');
    return data as Advertisement;
  },

  async delete(id: string) {
    console.log(`🗑️ Excluindo anúncio: ${id}`);
    
    const { error } = await supabase
      .from('advertisements')
      .delete()
      .eq('id', id);

    if (error) throw error;

    console.log('✅ Anúncio excluído com sucesso');
  },

  async trackImpression(advertisementId: string) {
    console.log(`📈 Rastreando impressão para anúncio: ${advertisementId}`);
    
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
  },

  async trackClick(advertisementId: string) {
    console.log(`🖱️ Rastreando clique para anúncio: ${advertisementId}`);
    
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
  }
};
