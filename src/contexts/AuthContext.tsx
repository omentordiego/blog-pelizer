
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, Session } from '@supabase/supabase-js';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
}

interface AuthContextType {
  user: AdminUser | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchAdminUser = async (userId: string) => {
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
        avatar: data.avatar
      };
    } catch (error) {
      console.error('Erro ao buscar dados do admin:', error);
      return null;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);

      // For demo purposes, check if it's the demo credentials
      if (email === 'admin@pontovista.com' && password === 'admin123') {
        // Get the demo admin user from the database
        const { data, error } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', email)
          .maybeSingle();

        if (error || !data) {
          console.error('Demo admin user not found:', error);
          toast({
            title: "Erro no login",
            description: "Usuário administrador não encontrado.",
            variant: "destructive",
          });
          return false;
        }

        setUser({
          id: data.id,
          email: data.email,
          name: data.name,
          role: data.role || 'admin',
          avatar: data.avatar
        });

        return true;
      }

      // For real authentication
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
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
    } catch (error) {
      console.error('Erro no logout:', error);
      toast({
        title: "Erro no logout",
        description: "Ocorreu um erro ao fazer logout.",
        variant: "destructive",
      });
    }
  };

  const refreshUser = async () => {
    try {
      const { data: { user: authUser, session: currentSession } } = await supabase.auth.getUser();
      
      if (authUser && currentSession) {
        setSession(currentSession);
        const adminUser = await fetchAdminUser(authUser.id);
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
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, currentSession) => {
            console.log('Auth state changed:', event, currentSession?.user?.id);
            
            setSession(currentSession);
            
            if (event === 'SIGNED_IN' && currentSession?.user) {
              // Defer the admin user fetch to avoid potential deadlocks
              setTimeout(async () => {
                const adminUser = await fetchAdminUser(currentSession.user.id);
                setUser(adminUser);
              }, 0);
            } else if (event === 'SIGNED_OUT') {
              setUser(null);
            }
            
            if (event === 'TOKEN_REFRESHED') {
              console.log('Token refreshed successfully');
            }
          }
        );

        // Check for existing session
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (currentSession?.user) {
          setSession(currentSession);
          const adminUser = await fetchAdminUser(currentSession.user.id);
          setUser(adminUser);
        }

        setIsLoading(false);

        return () => subscription.unsubscribe();
      } catch (error) {
        console.error('Erro ao inicializar auth:', error);
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const value = {
    user,
    session,
    isLoading,
    login,
    logout,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
