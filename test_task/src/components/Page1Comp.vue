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
                    <v-virtual-scroll height="100">
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
export default {
    name: 'Page1',
    data() {
        return {
            bids: null,
            asks: [],
            lastUpdateId: 0,
            buffer: [],
            test: true,
            ws: null
        }
    },
    methods: {
        compareArrays(data, event) {
            let i = 0;
            while (i < data.length) {
                let j = 0;
                while (j < event.length) {
                    if (data[i][0] == event[j][0]) {
                        data.splice(i, 1);
                        i--;
                        break;
                    }
                    if (Number(event[j][1]) == 0) {
                        event.splice(j, 1);
                        j--;
                    }
                    j++;
                }
                i++;
            }
        },
        checkeventdata(event, data) {
            const buf = event
            this.compareArrays(data, buf)
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
        },
        eventProcess(event) {
            this.lastUpdateId = event.u
            this.checkeventdata(event.b, this.bids)
            console.log(this.bids.length)
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
                            this.eventProcess(this.buffer[item])
                        }
                    }
                }
            }
        },
    },
    mounted() {
        if (this.ws == null) {
            this.ws = this.$binance.subscribe('BTCUSDT')
        }
        this.ws.onmessage = function (e) {
            const event = JSON.parse(e.data)
            if (event.e === 'depthUpdate') {
                this.buffer.push(event)
                this.processBuffer()
            }
        }.bind(this)
        setTimeout(() => {
            if (this.bids == null) {
                this.$binance.getOrderBook('BTCUSDT').then(data => {
                    this.bids = data.bids
                    this.asks = data.asks
                    this.lastUpdateId = data.lastUpdateId
                })
            }
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

.visscroll .table>.tbody {
    overflow: hidden
}

.visscroll .table>.tbody:hover {
    overflow-y: scroll
}

.visscroll .table>.tbody::-webkit-scrollbar {
    width: 10px;
}

.visscroll .table>.tbody {
    width: 10px;
    scrollbar-gutter: stable;
}

.visscroll .table>.tbody::-webkit-scrollbar-thumb {
    background-color: #000000;
    border-radius: 10px;
    -webkit-transition: all 0.2s ease-in-out;
    transition: all 0.2s ease-in-out;
}

.visscroll .table>.tbody::-webkit-scrollbar-thumb:hover {
    background-color: #939393;
}

.visscroll>div>p {
    text-align: center;
}
</style>