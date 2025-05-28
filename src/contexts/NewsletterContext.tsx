
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
  subscribe: (email: string, name?: string) => Promise<void>;
  unsubscribe: (email: string) => Promise<void>;
  exportSubscribers: () => Promise<void>;
  refreshSubscribers: () => Promise<void>;
  isLoading: boolean;
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

  const fetchSubscribers = async () => {
    try {
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

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const subscribe = async (email: string, name?: string) => {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .insert([
          {
            email: email,
            name: name,
            is_active: true
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Erro ao inscrever na newsletter:', error);
        throw error;
      }

      console.log('Nova inscrição na newsletter:', data);
      await refreshSubscribers();
    } catch (error) {
      console.error('Erro ao inscrever na newsletter:', error);
      throw error;
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

      await refreshSubscribers();
    } catch (error) {
      console.error('Erro ao cancelar inscrição:', error);
      throw error;
    }
  };

  const exportSubscribers = async () => {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('email, name, subscribed_at')
        .eq('is_active', true);

      if (error) {
        console.error('Erro ao exportar assinantes:', error);
        throw error;
      }

      // Create CSV content
      const csvContent = [
        ['Email', 'Nome', 'Data de Inscrição'],
        ...data.map(sub => [
          sub.email,
          sub.name || '',
          new Date(sub.subscribed_at).toLocaleDateString('pt-BR')
        ])
      ].map(row => row.join(',')).join('\n');

      // Download CSV file
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
    console.log('Atualizando assinantes...');
    await fetchSubscribers();
  };

  return (
    <NewsletterContext.Provider value={{
      subscribers,
      subscribe,
      unsubscribe,
      exportSubscribers,
      refreshSubscribers,
      isLoading
    }}>
      {children}
    </NewsletterContext.Provider>
  );
};
