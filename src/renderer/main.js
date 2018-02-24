import Vue from 'vue'
import axios from 'axios'
import store from './store'
import App from './App'

import 'onsenui/css/onsenui.css'
import 'onsenui/css/onsen-css-components.css'
import VueOnsen from 'vue-onsenui'
Vue.use(VueOnsen)
import nxt from "nxtjs"
import ardor from "ardorjs"
import gobal from "./gobal/config"
Vue.prototype.$g = gobal;//注册全局方法
Vue.prototype.$nxt = nxt;
Vue.prototype.$ardor = ardor;
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
store.commit('getWallet')
store.commit('getLang')

Vue.prototype.md =false;
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)
const i18n=new VueI18n({
    locale: store.state.lang,    // 语言标识
    messages: {
        'zh-CN': require('./lang/zh'),   // 中文语言包
        'en-US': require('./lang/en')    // 英文语言包x
    }
})

import "babel-polyfill";
// import eruda from  'eruda'
// eruda.init()

/* eslint-disable no-new */
new Vue({
    components: { App },
    store,
    i18n,
    template: '<App/>'
}).$mount('#app')