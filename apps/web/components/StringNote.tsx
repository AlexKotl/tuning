"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { stringToNoteId } from "@tuning/shared";
import { notesVariants } from "@tuning/shared";

const SOUND_FILE_INDEX_DIFF = 8;

interface StringNoteProps {
  index: number;
  tuning: string[];
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  isContinuousPlay: boolean;
}

export default function StringNote({ 
  index, 
  tuning, 
  onChange, 
  isContinuousPlay 
}: StringNoteProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const actualIndex = 5 - index;
  const stringNumber = 6 - index;
  
  useEffect(() => {
    // Preload audio when component mounts or tuning changes
    const audio = document.getElementById(`note-${index}`) as HTMLAudioElement;
    if (audio) {
      audio.load();
    }
  }, [tuning, index]);

  function playStringNote() {
    // Stop all other notes first
    stopAllNotes();

    const note = document.getElementById(`note-${index}`) as HTMLAudioElement;
    note.loop = isContinuousPlay;
    note.play();
  }

  function stopAllNotes() {
    Array.from({ length: 6 }).forEach((_, i) => {
      if (i !== index) {
        const note = document.getElementById(`note-${i}`) as HTMLAudioElement;
        if (note) {
          note.pause();
          note.currentTime = 0;
        }
      }
    });
  }

  function handleSoundLoaded() {
    setIsLoaded(true);
  }

  return (
    <div>
      <audio 
        id={`note-${index}`} 
        // TODO: Refactor with new util method
        src={`/sounds/piano/piano-ff-0${stringToNoteId(tuning[actualIndex], actualIndex) - SOUND_FILE_INDEX_DIFF}.wav`}
        onLoadedData={handleSoundLoaded}
        preload="auto"
      ></audio>
      <button
        className="btn btn-warning btn-sm"
        onClick={playStringNote}
        disabled={!isLoaded}
      >
        {!isLoaded 
          ? <span className="loading loading-spinner loading-xs"></span> 
          : <img src="/images/note.svg" width={20} alt="Play note" />}
      </button>
      <select
        className="input w-full max-w-xs input-bordered my-1 text-black text-bold"
        value={tuning[actualIndex] ?? ""}
        onChange={onChange}
      >
        {notesVariants.map((note) => (
          <option key={note + index} value={note}>
            {note}
          </option>
        ))}
      </select>
      <div className="text-xs">String {stringNumber}</div>
    </div>
  );
} 