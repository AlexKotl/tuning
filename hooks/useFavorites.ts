import { useState, useEffect, useCallback } from 'react';
import { getFavoriteSongs, toggleFavorite as toggleFavoriteFn, isFavorite as isFavoriteFn } from '@/utils/favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>([]);
  
  // Load favorites from localStorage on component mount
  useEffect(() => {
    setFavorites(getFavoriteSongs());
    
    // Add event listener to update favorites across tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'favorite_songs') {
        setFavorites(getFavoriteSongs());
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  // Toggle favorite status
  const toggleFavorite = useCallback((songId: number) => {
    toggleFavoriteFn(songId);
    setFavorites(getFavoriteSongs());
  }, []);
  
  // Check if a song is favorite
  const isFavorite = useCallback((songId: number) => {
    return isFavoriteFn(songId);
  }, []);
  
  return { favorites, toggleFavorite, isFavorite };
} 