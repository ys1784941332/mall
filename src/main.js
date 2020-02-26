import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import FastClick from 'fastclick'   
import VueLazyLoad from 'vue-lazyload'

import toast from './components/common/toast'    // 引入 toast

Vue.config.productionTip = false

Vue.prototype.$bus = new Vue()     // 将vue实例 定义给 $bus

// 安装 toast 插件 ，会执行  install 函数
Vue.use(toast)       

// 解决移动端 点击 300ms 延迟问题
FastClick.attach(document.body)

// 使用懒加载插件
Vue.use(VueLazyLoad, {
  loading:require('assets/img/common/loading.jpg')
})

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
