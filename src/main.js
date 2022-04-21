import { createApp } from 'vue'
import App from './App.vue'
// 导航
import router from './router.js'
import installElementPlus from './plugins/element'
import loki from "lokijs"

const app = createApp(App)
let db = new loki('wincloudData.db')
app.config.globalProperties.$db = db;

installElementPlus(app)
app.use(router).mount('#app')
