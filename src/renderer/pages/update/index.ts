import 'element-plus/lib/theme-chalk/index.css'
import './index.css'
import { createApp } from 'vue'
// import { useElementPlus } from '../../plugins/element-plus'
import App from './App.vue'

const app = createApp(App)

// app.use(useElementPlus)

app.mount('#app')
