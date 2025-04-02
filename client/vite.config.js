import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig(({ mode }) => {
  // Load environment variables manually
  const env = loadEnv(mode, process.cwd(), "");

  // Environment variables

  const localUrl = "http://localhost:3000";
  const backUrl = env.BACKEND_URL || "https://tiberbu.onrender.com/api/v1.0";

  const host = env.TAURI_DEV_HOST;
  const isTauriBuild = env.TAURI_ENV === "true";

  return {
    plugins: [react(), tailwindcss()],

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "~": path.resolve(__dirname, "./public"),
      },
    },

    server: {
      port: 5173,
      strictPort: true,
      host: host || "0.0.0.0",

      hmr: host
        ? {
            protocol: "ws",
            host,
            port: 5173,
          }
        : undefined,

      proxy: {
        "/api": {
          target: backUrl,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
          configure: (proxy) => {
            proxy.on("error", (err) => {
              console.log("Proxy Error:", err);
            });
            proxy.on("proxyReq", (proxyReq) => {
              console.log("Proxying:", proxyReq.path);
            });
          },
        },
        
        "/socket.io": {
          target: localUrl,
          ws: true,
          changeOrigin: true,
        },
      },

      watch: {
        ignored: ["**/src-tauri/**"],
      },
    },

    build: {
      target: isTauriBuild ? ["es2021", "chrome100", "safari15"] : "esnext",
      chunkSizeWarningLimit: isTauriBuild ? 500 : 1000,
      sourcemap: !isTauriBuild,
      rollupOptions: {
        output: {
          manualChunks: isTauriBuild
            ? undefined
            : {
                react: ["react", "react-dom"],
                vendor: ["lodash", "axios"],
              },
        },
      },
    },

    define: {
      __APP_ENV__: JSON.stringify(env.NODE_ENV || "development"),
      __BACKEND_URL__: JSON.stringify(isTauriBuild ? "/api" : backUrl),
    },
  };
});
