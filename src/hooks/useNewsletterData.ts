
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { NewsletterSubscriber } from '@/types/newsletter';

export const useNewsletterData = () => {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchSubscribers = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('Iniciando busca de assinantes da newsletter...');
      
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('subscribed_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar assinantes:', error);
        return;
      }

      console.log('Assinantes carregados com sucesso:', data?.length || 0);
      setSubscribers(data || []);
    } catch (error) {
      console.error('Erro inesperado ao buscar assinantes:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const exportSubscribers = async () => {
    try {
      const activeSubscribers = subscribers.filter(sub => sub.is_active);
      
      if (activeSubscribers.length === 0) {
        toast({
          title: "Aviso",
          description: "Não há assinantes ativos para exportar.",
          variant: "destructive",
        });
        return;
      }

      const csvContent = [
        ['Email', 'Nome', 'Data de Inscrição'],
        ...activeSubscribers.map(sub => [
          sub.email,
          sub.name || '',
          new Date(sub.subscribed_at).toLocaleDateString('pt-BR')
        ])
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `newsletter_subscribers_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao exportar assinantes:', error);
      throw error;
    }
  };

  const addSubscriber = (newSubscriber: NewsletterSubscriber) => {
    setSubscribers(prev => [newSubscriber, ...prev]);
  };

  return {
    subscribers,
    isLoading,
    fetchSubscribers,
    exportSubscribers,
    addSubscriber,
    setSubscribers
  };
};
