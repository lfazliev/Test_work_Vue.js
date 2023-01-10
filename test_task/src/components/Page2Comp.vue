<template>
    <v-container class="d-flex cont listmobile">
        <div class='diffcont'>
            <div v-for="diff of difflist">{{
                diff
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
            // console.log(diff);
            this.difflist.unshift(diff)
            if (this.difflist.length > 200) {
                this.difflist.pop()
            }
        })
    },
})
</script>
<style scoped lang="scss">
.cont {
    height: 85vh;

    >div {
        width: 50%;
    }

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

    >.diffcont {
        scrollbar-gutter: stable;
        overflow: hidden
    }

    >.diffcont:hover {
        overflow-y: scroll
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