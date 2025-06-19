import { SongsterrSong } from "@tuning/shared/api";

const FAVORITES_KEY = 'favorite_songs';

// Get favorite songs from localStorage
export function getFavoriteSongs(): number[] {
  if (typeof window === 'undefined') return [];
  
  const favoritesString = localStorage.getItem(FAVORITES_KEY);
  if (!favoritesString) return [];
  
  try {
    return JSON.parse(favoritesString);
  } catch (error) {
    console.error('Error parsing favorite songs', error);
    return [];
  }
}

// Add a song to favorites
export function addToFavorites(songId: number): void {
  if (typeof window === 'undefined') return;
  
  const favorites = getFavoriteSongs();
  if (!favorites.includes(songId)) {
    const newFavorites = [...favorites, songId];
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
  }
}

// Remove a song from favorites
export function removeFromFavorites(songId: number): void {
  if (typeof window === 'undefined') return;
  
  const favorites = getFavoriteSongs();
  const newFavorites = favorites.filter(id => id !== songId);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
}

// Toggle a song's favorite status
export function toggleFavorite(songId: number): void {
  if (typeof window === 'undefined') return;
  
  const favorites = getFavoriteSongs();
  if (favorites.includes(songId)) {
    removeFromFavorites(songId);
  } else {
    addToFavorites(songId);
  }
}

// Check if a song is a favorite
export function isFavorite(songId: number): boolean {
  const favorites = getFavoriteSongs();
  return favorites.includes(songId);
} 