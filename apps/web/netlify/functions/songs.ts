import type { Context } from "@netlify/functions";

export const SONGSTERR_API_URL = "https://www.songsterr.com/api/songs?";

const handler = async (req: Request, context: Context) => {
  const url = new URL(req.url);
  const searchParams = url.searchParams;
  
  // Extract parameters with defaults
  const size = searchParams.get("size") || "20";
  const from = searchParams.get("from") || "0";
  const tuning = searchParams.get("tuning") || "";
  
  // Build the query for Songsterr API
  const songsterrParams = new URLSearchParams({
    size,
    from,
  });
  
  // Only add tuning if it exists
  if (tuning) {
    songsterrParams.append("tuning", tuning);
  }

  const response = await fetch(
    SONGSTERR_API_URL + songsterrParams.toString()
  );

  const corsResponse = new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: {
      ...Object.fromEntries(response.headers.entries()),
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });

  return corsResponse;
};

export default handler;
