<template>
    <div>
        <v-btn @click="check()">chack</v-btn>
        <img src="https://w-dog.ru/wallpapers/9/17/322057789001671/zakat-nebo-solnce-luchi-oblaka-tuchi-pole-kolosya-zelenye-trava.jpg"
            alt="">
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