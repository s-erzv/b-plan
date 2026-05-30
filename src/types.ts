export interface BusinessProfile {
  id: string;
  userId: string;
  productName: string;
  targetAudience: string;
  businessCategory?: string;
  tone?: string;
  usp?: string;
  specialOffer?: string;
  keywords?: string;
  createdAt: Date | string;
}

export interface ContentDay {
  day: number;
  theme: string;
  visual_concept: string;
  caption: string;
  hashtags: string[];
}

export interface SavedCalendar {
  id: string;
  userId: string;
  productName: string;
  targetAudience: string;
  businessCategory?: string;
  tone?: string;
  usp?: string;
  specialOffer?: string;
  keywords?: string;
  items: ContentDay[];
  createdAt: string;
}
