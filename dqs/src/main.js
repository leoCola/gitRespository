// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import VueResource from 'vue-resource'
import App from './App'
import router from './router'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios' 
import qs from 'qs'
import Global from '../static/config/global'   //引用
import QuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.bubble.css'
import 'quill/dist/quill.snow.css'


Vue.use(ElementUI);
Vue.use(VueResource);
Vue.use(QuillEditor)

Vue.prototype.$axios = axios;
Vue.prototype.$qs = qs
Vue.prototype.GLOBAL = Global;   //挂载原型，可以使用this.GLOBAL拿到global.js的内容
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
})
