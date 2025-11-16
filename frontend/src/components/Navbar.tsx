import { Box, Container, HStack, Text } from '@chakra-ui/react';
import { LuBeer, LuStar, LuChartBar } from 'react-icons/lu';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'All Breweries', icon: LuBeer },
    { path: '/favorites', label: 'Favorites', icon: LuStar },
    { path: '/analytics', label: 'Analytics', icon: LuChartBar },
  ];

  return (
    <Box
      bg="blue.600"
      color="white"
      py={4}
      shadow="md"
      position="sticky"
      top={0}
      zIndex={10}
    >
      <Container maxW="container.xl">
        <HStack justify="space-between" align="center">
          <Text fontSize="2xl" fontWeight="bold">
            🍺 Brewery App
          </Text>
          <HStack gap={6}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{ textDecoration: 'none' }}
                >
                  <HStack
                    gap={2}
                    px={4}
                    py={2}
                    borderRadius="md"
                    bg={isActive ? 'blue.700' : 'transparent'}
                    _hover={{ bg: 'blue.700' }}
                    transition="all 0.2s"
                    cursor="pointer"
                  >
                    <Icon size={20} />
                    <Text fontWeight="medium">{item.label}</Text>
                  </HStack>
                </Link>
              );
            })}
          </HStack>
        </HStack>
      </Container>
    </Box>
  );
};

export default Navbar;
