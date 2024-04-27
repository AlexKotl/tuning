"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { stringToNoteId } from "@/utils/utils";
import type { Database, Tables } from "@/supabase/database";

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
    setSongs(data?.slice(0, 20) ?? []);
    setIsLoading(false);

    // TODO: Implement search by  close tunings
  };

  return (
    <div>
      Quick picks:
      <button
        className="btn btn-neutral mx-1"
        onClick={() => setTuning(["E", "B", "G", "D", "A", "E"])}
      >
        Standard: EADGBE
      </button>
      <button
        className="btn btn-neutral mx-1"
        onClick={() => setTuning(["D", "A", "F#", "D", "A", "D"])}
      >
        Drop D: DADF#AD
      </button>
      <button
        className="btn btn-neutral mx-1"
        onClick={() => setTuning(["D", "A", "G", "D", "A", "D"])}
      >
        DADGAD
      </button>
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index}>
          <input
            type="text"
            value={tuning[index] ?? ""}
            placeholder={`String ${index + 1}`}
            className="input w-full max-w-xs"
            maxLength={2}
            minLength={1}
          />
        </div>
      ))}
      <button
        className="btn btn-primary"
        onClick={fetchSongs}
        disabled={isLoading}
      >
        {isLoading && <span className="loading loading-spinner"></span>}
        Search songs with tuning
      </button>
      {songs?.map((song) => (
        <div key={song.id}>{song.title}</div>
      ))}
    </div>
  );
}
