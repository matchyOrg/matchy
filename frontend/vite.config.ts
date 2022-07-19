import { fileURLToPath, URL } from "node:url";

// https://vant-ui.github.io/vant/#/en-US/quickstart
import Components from "unplugin-vue-components/vite";
import { VantResolver } from "unplugin-vue-components/resolvers";

// https://vitejs.dev/config/
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

export default defineConfig({
  plugins: [vue(), vueJsx(), Components({ resolvers: [VantResolver()] })],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    outDir: "dist",
    target: "esnext",
  },
});
