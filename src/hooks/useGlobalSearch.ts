import { useState, useCallback, useMemo } from 'react';
import { SearchResult } from '../types';
import { useData } from './useData';

export const useGlobalSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { machinery, vehicles, tools, spareParts, warehouses } = useData();

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];

    const results: SearchResult[] = [];
    const term = searchTerm.toLowerCase();

    // Search machinery
    machinery.forEach(item => {
      const relevance = calculateRelevance(term, [
        item.name,
        item.brand,
        item.model,
        item.category,
        item.serialNumber
      ]);
      
      if (relevance > 0) {
        results.push({
          id: item.id,
          type: 'machinery',
          title: item.name,
          subtitle: `${item.brand} ${item.model}`,
          description: `${item.category} - ${item.status}`,
          url: `/machinery/${item.id}`,
          relevance,
          highlightedText: getHighlightedText(term, item.name)
        });
      }
    });

    // Search vehicles
    vehicles.forEach(item => {
      const relevance = calculateRelevance(term, [
        item.plate,
        item.brand,
        item.model,
        `${item.year}`
      ]);
      
      if (relevance > 0) {
        results.push({
          id: item.id,
          type: 'vehicle',
          title: item.plate,
          subtitle: `${item.brand} ${item.model}`,
          description: `${item.year} - ${item.status}`,
          url: `/vehicles/${item.id}`,
          relevance,
          highlightedText: getHighlightedText(term, item.plate)
        });
      }
    });

    // Search tools
    tools.forEach(item => {
      const relevance = calculateRelevance(term, [
        item.name,
        item.internalCode,
        item.category || '',
        item.brand || ''
      ]);
      
      if (relevance > 0) {
        results.push({
          id: item.id,
          type: 'tool',
          title: item.name,
          subtitle: item.internalCode,
          description: `${item.category || 'Herramienta'} - ${item.status}`,
          url: `/tools/${item.id}`,
          relevance,
          highlightedText: getHighlightedText(term, item.name)
        });
      }
    });

    // Search spare parts
    spareParts.forEach(item => {
      const relevance = calculateRelevance(term, [
        item.name,
        item.code,
        item.brand,
        item.category || ''
      ]);
      
      if (relevance > 0) {
        results.push({
          id: item.id,
          type: 'sparepart',
          title: item.name,
          subtitle: item.code,
          description: `${item.brand} - Stock: ${Object.values(item.stockByWarehouse).reduce((a, b) => a + b, 0)}`,
          url: `/spareparts/${item.id}`,
          relevance,
          highlightedText: getHighlightedText(term, item.name)
        });
      }
    });

    // Search warehouses
    warehouses.forEach(item => {
      const relevance = calculateRelevance(term, [
        item.name,
        item.city,
        item.address
      ]);
      
      if (relevance > 0) {
        results.push({
          id: item.id,
          type: 'machinery', // Using machinery as default for warehouses
          title: item.name,
          subtitle: item.city,
          description: item.address,
          url: `/warehouses/${item.id}`,
          relevance,
          highlightedText: getHighlightedText(term, item.name)
        });
      }
    });

    // Sort by relevance
    return results.sort((a, b) => b.relevance - a.relevance).slice(0, 20);
  }, [searchTerm, machinery, vehicles, tools, spareParts, warehouses]);

  const search = useCallback(async (term: string) => {
    setSearchTerm(term);
    setIsSearching(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setIsSearching(false);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  return {
    searchTerm,
    searchResults,
    isSearching,
    search,
    clearSearch
  };
};

function calculateRelevance(searchTerm: string, fields: string[]): number {
  let relevance = 0;
  const term = searchTerm.toLowerCase();

  fields.forEach(field => {
    const fieldLower = field.toLowerCase();
    
    // Exact match gets highest score
    if (fieldLower === term) {
      relevance += 100;
    }
    // Starts with search term
    else if (fieldLower.startsWith(term)) {
      relevance += 80;
    }
    // Contains search term
    else if (fieldLower.includes(term)) {
      relevance += 60;
    }
    // Fuzzy match (simple implementation)
    else if (fuzzyMatch(fieldLower, term)) {
      relevance += 30;
    }
  });

  return relevance;
}

function fuzzyMatch(text: string, pattern: string): boolean {
  const textLen = text.length;
  const patternLen = pattern.length;
  
  if (patternLen === 0) return true;
  if (textLen === 0) return false;
  
  let textIndex = 0;
  let patternIndex = 0;
  
  while (textIndex < textLen && patternIndex < patternLen) {
    if (text[textIndex] === pattern[patternIndex]) {
      patternIndex++;
    }
    textIndex++;
  }
  
  return patternIndex === patternLen;
}

function getHighlightedText(searchTerm: string, text: string): string {
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}