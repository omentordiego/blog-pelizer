
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { NewsletterSubscriber } from '@/types/newsletter';

export const useNewsletterSubscription = () => {
  const { toast } = useToast();

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

      console.log('Inscrição cancelada com sucesso para:', email);
    } catch (error) {
      console.error('Erro ao cancelar inscrição:', error);
      throw error;
    }
  };

  return { subscribe, unsubscribe };
};
