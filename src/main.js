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
import TreeTable from 'vue-table-with-tree-grid'
//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
//require styles 导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
//配置axios
import axios from 'axios'
//配置请求的跟路径
axios.defaults.baseURL ='http://www.gx-blog.com:8888/api/private/v1/'
axios.interceptors.request.use(config=>{
  // console.log(config)
   config.headers.Authorization =window.sessionStorage.getItem('token')
  return config
})

Vue.prototype.$http =axios
Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.component('tree-table',TreeTable)
Vue.use(VueQuillEditor)

Vue.filter('dateFormat',function(originVal){
  const dt = new Date(originVal)
  const y =dt.getFullYear()
  const m =(dt.getMonth()+1+'').padStart(2,'0')
  const d =(dt.getDate()+'').padStart(2,'0')
  const hh =(dt.getHours()+'').padStart(2,'0')
  const mm =(dt.getMinutes()+'').padStart(2,'0')
  const ss =(dt.getSeconds()+'').padStart(2,'0')
   return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
