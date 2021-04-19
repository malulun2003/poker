import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import router from './router'
import './plugins/bootstrap-vue'
import App from './App.vue'
import uuid from "vue-uuid"

Vue.use(uuid);
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
