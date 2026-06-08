// Vercel serverless function entry point.
//
// Every request to /api/* is routed here (catch-all). The Express app reads the
// original request URL (e.g. /api/exercises/categories) so its existing routes
// match without any rewrites. The SPA is served separately by Vercel's CDN from
// the Vite `dist` output.
import app from "../server.js";

export default app;
