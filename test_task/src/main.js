import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import { binanceSdk } from './core/binance-sdk'
import eventBus from './core/event-bus'
import './assets/main.css'
loadFonts()
createApp(App)
  .use(eventBus)
  .use(binanceSdk)
  .use(vuetify)
  .mount('#app')
