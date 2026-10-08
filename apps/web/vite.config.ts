import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiUrl = (process.env.API_URL ?? env.API_URL ?? "http://127.0.0.1:8001").replace(/\/$/, "");
  const port = Number(process.env.PORT ?? env.PORT ?? 3001);
  const proxy = { "/api": { target: apiUrl, changeOrigin: true } };

  return {
    plugins: [react()],
    resolve: {
      alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
    },
    server: { host: "127.0.0.1", port, strictPort: true, proxy },
    preview: { host: "127.0.0.1", port, strictPort: true, proxy },
  };
});
