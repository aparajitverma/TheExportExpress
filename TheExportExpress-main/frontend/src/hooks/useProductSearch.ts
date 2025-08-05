import { useState, useEffect } from 'react';
import { api } from '../utils/apiClient';
import { PopulatedCategory } from '../types/product';

interface ProductSearchResult {
  _id: string;
  name: string;
  category: PopulatedCategory;
  images?: string[];
  shortDescription?: string;
}

export interface SearchSuggestion {
  id: string;
  name: string;
  category: string;
  image?: string;
  shortDescription?: string;
}

export function useProductSearch() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!query.trim() || query.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const products = await api.get<ProductSearchResult[]>(`/products/search?q=${encodeURIComponent(query)}&limit=5`);
        const searchSuggestions: SearchSuggestion[] = products.map((product: ProductSearchResult) => ({
          id: product._id,
          name: product.name,
          category: product.category.name || 'Uncategorized',
          image: product.images?.[0],
          shortDescription: product.shortDescription
        }));
        setSuggestions(searchSuggestions);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  return {
    query,
    setQuery,
    suggestions,
    isLoading
  };
}
