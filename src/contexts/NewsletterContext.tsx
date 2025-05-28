
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface NewsletterSubscriber {
  id: string;
  email: string;
  name?: string;
  is_active: boolean;
  subscribed_at: string;
  unsubscribed_at?: string;
}

interface NewsletterContextType {
  subscribers: NewsletterSubscriber[];
  isLoading: boolean;
  subscribe: (email: string, name?: string) => Promise<boolean>;
  unsubscribe: (email: string) => Promise<void>;
  exportSubscribers: () => Promise<void>;
  refreshSubscribers: () => Promise<void>;
}

const NewsletterContext = createContext<NewsletterContextType | null>(null);

export const useNewsletter = () => {
  const context = useContext(NewsletterContext);
  if (!context) {
    throw new Error('useNewsletter deve ser usado dentro de um NewsletterProvider');
  }
  return context;
};

export const NewsletterProvider = ({ children }: { children: React.ReactNode }) => {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchSubscribers = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('subscribed_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar assinantes:', error);
        return;
      }

      setSubscribers(data || []);
    } catch (error) {
      console.error('Erro ao buscar assinantes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const subscribe = async (email: string, name?: string): Promise<boolean> => {
    try {
      // Check if email already exists
      const { data: existing } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .eq('email', email)
        .single();

      if (existing) {
        if (existing.is_active) {
          toast({
            title: "Email já cadastrado",
            description: "Este email já está inscrito na newsletter.",
            variant: "destructive",
          });
          return false;
        } else {
          // Reactivate subscription
          const { error } = await supabase
            .from('newsletter_subscribers')
            .update({
              is_active: true,
              unsubscribed_at: null,
              name: name || existing.name
            })
            .eq('email', email);

          if (error) {
            console.error('Erro ao reativar inscrição:', error);
            return false;
          }

          await fetchSubscribers();
          return true;
        }
      }

      // Create new subscription
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .insert([{
          email,
          name,
          is_active: true
        }])
        .select()
        .single();

      if (error) {
        console.error('Erro ao inscrever:', error);
        return false;
      }

      setSubscribers(prev => [data, ...prev]);
      return true;
    } catch (error) {
      console.error('Erro ao inscrever:', error);
      return false;
    }
  };

  const unsubscribe = async (email: string) => {
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .update({
          is_active: false,
          unsubscribed_at: new Date().toISOString()
        })
        .eq('email', email);

      if (error) {
        console.error('Erro ao cancelar inscrição:', error);
        throw error;
      }

      await fetchSubscribers();
    } catch (error) {
      console.error('Erro ao cancelar inscrição:', error);
      throw error;
    }
  };

  const exportSubscribers = async () => {
    try {
      const activeSubscribers = subscribers.filter(sub => sub.is_active);
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
    } catch (error) {
      console.error('Erro ao exportar assinantes:', error);
      throw error;
    }
  };

  const refreshSubscribers = async () => {
    await fetchSubscribers();
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const value = {
    subscribers,
    isLoading,
    subscribe,
    unsubscribe,
    exportSubscribers,
    refreshSubscribers
  };

  return (
    <NewsletterContext.Provider value={value}>
      {children}
    </NewsletterContext.Provider>
  );
};
