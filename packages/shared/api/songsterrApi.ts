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
  const endpoint = process.env.SONGS_API_URL ?? 'https://fingerstyle.top/api/songs';
  const queryParams = new URLSearchParams({
    tuning: params.tuning ?? "",
    size: params.size?.toString() ?? "20",
    from: params.from?.toString() ?? "0",
  }).toString();
  const response = await fetch(`${endpoint}?${queryParams}`);
  const songsResponse = (await response.json()) satisfies SongsterrResponse;
  return songsResponse;
}
