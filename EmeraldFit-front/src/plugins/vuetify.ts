/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        dark: true,
        colors: {
          background: '#020420',
          surface: '#0f172a',
          primary: '#00dc82',
          secondary: '#00b368',
          error: '#ef4444',
          warning: '#f59e0b',
          info: '#3b82f6',
          success: '#00dc82',
        },
      },
    },
  },
})
