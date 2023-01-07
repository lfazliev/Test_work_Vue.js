<template>
    <v-container class="h-screen">
        <v-container class='h-75 overflow-auto'>
            <p>Bids</p>
            <div v-for="bid of bids">{{ bid[0]}} {{ ` ${bid[1]}` }} {{ (bid[0] * bid[1]).toFixed(1) }}</div>
        </v-container>
        <v-container class='h-75 overflow-auto'>
            <p>Asks</p>
            <div v-for="ask of asks">{{ ask[0]}} {{ ` ${ask[1]}` }}</div>
        </v-container>
    </v-container>
</template>

<script>
export default {
    name: 'Page1',
    data() {
        return {
            bids: [],
            asks: [],
            lastUpdateId: 0,
            buffer: []
        }
    },
    methods: {
        processBuffer() {
            for (const item in this.buffer) {
                if (this.buffer[item].u <= this.lastUpdateId) {
                    this.buffer.splice(item, 1)
                }
                else {
                    if (this.buffer[item].U <= (this.lastUpdateId + 1)) {
                        if (this.buffer[item].u >= (this.lastUpdateId + 1))
                            this.eventProcess(this.buffer[item])
                    }
                }
            }
            this.buffer = []
        },
        eventProcess(event) {
            console.log('a');
            this.lastUpdateId = event.u
            this.checkeventdata(event, this.bids)
            this.checkeventdata(event, this.asks)
        },
        checkeventdata(e, data) {
            let buf = e.b
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
            for (const i in data) {
                if (data[i][1] == 0 || data[i][1] == '0.00000000') {
                    data.splice(i, 1);
                    // console.log("удалено");
                }
            }
            data.filter((item, index, self) => {
                return self.findIndex(b => b[0] === item[0]) === index;
            });

        }
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
        }, 1001)
    }
}

</script>