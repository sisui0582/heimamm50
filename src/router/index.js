import Vue from 'vue'
import VueRouter from 'vue-router'
// import login from '@/view/login/login'
// import layout from '@/view/layout/layout.vue'

//引入layout的子组件
// import chart from '@/view/layout/chart/chart'
// import user from '@/view/layout/user/user'
// import enterprise from '@/view/layout/enterprise/enterprise'
// import question from '@/view/layout/question/question'
// import subject from '@/view/layout/subject/subject'
// import welcome from '@/view/layout/welcome/welcome'

const login = () => import('@/view/login/login')
const layout = () => import('@/view/layout/layout')
const chart = () => import('@/view/layout/chart/chart')
const enterprise = () => import('@/view/layout/enterprise/enterprise')
const question = () => import('@/view/layout/question/question')
const subject = () => import('@/view/layout/subject/subject')
const user = () => import('@/view/layout/user/user')
const welcome = () => import('@/view/layout/welcome/welcome')

//以下测试
import Sloe3 from "@/test/sloe3/index"

Vue.use(VueRouter)
//导入 token (按需导入)
import { getToken } from '../utils/token'

const router = new VueRouter({
    routes: [
        { path: '/', redirect: '/login' },
        { path: '/login', component: login ,meta:{title:'登录'}},
        {
            path: '/layout', component: layout, children: [
                {
                    path: "welcome",
                    component: welcome,
                    // 元信息
                    meta: {
                        roles: ["超级管理员", "管理员", "老师", "学生"],
                        icon: "el-icon-date",
                        fullPath: "/layout/welcome",
                        title: "个人信息",
                    },
                },
                {
                    path: "chart",
                    component: chart,
                    meta: {
                        roles: ["超级管理员", "管理员", "老师"],
                        icon: "el-icon-pie-chart",
                        fullPath: "/layout/chart",
                        title: "数据预览",
                    },
                },
                {
                    path: "user",
                    component: user,
                    meta: {
                        roles: ["超级管理员", "管理员", "老师"],
                        icon: "el-icon-user",
                        fullPath: "/layout/user",
                        title: "用户列表",
                    },
                },
                {
                    path: "enterprise",
                    component: enterprise,
                    meta: {
                        roles: ["超级管理员", "管理员", "老师"],
                        icon: "el-icon-office-building",
                        fullPath: "/layout/enterprise",
                        title: "企业列表",
                    },
                },
                {
                    path: "question",
                    component: question,
                    meta: {
                        roles: ["超级管理员", "管理员", "老师", "学生"],
                        icon: "el-icon-edit-outline",
                        fullPath: "/layout/question",
                        title: "题库列表",
                    },
                },
                {
                    path: "subject",
                    component: subject,
                    meta: {
                        roles: ["超级管理员", "管理员", "老师"],
                        icon: "el-icon-notebook-2",
                        fullPath: "/layout/subject",
                        title: "学科列表",
                    },
                },
            ],
        },
        //以下面测试
        { path: "/sloe3", component: Sloe3 },
    ]
})
//全局导航首位
//to : 从哪个页面(路由)来
// from: 到哪个页面(路由)
//next: 函数
router.beforeEach((to, from, next) => {
    //console.log(to);
    //console.log(from);
    if (to.fullPath === "/login") {
        next()
    } else {
        //要去非登录页面,就要去判断是否登陆了,如果登陆了,就去你想要的页面,如果没有就返回登陆页面
        const token = getToken()
        if (token) {
            next()
        } else {
            next("/login")
        }
    }
})

export default router