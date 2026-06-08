import express from "express";
import path from "path";
import app from "./server.js";

const PORT = Number(process.env.PORT) || 3000;

// Standalone HTTP server. Used for local development (`npm run dev`) and for
// long-running hosts such as Cloud Run (`npm run build` + `npm start`).
// On Vercel this file is NOT used — the Express app runs as a serverless
// function (api/[...path].ts) and the SPA is served by Vercel's CDN.
async function startServer() {
  // Vite integration in development env
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting development Express server with Vite middleware...");
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });

    app.use(vite.middlewares);
  } else {
    // In production, serve built client assets from /dist
    console.log("Starting production Express server serving /dist folder...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Solana Fitness Explorer Server listening on http://localhost:${PORT}`);
  });
}

startServer();
