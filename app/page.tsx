"use client";

import { useState, ChangeEvent, useEffect } from "react";
import { getSongExternalUrl, stringToNoteId } from "@/utils/utils";
import { playTuning, load as loadSound, playNote } from "@/utils/sound";
import { tuningVariants, notesVariants } from "@/config/constants";
import About from "./about";
import { getSongsFromClient } from "@/api/songsterrApi";
import type { SongsterrSong } from "@/api/songsterrApi";

export default function Home() {
  const [tuning, setTuning] = useState<string[]>(tuningVariants[0].tuning);
  const [songs, setSongs] = useState<SongsterrSong[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSongs = async () => {
    setIsLoading(true);
    setSongs([]);

    try {
      const songs = await getSongsFromClient({
        tuning: tuning
          .map((note, index) => stringToNoteId(note, index))
          .join(","),
      });

      setSongs(songs);
    } catch (e) {
      alert("Oops, we cant get songs list :(");
    }

    setIsLoading(false);
  };

  const handleTuningInputChange =
    (index: number) => (event: ChangeEvent<HTMLSelectElement>) => {
      const newTuning = tuning;
      newTuning[index] = (event.target as HTMLSelectElement).value;
      setTuning([...newTuning]);
    };

  function handleQuickPickClick(tuning: string[]) {
    setTuning(tuning);
    playTuning(tuning);
  }

  return (
    <div className="flex gap-5 flex-col md:flex-row">
      <div className="flex-1">
        <div className="card shadow-xl ">
          <div className="card-body p-10">
            <div>
              Quick picks: <br />
              {tuningVariants.map((tuningVariant, index) => (
                <a
                  role="button"
                  key={index}
                  className="btn mx-1 my-1"
                  onClick={() => handleQuickPickClick(tuningVariant.tuning)}
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
            <div className="my-5 flex gap-2 ">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index}>
                  <button
                    className="btn btn-warning  btn-sm"
                    onClick={() => playNote(tuning[5 - index])}
                  >
                    <img src="/images/note.svg" width={20}></img>
                  </button>
                  <select
                    className="input w-full max-w-xs input-bordered my-1 text-black text-bold"
                    value={tuning[5 - index] ?? ""}
                    onChange={handleTuningInputChange(5 - index)}
                  >
                    {notesVariants.map((note) => (
                      <option key={note + index} value={note}>
                        {note}
                      </option>
                    ))}
                  </select>
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
