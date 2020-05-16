import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false
//导入less,webpack会让 main.js这个入口函数 与 .less文件关联起来


import router from './router/index'
new Vue({
  render: h => h(App),
  router
}).$mount('#app')
