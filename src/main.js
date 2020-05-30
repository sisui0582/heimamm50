import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false
// 导入less，webpack会让 main.js 这个入口文件和 .less 建立依赖关系
// import '@/styles/base.less'


import router from './router/index';
//导入 element.js
import '@/plugins/element.js';
import store from '@/store/index.js'

// 导入 request(封装了axios)
import '@/utils/request.js'

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
