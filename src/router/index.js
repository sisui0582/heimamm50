import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '@/view/login/login'
import layout from '@/view/layout/layout.vue'

//引入layout的子组件
import chart from '@/view/layout/chart/chart'
import user from '@/view/layout/user/user'
import enterprise from '@/view/layout/enterprise/enterprise'
import question from '@/view/layout/question/question'
import subject from '@/view/layout/subject/subject'

//以下测试
import Sloe3 from "@/test/sloe3/index"

Vue.use(VueRouter)
//导入 token (按需导入)
import {getToken} from '../utils/token'

const router = new VueRouter({
    routes :[
        {path:'/',redirect:'/login'},
        {path:'/login',component:login},
        {path:'/layout',component:layout,children:[
            {path:'chart',component:chart},
            {path:'user',component:user},
            {path:'enterprise',component:enterprise},
            {path:'question',component:question},
            {path:'subject',component:subject}
        ]},
        //以下面测试
        { path: "/sloe3",component: Sloe3},
    ]
})
//全局导航首位
//to : 从哪个页面(路由)来
// from: 到哪个页面(路由)
//next: 函数
router.beforeEach((to, from, next) => {
    //console.log(to);
    //console.log(from);
    if(to.fullPath === "/login"){
        next()
    }else{
      //要去非登录页面,就要去判断是否登陆了,如果登陆了,就去你想要的页面,如果没有就返回登陆页面
      const token = getToken()
      if(token){
          next()
      }else{
          next("/login")
      }
    }
  })

export default router