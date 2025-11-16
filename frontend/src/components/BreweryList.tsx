import { useState, useEffect } from 'react';
import { VStack, SimpleGrid, Text, Box } from '@chakra-ui/react';
import { Alert } from './ui/alert';
import SearchForm from './SearchForm';
import BreweryCard from './BreweryCard';
import { searchBreweries, toggleFavorite } from '../api/breweryApi';
import type { Brewery, SearchParams } from '../types/Brewery';

interface BreweryListProps {
  favoritesOnly?: boolean;
  title: string;
  emptyMessage: string;
}

const BreweryList = ({
  favoritesOnly = false,
  title,
  emptyMessage,
}: BreweryListProps) => {
  const [breweries, setBreweries] = useState<Brewery[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (params: SearchParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const results = await searchBreweries(params, favoritesOnly);
      setBreweries(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setBreweries([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load breweries on component mount
  useEffect(() => {
    handleSearch({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favoritesOnly]);

  const handleToggleFavorite = async (id: string) => {
    try {
      const updatedBrewery = await toggleFavorite(id);

      // Update the brewery in the list
      setBreweries((prevBreweries) =>
        prevBreweries.map((brewery) =>
          brewery.id === id ? updatedBrewery : brewery
        )
      );

      // If we're on favorites page and brewery was unfavorited, remove it from list
      if (favoritesOnly && !updatedBrewery.is_favorite) {
        setBreweries((prevBreweries) =>
          prevBreweries.filter((brewery) => brewery.id !== id)
        );
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to update favorite'
      );
    }
  };

  return (
    <VStack gap={8} align="stretch">
      <Box textAlign="center">
        <Text fontSize="3xl" fontWeight="bold" color="blue.700">
          {title}
        </Text>
      </Box>

      <SearchForm onSearch={handleSearch} isLoading={isLoading} />

      {error && (
        <Alert status="error" title="Error!">
          {error}
        </Alert>
      )}

      {!isLoading && breweries.length === 0 && !error && (
        <Alert status="info" title="No results">
          {emptyMessage}
        </Alert>
      )}

      {breweries.length > 0 && (
        <Box>
          <Text fontSize="lg" fontWeight="medium" mb={4} color="gray.700">
            Found {breweries.length}{' '}
            {breweries.length === 1 ? 'brewery' : 'breweries'}
          </Text>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
            {breweries.map((brewery) => (
              <BreweryCard
                key={brewery.id}
                brewery={brewery}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </SimpleGrid>
        </Box>
      )}
    </VStack>
  );
};

export default BreweryList;
