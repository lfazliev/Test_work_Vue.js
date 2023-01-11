<template>
  <v-app>
    <v-toolbar>
      <v-toolbar-title>My Test App</v-toolbar-title>
      <v-spacer />
      <v-btn @click="navigateToPage('page1')" text>Page 1</v-btn>
      <v-btn @click="navigateToPage('page2')" text>Page 2</v-btn>
    </v-toolbar>
    <keep-alive>
      <component :is="currentPage" />
    </keep-alive>
  </v-app>
</template>

<script>
import { defineAsyncComponent } from 'vue'
const Page1 = defineAsyncComponent(() => import('./components/Page1Comp.vue')) // так импортируются асинхронные компоненты
const Page2 = defineAsyncComponent(() => import('./components/Page2Comp.vue')) // так импортируются асинхронные компоненты
export default {
  data() {
    return {
      currentPage: Page1
    }
  },
  methods: {
    sdk() {
      this.$vuetify
    },
    navigateToPage(page) {
      if (page === 'page1') {
        this.currentPage = Page1
      } else if (page === 'page2') {
        this.currentPage = Page2
      }
    }
  },
}
</script>
<style scoped lang = scss>
@media screen and (max-width: 460px) {
  .v-toolbar-title {
    display: none;
  }

}
</style>