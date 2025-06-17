
export interface NewsletterSubscriber {
  id: string;
  email: string;
  name?: string;
  is_active: boolean;
  subscribed_at: string;
  unsubscribed_at?: string;
}

export interface NewsletterContextType {
  subscribers: NewsletterSubscriber[];
  isLoading: boolean;
  subscribe: (email: string, name?: string) => Promise<boolean>;
  unsubscribe: (email: string) => Promise<void>;
  exportSubscribers: () => Promise<void>;
  refreshSubscribers: () => Promise<void>;
}
