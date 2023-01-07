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
                const ws = new window.WebSocket(`wss://stream.binance.com:9443/ws`)
                ws.onopen = function (event) {
                    console.log("WebSocket connection established")
                    ws.send(JSON.stringify({ "method": "SUBSCRIBE", "params": [`${symbol.toLowerCase()}@depth`], "id": 1 }))
                }
                ws.onmessage = (event) => {
                    if (event.type == 'ping')
                        ws.send('pong')
                    //`${symbol.toLowerCase()}@aggTrade`,
                }
                return ws
            }
        }
    }
}