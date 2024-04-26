import type { Context } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

const parameters = {
  size: 500,
  from: 0,
  inst: "guitar",
  difficulty: "0",
};

const supabase = createClient(
  process.env.SUPABASE_URL ?? "",
  process.env.SUPABASE_SERVICE_KEY ?? ""
);

const apiUrl =
  "https://www.songsterr.com/api/songs?" +
  Object.keys(parameters)
    .map((key) => `${key}=${parameters[key]}`)
    .join("&");

const handler = async (req: Request, context: Context) => {
  if (!process.env.SUPABASE_URL) {
    throw new Error("SUPABASE_URL not defined");
  }

  console.log("Fetching", apiUrl);
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
      string1TuningId: track.tuning?.[0],
      string2TuningId: track.tuning?.[1],
      string3TuningId: track.tuning?.[2],
      string4TuningId: track.tuning?.[3],
      string5TuningId: track.tuning?.[4],
      string6TuningId: track.tuning?.[5],
      string7TuningId: track.tuning?.[6],
    };
  });

  const songIds = songsResponse.map((song: any) => song.songId);

  const { data, error } = await supabase.from("parser_logs").select("*").
  await supabase.from("parser_logs").insert([
    {
      sizeParam: parameters.size,
      fromParam: parameters.from,
      instParam: parameters.inst,
      difficultyParam: parameters.difficulty,
    },
  ]);

  //   const { data, error } = await supabase.from("songs").insert(songsList);
  //   console.log(data, error);
  return new Response("Parsing finished!");
};

export default handler;
