import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import { binanceSdk } from './core/binance-sdk'
loadFonts()
createApp(App)
  .use(binanceSdk)
  .use(vuetify)
  .mount('#app')
