import { createApp } from 'vue'

const eventBus = createApp({
    // Optionally define a default state
    data: {
        message: ''
    }
})

export default {
    install(app) {
        // Add the event bus as a property of the app instance
        app.config.globalProperties.$eventBus = eventBus
    }
}