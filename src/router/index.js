import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const Login=()=>import('../components/Login')
const Home=()=>import('../components/Home')
const Welcome=()=>import('../components/Welcome')
const Users=()=>import('../components/user/Users')
const Rights=()=>import('../components/power/Rights')
const Roles=()=>import('../components/power/Roles')
const Cate=()=>import('../components/goods/Cate')
const Params=()=>import('../components/goods/Params')
const List=()=>import('../components/goods/List')
const Add=()=>import('../components/goods/Add')
const Order=()=>import('../components/order/Order')
const routes = [
  {
    path: '/',
    //重定向
    redirect:'/Login'
  },
  {
    path:'/Login',
    component:Login
        
  },
  {
    path:'/home',
    component:Home,
    redirect:'/welcome',
    children:[{path:'/welcome' , component:Welcome} ,{path:'/users' ,component:Users} ,
    {path:'/rights',component:Rights},{path:'/roles',component:Roles},{path:'/categories',component:Cate},
  {path:'/params',component:Params},{path:'/goods',component:List},{path:'/goods/add',component:Add},{path:'/orders',component:Order}]
  },
  
]

const router = new VueRouter({
  routes,
  mode:'history'
})
 

//挂载路由导航守卫  就是拦截器
router.beforeEach((to,from,next)=>{
  //to表示将要访问的路径
  //from代表从哪个路径跳转而来
  //next 是一个函数，表示放行
  // next（）放行  ，next（'login'）强行跳转
  if(to.path ==='/login') return next()
  //获取token
   const tokenStr= window.sessionStorage.getItem('token')
   if(!tokenStr) return next('/login')
   next()
})
export default router
