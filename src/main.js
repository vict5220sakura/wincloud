import { createApp } from 'vue'
import App from './App.vue'

// 导航
import router from './router.js'

const app = createApp(App)
app.use(router).mount('#app')