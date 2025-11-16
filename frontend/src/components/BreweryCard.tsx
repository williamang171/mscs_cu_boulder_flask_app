import {
  Card,
  Heading,
  Text,
  Badge,
  VStack,
  HStack,
  IconButton,
} from '@chakra-ui/react';
import { LuPhone, LuStar } from 'react-icons/lu';
import type { Brewery } from '../types/Brewery';

interface BreweryCardProps {
  brewery: Brewery;
  onToggleFavorite: (id: string) => void;
}

const BreweryCard = ({ brewery, onToggleFavorite }: BreweryCardProps) => {
  const formatPhone = (phone: string) => {
    if (!phone) return null;
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(
        6
      )}`;
    }
    return phone;
  };

  return (
    <Card.Root
      size="md"
      variant="outline"
      _hover={{ shadow: 'md', borderColor: 'blue.400' }}
      transition="all 0.2s"
    >
      <Card.Body>
        <VStack align="stretch" gap={3}>
          <HStack justify="space-between" align="start">
            <VStack align="stretch" gap={1} flex={1}>
              <Heading size="md" color="blue.600">
                {brewery.name}
              </Heading>
              <Badge colorPalette="purple" size="sm" width="fit-content">
                {brewery.brewery_type}
              </Badge>
            </VStack>
            <IconButton
              aria-label={
                brewery.is_favorite
                  ? 'Remove from favorites'
                  : 'Add to favorites'
              }
              size="sm"
              variant={brewery.is_favorite ? 'solid' : 'outline'}
              colorPalette={brewery.is_favorite ? 'yellow' : 'gray'}
              onClick={() => onToggleFavorite(brewery.id)}
            >
              <LuStar fill={brewery.is_favorite ? 'currentColor' : 'none'} />
            </IconButton>
          </HStack>

          <VStack align="stretch" gap={1}>
            <Text fontSize="sm" color="gray.600">
              {brewery.street}
            </Text>
            <Text fontSize="sm" color="gray.600">
              {brewery.city}, {brewery.state} {brewery.postal_code}
            </Text>
            <Text fontSize="sm" fontWeight="medium" color="gray.700">
              {brewery.country}
            </Text>
          </VStack>

          <HStack gap={4} flexWrap="wrap">
            {brewery.phone && (
              <HStack gap={1}>
                <LuPhone color="var(--chakra-colors-green-500)" size={12} />
                <Text fontSize="sm" color="gray.700">
                  {formatPhone(brewery.phone)}
                </Text>
              </HStack>
            )}
          </HStack>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
};

export default BreweryCard;
