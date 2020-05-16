import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '@/view/login/login'
import layout from '@/view/layout/layout.vue'

Vue.use(VueRouter)

const router = new VueRouter({
    routes :[
        {path:'/',redirect:'/login'},
        {path:'/login',component:login},
        {path:'/layout',component:layout},
    ]
})

export default router