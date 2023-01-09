<template>
    <div class="h-screen-10 d-flex justify-space-between visscroll">

        <div class='h-100 w-50'>
            <p>Bids</p>
            <div class="table w-100 h-100">
                <div>
                    <tr class=d-flex>
                        <th>Price(USDT)</th>
                        <th>Quantity(BTC)</th>
                        <th>Total</th>
                    </tr>
                </div>
                <div class="w-100 tbody">
                    <!-- <v-virtual-scroll height="100">
                        <template class=flex v-for="bid of bids">
                            <div class='d-flex'>
                                <div>{{ bid[0] }}</div>
                                <div>{{ bid[1] }}</div>
                                <div>{{ (bid[0] * bid[1]).toFixed(5) }}</div>
                            </div>
                        </template>
                    </v-virtual-scroll> -->
                </div>
            </div>

        </div>
        <div class='h-100 w-50'>
            <p>Asks</p>
            <div class="table w-100 h-100">
                <div>
                    <tr class=d-flex>
                        <th>Price(USDT)</th>
                        <th>Quantity(BTC)</th>
                        <th>Total</th>
                    </tr>
                </div>
                <div class="w-100 h-95 tbody">
                    <!-- <v-virtual-scroll height="50">
                        <template class=flex v-for="bid of bids">
                            <div class='d-flex'>
                                <div>{{ bid[0] }}</div>
                                <div>{{ bid[1] }}</div>
                                <div>{{ (bid[0] * bid[1]).toFixed(5) }}</div>
                            </div>
                        </template>
                    </v-virtual-scroll> -->
                </div>
            </div>
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
            data.sort((a, b) => {
                if (a[0] < b[0]) {
                    return -1;
                }
                if (a.name > b.name) {
                    return 1;
                }
                return 0;
            })
            if (data.length > 1000) {
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
        subscribe() {
            setTimeout(() => {
                if (this.bids == null) {
                    this.$binance.getOrderBook(this.symbol).then(data => {
                        this.bids = data.bids
                        this.asks = data.asks
                        this.lastUpdateId = data.lastUpdateId
                        this.processBuffer()
                    })
                }
            }, 1100)
        }
    },
    mounted() {

        this.$bus.on('symbolChange', (symbol) => {
            this.symbol = symbol
            this.bids = null
            this.asks = []
            this.lastUpdateId = 0
            this.buffer = []
            this.checkFirstE = false
            this.ws = null
            this.subscribe()
        })
        if (this.ws == null) {
            this.ws = this.$binance.subscribe(this.symbol)
        }
        this.ws.onmessage = function (e) {
            const event = JSON.parse(e.data)
            if (event.e === 'depthUpdate') {
                this.buffer.push(event)
                if (this.lastUpdateId !== 0) { this.processBuffer() }
            }
        }.bind(this)
        this.subscribe()
    }
})

</script>
