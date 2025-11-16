import type { Brewery, SearchParams, AnalyticsData } from '../types/Brewery';

// Use relative path in production (same domain), localhost in development
const API_BASE_URL =
  import.meta.env.MODE === 'production'
    ? '/api/breweries'
    : 'http://localhost:5000/api/breweries';

export const searchBreweries = async (
  params: SearchParams,
  favoritesOnly: boolean = false
): Promise<Brewery[]> => {
  const queryParams = new URLSearchParams();

  if (favoritesOnly) {
    queryParams.append('favorites_only', 'true');
  }

  if (params.by_type) {
    queryParams.append('by_type', params.by_type);
  }

  if (params.by_country) {
    queryParams.append('by_country', params.by_country);
  }

  if (params.query) {
    queryParams.append('query', params.query);
  }

  const url = `${API_BASE_URL}?${queryParams.toString()}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch breweries');
  }

  return response.json();
};

export const getBrewery = async (id: string): Promise<Brewery> => {
  const url = `${API_BASE_URL}/${id}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch brewery');
  }

  return response.json();
};

export const toggleFavorite = async (id: string): Promise<Brewery> => {
  const url = `${API_BASE_URL}/${id}/favorite`;

  const response = await fetch(url, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Failed to toggle favorite');
  }

  return response.json();
};

export const getFavoritesAnalytics = async (): Promise<AnalyticsData> => {
  const analyticsUrl =
    import.meta.env.MODE === 'production'
      ? '/api/analytics/favorites'
      : 'http://localhost:5000/api/analytics/favorites';

  const response = await fetch(analyticsUrl);

  if (!response.ok) {
    throw new Error('Failed to fetch analytics');
  }

  return response.json();
};
