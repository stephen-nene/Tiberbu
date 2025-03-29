import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// Environment variables
const host = process.env.TAURI_DEV_HOST;
const backendUrl = process.env.BACKEND_URL || "http://localhost:3000";
const isTauriBuild = process.env.TAURI_ENV === "true";

export default defineConfig(async () => ({
  plugins: [react(), tailwindcss()],

  // Path aliases
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "~": path.resolve(__dirname, "./public"),
    },
  },

  // Development server configuration
  server: {
    port: 5173,
    strictPort: true,
    host: host || "0.0.0.0",

    // Hot Module Replacement
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 5173,
        }
      : undefined,

    // Proxy configuration
    proxy: {
      // API forwarding
      "/api": {
        target: backendUrl,
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

      // WebSocket proxy example
      "/socket.io": {
        target: backendUrl,
        ws: true,
        changeOrigin: true,
      },
    },

    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },

  // Build optimizations
  build: {
    // Tauri supports es2021
    target: isTauriBuild ? ["es2021", "chrome100", "safari15"] : "esnext",

    // Smaller chunk size for Tauri
    chunkSizeWarningLimit: isTauriBuild ? 500 : 1000,

    // Enable sourcemaps in dev
    sourcemap: !isTauriBuild,

    // Output analysis
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
  

  // Environment variables
  define: {
    __APP_ENV__: JSON.stringify(process.env.NODE_ENV || "development"),
    __BACKEND_URL__: JSON.stringify(isTauriBuild ? "/api" : backendUrl),
  },
}));
