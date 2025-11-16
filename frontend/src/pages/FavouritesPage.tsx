import { Container } from '@chakra-ui/react';
import BreweryList from '../components/BreweryList';

const FavoritesPage = () => {
  return (
    <Container maxW="container.xl" py={8}>
      <BreweryList
        favoritesOnly
        title="My Favorite Breweries"
        emptyMessage="No favorite breweries found. Add some favorites to see them here!"
      />
    </Container>
  );
};

export default FavoritesPage;
