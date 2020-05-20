
import Vue from "vue";
import axios from "axios";
//按需导入
import { getToken, removeToken } from "@/utils/token";
import router from "@/router";

// 设置基础路径
axios.defaults.baseURL = process.env.VUE_APP_BASEURL;
// 允许携带cookies
axios.defaults.withCredentials = true;
//axios 拦截器
axios.interceptors.request.use(
    config => {
        const token = getToken();
        if (token) { // 判断是否存在token，如果存在的话，则每个http header都加上token
            config.headers.token = token  //请求头加上token
        }
        return config
    },
    err => {
        return Promise.reject(err)
    })

    //响应拦截器
    axios.interceptors.response.use(
        response =>{
            //拦截响应,做统一处理
            if(response.data.code === 206){
                //移出token
                removeToken()
                //跳转登陆页面
                router.path('/login')
            }
            return response;
        },
        err =>{
            return Promise.reject(error);
        }
    )

Vue.prototype.$axios = axios;