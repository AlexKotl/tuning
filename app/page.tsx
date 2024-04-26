"use client";

import { useState } from "react";
// import { getSongs as getSongsRequest } from "@/api/songsterrApi";
import { createClient } from "@supabase/supabase-js";
import { stringToNoteId } from "@/utils/utils";

export default function Home() {
  const [tuning, setTuning] = useState<string[]>([]);
  const [songs, setSongs] = useState([]);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_KEY ?? ""
  );

  const getSongs = async () => {
    const { data, error } = await supabase
      .from("songs")
      .select()
      .eq("string1TuningId", stringToNoteId(tuning[0]))
      .eq("string2TuningId", stringToNoteId(tuning[1]))
      .eq("string3TuningId", stringToNoteId(tuning[2]))
      .eq("string4TuningId", stringToNoteId(tuning[3]))
      .eq("string5TuningId", stringToNoteId(tuning[4]))
      .eq("string6TuningId", stringToNoteId(tuning[5]));

    setSongs((data as any).slice(0, 20));
  };

  return (
    <div>
      Quick picks:
      <button
        className="btn btn-neutral mx-1"
        onClick={() => setTuning(["E", "A", "D", "G", "B", "E"])}
      >
        Standard: EADGBE
      </button>
      <button
        className="btn btn-neutral mx-1"
        onClick={() => setTuning(["D", "A", "D", "F#", "A", "D"])}
      >
        Drop D: DADF#AD
      </button>
      <button
        className="btn btn-neutral mx-1"
        onClick={() => setTuning(["D", "A", "D", "G", "A", "D"])}
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
      <button className="btn btn-primary" onClick={getSongs}>
        Search songs with tuning
      </button>
      {songs?.map((song) => (
        <div>{song.title}</div>
      ))}
    </div>
  );
}
