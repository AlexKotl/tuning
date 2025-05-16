"use client";

import { getSongExternalUrl, tuningToString } from "@/utils/utils";
import { SongsterrSong } from "@/api/songsterrApi";
import { useFavorites } from "@/hooks/useFavorites";

interface SongsListProps {
  songs: SongsterrSong[];
  tuning: string[];
  isLoading: boolean;
  onFetchSongs: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  onLoadMore?: () => void;
}

export default function SongsList({ 
  songs, 
  isLoading, 
  onFetchSongs, 
  tuning, 
  hasMore = false, 
  isLoadingMore = false, 
  onLoadMore 
}: SongsListProps) {
  const { isFavorite, toggleFavorite } = useFavorites();

  return (
    <div className="flex-1">
      <button
        className="btn btn-primary mb-5 w-full"
        onClick={onFetchSongs}
        disabled={isLoading}
      >
        {isLoading && <span className="loading loading-spinner"></span>}
        Search songs with {tuningToString(tuning)} tuning
      </button>
    
      <ul className="menu bg-base-200 w-100 rounded-box">
        <li className="menu-title">Songs with this tuning:</li>
        {songs?.map((song) => (
          <li key={song.songId} className={isFavorite(song.songId) ? "bordered border-accent" : ""}>
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
                className={`btn btn-sm ${isFavorite(song.songId) ? "btn-accent" : "btn-ghost"}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleFavorite(song.songId);
                }}
                aria-label={isFavorite(song.songId) ? "Remove from favorites" : "Add to favorites"}
              >
                {isFavorite(song.songId) ? "★" : "☆"}
              </button>
            </div>
          </li>
        ))}
        
        {songs.length > 0 && hasMore && (
          <li className="p-2">
            <button 
              className="btn btn-secondary w-full" 
              onClick={onLoadMore}
              disabled={isLoadingMore}
            >
              {isLoadingMore && <span className="loading loading-spinner"></span>}
              Load More
            </button>
          </li>
        )}
      </ul>
    </div>
  );
} 