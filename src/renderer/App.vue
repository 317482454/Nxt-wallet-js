<template>
    <v-ons-splitter style="        background-color:transparent !important;">
        <v-ons-splitter-side width="190px"
                swipeable  collapse="" side="right"
                :animation="'reveal'"
                :open.sync="$store.state.openSide">
            <v-ons-page >
                <div style="background: rgb(60, 83, 107)"
                     class="page__background"></div>
                <div class="app_walletList">
                    <div @click="setWalletIndex(index)"
                         :class="index==$store.state.walletList.index?'app_walletList_selectd':''"
                         v-for="(item,index) in $store.state.walletList.list"
                         class="app_walletList_div">
                        <img src="./assets/walleticn.png"/>
                        {{item.name}}
                    </div>
                </div>
                <div class="app_walletTool">
                    <div @click="push(createWallet)">
                        <img src="./assets/createWallet.png"/>
                        {{$t('l.profile.create')}}
                    </div>
                    <div @click="push(importWallet)">
                        <img src="./assets/importWallet.png"/>
                        {{$t('l.profile.import')}}
                    </div>
                </div>
            </v-ons-page>
        </v-ons-splitter-side>
        <v-ons-splitter-content style="        background-color:transparent !important;
">
            <div style="height: 100%;        background-color:transparent !important;
width: 100%">
                <v-ons-navigator id="app" swipeable
                                 :page-stack="$store.state.pageStack"
                                 @push-page="$store.state.pageStack.push($event)"
                                 @prepop="list"
                ></v-ons-navigator>
                <div id="scan" style="width: 100%;height: 100%;display: none;
        position: relative;        background-color:transparent !important; ">
                    <div class="zhs_head" style="background-color:rgba(0,0,0,0.4);">
                        <div class="zhs_txt">
                            Scan QR Code
                        </div>
                        <div id="scan_cancel" class="zhs_left" style="text-indent: 10px">
                            Cancel
                        </div>
                    </div>
                    <img src="./assets/scan.png"
                         style="position: absolute;width: 200px;height: 200px;top: 50%;margin-top: -120px;left: 50%;margin-left: -100px"/>
                    <img src="./assets/ding.png" id="ding"
                         style="position: absolute;width: 50px;top: 50%;margin-top:120px;left: 50%;
                 margin-left: -25px;"/>
                    <img src="./assets/ding_selected.png" id="ding_selected"
                         style="display:none;position: absolute;width: 50px;
                 top: 50%;margin-top:120px;left: 50%;margin-left: -25px;"/>
                </div>
                <v-ons-alert-dialog modifier="rowfooter" :visible.sync="alertDialog1Visible">
                    <span slot="title">{{$t('l.versionAlert.title')}} {{model.version}}</span>
                    <div class="alertDiv" v-for="item in model.txt">
                        {{item}}
                    </div>
                    <template slot="footer">
                        <v-ons-alert-dialog-button @click="alertDialog1Visible = false">
                            {{$t('l.versionAlert.footer[0]')}}
                        </v-ons-alert-dialog-button>
                        <v-ons-alert-dialog-button  @click="open">
                            {{$t('l.versionAlert.footer[1]')}}
                        </v-ons-alert-dialog-button>
                    </template>
                </v-ons-alert-dialog>
            </div>
        </v-ons-splitter-content>
    </v-ons-splitter>

</template>

