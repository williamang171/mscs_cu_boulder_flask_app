import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import FavoritesPage from './pages/FavouritesPage';
import AnalyticsPage from './pages/AnalyticsPage';

function App() {
  return (
    <ChakraProvider value={defaultSystem}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
