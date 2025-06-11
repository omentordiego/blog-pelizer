
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdminUser } from '@/types/auth';
import { Session } from '@supabase/supabase-js';

interface UseAuthStateListenerProps {
  fetchAdminUser: (userId: string) => Promise<AdminUser | null>;
  setUser: (user: AdminUser | null) => void;
  setSession: (session: Session | null) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useAuthStateListener = ({
  fetchAdminUser,
  setUser,
  setSession,
  setIsLoading
}: UseAuthStateListenerProps) => {
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
  }, [fetchAdminUser, setUser, setSession, setIsLoading]);
};
