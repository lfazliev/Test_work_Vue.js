<template>
    <div>
        <v-btn @click="even()">событие</v-btn>
        <p>{{ checkevent }}</p>
    </div>
</template>

<script>
export default {
    name: 'Page1',
    data() {
        return {
            checkevent: ''
        }
    },
    methods: {
        even() {
            let data = 'color123'
            this.$bus.emit('testevent', { a: 'bre' })
        }
    },
    mounted() {
        this.$bus.on('testevent', e => this.checkevent = e)
    }

}
</script>