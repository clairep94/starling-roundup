// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/main.css','@justeattakeaway/pie-css'],
  ssr: false,

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  routeRules: {
    // prerender index route by default
    '/': { prerender: true },
  },

  compatibilityDate: '2025-03-06',
  modules: [
    '@pinia/nuxt',
    '@nuxt/test-utils/module'
  ],
  app:{
    head:{
      titleTemplate: '%s | Claire Peng Roundup Challenge'
    }
  },
  vue: {
    compilerOptions: {
      isCustomElement: tag => tag.includes('pie-') || tag.includes('icon-')
    }
  }
});