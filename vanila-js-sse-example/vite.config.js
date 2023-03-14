import { defineConfig } from "vite";
export default defineConfig({
  server: {
    proxy: {
      "/be": {
        target: "http://0.0.0.0:8080",
        rewrite: (path) => path.replace(/^\/be/, ""),
        ws: true,
        secure: false,
      },
    },
  },
});
