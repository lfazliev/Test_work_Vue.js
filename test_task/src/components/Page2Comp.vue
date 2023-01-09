<template>
    <!-- <DynamicScroller :items="difflist" :min-item-size="12" class="scroller w-50 overflow-auto" style="height: 90vh;">
        <template v-slot="{ item, index, active }">
            <DynamicScrollerItem :item="difflist" :active="active" :size-dependencies="[item,]" :data-index="index"
                prerender=500 updateInterval=1000>
                <div class="text">{{ item }}</div>
            </DynamicScrollerItem>
        </template>
    </DynamicScroller> -->
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
    name: 'Page2',
    data() {
        return {
            difflist: []
        }
    },
    methods: {
    },
    mounted() {
        this.$bus.on('diffChange', (diff) => {
            this.difflist.push(diff)
            if (this.difflist.length > 3000) {
                this.difflist.shift()
            }
        })

    },
})
</script>
<style scoped>
.scroller {
    height: 100%;
}
</style>