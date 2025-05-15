"use client";

import { useState, useEffect } from "react";
import { stringToNoteId } from "@/utils/utils";
import { tuningVariants } from "@/config/constants";
import About from "../../../components/About";
import { getSongsFromClient, type SongsterrSong } from "@/api/songsterrApi";
import { useRouter, usePathname } from "next/navigation";
import TuningPicker from "@/components/TuningPicker";
import SongsList from "@/components/SongsList";

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();
  const defaultTuning = tuningVariants[0].tuning;
  const [tuning, setTuning] = useState<string[]>(
    pathname === "/" || pathname === "/tuning/standard" ? defaultTuning : pathname.split("/").pop()?.replace(/sharp/g, "#").split("-") || defaultTuning
  );
  const [songs, setSongs] = useState<SongsterrSong[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isContinuousPlay, setIsContinuousPlay] = useState(false);

  useEffect(() => {
    // Stop all notes when continuous play is disabled
    if (!isContinuousPlay) {
      stopAllNotes();
    }
  }, [isContinuousPlay]);

  const stopAllNotes = (excludeIndex?: number) => {
    Array.from({ length: 6 }).forEach((_, index) => {
      if (index !== excludeIndex) {
        const note = document.getElementById(`note-${index}`) as HTMLAudioElement;
        if (note) {
          note.pause();
          note.currentTime = 0;
        }
      }
    });
  };

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

  const handleTuningChange = (index: number, value: string) => {
    const newTuning = [...tuning];
    newTuning[index] = value;
    setTuning(newTuning);
    const newPath = newTuning.join("-").replace(/#/g, "sharp");
    router.push(newPath === defaultTuning.join("-") ? "/tuning/standard" : `/tuning/${newPath}`);
  };

  const handleSetTuning = (newTuning: string[]) => {
    setTuning(newTuning);
    const newPath = newTuning.join("-").replace(/#/g, "sharp");
    router.push(newPath === defaultTuning.join("-") ? "/tuning/standard" : `/tuning/${newPath}`);
  };

  return (
    <div className="flex gap-5 flex-col md:flex-row">
      <div className="flex-1">
        <TuningPicker
          tuning={tuning}
          setTuning={handleSetTuning}
          onTuningChange={handleTuningChange}
          isContinuousPlay={isContinuousPlay}
          setIsContinuousPlay={setIsContinuousPlay}
        />

        <div className="card shadow-xl my-5">
          <div className="card-body">
            <About />
          </div>
        </div>
      </div>

      <SongsList 
        songs={songs} 
        isLoading={isLoading} 
        onFetchSongs={fetchSongs} 
      />
    </div>
  );
}
