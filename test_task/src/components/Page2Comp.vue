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

        }
    },
    beforeMount() {

    },
}
</script>