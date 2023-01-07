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
                <div class="w-100 h-95 tbody">
                    <v-virtual-scroll :items='this.buds' height="50" :height="300">
                        <template v-slot:default='{ item }'>
                            <div class='d-flex'>
                                <div>{{ item[0] }}</div>
                                <div>{{ item[1] }}</div>
                                <div>{{ (item[0] * item[1]).toFixed(5) }}</div>
                            </div>
                        </template>
                    </v-virtual-scroll>
                </div>
            </div>

        </div>
        <!-- <div class='h-100 w-50'>
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
                    <v-virtual-scroll :height="50">
                        <template class=flex v-for="bid of bids">
                            <div class='d-flex'>
                                <div>{{ bid[0] }}</div>
                                <div>{{ bid[1] }}</div>
                                <div>{{ (bid[0] * bid[1]).toFixed(5) }}</div>
                            </div>
                        </template>
                    </v-virtual-scroll>
                </div>
            </div>
        </div> -->
    </div>
</template>

<script>
export default {
    name: 'Page1',
    data() {
        return {
            bids: [],
            asks: [],
            lastUpdateId: 0,
            buffer: [],
            test: true
        }
    },
    methods: {
        removeUnsuitable(array) {
            const seen = new Set();
            const result = [];
            for (const item of array) {
                if (!seen.has(item[0]) && (Number(item[1]) != 0)) {
                    seen.add(item);
                    result.push(item);
                }
            }
            return result;
        },
        checkeventdata(e, data) {
            let buf = []
            buf.push(...e, ...data)
            buf.sort((a, b) => {
                if (a[0] < b[0]) {
                    return -1;
                }
                if (a.name > b.name) {
                    return 1;
                }
                return 0;
            })
            buf = this.removeUnsuitable(buf)
            data.splice(0, data.length, ...buf)
        },
        eventProcess(event) {
            this.lastUpdateId = event.u
            this.checkeventdata(event.b, this.bids)
            this.checkeventdata(event.a, this.asks)
        },
        processBuffer() {
            for (const item in this.buffer) {
                if (this.buffer[item].u <= this.lastUpdateId) {
                    this.buffer.splice(item, 1)
                }
                else {
                    if (this.test) {
                        if (this.buffer[item].U <= (this.lastUpdateId + 1)) {
                            if (this.buffer[item].u >= (this.lastUpdateId + 1)) {
                                this.eventProcess(this.buffer[item])
                                this.test = false
                            }
                        }
                    }
                    else {
                        if (this.buffer[item].U = (this.lastUpdateId + 1)) {
                            // this.eventProcess(this.buffer[item])
                        }
                    }
                }
            }
            this.buffer = []
        },
    },
    mounted() {
        const ws = this.$binance.subscribe('BTCUSDT')
        ws.onmessage = function (e) {
            const event = JSON.parse(e.data)
            if (event.e === 'depthUpdate') {
                this.buffer.push(event)
                this.processBuffer()
            }
        }.bind(this)
        setTimeout(() => {
            this.$binance.getOrderBook('BTCUSDT').then(data => {
                this.bids = data.bids
                this.asks = data.asks
                this.lastUpdateId = data.lastUpdateId
            })
        }, 1100)
    }
}

</script>
<style lang="scss">
.h-screen-10 {
    height: 90vh;
}

.textcont>p {
    padding: 15px;
}

.table th,
.table .tbody div>div {
    width: 33.3%;
    text-align: center;
}

.visscroll .table>.tbody>div {
    overflow: hidden
}

.visscroll .table>.tbody>div:hover {
    overflow-y: scroll
}

.visscroll .table>.tbody>div::-webkit-scrollbar {
    width: 10px;
}

.visscroll .table>.tbody>div {
    width: 10px;
    scrollbar-gutter: stable;
}

.visscroll .table>.tbody>div::-webkit-scrollbar-thumb {
    background-color: #000000;
    border-radius: 10px;
    -webkit-transition: all 0.2s ease-in-out;
    transition: all 0.2s ease-in-out;
}

.visscroll .table>.tbody>div::-webkit-scrollbar-thumb:hover {
    background-color: #939393;
}

.visscroll>div>p {
    text-align: center;
}
</style>