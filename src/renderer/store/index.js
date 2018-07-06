import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
    state:{
        wallet:{
            model:{}
        },
        walletList:{
            list:[]
        },
        currency:'',
        pageStack: [require('@/components/index').default],
        pageText:'',
        ticker:'',
        openSide:false,
        sum:'',
        lang:'',
        changenow:{
            api:'https://exchange.walletnxt.com/api/v1',
            key:'6808c1758d0aeebe8e857d1cd46cd33b70c0a30685af4bea785d82f65b920d75',
        },
        url:'http://www.walletnxt.com:8080/',
        version:'1.0.6'
    },
    mutations: {
        ['setWalletIndex'](state,index){
            state.openSide=false;
            state.walletList.index=index;
            localStorage.setItem('walletList', JSON.stringify(state.walletList));
            state.walletList=JSON.parse(localStorage.getItem('walletList'));
            if(state.walletList.list[state.walletList.index]){
                state.wallet=state.walletList.list[state.walletList.index];
            }else{
                state.wallet={}
            }
            localStorage.setItem('wallet',JSON.stringify(state.wallet));
        },
        ['wallet'](state,model){
            state.walletList.list.push(model);
            state.walletList.index=state.walletList.list.length-1;
            localStorage.setItem('walletList', JSON.stringify(state.walletList));
            localStorage.setItem('wallet',JSON.stringify(model));
            if(localStorage.getItem('wallet')!=null){
                state.wallet=JSON.parse(localStorage.getItem('wallet'));
            }
        },
        ['getWallet'] (state) {
            if(localStorage.getItem('walletList')!=null){
                state.walletList=JSON.parse(localStorage.getItem('walletList'));
                if(state.walletList.list[state.walletList.index])
                   state.wallet=state.walletList.list[state.walletList.index];
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
            state.walletList.list[state.walletList.index]=state.wallet
            localStorage.setItem('wallet',JSON.stringify(state.wallet));
            localStorage.setItem('walletList', JSON.stringify(state.walletList));
        },
        ['logOutWallet'](state,vue){
            state.walletList.list.splice(state.walletList.index,1)
            vue.$store.commit("setWalletIndex",0);
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
