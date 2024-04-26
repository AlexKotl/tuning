type SongsterrSongsParams = {
  size?: number;
  from?: number;
  inst?: undefined | "guitar";
  difficulty?: "0" | "1" | "2";
};

type SongsterrResponse = {
  hasPlayer: boolean;
  artist: string;
  artistId: number;
  title: string;
  songId: number;
  tracks: {
    difficulty: string;
    tuning: number[];
    instrumentId: number;
    name: string;
    instrument: string;
    views: number;
  }[];
  hasChords: boolean;
  defaultTrack: number;
}[];

export const SONGSTERR_API_URL = "https://www.songsterr.com/api/songs?";

export async function getSongs(
  params: SongsterrSongsParams = {}
): Promise<SongsterrResponse> {
  const response = await fetch(SONGSTERR_API_URL);
  const songsResponse = (await response.json()) satisfies SongsterrResponse;
  return songsResponse;
}
