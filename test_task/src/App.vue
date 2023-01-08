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
import { defineComponent } from 'vue'
import Page1 from './components/Page1Comp.vue'
import Page2 from './components/Page2Comp.vue'
//const Page2 = defineAsyncComponent(() => import('./components/Page2Comp.vue')) // так импортируются асинхронные компоненты
//defineAsyncComponent is not defined
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