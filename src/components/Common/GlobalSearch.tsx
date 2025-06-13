import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Clock, ArrowRight } from 'lucide-react';
import { useGlobalSearch } from '../../hooks/useGlobalSearch';
import { SearchResult } from '../../types';

interface GlobalSearchProps {
  onNavigate?: (url: string) => void;
}

const typeIcons = {
  machinery: '🚜',
  vehicle: '🚗',
  tool: '🔧',
  sparepart: '📦',
  rental: '📋',
  maintenance: '⚙️'
};

const typeLabels = {
  machinery: 'Maquinaria',
  vehicle: 'Vehículo',
  tool: 'Herramienta',
  sparepart: 'Repuesto',
  rental: 'Alquiler',
  maintenance: 'Mantenimiento'
};

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { searchResults, isSearching, search, clearSearch } = useGlobalSearch();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        setInputValue('');
        clearSearch();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [clearSearch]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (value.trim()) {
      search(value);
    } else {
      clearSearch();
    }
  };

  const handleResultClick = (result: SearchResult) => {
    // Add to recent searches
    setRecentSearches(prev => {
      const updated = [inputValue, ...prev.filter(s => s !== inputValue)].slice(0, 5);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      return updated;
    });

    setIsOpen(false);
    setInputValue('');
    clearSearch();
    
    if (onNavigate) {
      onNavigate(result.url);
    }
  };

  const handleRecentSearchClick = (searchTerm: string) => {
    setInputValue(searchTerm);
    search(searchTerm);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  // Load recent searches on mount
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  return (
    <>
      {/* Search Trigger */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center space-x-2 w-80 px-3 py-2 text-left border border-gray-300 rounded-lg hover:border-gray-400 transition-colors bg-white"
        >
          <Search className="w-4 h-4 text-gray-400" />
          <span className="text-gray-500 flex-1">Buscar en todo el sistema...</span>
          <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-xs font-mono bg-gray-100 text-gray-600 rounded">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Search Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-start justify-center p-4 pt-16">
            <div className="fixed inset-0 bg-black bg-opacity-25 transition-opacity" />
            
            <div
              ref={containerRef}
              className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl"
            >
              {/* Search Input */}
              <div className="flex items-center px-4 py-3 border-b border-gray-200">
                <Search className="w-5 h-5 text-gray-400 mr-3" />
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="Buscar maquinaria, vehículos, herramientas..."
                  className="flex-1 text-lg outline-none"
                  autoComplete="off"
                />
                {inputValue && (
                  <button
                    onClick={() => {
                      setInputValue('');
                      clearSearch();
                    }}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                )}
              </div>

              {/* Search Results */}
              <div className="max-h-96 overflow-y-auto">
                {isSearching && (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <span className="ml-3 text-gray-600">Buscando...</span>
                  </div>
                )}

                {!isSearching && inputValue && searchResults.length === 0 && (
                  <div className="py-8 text-center text-gray-500">
                    <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No se encontraron resultados para "{inputValue}"</p>
                  </div>
                )}

                {!isSearching && searchResults.length > 0 && (
                  <div className="py-2">
                    {searchResults.map((result) => (
                      <button
                        key={`${result.type}-${result.id}`}
                        onClick={() => handleResultClick(result)}
                        className="w-full flex items-center px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                      >
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-lg">{typeIcons[result.type]}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h3 
                              className="font-medium text-gray-900 truncate"
                              dangerouslySetInnerHTML={{ __html: result.highlightedText || result.title }}
                            />
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                              {typeLabels[result.type]}
                            </span>
                          </div>
                          {result.subtitle && (
                            <p className="text-sm text-gray-600 truncate">{result.subtitle}</p>
                          )}
                          {result.description && (
                            <p className="text-xs text-gray-500 truncate">{result.description}</p>
                          )}
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 ml-2" />
                      </button>
                    ))}
                  </div>
                )}

                {!inputValue && recentSearches.length > 0 && (
                  <div className="py-2">
                    <div className="flex items-center justify-between px-4 py-2">
                      <h3 className="text-sm font-medium text-gray-900">Búsquedas recientes</h3>
                      <button
                        onClick={clearRecentSearches}
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        Limpiar
                      </button>
                    </div>
                    {recentSearches.map((searchTerm, index) => (
                      <button
                        key={index}
                        onClick={() => handleRecentSearchClick(searchTerm)}
                        className="w-full flex items-center px-4 py-2 hover:bg-gray-50 transition-colors text-left"
                      >
                        <Clock className="w-4 h-4 text-gray-400 mr-3" />
                        <span className="text-gray-700">{searchTerm}</span>
                      </button>
                    ))}
                  </div>
                )}

                {!inputValue && recentSearches.length === 0 && (
                  <div className="py-8 text-center text-gray-500">
                    <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Comienza escribiendo para buscar</p>
                    <p className="text-sm mt-1">Busca maquinaria, vehículos, herramientas y más</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs">↵</kbd>
                    <span>para seleccionar</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs">esc</kbd>
                    <span>para cerrar</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};