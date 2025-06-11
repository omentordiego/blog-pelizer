
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);

      // Check for your specific credentials
      if (email === 'pelizervanderlei@gmail.com' && password === '@Pelizer22') {
        // Get or create the admin user in the database
        let { data, error } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', email)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Erro ao buscar admin user:', error);
          return false;
        }

        // If user doesn't exist, create it
        if (!data) {
          const { data: newUser, error: insertError } = await supabase
            .from('admin_users')
            .insert([{
              email: 'pelizervanderlei@gmail.com',
              name: 'Vanderlei Pelizer',
              role: 'admin'
            }])
            .select()
            .single();

          if (insertError) {
            console.error('Erro ao criar admin user:', insertError);
            return false;
          }
          data = newUser;
        }

        setUser({
          id: data.id,
          email: data.email,
          name: data.name,
          role: data.role || 'admin',
          avatar: data.avatar || undefined
        });

        return true;
      }

      // For real authentication with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Erro no login:', error);
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
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchAdminUser, toast]);

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  }, []);

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
  }, [fetchAdminUser]);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Check for existing session first
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (mounted && currentSession?.user) {
          setSession(currentSession);
          // Defer admin user fetch to avoid blocking UI
          setTimeout(async () => {
            if (mounted) {
              const adminUser = await fetchAdminUser(currentSession.user.id);
              if (mounted) {
                setUser(adminUser);
              }
            }
          }, 0);
        }

        // Set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, currentSession) => {
            if (!mounted) return;
            
            console.log('Auth state changed:', event);
            
            setSession(currentSession);
            
            if (event === 'SIGNED_IN' && currentSession?.user) {
              // Defer the admin user fetch to avoid potential deadlocks
              setTimeout(async () => {
                if (mounted) {
                  const adminUser = await fetchAdminUser(currentSession.user.id);
                  if (mounted) {
                    setUser(adminUser);
                  }
                }
              }, 0);
            } else if (event === 'SIGNED_OUT') {
              if (mounted) {
                setUser(null);
              }
            }
            
            if (event === 'TOKEN_REFRESHED') {
              console.log('Token refreshed successfully');
            }
          }
        );

        if (mounted) {
          setIsLoading(false);
        }

        return () => {
          mounted = false;
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Erro ao inicializar auth:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, [fetchAdminUser]);

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
