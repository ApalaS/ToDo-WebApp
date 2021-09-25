import Vue from 'vue/dist/vue.js';
import App from './App.vue'
import router from './router'
import Ant from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css';
import VueRouter from 'vue-router'

Vue.use(VueRouter)

Vue.use(Ant)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
