import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  root: "src/assessment",
  base: "/assessment/",
  build: {
    outDir: path.resolve(__dirname, "assessment"),
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@lib": path.resolve(__dirname, "lib"),
    },
  },
});
