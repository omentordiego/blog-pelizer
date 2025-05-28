
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
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

      return data;
    } catch (error) {
      console.error('Erro ao buscar dados do admin:', error);
      return null;
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session);
        setSession(session);
        
        if (session?.user) {
          // Check if this is the demo user first
          if (session.user.email === 'admin@pontovista.com') {
            setUser({
              id: session.user.id,
              email: 'admin@pontovista.com',
              name: 'Vanderlei Pelizer',
              role: 'admin'
            });
          } else {
            // Try to fetch admin user data from database
            const adminUser = await fetchAdminUser(session.user.id);
            if (adminUser) {
              setUser({
                id: adminUser.id,
                email: adminUser.email,
                name: adminUser.name,
                role: adminUser.role || 'editor',
                avatar: adminUser.avatar || undefined
              });
            } else {
              // Create admin user entry if it doesn't exist
              try {
                const { data: newAdminUser, error } = await supabase
                  .from('admin_users')
                  .insert([
                    {
                      user_id: session.user.id,
                      email: session.user.email || '',
                      name: session.user.user_metadata?.full_name || session.user.email || 'Usuário',
                      role: 'admin'
                    }
                  ])
                  .select()
                  .single();

                if (error) {
                  console.error('Erro ao criar usuário admin:', error);
                  setUser(null);
                } else {
                  setUser({
                    id: newAdminUser.id,
                    email: newAdminUser.email,
                    name: newAdminUser.name,
                    role: newAdminUser.role || 'admin',
                    avatar: newAdminUser.avatar || undefined
                  });
                }
              } catch (error) {
                console.error('Erro ao criar usuário admin:', error);
                setUser(null);
              }
            }
          }
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        console.log('Existing session found:', session);
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Special handling for demo credentials
      if (email === 'admin@pontovista.com' && password === 'admin123') {
        // Create a mock session for demo purposes
        setUser({
          id: 'demo-user-id',
          email: 'admin@pontovista.com',
          name: 'Vanderlei Pelizer',
          role: 'admin'
        });
        setSession({
          access_token: 'demo_token',
          token_type: 'bearer',
          expires_in: 3600,
          expires_at: Date.now() + 3600000,
          refresh_token: 'demo_refresh',
          user: {
            id: 'demo-user-id',
            email: 'admin@pontovista.com',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            app_metadata: {},
            user_metadata: {},
            aud: 'authenticated'
          }
        } as Session);
        setIsLoading(false);
        return true;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Erro no login:', error);
        setIsLoading(false);
        return false;
      }

      console.log('Login successful:', data);
      return true;
    } catch (error) {
      console.error('Erro no login:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      // Handle demo logout
      if (user?.email === 'admin@pontovista.com' && session?.access_token === 'demo_token') {
        setUser(null);
        setSession(null);
        return;
      }

      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  const value = {
    user,
    session,
    login,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
