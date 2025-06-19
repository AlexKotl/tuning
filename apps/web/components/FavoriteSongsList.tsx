"use client";

import { useEffect, useState } from "react";
import { useFavorites } from "@/hooks/useFavorites";
import { SongsterrSong } from "@tuning/shared/api";
import { getSongExternalUrl } from "@tuning/shared";

interface FavoriteSongsListProps {
  allSongs: SongsterrSong[];
}

export default function FavoriteSongsList({ allSongs }: FavoriteSongsListProps) {
  const { isFavorite, toggleFavorite, favorites } = useFavorites();
  const [favoriteSongs, setFavoriteSongs] = useState<SongsterrSong[]>([]);
  
  useEffect(() => {
    // Filter songs to only include favorites
    const filtered = allSongs.filter(song => isFavorite(song.songId));
    setFavoriteSongs(filtered);
  }, [allSongs, favorites, isFavorite]);
  
  if (favoriteSongs.length === 0) {
    return (
      <div className="bg-base-200 p-4 rounded-box mb-6">
        <h3 className="font-bold mb-2">Your Favorites</h3>
        <p className="text-sm text-base-content/70">
          You haven't saved any favorite songs yet. Click the star icon next to songs to add them to your favorites.
        </p>
      </div>
    );
  }
  
  return (
    <div className="mb-6">
      <h3 className="font-bold mb-2">Your Favorites</h3>
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
  );
} 