import type { Context } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL ?? "",
  process.env.SUPABASE_SERVICE_KEY ?? ""
);

const apiUrl = "https://www.songsterr.com/api/songs";

const handler = async (req: Request, context: Context) => {
  if (!process.env.SUPABASE_URL) {
    throw new Error("SUPABASE_URL not defined");
  }

  const response = await fetch(apiUrl);
  const songsResponse = await response.json();

  const songsList = songsResponse.map((song: any) => {
    const track = song.tracks.sort((a: any, b: any) => a.views > b.views)[0];
    return {
      songId: song.songId,
      instrumentId: track.instrumentId,
      artist: song.artist,
      title: song.title,
      views: track.views,
      string1TuningId: track.tuning[0],
      string2TuningId: track.tuning[1],
      string3TuningId: track.tuning[2],
      string4TuningId: track.tuning[3],
      string5TuningId: track.tuning[4],
      string6TuningId: track.tuning[5],
      string7TuningId: track.tuning[6],
    };
  });

  //   const { data, error } = await supabase.from("songs").insert(songsList);
  //   console.log(data, error);
  return new Response("Parsing finished!");
};

export default handler;
