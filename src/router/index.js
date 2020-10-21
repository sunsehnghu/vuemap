import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const Login=()=>import('../components/Login')

const routes = [
  {
    path: '/',
    redirect:'/Login'
  },
  {
    path:'/Login',
    component:Login
    
    
  }
]

const router = new VueRouter({
  routes,
  mode:'history'
})

export default router
