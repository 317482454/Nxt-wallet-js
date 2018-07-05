<template>
    <v-ons-page >
        <v-ons-toolbar style="padding-top: 0px" class="zhs_head">
            <div class="zhs_left" @click="$store.commit('pop')">
                <img src="../../assets/left.png"/>
            </div>
            <div class="center">
                {{$t('l.exchange.index.title')}}
            </div>
            <div class="zhs_right" @click="push(exchangeDetails)" style="    line-height: 60px;
    color: #fff;" >
                {{$t('l.exchange.index.records')}}
            </div>
        </v-ons-toolbar>
        <section class="exchange" style="padding-top: 60px" >
            <v-ons-list class="out">
                <v-ons-list-item modifier="nodivider ">
                    <div class="out_div out_div_txt">{{$t('l.exchange.index.type')}}</div>
                    <div class="out_div_input">
                        <v-ons-select @change="typeChange" v-model="typeSelected">
                            <option v-for="item in $t('l.exchange.index.typeItems')" :value="item.value">
                                {{ item.text }}
                            </option>
                        </v-ons-select>
                    </div>
                </v-ons-list-item>
            </v-ons-list>
            <v-ons-list class="out">
                <v-ons-list-item modifier="nodivider ">
                    <div class="out_div out_div_txt">{{$t('l.exchange.index.sendCoin')}}</div>
                    <div class="out_div_input">
                        <v-ons-select @change="buyChange"  v-model="buySelected">
                            <option v-for="item in buyItems" :value="item.ticker">
                                {{ item.name }}
                            </option>
                        </v-ons-select>
                    </div>
                </v-ons-list-item>
            </v-ons-list>
            <v-ons-list class="out">
                <v-ons-list-item modifier="nodivider ">
                    <div class="out_div out_div_txt">{{$t('l.exchange.index.sendAmount')}}</div>
                    <div class="out_div_input">
                        <input @change="exchangeAmount" v-model="count"
                               :placeholder="$t('l.exchange.index.please')+$t('l.exchange.index.sendAmount')"  />
                    </div>
                </v-ons-list-item>
            </v-ons-list>
            <v-ons-list class="out">
                <v-ons-list-item modifier="nodivider ">
                    <div class="out_div out_div_txt">{{$t('l.exchange.index.minAmount')}}</div>
                    <div class="out_div out_div_sum">
                        <span>{{minAmount}}</span>
                    </div>
                </v-ons-list-item>
            </v-ons-list>
            <v-ons-list class="out">
                <v-ons-list-item modifier="nodivider ">
                    <div class="out_div out_div_txt">{{$t('l.exchange.index.receiveCoin')}}</div>
                    <div class="out_div_input">
                        <v-ons-select @change="getChange" v-model="getSelected">
                            <option v-for="item in getItems" :value="item.ticker">
                                {{item.name}}
                            </option>
                        </v-ons-select>
                    </div>
                </v-ons-list-item>
            </v-ons-list>
            <v-ons-list class="out">
                <v-ons-list-item modifier="nodivider ">
                    <div class="out_div out_div_txt">{{$t('l.exchange.index.receiveAmount')}}</div>
                    <div class="out_div_input">
                        <input placeholder="0" v-model="sum"  readonly />
                    </div>
                </v-ons-list-item>
            </v-ons-list>
            <v-ons-list class="out" v-show="typeSelected=='sell'">
                <v-ons-list-item modifier="nodivider ">
                    <div class="out_div out_div_txt">{{$t('l.exchange.index.receiveAddr')}}</div>
                    <div class="out_div_input">
                        <input style="width: 100%;"
                               :placeholder="$t('l.exchange.index.please')+getSelected+$t('l.exchange.index.receiveAddr')"
                               v-model="addr"/>
                    </div>
                </v-ons-list-item>
            </v-ons-list>
            <div style="margin: 20px 10px">
                <ons-button :disabled="sum == 0" @click="save" class="button button--large" style="background: #ed3554"  modifier="large">
                    {{$t('l.exchange.index.save')}}
                </ons-button>
            </div>
            <div v-show="typeSelected!='buy'" style="text-align: center">
                <v-ons-button @click="push(wallets,getSelected)" modifier="quiet" >
                    {{$t('l.exchange.index.click')}} {{getSelected}} Wallet
                </v-ons-button>
            </div>
        </section>
        <v-ons-modal :visible="modalVisible" >
            <p style="text-align: center">
                Loading <v-ons-icon icon="fa-spinner" spin></v-ons-icon>
            </p>
        </v-ons-modal>
    </v-ons-page>
