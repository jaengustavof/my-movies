// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite 5+ expone isSsrBuild en el callback de config
export default defineConfig(({ command, isSsrBuild }) => {
  const isBuild = command === "build";

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": "/src",
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          quietDeps: true,
        },
      },
    },

    // Config diferenciada según sea build cliente o SSR
    build: {
      // Cliente -> dist/client | SSR -> dist/server
      outDir: isSsrBuild ? "dist/server" : "dist/client",
      // Solo vaciamos dist en el primer build (cliente).
      // Así puedes correr build cliente y luego SSR sin que se borren mutuamente.
      emptyOutDir: isSsrBuild ? false : true,

      rollupOptions: isSsrBuild
        ? {
            // Entrada del bundle SSR
            input: "./src/entry-server.tsx",
            output: {
              format: "esm",
            },
          }
        : {
            // Entrada del cliente (Vite resuelve index.html)
            input: "./index.html",
          },
    },

    ssr: {
      external: ["react", "react-dom", "react-dom/server"],
    },
  };
});
