<template>
    <div style="height: 100%;">
        <v-ons-navigator id="app" swipeable
                         :page-stack="$store.state.pageStack"
                         @push-page="$store.state.pageStack.push($event)"
                         @prepop="list"
        ></v-ons-navigator>
        <div id="scan" style="width: 100%;height: 100%;display: none;
        position: relative;background-color:rgba(0,0,0,0.2); ">
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
</template>

<script>
    export default {
        name: 'app',
        data(){
            return{
                alertDialog1Visible:false,
                model:{},
            }
        },
        methods: {
            list() {
                if (this.$store.state.wallet.name&&this.$store.state.wallet.list) {
                    let model = [];
                    this.$store.state.wallet.list.forEach((v, k) => {
                        this.$g.wallet.getAccount(this, v).then(sum => {
                            if (sum== 'errorCode') {
                                v.sum=0;
                            } else {
                                v.sum = sum;
                            }
                            if(sum=='errorCode404'){
                                v.sum=0;
                                v.is = true;
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

            if (this.$ons.platform.isIPhoneX()) {
                document.documentElement.setAttribute('onsflag-iphonex-landscape', '');
                document.documentElement.setAttribute('onsflag-iphonex-portrait', '');
            }
            this.list();
            setInterval(() => {
                this.list();
            }, 3000);
            this.update()
        }
    }
</script>

<style lang="less">
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
    body {
        background: none transparent;
    }

    .page__content {
        top: 0 !important;
    }
</style>
