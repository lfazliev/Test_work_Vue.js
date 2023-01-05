import * as WebSocket from 'ws'
import axios from 'axios'
export const binanceSdk = {
    install(app) {
        app.config.globalProperties.$binance = {
            getOrderBook(symbol) {
                return fetch(`https://api.binance.com/api/v3/depth?symbol=${symbol}&limit=500`)
                    .then(response => response.json())
            },
            subscribe(symbol) {
                const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@depth`)
                ws.onmessage = onMessage
                return ws
            }
        }
    }
}