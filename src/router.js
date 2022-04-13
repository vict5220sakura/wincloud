import {createRouter, createWebHashHistory} from 'vue-router'
import Index from './pages/Index.vue'
import Windows from './pages/windows/Windows.vue'
import Windows2 from './pages/windows2/Windows2.vue'
import WsTest from './pages/windows2/WsChat'

const routes = [
    { path: '/', redirect: '/windows2'},
    { path: '/index', component: Index },
    { path: '/windows', component: Windows },
    { path: '/windows2', component: Windows2 },
    { path: '/WsTest', component: WsTest },
]

const router = createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: createWebHashHistory(),
    routes, // `routes: routes` 的缩写
})

export default router;