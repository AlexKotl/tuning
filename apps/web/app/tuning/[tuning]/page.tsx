"use client";

import { useState, useEffect } from "react";
// TODO: refactor this to use shared package
import { stringToNoteId } from "@/utils/utils";
import { tuningVariants } from "@/config/constants";
import About from "../../../components/About";
import { getSongsFromClient, type SongsterrSong } from "@/api/songsterrApi";
import { useRouter, usePathname } from "next/navigation";
import TuningPicker from "@/components/TuningPicker";
import SongsList from "@/components/SongsList";
import Link from "next/link";

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
  const [page, setPage] = useState(0);
  const pageSize = 20;
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

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
    setPage(0);
    setHasMore(true);

    try {
      const songs = await getSongsFromClient({
        tuning: tuning
          .map((note, index) => stringToNoteId(note, index))
          .join(","),
        size: pageSize,
        from: 0,
      });

      setSongs(songs);
      
      // Cache songs in localStorage for favorites page
      const existingCache = localStorage.getItem('allSongsCache');
      let allSongs: SongsterrSong[] = [];
      
      if (existingCache) {
        try {
          allSongs = JSON.parse(existingCache);
          
          // Add new songs that aren't already in the cache
          songs.forEach(song => {
            if (!allSongs.some(s => s.songId === song.songId)) {
              allSongs.push(song);
            }
          });
        } catch (e) {
          allSongs = songs;
        }
      } else {
        allSongs = songs;
      }
      
      localStorage.setItem('allSongsCache', JSON.stringify(allSongs));
      
      setHasMore(songs.length === pageSize);
    } catch (e) {
      alert("Oops, we cant get songs list :(");
    }

    setIsLoading(false);
  };

  const loadMoreSongs = async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    const nextPage = page + 1;
    const from = nextPage * pageSize;

    try {
      const moreSongs = await getSongsFromClient({
        tuning: tuning
          .map((note, index) => stringToNoteId(note, index))
          .join(","),
        size: pageSize,
        from,
      });

      setSongs((prevSongs) => [...prevSongs, ...moreSongs]);
      
      // Add more songs to cache
      const existingCache = localStorage.getItem('allSongsCache');
      let allSongs: SongsterrSong[] = [];
      
      if (existingCache) {
        try {
          allSongs = JSON.parse(existingCache);
          
          // Add new songs that aren't already in the cache
          moreSongs.forEach(song => {
            if (!allSongs.some(s => s.songId === song.songId)) {
              allSongs.push(song);
            }
          });
          
          localStorage.setItem('allSongsCache', JSON.stringify(allSongs));
        } catch (e) {
          console.error('Error updating song cache', e);
        }
      }
      
      setPage(nextPage);
      setHasMore(moreSongs.length === pageSize);
    } catch (e) {
      alert("Oops, we cant get more songs :(");
    }

    setIsLoadingMore(false);
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

      <div className="flex-1">
        <div className="flex items-center justify-between mb-5">
          <button
            className="btn btn-primary flex-grow mr-2"
            onClick={fetchSongs}
            disabled={isLoading}
          >
            {isLoading && <span className="loading loading-spinner"></span>}
            Search songs with {tuning.join(" ")} tuning
          </button>
        </div>
        
        <SongsList 
          songs={songs} 
          isLoading={isLoading} 
          onFetchSongs={fetchSongs} 
          tuning={tuning}
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
          onLoadMore={loadMoreSongs}
        />
      </div>
    </div>
  );
}
