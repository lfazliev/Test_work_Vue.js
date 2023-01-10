<template>
    <div class="h-screen-10 d-flex justify-space-between visscroll">

        <div class='h-100'>
            <p>Bids ({{ symbol }})</p>
            <table class="w-100 h-100 d-flex flex-column listmobile">
                <thead>
                    <tr class='d-flex'>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th class="total">Total</th>
                    </tr>
                </thead>
                <tbody class="w-100 h-95">
                    <tr class='d-flex' v-for="bid of bids">
                        <td>{{ bid[0] }}</td>
                        <td>{{ bid[1] }}</td>
                        <td class="total">{{ (bid[0] * bid[1]).toFixed(5) }}</td>
                    </tr>
                </tbody>
            </table>

        </div>
        <div class='h-100'>
            <p>Asks {{ symbol }}</p>
            <table class="w-100 h-100 d-flex flex-column listmobile">
                <thead>
                    <tr class='d-flex'>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th class="total">Total</th>
                    </tr>
                </thead>
                <tbody class="w-100 h-95">
                    <tr class='d-flex' v-for="ask of asks">
                        <td>{{ ask[0] }}</td>
                        <td>{{ ask[1] }}</td>
                        <td class="total">{{ (ask[0] * ask[1]).toFixed(5) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
    name: 'Page1',
    data() {
        return {
            symbol: 'BTCUSDT',
            bids: null,
            asks: [],
            lastUpdateId: 0,
            buffer: [],
            checkFirstE: false,
            ws: null
        }
    },
    methods: {
        compareArrays(data, event, E, pol) {
            for (let i = 0; i < event.length; i++) {
                event[i].push(E)
                const index = data.findIndex(d => d[0] == event[i][0]);
                if (index >= 0) {
                    if (Number(event[i][1]) == 0) {
                        this.$bus.emit('diffChange', `${(pol == 'a') ? 'ask:' : 'bid:'} ${data[index][0]} ${data[index][1]} удалено`)
                        data.splice(index, 1);
                        event.splice(i, 1)
                        i--
                    }
                    else {
                        if (Number(event[i][1]) != data[index][1]) {
                            this.$bus.emit('diffChange', `${(pol == 'a') ? 'ask:' : 'bid:'} ${data[index][0]} ${data[index][1]} обновлено на ${event[i][0]} ${event[i][1]}`)
                            data[index] = event[i]
                        }
                        event.splice(i, 1)
                        i--
                    }
                }
                else {
                    if (Number(event[i][1] != 0)) {
                        this.$bus.emit('diffChange', `${(pol == 'a') ? 'ask:' : 'bid:'} ${event[i][0]} ${event[i][1]} добавлено`)
                    }
                    else {
                        event.splice(i, 1);
                        i--
                    }
                }
            }
        },
        checkeventdata(event, data, E, pol) {
            const buf = event
            this.compareArrays(data, buf, E, pol)
            data.push(...buf)
            data.sort((a, b) => b[0] - a[0])
            if (data.length > 5000) {
                while (data.length > 1000) {
                    let minIndex = 0;
                    data.reduce((min, item, index) => {
                        if (item[2] === undefined) {
                            minIndex = index;
                            return min;
                        }
                        if (item[2] < min) {
                            minIndex = index;
                            return item[2];
                        }
                        return min;
                    }, data[0][2]);

                    data.splice(minIndex, 1);
                }
            }
        },
        eventProcess(event) {
            this.lastUpdateId = event.u
            this.checkeventdata(event.b, this.bids, event.E, 'b')
            console.log(this.bids.length);
            this.checkeventdata(event.a, this.asks, event.E, 'a')
        },
        processBuffer() {
            for (const item in this.buffer) {
                if (this.buffer[item].u <= this.lastUpdateId) {
                    this.buffer.splice(item, 1)
                }
                else {
                    if (!this.test) {
                        if (this.buffer[item].U <= (this.lastUpdateId + 1)) {
                            if (this.buffer[item].u >= (this.lastUpdateId + 1)) {
                                this.eventProcess(this.buffer[item])
                                this.test = true
                            }
                        }
                    }
                    else {
                        if (this.buffer[item].U = (this.lastUpdateId + 1)) {
                            this.eventProcess(this.buffer[item])
                        }
                    }
                    this.buffer.splice(item, 1)
                }
            }

        },
        getSnap() {
            setTimeout(() => {
                if (this.bids == null) {
                    this.$binance.getOrderBook(this.symbol).then(data => {
                        this.bids = data.bids
                        this.asks = data.asks
                        this.lastUpdateId = data.lastUpdateId
                        if (this.buffer.length > 2) {
                            this.processBuffer()
                        }
                    })
                }
            }, 2500)
        }
    },
    mounted() {

        this.$bus.on('symbolChange', (symbol) => {
            this.$binance.unsubscribe(this.symbol, this.ws)
            this.symbol = symbol
            this.bids = null
            this.asks = []
            this.lastUpdateId = 0
            this.buffer = []
            this.checkFirstE = false
            this.ws = null
            this.getSnap()
            this.ws = this.$binance.subscribe(this.symbol)
            this.ws.onmessage = function (e) {
                const event = JSON.parse(e.data)
                if (event.e === 'depthUpdate') {
                    this.buffer.push(event)
                    if (this.lastUpdateId !== 0) {
                        if (this.buffer.length > 2) {
                            this.processBuffer()
                        }
                    }
                }
            }.bind(this)
        })
        if (this.ws == null) {
            this.ws = this.$binance.subscribe(this.symbol)
        }
        this.ws.onmessage = function (e) {
            const event = JSON.parse(e.data)
            if (event.e === 'depthUpdate') {
                this.buffer.push(event)
                if (this.lastUpdateId !== 0) {
                    if (this.buffer.length > 2) {
                        this.processBuffer()
                    }
                }
            }
        }.bind(this)
        this.getSnap()
    }
})

</script>
<style scoped lang = 'scss'>
@media screen and (max-width:600px) {
    .visscroll {
        flex-direction: column;

        >div {
            width: 100% !important;
        }

        table {
            >tbody {
                height: 90%;
            }
        }
    }
}

.visscroll {
    >div {
        width: 50%;

        >p {
            text-align: center;
        }

        table {
            ::-webkit-scrollbar-thumb {
                background-color: #000000;
                border-radius: 10px;
                -webkit-transition: all 0.2s ease-in-out;
                transition: all 0.2s ease-in-out;
            }

            ::-webkit-scrollbar-thumb:hover {
                background-color: #939393;
            }

            ::-webkit-scrollbar {
                width: 10px;
            }

            >tbody {
                scrollbar-gutter: stable;
                overflow: hidden
            }

            >tbody:hover {
                overflow-y: scroll
            }

            @media screen and (max-width:800px) {
                tr {
                    .total {
                        display: none;
                        width: 0%;
                    }

                    >td,
                    >th {
                        text-align: center;
                        width: 50% !important;
                    }
                }
            }

            tr {

                >td,
                >th {
                    text-align: center;
                    width: 33.3%;
                }
            }
        }
    }
}
</style>