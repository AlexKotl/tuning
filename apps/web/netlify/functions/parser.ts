// import type { Context } from "@netlify/functions";
// import { createClient } from "@supabase/supabase-js";

// type ApiRequestParameters = {
//   size: number;
//   from: number;
//   inst?: string;
//   difficulty?: string;
// };

// const MAX_RESULT_ITEMS = 10_000;
// const ITEMS_PER_REQUEST = 500;

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
//   process.env.SUPABASE_SERVICE_KEY ?? ""
// );

// async function parseWithParams(parameters: ApiRequestParameters) {
//   const apiUrl =
//     "https://www.songsterr.com/api/songs?" +
//     Object.keys(parameters)
//       .map((key) => `${key}=${parameters[key as keyof typeof parameters]}`)
//       .join("&");

//   const currentQueryParams = {
//     sizeParam: parameters.size,
//     fromParam: parameters.from,
//     instParam: parameters.inst,
//     difficultyParam: parameters.difficulty,
//   };

//   // Check if we already parsed this
//   const { data: dataParser } = await supabase
//     .from("parser_logs")
//     .select("*")
//     .match(currentQueryParams);
//   if (dataParser && dataParser.length > 0) {
//     console.log("Already parsed with params:", currentQueryParams);
//     return;
//   }

//   console.log("Fetching", apiUrl);
//   const response = await fetch(apiUrl);
//   const songsResponse = await response.json();

//   const pasedSongIds = songsResponse.map((song: any) => song.songId);

//   const { data } = await supabase
//     .from("songs")
//     .select("songId")
//     .in("songId", pasedSongIds);

//   const existedIds = data?.map((song) => song.songId);

//   const songsList = songsResponse
//     .filter((song: any) => !existedIds?.includes(song.songId))
//     .map((song: any) => {
//       const track = song.tracks.sort((a: any, b: any) => a.views > b.views)[0];
//       return {
//         songId: song.songId,
//         instrumentId: track.instrumentId,
//         artist: song.artist,
//         title: song.title,
//         views: track.views,
//         string1TuningId: track.tuning?.[0],
//         string2TuningId: track.tuning?.[1],
//         string3TuningId: track.tuning?.[2],
//         string4TuningId: track.tuning?.[3],
//         string5TuningId: track.tuning?.[4],
//         string6TuningId: track.tuning?.[5],
//         string7TuningId: track.tuning?.[6],
//       };
//     });

//   await supabase.from("parser_logs").insert([currentQueryParams]);

//   await supabase.from("songs").insert(songsList);
// }

// const handler = async (req: Request, context: Context) => {
//   if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
//     throw new Error("NEXT_PUBLIC_SUPABASE_URL not defined");
//   }

//   for (let difficulty of ["0", "1", "2"]) {
//     for (
//       let page = 0;
//       page < Math.floor(MAX_RESULT_ITEMS / ITEMS_PER_REQUEST);
//       page++
//     ) {
//       await parseWithParams({
//         from: page * ITEMS_PER_REQUEST,
//         size: ITEMS_PER_REQUEST,
//         difficulty: difficulty,
//         inst: "guitar",
//       });
//     }
//   }

//   return new Response("Parsing finished!");
// };

// export default handler;
