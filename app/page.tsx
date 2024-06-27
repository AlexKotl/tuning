"use client";

import { useState, ChangeEvent } from "react";
import {
  getSongExternalUrl,
  stringToNoteId,
  getSongTuningString,
} from "@/utils/utils";
import { tuningVariants } from "@/config/constants";
import About from "./about";
import { getSongsFromClient } from "@/api/songsterrApi";
import type { SongsterrSong } from "@/api/songsterrApi";

export default function Home() {
  const [tuning, setTuning] = useState<string[]>([]);
  const [songs, setSongs] = useState<SongsterrSong[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSongs = async () => {
    setIsLoading(true);
    setSongs([]);

    const songs = await getSongsFromClient({
      tuning: tuning
        .map((note, index) => stringToNoteId(note, index))
        .join(","),
    });

    setSongs(songs);

    setIsLoading(false);
  };

  const handleTuningInputChange =
    (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
      const newTuning = tuning;
      newTuning[index] = (event.target as HTMLInputElement).value;
      console.log("setting", newTuning);
      setTuning([...newTuning]);
    };

  return (
    <div className="flex gap-5 flex-col md:flex-row">
      <div className="flex-1">
        <div className="card bg-neutral text-neutral-content shadow-xl ">
          <div className="card-body p-10">
            <div>
              Quick picks: <br />
              {tuningVariants.map((tuningVariant, index) => (
                <a
                  role="button"
                  key={index}
                  className="btn mx-1 my-1"
                  onClick={() => setTuning(tuningVariant.tuning)}
                >
                  <div className="flex flex-col items-start">
                    {tuningVariant.title && (
                      <div className="text-base-content/50 text-xs">
                        {tuningVariant.title}
                      </div>
                    )}
                    <div>
                      <strong>
                        {[...tuningVariant.tuning].reverse().join("")}
                      </strong>
                    </div>
                  </div>
                </a>
              ))}
            </div>
            <div className="my-5 flex gap-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index}>
                  <input
                    type="text"
                    value={tuning[index] ?? ""}
                    onChange={handleTuningInputChange(index)}
                    placeholder="Tune"
                    className="input w-full max-w-xs input-bordered my-1 text-black text-bold"
                    maxLength={2}
                    minLength={1}
                  />
                  <div className=" text-xs">String {6 - index}</div>
                </div>
              ))}
            </div>
            <button
              className="btn btn-primary"
              onClick={fetchSongs}
              disabled={isLoading}
            >
              {isLoading && <span className="loading loading-spinner"></span>}
              Search songs with tuning
            </button>
          </div>
        </div>

        <div className="card  shadow-xl my-5">
          <div className="card-body">
            <About />
          </div>
        </div>
      </div>

      <div className="flex-1">
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
    </div>
  );
}
