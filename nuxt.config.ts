import { defineNuxtConfig } from "nuxt";

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  buildModules: ["nuxt-windicss", "@pinia/nuxt"],
  middleware: ["auth"],
  ssr: false,
  //buildDir: "../functions/nuxt",
});
