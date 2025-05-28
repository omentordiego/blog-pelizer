
export interface Advertisement {
  id: string;
  title: string;
  type: 'adsense' | 'banner';
  content: string;
  link_url?: string;
  position: 'header' | 'between_articles' | 'sidebar' | 'article_footer' | 'site_footer' | 'exit_popup';
  is_active: boolean;
  start_date?: string;
  end_date?: string;
  click_count: number;
  impression_count: number;
  created_at: string;
  updated_at: string;
}

export interface AdvertisementStats {
  id: string;
  advertisement_id: string;
  date: string;
  clicks: number;
  impressions: number;
  created_at: string;
}

export type AdvertisementPosition = Advertisement['position'];
export type AdvertisementType = Advertisement['type'];