</template>


<script>
    export default {
        name: 'exchange',
        data() {
            return {
                typeSelected: 'buy',
                buyItems:[],
                buySelected:'',
                getItems:[],
                getSelected:'',
                minAmount:0,
                api:'',
                key:'',
                modalVisible:false,
                count:'',
                sum:'',
                addr:'',
                wallets: require('@/components/exchange/wallets').default,
                exchangeDetails:require('@/components/exchange/details').default,
                out: require('@/components/wallet/out').default
            }
        },
        methods: {
            push(item,txt) {
                this.$store.commit('push', {page: item,txt});
            },
            typeChange(){
                this.load(this.$store.state.wallet.list[0].txt.toUpperCase(),'BTC');
            },
            buyChange(){
                if(this.typeSelected=='buy') {
                    this.load(this.getSelected, this.buySelected);
                }else{
                    this.load(this.buySelected,this.getSelected);
                }
            },
            getChange(){
                if(this.typeSelected=='buy') {
                    this.load(this.getSelected, this.buySelected);
                }else{
                    this.load(this.buySelected,this.getSelected);
                }
            },
            httpError(){
                this.sum=0;
                this.modalVisible=false;
                this.$ons.notification.alert({
                    'title': this.$t('l.prompt.title'),
                    'message':this.buySelected + '/' + this.getSelected+this.$t('l.exchange.index.not'),
                })
            },
            exchangeAmount(){
                if(this.count=='') return;
                if(this.$g.wallet.isNumber(this.count)) {
                    this.sum=0;
                    this.modalVisible=true;

                    this.$http.get(this.api + '/exchange-amount/' + parseFloat(this.count) + '/' + this.buySelected + '_' + this.getSelected).
                    then(v => {
                        this.modalVisible=false;

                        if(v.data.error){
                            this.$ons.notification.alert({
                                'title': this.$t('l.prompt.title'),
                                'message':v.data.error,
                            })
                            return;
                        }
                        this.sum=v.data.estimatedAmount;
                        if(this.sum==0){
                            this.httpError();
                        }
                    }).
                    catch((error,txt) => {
                        this.modalVisible=false;
                        this.$ons.notification.alert({
                            'title': this.$t('l.prompt.title'),
                            'message':this.$t('l.exchange.index.exchangeError')
                        })
                    });

                }
                else{
                    this.$ons.notification.alert({
                        'title': this.$t('l.prompt.title'),
                        'message': this.$t('l.error.amount'),
                    })
                }
            },
            min(){
                this.$http.get( this.api + '/min-amount/' + this.buySelected + '_' + this.getSelected).then(v => {
                    this.minAmount = v.data.minAmount
                    this.modalVisible=false;
                    this.exchangeAmount();
                }).catch(error => {
                   this.httpError();
                });
            },
            currencies(txt){
                this.modalVisible=true;
                let _this=this;
                return new Promise(function (resolve) {
                    let coinlist = [];
                    _this.$http.get( _this.api + '/currencies-to/'+txt).then(v => {
                        v.data.forEach(item => {
                            item.ticker = item.ticker.toUpperCase();
                            if (item.ticker != txt.toUpperCase())
                                coinlist.push({name: item.name + ' [' + item.ticker + ']', ticker: item.ticker})
                        })
                        resolve(coinlist);
                    }).catch(error => {
                        _this.httpError();
                    });
                });
            },
            load(buyTxt,sellTxt){
                let walletList=[];
                this.addr=''
                this.$store.state.wallet.list.forEach(item=>{
                    let txt=item.txt.toUpperCase();
                    if(txt!='ARDOR')
                        walletList.push({name:txt,ticker:txt})
                    else
                        walletList.push({name:txt,ticker:'ARDR'})
                })
                this.currencies(buyTxt).
                then(item=> {
                    if(this.typeSelected=='buy'){
                        this.getItems=walletList;
                        this.buyItems=item;
                        this.$nextTick(() => {
                            this.getSelected=buyTxt;
                            this.buySelected=sellTxt;
                            this.min();
                        })
                    }
                    else{
                        this.buyItems=walletList;
                        this.getItems=item;
                        this.$nextTick(() => {
                            this.getSelected=sellTxt;
                            this.buySelected=buyTxt;
                            this.min();
                        })
                    }
                })
            },
            save() {
                if (this.typeSelected == 'buy') {
                    this.addr = this.coin(this.getSelected).address
                }
                else {
                    if(this.addr=='') {
                        this.$ons.notification.alert({
                            'title': this.$t('l.prompt.title'),
                            'message':this.$t('l.exchange.index.please')+this.$t('l.exchange.index.receiveAddr'),
                        })
                        return
                    }
                    if (parseFloat(this.count) > parseFloat(this.coin(this.buySelected).sum)-1){
                        this.$ons.notification.alert({
                            'title': this.$t('l.prompt.title'),
                            'message':this.$t('l.exchange.index.count')[0]+this.buySelected+this.$t('l.exchange.index.count')[1],
                        })
                        return;
                    }
                }

                let transactions={"from":this.buySelected,"to":this.getSelected,"address":this.addr,"amount":this.count,"extraId":"","userId":"","linkId":""}
                this.modalVisible=true;
                this.$http.post( this.api +'/transactions/'+this.key, transactions).
                then(v => {
                    this.modalVisible=false;
                    if(v.data.error){
                        this.$ons.notification.alert({
                            'title': this.$t('l.prompt.title'),
                            'message':v.data.error,
                        })
                        return;
                    }
                    if(!this.$store.state.wallet.exchange)
                        this.$store.state.wallet.exchange=[]
                    this.$store.state.wallet.exchange.push(v.data.id)
                    this.$store.state.wallet=JSON.parse(JSON.stringify(this.$store.state.wallet))
                    this.$store.commit('setWallet',this.$store.state.wallet);
                    let _this=this;
                    if (this.typeSelected == 'buy') {
                        this.$ons.notification.alert({
                            'title': this.$t('l.prompt.title'),
                            'message': this.$t('l.exchange.index.buy01'),
                            'callback': function () {
                                _this.push(_this.exchangeDetails)
                            }
                        })
                    }
                    else {
                        this.$ons.notification.confirm({
                            'title': this.$t('l.prompt.title'),
                            'message': this.$t('l.exchange.index.buy02'),
                            'callback': function (ok) {
                                if (ok) {
                                    _this.$store.state.pageText = {
                                        to: v.data.payinAddress,
                                        sum: _this.count,
                                        model: _this.coin(_this.buySelected)
                                    }
                                    _this.push(_this.out)
                                }
                            }
                        })
                    }
                }).
                catch(error=>{
                    this.modalVisible=false;
                    this.$ons.notification.alert({
                        'title': this.$t('l.prompt.title'),
                        'message': this.$t('l.exchange.index.buyError'),
                    })
                })
            },
            coin(coinName){
                if (coinName == 'ARDR') coinName = 'ARDOR';
                let model;
                this.$store.state.wallet.list.forEach(item => {
                    if (item.txt.toUpperCase() == coinName) {
                        model=item
                    }
                });
                return model
            }
        },
        created: function () {
            if(!this.$store.state.wallet.exchangeState) {
                let _this=this;
                this.$ons.notification.alert({
                    'title': this.$t('l.prompt.title'),
                    'message': this.$t('l.exchange.index.message'),
                    'callback': function () {
                        _this.$store.state.wallet.exchangeState=1;
                    }
                })
            }
            this.api=this.$store.state.changenow.api;
            this.key=this.$store.state.changenow.key;
            this.load(this.$store.state.wallet.list[0].txt.toUpperCase(),'BTC')
        }
    }

</script>


<style scoped lang="less">
    .out {
        margin-top: 16px;
        background-image: none;
        position: relative;

        .out_div {
            float: right;
            font-size: 14px;
        }

        .out_div_txt {
            width: 72px;
            font-size: 14px;
        }

        img {
            position: absolute;
            top: 10px;
            right: 20px;
            width: 26px;
        }

        .out_div_input {
            float: right;
            font-size: 14px;
            margin-left: 20px;
            word-break: break-all;
            word-wrap: break-word;
            width: 60%;
            margin-right: 40px;

            input {
                border: none
            }

        }
        .out_div_sum {
            margin-left: 20px;
            word-break: break-all;
            word-wrap: break-word;
            width: 70%;

            span {
                color: red
            }

        }
    }
</style>  