import { Container } from '@chakra-ui/react';
import BreweryList from '../components/BreweryList';

const HomePage = () => {
  return (
    <Container maxW="container.xl" py={8}>
      <BreweryList
        title="Brewery Finder"
        emptyMessage="No breweries found. Try adjusting your search criteria."
      />
    </Container>
  );
};

export default HomePage;
