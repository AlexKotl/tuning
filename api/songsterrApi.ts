type SongsterrSongsParams = {
  size?: number;
  from?: number;
  inst?: undefined | "guitar";
  difficulty?: "0" | "1" | "2";
  tuning?: string;
};

export type SongsterrSong = {
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
};

type SongsterrResponse = SongsterrSong[];

export async function getSongsFromClient(
  params: SongsterrSongsParams = {}
): Promise<SongsterrResponse> {
  const queryParams = new URLSearchParams({
    tuning: params.tuning ?? "",
  }).toString();
  const response = await fetch(`/api/songs?${queryParams}`);
  const songsResponse = (await response.json()) satisfies SongsterrResponse;
  return songsResponse;
}
