"use client";

import { getSongExternalUrl, tuningToString } from "@/utils/utils";
import { SongsterrSong } from "@/api/songsterrApi";

interface SongsListProps {
  songs: SongsterrSong[];
  tuning: string[];
  isLoading: boolean;
  onFetchSongs: () => void;
}

export default function SongsList({ songs, isLoading, onFetchSongs, tuning }: SongsListProps) {
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