// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  modules: ['@nuxt/ui', '@nuxtjs/color-mode'],
  ssr: false,
  routeRules: {
    '/': { prerender: true },
    '/ai': {prerender: true}
  },
  app: {
    head: {
      title: 'Wavethinker',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: 'An AI-powered B2B SaaS for detecting Alzheimer\'s Disease from EEG data.' },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    },

  },
  css: ['~/assets/css/main.css'],
  devtools: { enabled: true }
})
