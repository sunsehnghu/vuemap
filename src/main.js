import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//导入字体图标
import  './assets/fonts/iconfont.css'
//导入全局样式表
import './assets/global.css'

//配置axios
import axios from 'axios'
//配置请求的跟路径
axios.defaults.baseURL ='http://127.0.0.1:8888/api/private/v1'
axios.interceptors.request.use(config=>{
  // console.log(config)
   config.headers.Authorization =window.sessionStorage.getItem('token')
  return config
})

Vue.prototype.$http =axios
Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
