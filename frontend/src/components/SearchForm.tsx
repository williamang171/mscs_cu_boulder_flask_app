import { useState } from 'react';
import { Box, Button, Field, Input, HStack, VStack } from '@chakra-ui/react';
import { LuSearch } from 'react-icons/lu';
import type { SearchParams } from '../types/Brewery';
import {
  NativeSelectField,
  NativeSelectRoot,
} from '../components/ui/native-select';

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  isLoading: boolean;
}

const SearchForm = ({ onSearch, isLoading }: SearchFormProps) => {
  const [query, setQuery] = useState('');
  const [byType, setByType] = useState('');
  const [byCountry, setByCountry] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      query: query || undefined,
      by_type: byType || undefined,
      by_country: byCountry || undefined,
    });
  };

  const handleReset = () => {
    setQuery('');
    setByType('');
    setByCountry('');
  };

  return (
    <Box asChild>
      <form onSubmit={handleSubmit}>
        <VStack gap={4} align="stretch">
          <Field.Root>
            <Field.Label>Search</Field.Label>
            <Input
              placeholder="Search by name, city, or state..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              size="lg"
            />
          </Field.Root>

          <HStack gap={4}>
            <Field.Root flex={1}>
              <Field.Label>Brewery Type</Field.Label>
              <NativeSelectRoot size="md">
                <NativeSelectField
                  value={byType}
                  onChange={(e) => setByType(e.target.value)}
                >
                  <option value="">All types</option>
                  <option value="micro">Micro</option>
                  <option value="nano">Nano</option>
                  <option value="regional">Regional</option>
                  <option value="brewpub">Brewpub</option>
                  <option value="large">Large</option>
                  <option value="planning">Planning</option>
                  <option value="bar">Bar</option>
                  <option value="contract">Contract</option>
                  <option value="proprietor">Proprietor</option>
                  <option value="closed">Closed</option>
                </NativeSelectField>
              </NativeSelectRoot>
            </Field.Root>

            <Field.Root flex={1}>
              <Field.Label>Country</Field.Label>
              <Input
                placeholder="e.g., United States"
                value={byCountry}
                onChange={(e) => setByCountry(e.target.value)}
              />
            </Field.Root>
          </HStack>

          <HStack gap={3}>
            <Button
              type="submit"
              colorPalette="blue"
              loading={isLoading}
              loadingText="Searching..."
              size="lg"
              flex={1}
            >
              <LuSearch />
              Search
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              size="lg"
            >
              Reset
            </Button>
          </HStack>
        </VStack>
      </form>
    </Box>
  );
};

export default SearchForm;
