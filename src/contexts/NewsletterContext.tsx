
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
      console.log('Iniciando busca de assinantes da newsletter...');
      
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('subscribed_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar assinantes:', error);
        // Não mostrar toast de erro durante carregamento inicial
        return;
      }

      console.log('Assinantes carregados com sucesso:', data?.length || 0);
      setSubscribers(data || []);
    } catch (error) {
      console.error('Erro inesperado ao buscar assinantes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const subscribe = async (email: string, name?: string): Promise<boolean> => {
    try {
      console.log('Iniciando processo de inscrição:', { email, name });
      
      if (!email || !email.trim()) {
        toast({
          title: "Erro",
          description: "Email é obrigatório",
          variant: "destructive",
        });
        return false;
      }

      const cleanEmail = email.trim().toLowerCase();
      
      // Verificar se o email já existe
      const { data: existing, error: checkError } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (checkError) {
        console.error('Erro ao verificar email existente:', checkError);
        toast({
          title: "Erro",
          description: "Erro ao verificar email. Tente novamente.",
          variant: "destructive",
        });
        return false;
      }

      if (existing) {
        if (existing.is_active) {
          toast({
            title: "Email já cadastrado",
            description: "Este email já está inscrito na newsletter.",
            variant: "destructive",
          });
          return false;
        } else {
          // Reativar inscrição
          console.log('Reativando inscrição para:', cleanEmail);
          const { error: updateError } = await supabase
            .from('newsletter_subscribers')
            .update({
              is_active: true,
              unsubscribed_at: null,
              name: name?.trim() || existing.name,
              subscribed_at: new Date().toISOString()
            })
            .eq('email', cleanEmail);

          if (updateError) {
            console.error('Erro ao reativar inscrição:', updateError);
            toast({
              title: "Erro",
              description: "Erro ao reativar inscrição. Tente novamente.",
              variant: "destructive",
            });
            return false;
          }

          await fetchSubscribers();
          toast({
            title: "Sucesso!",
            description: "Sua inscrição foi reativada com sucesso!",
          });
          return true;
        }
      }

      // Criar nova inscrição
      console.log('Criando nova inscrição para:', cleanEmail);
      const { data: newSubscriber, error: insertError } = await supabase
        .from('newsletter_subscribers')
        .insert([{
          email: cleanEmail,
          name: name?.trim() || null,
          is_active: true,
          subscribed_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (insertError) {
        console.error('Erro ao criar inscrição:', insertError);
        toast({
          title: "Erro",
          description: "Erro ao processar inscrição. Tente novamente.",
          variant: "destructive",
        });
        return false;
      }

      console.log('Inscrição criada com sucesso:', newSubscriber);
      setSubscribers(prev => [newSubscriber, ...prev]);
      
      toast({
        title: "Sucesso!",
        description: "Você foi inscrito na nossa newsletter!",
      });
      return true;
    } catch (error) {
      console.error('Erro inesperado ao inscrever:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado. Tente novamente.",
        variant: "destructive",
      });
      return false;
    }
  };

  const unsubscribe = async (email: string) => {
    try {
      console.log('Cancelando inscrição para:', email);
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
      console.log('Inscrição cancelada com sucesso para:', email);
    } catch (error) {
      console.error('Erro ao cancelar inscrição:', error);
      throw error;
    }
  };

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
