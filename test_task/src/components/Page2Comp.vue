<template>
    <div>
        <v-btn @click="check()">chack</v-btn>
        <p>{{ col }}</p>
    </div>
</template>

<script>
export default {
    name: 'Page2',
    data() {
        return {
            col: []
        }
    },
    methods: {
        check() {
            this.col = []
            this.$binance.getOrderBook('BTCUSDT').then(data => {


                this.col.push(data.asks)
                this.col.push('dfdgsfdfdfsdgsdfg')
                this.col.push(data.bids)
            })
        }
    },
    beforeMount() {

    },
}
</script>