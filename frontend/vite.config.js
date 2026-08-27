import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "node:path";
import { fileURLToPath } from "node:url";

// 项目根目录（frontend 的上一级）
const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

export default defineConfig(({ mode }) => {
  // 读取项目根目录下的 .env，动态获取后端端口
  const env = loadEnv(mode, rootDir, "");
  const apiPort = env.PORT || "30000";

  return {
    plugins: [vue()],
    build: {
      outDir: "../dist",
      emptyOutDir: true,
    },
    server: {
      port: 5173,
      proxy: {
        "/api": `http://localhost:${apiPort}`,
      },
    },
  };
});
