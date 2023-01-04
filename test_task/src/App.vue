<template>
  <v-app>
    <v-toolbar>
      <v-toolbar-title>My Test App</v-toolbar-title>
      <v-spacer />
      <v-btn @click="navigateToPage('page1')" text>Page 1</v-btn>
      <v-btn @click="navigateToPage('page2')" text>Page 2</v-btn>
    </v-toolbar>
    <v-content>
      <component :is="currentPage" />
    </v-content>
  </v-app>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'App',
  data() {
    return {
      currentPage: null
    }
  },
  methods: {
    async navigateToPage(page) {
      if (page === 'page1') {
        const Page1Comp = await import('./components/Page1Comp.vue')
        this.currentPage = Page1Comp
      } else if (page === 'page2') {
        const Page2Comp = await import('./components/Page2Comp.vue')
        this.currentPage = Page2Comp
      }
    }
  }
})
</script>