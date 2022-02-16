import { createApp } from 'vue'
import App from './App.vue'

// 导航
import router from './router.js'

import installElementPlus from './plugins/element'

const app = createApp(App)
installElementPlus(app)
app.use(router).mount('#app')