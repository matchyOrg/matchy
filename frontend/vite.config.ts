import { fileURLToPath, URL } from "node:url";

import Components from "unplugin-vue-components/vite";
import AutoImport from "unplugin-auto-import/vite";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { visualizer } from "rollup-plugin-visualizer";
import vuetify from "vite-plugin-vuetify";
import vueI18n from "@intlify/vite-plugin-vue-i18n";
import basicSsl from "@vitejs/plugin-basic-ssl";
import Unocss from "unocss/vite";

export default defineConfig({
  plugins: [
    vue(),
    vueI18n({
      include: "./src/locales/**",
    }),
    vueJsx(),
    vuetify({ autoImport: true }),
    AutoImport({
      // targets to transform
      include: [
        /\.ts$/, // .ts,
        /\.vue$/, // .vue
      ],
      // global imports to register
      imports: ["vue", "vue-router"],
      dirs: ["./src/composables"],

      // Generate corresponding .eslintrc-auto-import.json file.
      // eslint globals Docs - https://eslint.org/docs/user-guide/configuring/language-options#specifying-globals
      eslintrc: {
        enabled: true, // Default `false`
        filepath: "./.eslintrc-auto-import.json", // Default `./.eslintrc-auto-import.json`
        globalsPropValue: true, // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
      },

      // Filepath to generate corresponding .d.ts file.
      dts: "src/auto-imports.d.ts",
    }),
    Components({ dts: "src/components.d.ts" }),
    basicSsl(),
    visualizer({
      emitFile: true,
      filename: "stats.html",
      template: "sunburst",
    }),
    Unocss({
      /* options */
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    https: true,
    port: 5173,
  },
  build: {
    outDir: "dist",
  },
});
