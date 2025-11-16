#!/usr/bin/env python3
import unittest
from unittest.mock import Mock
from app import parse_search_filters


class TestParseSearchFilters(unittest.TestCase):
    """Test cases for parse_search_filters function"""
    
    def test_parse_empty_filters(self):
        """Test parsing when no filters are provided"""
        mock_args = Mock()
        mock_args.get = Mock(side_effect=lambda key, default='': default if key == 'favorites_only' else None)
        
        result = parse_search_filters(mock_args)
        
        self.assertEqual(result['favorites_only'], False)
        self.assertIsNone(result['by_type'])
        self.assertIsNone(result['by_country'])
        self.assertIsNone(result['query'])
    
    def test_parse_favorites_only_true(self):
        """Test parsing favorites_only when value is 'true'"""
        mock_args = Mock()
        mock_args.get = Mock(side_effect=lambda key, default='': 'true' if key == 'favorites_only' else None)
        
        result = parse_search_filters(mock_args)
        
        self.assertEqual(result['favorites_only'], True)
    
    def test_parse_favorites_only_false(self):
        """Test parsing favorites_only when value is 'false'"""
        mock_args = Mock()
        mock_args.get = Mock(side_effect=lambda key, default='': 'false' if key == 'favorites_only' else None)
        
        result = parse_search_filters(mock_args)
        
        self.assertEqual(result['favorites_only'], False)
    
    def test_parse_favorites_only_case_insensitive(self):
        """Test parsing favorites_only is case insensitive"""
        mock_args = Mock()
        mock_args.get = Mock(side_effect=lambda key, default='': 'TRUE' if key == 'favorites_only' else None)
        
        result = parse_search_filters(mock_args)
        
        self.assertEqual(result['favorites_only'], True)
    
    def test_parse_by_type(self):
        """Test parsing by_type filter"""
        mock_args = Mock()
        mock_args.get = Mock(side_effect=lambda key, default='': 'micro' if key == 'by_type' else ('' if key == 'favorites_only' else None))
        
        result = parse_search_filters(mock_args)
        
        self.assertEqual(result['by_type'], 'micro')
    
    def test_parse_by_country(self):
        """Test parsing by_country filter"""
        mock_args = Mock()
        mock_args.get = Mock(side_effect=lambda key, default='': 'United States' if key == 'by_country' else ('' if key == 'favorites_only' else None))
        
        result = parse_search_filters(mock_args)
        
        self.assertEqual(result['by_country'], 'United States')
    
    def test_parse_query(self):
        """Test parsing query filter"""
        mock_args = Mock()
        mock_args.get = Mock(side_effect=lambda key, default='': 'austin' if key == 'query' else ('' if key == 'favorites_only' else None))
        
        result = parse_search_filters(mock_args)
        
        self.assertEqual(result['query'], 'austin')
    
    def test_parse_all_filters(self):
        """Test parsing when all filters are provided"""
        def mock_get(key, default=''):
            values = {
                'favorites_only': 'true',
                'by_type': 'micro',
                'by_country': 'United States',
                'query': 'austin'
            }
            return values.get(key, default)
        
        mock_args = Mock()
        mock_args.get = Mock(side_effect=mock_get)
        
        result = parse_search_filters(mock_args)
        
        self.assertEqual(result['favorites_only'], True)
        self.assertEqual(result['by_type'], 'micro')
        self.assertEqual(result['by_country'], 'United States')
        self.assertEqual(result['query'], 'austin')
    
    def test_parse_mixed_filters(self):
        """Test parsing when some filters are provided"""
        def mock_get(key, default=''):
            values = {
                'favorites_only': '',
                'by_type': 'brewpub',
                'query': 'texas'
            }
            return values.get(key, default if key == 'favorites_only' else None)
        
        mock_args = Mock()
        mock_args.get = Mock(side_effect=mock_get)
        
        result = parse_search_filters(mock_args)
        
        self.assertEqual(result['favorites_only'], False)
        self.assertEqual(result['by_type'], 'brewpub')
        self.assertIsNone(result['by_country'])
        self.assertEqual(result['query'], 'texas')
    
    def test_parse_special_characters_in_query(self):
        """Test parsing query with special characters"""
        mock_args = Mock()
        mock_args.get = Mock(side_effect=lambda key, default='': 'brewery & co.' if key == 'query' else ('' if key == 'favorites_only' else None))
        
        result = parse_search_filters(mock_args)
        
        self.assertEqual(result['query'], 'brewery & co.')
    
    def test_parse_whitespace_in_filters(self):
        """Test parsing filters with whitespace"""
        def mock_get(key, default=''):
            values = {
                'favorites_only': '',
                'by_type': '  micro  ',
                'by_country': 'United States',
                'query': '  austin  '
            }
            return values.get(key, default if key == 'favorites_only' else None)
        
        mock_args = Mock()
        mock_args.get = Mock(side_effect=mock_get)
        
        result = parse_search_filters(mock_args)
        
        # Function should preserve whitespace as-is (not strip)
        self.assertEqual(result['by_type'], '  micro  ')
        self.assertEqual(result['query'], '  austin  ')


class TestFilterLogic(unittest.TestCase):
    """Test cases for filter logic and edge cases"""
    
    def test_empty_string_is_not_true(self):
        """Test that empty string for favorites_only is treated as False"""
        mock_args = Mock()
        mock_args.get = Mock(return_value='')
        
        result = parse_search_filters(mock_args)
        
        self.assertEqual(result['favorites_only'], False)
    
    def test_random_string_is_not_true(self):
        """Test that random string for favorites_only is treated as False"""
        mock_args = Mock()
        mock_args.get = Mock(side_effect=lambda key, default='': 'yes' if key == 'favorites_only' else None)
        
        result = parse_search_filters(mock_args)
        
        self.assertEqual(result['favorites_only'], False)


if __name__ == '__main__':
    unittest.main()