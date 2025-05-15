"use client";

import { getSongExternalUrl } from "@/utils/utils";
import { SongsterrSong } from "@/api/songsterrApi";

interface SongsListProps {
  songs: SongsterrSong[];
  isLoading: boolean;
  onFetchSongs: () => void;
}

export default function SongsList({ songs, isLoading, onFetchSongs }: SongsListProps) {
  return (
    <div className="flex-1">
      <button
        className="btn btn-primary mb-5 w-full"
        onClick={onFetchSongs}
        disabled={isLoading}
      >
        {isLoading && <span className="loading loading-spinner"></span>}
        Search songs with tuning
      </button>
    
      <ul className="menu bg-base-200 w-100 rounded-box">
        <li className="menu-title">Songs with this tuning:</li>
        {songs?.map((song) => (
          <li key={song.songId}>
            <a href={getSongExternalUrl(song.songId)} target="_blank">
              {song.artist}:<strong>{song.title}</strong>{" "}
              <small>{song.tracks[song.defaultTrack]?.views} views</small>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
} 