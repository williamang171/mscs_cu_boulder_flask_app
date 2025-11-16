export interface Brewery {
  id: string;
  name: string;
  brewery_type: string;
  address_1: string | null;
  address_2: string | null;
  address_3: string | null;
  city: string;
  state_province: string;
  postal_code: string;
  country: string;
  longitude: number | null;
  latitude: number | null;
  phone: string;
  website_url: string;
  state: string;
  street: string;
  is_favorite: boolean;
}

export interface SearchParams {
  by_type?: string;
  by_country?: string;
  query?: string;
}

export interface ChartDataPoint {
  name?: string;
  value?: number;
  [x: string]: unknown;
}

export interface AnalyticsData {
  total_favorites: number;
  by_type: ChartDataPoint[];
  by_country: ChartDataPoint[];
  by_state: ChartDataPoint[];
}
