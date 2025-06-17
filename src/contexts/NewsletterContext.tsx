
import React, { createContext, useContext, useEffect } from 'react';
import { NewsletterContextType } from '@/types/newsletter';
import { useNewsletterData } from '@/hooks/useNewsletterData';
import { useNewsletterSubscription } from '@/hooks/useNewsletterSubscription';

const NewsletterContext = createContext<NewsletterContextType | null>(null);

export const useNewsletter = () => {
  const context = useContext(NewsletterContext);
  if (!context) {
    throw new Error('useNewsletter deve ser usado dentro de um NewsletterProvider');
  }
  return context;
};

export const NewsletterProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    subscribers,
    isLoading,
    fetchSubscribers,
    exportSubscribers,
    addSubscriber
  } = useNewsletterData();
  
  const { subscribe: subscribeUser, unsubscribe: unsubscribeUser } = useNewsletterSubscription();

  const subscribe = async (email: string, name?: string): Promise<boolean> => {
    const success = await subscribeUser(email, name);
    if (success) {
      // Refresh subscribers after successful subscription
      await fetchSubscribers();
    }
    return success;
  };

  const unsubscribe = async (email: string) => {
    await unsubscribeUser(email);
    await fetchSubscribers();
  };

  const refreshSubscribers = async () => {
    await fetchSubscribers();
  };

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  const value = {
    subscribers,
    isLoading,
    subscribe,
    unsubscribe,
    exportSubscribers,
    refreshSubscribers
  };

  return (
    <NewsletterContext.Provider value={value}>
      {children}
    </NewsletterContext.Provider>
  );
};
