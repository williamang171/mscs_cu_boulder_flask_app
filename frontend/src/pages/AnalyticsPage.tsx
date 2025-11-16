import { useState, useEffect } from 'react';
import {
  Container,
  Heading,
  VStack,
  SimpleGrid,
  Text,
  Box,
  Card,
} from '@chakra-ui/react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { Alert } from '../components/ui/alert';
import { getFavoritesAnalytics } from '../api/breweryApi';
import type { AnalyticsData } from '../types/Brewery';

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884D8',
  '#82CA9D',
  '#FFC658',
  '#FF6B9D',
  '#C084FC',
  '#34D399',
];

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getFavoritesAnalytics();
        setAnalytics(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load analytics'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack gap={8}>
          <Heading size="2xl" color="blue.700">
            Analytics Loading...
          </Heading>
        </VStack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="container.xl" py={8}>
        <Alert status="error" title="Error!">
          {error}
        </Alert>
      </Container>
    );
  }

  if (!analytics || analytics.total_favorites === 0) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack gap={8}>
          <Heading size="2xl" color="blue.700">
            Favorites Analytics
          </Heading>
          <Alert status="info" title="No Data">
            You haven't added any favorite breweries yet. Add some favorites to
            see analytics!
          </Alert>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack gap={8} align="stretch">
        <Box textAlign="center">
          <Heading size="2xl" mb={2} color="blue.700">
            Favorites Analytics
          </Heading>
          <Text fontSize="xl" color="gray.600">
            Total Favorite Breweries:{' '}
            <strong>{analytics.total_favorites}</strong>
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, lg: 2 }} gap={8}>
          {/* Brewery Type Chart */}
          {analytics.by_type.length > 0 && (
            <Card.Root>
              <Card.Body>
                <VStack gap={4}>
                  <Heading size="lg" color="blue.600">
                    By Brewery Type
                  </Heading>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analytics.by_type}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name}: ${
                            percent ? (percent * 100).toFixed(0) : 0
                          }%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {analytics.by_type.map((_entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </VStack>
              </Card.Body>
            </Card.Root>
          )}

          {/* Country Chart */}
          {analytics.by_country.length > 0 && (
            <Card.Root>
              <Card.Body>
                <VStack gap={4}>
                  <Heading size="lg" color="blue.600">
                    By Country
                  </Heading>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analytics.by_country}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name}: ${
                            percent ? (percent * 100).toFixed(0) : 0
                          }%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {analytics.by_country.map((_entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </VStack>
              </Card.Body>
            </Card.Root>
          )}
        </SimpleGrid>
      </VStack>
    </Container>
  );
};

export default AnalyticsPage;
