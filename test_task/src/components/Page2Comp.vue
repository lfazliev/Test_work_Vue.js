<template>
    <v-container class="d-flex cont h-screen-10">
        <div class='overflow-auto'>
            <div v-for="dif of difflist.reverse()">{{
                dif
            }}</div>
        </div>
        <div><v-combobox @change='symbolChange()' label="Symobol" :items="symbollist" v-model="selsymbol"></v-combobox>
        </div>
    </v-container>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
    name: 'Page2',
    data() {
        return {
            difflist: [],
            selsymbol: 'BTCUSDT',
            symbollist: ['BTCUSDT', 'BNBBTC', 'ETHBTC']
        }
    },
    methods: {
    },
    watch: {
        selsymbol() {
            this.$bus.emit('symbolChange', this.selsymbol)
            this.difflist = []
        }
    },
    mounted() {
        this.$bus.on('diffChange', (diff) => {
            this.difflist.push(diff)
            if (this.difflist.length > 10) {
                this.difflist.shift()
            }
        })
    },
})
</script>
<style scoped lang="scss">
.cont {
    >div {
        width: 50%;
    }
}

@media screen and (max-width:600px) {
    .cont {
        flex-direction: column-reverse;

        >div {
            width: 100%;
        }
    }
}
</style>