<script>
    export default {
        name: 'app',
        data(){
            return{
                alertDialog1Visible:false,
                model:{},
                importWallet:require('@/components/user/import').default,
                createWallet:require('@/components/user/create').default
            }
        },
        methods: {
            setWalletIndex(index){
                this.$store.commit('setWalletIndex',index)
            },
            push(page) {
                this.$store.state.openSide=false;
                this.$store.commit('push', {page: page,txt: ''});
            },
            list() {
                if (this.$store.state.wallet.name&&this.$store.state.wallet.list) {
                    let model = [];
                    this.$store.state.wallet.list.forEach((v, k) => {
                        this.$g.wallet.getAccount(this, v).then(model => {
                            v.model=model;
                            if (model.balanceNQT) {

                                v.sum= this.$g.wallet.amount(model.balanceNQT);
                            } else {
                                v.sum=0;
                            }
                            if(model=='errorCode404'){
                                v.is = true;
                                v.price=0;
                            }else{
                                v.is = false;
                            }
                        })
                        model.push(v);
                    })
                    this.$store.commit('setWalletList2',model)
                }
                this.ticker()
            },
            ticker() {
                this.$http.get(this.$store.state.url).then(v => {
                    let sum = 0;
                    this.$store.state.ticker = v.data;
                    if (this.$store.state.wallet.name&&this.$store.state.wallet.list) {
                        this.$store.state.wallet.list.forEach(model => {
                            model.price=0;
                            this.$store.state.ticker.forEach(item => {
                                if (model.txt == item.ticker.name) {
                                    if(this.$store.state.lang=='zh-CN'){
                                        model.price=(parseFloat(item.ticker.price_cny).toFixed(2) * model.sum).toFixed(2);
                                        sum = sum + parseFloat(item.ticker.price_cny).toFixed(2) * model.sum;
                                    }else{
                                        model.price=(parseFloat(item.ticker.price_usd).toFixed(6) * model.sum).toFixed(4);
                                        sum = sum + parseFloat(item.ticker.price_usd).toFixed(6) * model.sum;
                                    }
                                }
                            })
                        })
                    }
                    this.$store.state.sum = sum.toFixed(2);
                })
            },
            open(){
                window.open('http://www.walletnxt.com/');
            },
            update(t){
                this.$http.get(this.$store.state.url+'log').then(v => {
                    if (this.$store.state.version!=v.data.log[0].model.version){
                        this.alertDialog1Visible=true;
                        this.model.version=v.data.log[0].model.version;
                        if(this.$store.state.lang=='zh-CN'){
                            this.model.txt=v.data.log[0].model.zh
                        }else{
                            this.model.txt=v.data.log[0].model.en
                        }
                    }else{
                        if(t==1){
                            this.$ons.notification.alert({
                                'title': this.$t('l.prompt.title'),
                                'message':this.$t('l.prompt.version')
                            })
                        }
                    }
                })
            }
        },
        created: function () {
            this.list();
            setInterval(() => {
                this.list();
            }, 3000);
            this.update()
//            var app = {
//                // Application Constructor
//                initialize: function () {
//                    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
//                },
//                onDeviceReady: function () {
//                    console.log(device.uuid);
//                },
//            };
//            app.initialize();

        }
    }
</script>

<style lang="less">
    .exchange{
        .list-item__center{
            padding: 0;
        }
    }
    .select{
        width: 100%;
        .select-input{
            font-size: 14px;
        }
    }

    .app_walletList{
        padding-bottom: 20px;margin-top: 60px;border-bottom: 1px solid rgb(74, 98, 123);
        .app_walletList_div{
            font-size: 14px;color: #A5B2BF;line-height: 54px;height: 54px;    overflow: hidden;text-overflow:ellipsis;
            white-space: nowrap;
            img{
                float: left;margin-left: 10px;width: 24px;    margin-top: 14px;margin-right: 10px
            }
        }
        .app_walletList_selectd{
            background: #2C3E50;
        }
    }
    .app_walletTool{
        margin-top: 20px;
        div{
            font-size: 14px;color: #A5B2BF;line-height: 54px;height: 54px;
            img{
                float: left;margin-left: 10px;width: 24px;    margin-top: 18px;margin-right: 10px
            }
        }
    }
    .toolbar {
        position: relative;
    }
    .segment__item{
        div{
            position: inherit !important;
            width: auto !important;
            height: auto !important;
            text-align: center !important;
        }
        :checked + .segment__button {
            background-color: #fff;
            color: rgb(26, 153, 213);
            transition: none;
        }
        .segment__button{
            background-color:rgb(1, 169, 249);
            color: #fff;
            border: none;
        }
    }
    html,body {
        background-color:transparent !important;
    }

    .page__content {
        top: 0 !important;
    }
    .toolbar+.page__background {
        top: 0 !important;
    }
</style>
