import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
    state:{
        wallet:{},
        currency:'',
        pageStack: [require('@/components/index').default],
        pageText:'',
        ticker:'',
        sum:'',
        lang:'',
        url:'http://www.walletnxt.com:8080/',
        version:'1.0.1'
    },
    mutations: {
        ['getWallet'] (state,password) {
            if(localStorage.getItem('wallet')!=null){
                state.wallet=JSON.parse(localStorage.getItem('wallet'));
            }
        },
        ['setWallet'] (state,model) {
            state.wallet=model;
            localStorage.setItem('wallet',JSON.stringify(state.wallet));
        },
        ['setWalletList'](state,model){
            state.wallet.list.push(model);
            localStorage.setItem('wallet',JSON.stringify(state.wallet));
        },
        ['setWalletList2'](state,model){
            state.wallet.list=model
            localStorage.setItem('wallet',JSON.stringify(state.wallet));
        },
        ['logOutWallet'](state){
            state.wallet={};
            localStorage.removeItem("wallet");
        },
        ['getLang'](state){
            if(localStorage.getItem('lang')!=null){
                state.lang=localStorage.getItem('lang');
            }else{
                state.lang=(navigator.systemLanguage?navigator.systemLanguage:navigator.language);
            }
        },
        ['setLang'](state,txt){
            state.lang=txt;
            localStorage.setItem('lang',txt);
        },
        ['push'](state,data){
            if(data.txt){
                state.pageText=data.txt
            }
            state.pageStack.push(data.page)
        },
        ['pop'](state){
            state.pageStack.pop();
        }
    }
})
