
import { supabase } from '@/integrations/supabase/client';

export const authService = {
  async createAdminUser(email: string, password: string, name: string, role: string = 'admin') {
    try {
      // First create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name
          }
        }
      });

      if (authError) {
        console.error('Erro ao criar usuário de autenticação:', authError);
        throw authError;
      }

      if (!authData.user) {
        throw new Error('Falha ao criar usuário de autenticação');
      }

      // Then create the admin user record
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .insert([{
          user_id: authData.user.id,
          email: email,
          name: name,
          role: role
        }])
        .select()
        .single();

      if (adminError) {
        console.error('Erro ao criar registro de admin:', adminError);
        // Try to clean up the auth user if admin creation fails
        await supabase.auth.admin.deleteUser(authData.user.id);
        throw adminError;
      }

      return {
        id: adminData.id,
        email: adminData.email,
        name: adminData.name,
        role: adminData.role,
        avatar: adminData.avatar
      };
    } catch (error) {
      console.error('Erro no serviço de criação de admin:', error);
      throw error;
    }
  },

  async updateAdminUser(userId: string, updates: { name?: string; role?: string; avatar?: string }) {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar usuário admin:', error);
        throw error;
      }

      return {
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role,
        avatar: data.avatar
      };
    } catch (error) {
      console.error('Erro no serviço de atualização de admin:', error);
      throw error;
    }
  },

  async deleteAdminUser(userId: string) {
    try {
      // First delete the admin user record
      const { error: adminError } = await supabase
        .from('admin_users')
        .delete()
        .eq('user_id', userId);

      if (adminError) {
        console.error('Erro ao deletar registro de admin:', adminError);
        throw adminError;
      }

      // Then delete the auth user
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);

      if (authError) {
        console.error('Erro ao deletar usuário de autenticação:', authError);
        throw authError;
      }

      return true;
    } catch (error) {
      console.error('Erro no serviço de exclusão de admin:', error);
      throw error;
    }
  }
};
