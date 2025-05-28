
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchAdminUser = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Erro ao buscar dados do admin:', error);
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
          .single();

        if (error || !data) {
          console.error('Demo admin user not found:', error);
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

      // For real authentication (when properly set up)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Erro no login:', error);
        return false;
      }

      if (data.user) {
        const adminUser = await fetchAdminUser(data.user.id);
        if (adminUser) {
          setUser(adminUser);
          return true;
        } else {
          // User authenticated but not an admin
          await supabase.auth.signOut();
          return false;
        }
      }

      return false;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  const refreshUser = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (authUser) {
        const adminUser = await fetchAdminUser(authUser.id);
        setUser(adminUser);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      setUser(null);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const adminUser = await fetchAdminUser(session.user.id);
          setUser(adminUser);
        }
      } catch (error) {
        console.error('Erro ao inicializar auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const adminUser = await fetchAdminUser(session.user.id);
          setUser(adminUser);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    user,
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
