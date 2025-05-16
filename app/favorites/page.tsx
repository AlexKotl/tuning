"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SongsterrSong } from "@/api/songsterrApi";
import { useFavorites } from "@/hooks/useFavorites";
import { getSongExternalUrl } from "@/utils/utils";

export default function FavoritesPage() {
  const [allSongs, setAllSongs] = useState<SongsterrSong[]>([]);
  const [favoriteSongs, setFavoriteSongs] = useState<SongsterrSong[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isFavorite, toggleFavorite, favorites } = useFavorites();

  // Fetch all songs from API
  useEffect(() => {
    const fetchAllSongs = async () => {
      try {
        // Using the allSongsCache to avoid multiple API calls
        const cachedSongs = localStorage.getItem('allSongsCache');
        
        if (cachedSongs) {
          const songs = JSON.parse(cachedSongs);
          setAllSongs(songs);
          setIsLoading(false);
        } else {
          // If no cached songs, we need to inform the user
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching songs:', error);
        setIsLoading(false);
      }
    };

    fetchAllSongs();
  }, []);

  // Filter songs to show only favorites
  useEffect(() => {
    // Filter songs to only include favorites
    const filtered = allSongs.filter(song => isFavorite(song.songId));
    setFavoriteSongs(filtered);
  }, [allSongs, favorites, isFavorite]);

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Your Favorite Songs</h1>
        <Link href="/tuning/standard" className="btn btn-primary">
          Back to Search
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center my-10">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : favoriteSongs.length > 0 ? (
        <div className="mb-6">
          <ul className="menu bg-base-200 w-100 rounded-box">
            {favoriteSongs.map((song) => (
              <li key={song.songId} className="bordered border-accent">
                <div className="flex items-center justify-between w-full">
                  <a 
                    href={getSongExternalUrl(song.songId)} 
                    target="_blank"
                    className="flex-1"
                  >
                    {song.artist}:<strong>{song.title}</strong>{" "}
                    <small>{song.tracks[song.defaultTrack]?.views} views</small>
                  </a>
                  <button
                    className="btn btn-sm btn-accent"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFavorite(song.songId);
                    }}
                    aria-label="Remove from favorites"
                  >
                    ★
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="bg-base-200 p-4 rounded-box mb-6">
          <h3 className="font-bold mb-2">Your Favorites</h3>
          <p className="text-sm text-base-content/70">
            You haven't saved any favorite songs yet. Click the star icon next to songs to add them to your favorites.
          </p>
          <Link href="/tuning/standard" className="btn btn-primary mt-2">
            Go to Tuning Page
          </Link>
        </div>
      )}
    </div>
  );
} 