
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdminUser } from '@/types/auth';

export const useAdminUser = () => {
  const fetchAdminUser = useCallback(async (userId: string): Promise<AdminUser | null> => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar dados do admin:', error);
        return null;
      }

      if (!data) {
        console.log('Usuário não é admin');
        return null;
      }

      return {
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role || 'editor',
        avatar: data.avatar || undefined
      };
    } catch (error) {
      console.error('Erro ao buscar dados do admin:', error);
      return null;
    }
  }, []);

  const createOrGetAdminUser = useCallback(async (email: string): Promise<AdminUser | null> => {
    try {
      // First try to get existing admin user by email
      let { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao buscar admin user:', error);
        return null;
      }

      // If user exists, return it
      if (data) {
        return {
          id: data.id,
          email: data.email,
          name: data.name,
          role: data.role || 'admin',
          avatar: data.avatar || undefined
        };
      }

      // If user doesn't exist, we can't create it without proper auth user
      console.log('Admin user não encontrado para email:', email);
      return null;
    } catch (error) {
      console.error('Erro ao buscar admin user:', error);
      return null;
    }
  }, []);

  return {
    fetchAdminUser,
    createOrGetAdminUser
  };
};
