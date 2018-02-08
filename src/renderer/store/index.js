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
        sum:''
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
        ['push'](state,data){
            state.pageText='';
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
