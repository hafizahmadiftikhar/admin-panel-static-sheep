import { createContext, useContext, useState } from 'react';

/**
 * Global search — the topbar search box writes here and any page can read it
 * to filter its content. Kept deliberately tiny: one shared query string.
 */
const SearchContext = createContext(null);

export function SearchProvider({ children }) {
  const [query, setQuery] = useState('');
  return (
    <SearchContext.Provider value={{ query, setQuery }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error('useSearch must be used within SearchProvider');
  return ctx;
}
