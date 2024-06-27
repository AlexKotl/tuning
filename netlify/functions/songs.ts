import type { Context } from "@netlify/functions";

export const SONGSTERR_API_URL = "https://www.songsterr.com/api/songs?";

const handler = async (req: Request, context: Context) => {
  console.log("req", req.url);

  const response = await fetch(
    SONGSTERR_API_URL + "size=20&" + req.url.split("?")[1]
  );

  return new Response(response.body);
};

export default handler;
