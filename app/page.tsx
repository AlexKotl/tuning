"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { getSongExternalUrl, stringToNoteId } from "@/utils/utils";
import type { Database, Tables } from "@/supabase/database";
import { tuningVariants } from "@/config/constants";
import About from "./about";

export default function Home() {
  const [tuning, setTuning] = useState<string[]>([]);
  const [songs, setSongs] = useState<Tables<"songs">[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_KEY ?? ""
  );

  const fetchSongs = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("songs")
      .select()
      .eq("string1TuningId", stringToNoteId(tuning[0], 0))
      .eq("string2TuningId", stringToNoteId(tuning[1], 1))
      .eq("string3TuningId", stringToNoteId(tuning[2], 2))
      .eq("string4TuningId", stringToNoteId(tuning[3], 3))
      .eq("string5TuningId", stringToNoteId(tuning[4], 4))
      .eq("string6TuningId", stringToNoteId(tuning[5], 5));

    if (error) {
      console.error(error);
    }
    // TODO: Implement show more feature insted of slicing
    setSongs(data?.slice(0, 20) ?? []);
    setIsLoading(false);

    // TODO: Implement search by  close tunings
  };

  return (
    <div className="flex gap-5 flex-col md:flex-row">
      <div className="flex-1">
        <div className="card bg-base-100 shadow-xl ">
          <div className="card-body p-10">
            <div>
              Quick picks: <br />
              {tuningVariants.map((tuning, index) => (
                <a
                  role="button"
                  key={index}
                  className="btn mx-1 my-1"
                  onClick={() => setTuning(tuning.tuning)}
                >
                  <div className="flex flex-col items-start">
                    {tuning.title && (
                      <div className="text-base-content/50 text-xs">
                        {tuning.title}
                      </div>
                    )}
                    <div>
                      <strong>{tuning.tuning.reverse().join("")}</strong>
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
                    placeholder="Tune"
                    className="input w-full max-w-xs input-bordered my-1"
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

        <div className="card bg-base-100 shadow-xl my-5">
          <div className="card-body">
            <About />
          </div>
        </div>
      </div>

      <div className="flex-1">
        <ul className="menu bg-base-200 w-100 rounded-box">
          {songs?.map((song) => (
            <li key={song.id}>
              <a href={getSongExternalUrl(song.songId)} target="_blank">
                {song.artist}:<strong>{song.title}</strong>{" "}
                <small>{song.views} views</small>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
