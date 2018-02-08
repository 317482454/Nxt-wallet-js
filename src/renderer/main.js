import Vue from 'vue'
import axios from 'axios'
import store from './store'
import App from './App'

import 'onsenui/css/onsenui.css'
import 'onsenui/css/onsen-css-components.css'
import VueOnsen from 'vue-onsenui'
Vue.use(VueOnsen)
import nxt from "nxtjs"
import gobal from "./gobal/config"
Vue.prototype.$g = gobal;//注册全局方法
Vue.prototype.$nxt = nxt;
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
store.commit('getWallet')
Vue.prototype.md =false;

/*import eruda from  'eruda'
eruda.init()*/

/* eslint-disable no-new */
new Vue({
    components: { App },
    store,
    template: '<App/>'
}).$mount('#app')