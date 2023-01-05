import eventBus from './event-bus.js'
import binanceSdk from './binance-sdk.js'
export default function install(app) {
    app.use(eventBus)
    app.use(binanceSdk)
}