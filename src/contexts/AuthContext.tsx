
import React, { createContext, useContext, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { AdminUser, AuthContextType } from '@/types/auth';
import { useAdminUser } from '@/hooks/useAdminUser';
import { useAuthOperations } from '@/hooks/useAuthOperations';
import { useAuthStateListener } from '@/hooks/useAuthStateListener';

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

  const { fetchAdminUser, createOrGetAdminUser } = useAdminUser();
  
  const { login, logout, refreshUser } = useAuthOperations({
    fetchAdminUser,
    createOrGetAdminUser,
    setUser,
    setSession,
    setIsLoading
  });

  useAuthStateListener({
    fetchAdminUser,
    setUser,
    setSession,
    setIsLoading
  });

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
