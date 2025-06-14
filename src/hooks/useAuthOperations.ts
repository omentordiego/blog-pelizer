
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AdminUser } from '@/types/auth';

interface UseAuthOperationsProps {
  fetchAdminUser: (userId: string) => Promise<AdminUser | null>;
  setUser: (user: AdminUser | null) => void;
  setSession: (session: any) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useAuthOperations = ({
  fetchAdminUser,
  setUser,
  setSession,
  setIsLoading
}: UseAuthOperationsProps) => {
  const { toast } = useToast();

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);

      // Use Supabase Auth for authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Erro no login:', error);
        toast({
          title: "Erro no login",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      if (data.user && data.session) {
        setSession(data.session);
        const adminUser = await fetchAdminUser(data.user.id);
        if (adminUser) {
          setUser(adminUser);
          toast({
            title: "Login realizado com sucesso",
            description: `Bem-vindo, ${adminUser.name}!`,
          });
          return true;
        } else {
          // User authenticated but not an admin
          await supabase.auth.signOut();
          toast({
            title: "Acesso negado",
            description: "Você não tem permissão para acessar o painel administrativo.",
            variant: "destructive",
          });
          return false;
        }
      }

      return false;
    } catch (error) {
      console.error('Erro no login:', error);
      toast({
        title: "Erro no login",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchAdminUser, setUser, setSession, setIsLoading, toast]);

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      toast({
        title: "Logout realizado",
        description: "Você foi deslogado com sucesso.",
      });
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  }, [setUser, setSession, toast]);

  const refreshUser = useCallback(async () => {
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (currentSession?.user) {
        setSession(currentSession);
        const adminUser = await fetchAdminUser(currentSession.user.id);
        setUser(adminUser);
      } else {
        setUser(null);
        setSession(null);
      }
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      setUser(null);
      setSession(null);
    }
  }, [fetchAdminUser, setUser, setSession]);

  return {
    login,
    logout,
    refreshUser
  };
};
