"use client";

import { useState } from "react";
import { getSongs as getSongsRequest } from "@/api/songsterrApi";

export default function Home() {
  const [tuning, setTuning] = useState<string[]>([]);

  const getSongs = async () => {
    const songs = await getSongsRequest();
    console.log("songs", songs);
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
    </div>
  );
}
