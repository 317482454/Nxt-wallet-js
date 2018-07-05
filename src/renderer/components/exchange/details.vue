<template>
    <v-ons-page>
        <v-ons-toolbar style="padding-top: 0px" class="zhs_head">
            <div class="zhs_left" @click="$store.commit('pop')">
                <img src="../../assets/left.png"/>
            </div>
            <div class="center" style="font-size: 14px;">
                {{$t('l.exchange.details.title')}}
            </div>
        </v-ons-toolbar>

        <section style="padding-top: 60px" >
            <div class="details_List" @click="setting(item)" v-for="item in list">
                <div class="details_List_sum">
                    <div>
                        {{$t('l.exchange.details.status')}}
                    </div>
                    <div class="details_balance">
                        <!--10000.00-->
                    </div>
                    <div  class="detail_cut_back details_cut_back_add">
                        {{$t('l.exchange.details.statuses.'+item.status+'')}}
                    </div>
                </div>
                <div class="details_List_sum">
                    <div>
                        {{$t('l.exchange.details.id')}}
                    </div>
                    <div class="details_balance">
                        <!--10000.00-->
                    </div>
                    <div  class="sum_addr">
                        {{item.id}}
                    </div>
                </div>
                <div class="details_List_sum ">
                    <div  style="float: left">
                        {{$t('l.exchange.details.sendAmount')}}
                    </div>
                    <div class="sum_addr" >
                       <span v-show="item.status!='finished'">
                           {{item.expectedSendAmount}}
                       </span>
                        <span v-show="item.status=='finished'">
                           {{item.amountSend}}
                       </span>
                        {{item.fromCurrency}}
                    </div>
                </div>
                <div class="details_List_sum ">
                    <div  style="float: left">
                        {{$t('l.exchange.details.receiveAmount')}}
                    </div>
                    <div class="sum_addr">
                         <span v-show="item.status!='finished'">
                           {{item.expectedReceiveAmount}}
                       </span>
                        <span v-show="item.status=='finished'">
                           {{item.amountReceive}}
                       </span>
                        {{item.toCurrency}}
                    </div>
                </div>
                <div class="details_List_sum " v-show="item.status=='finished'&&item.networkFee">
                    <div  style="float: left">
                        {{$t('l.exchange.details.fee')}}
                    </div>
                    <div class="sum_addr">
                        {{item.networkFee}}
                        {{item.toCurrency}}
                    </div>
                </div>
                <div class="details_List_sum ">
                    <div  style="float: left">
                        {{$t('l.exchange.details.payinAddress')}}
                    </div>
                    <div class="sum_addr">
                        {{item.payinAddress}}
                    </div>
                </div>
                <div class="details_List_sum ">
                    <div  style="float: left">
                        {{$t('l.exchange.details.payoutAddress')}}
                    </div>
                    <div class="sum_addr">
                        {{item.payoutAddress}}
                    </div>
                </div>
                <div class="details_List_sum ">
                    <div  style="float: left">
                        {{$t('l.exchange.details.updatedAt')}}
                    </div>
                    <div class="sum_addr">
                       {{item.updatedAt}}
                    </div>
                </div>
            </div>
            <div style="height: 60px;width: 100%">
            </div>
        </section>
        <v-ons-modal :visible="modalVisible" >
            <p style="text-align: center">
                Loading <v-ons-icon icon="fa-spinner" spin></v-ons-icon>
            </p>
        </v-ons-modal>
        <v-ons-action-sheet :visible.sync="settingSheetVisible"
                            cancelable>
            <v-ons-action-sheet-button class="payinAddress" :addr="model.payinAddress"  icon="md-square-o">
                {{$t('l.exchange.details.copy')}}{{$t('l.exchange.details.payinAddress')}}
            </v-ons-action-sheet-button>
            <v-ons-action-sheet-button class="payoutAddress" :addr="model.payoutAddress" icon="md-square-o">
                {{$t('l.exchange.details.copy')}}{{$t('l.exchange.details.payoutAddress')}}
            </v-ons-action-sheet-button>
            <v-ons-action-sheet-button @click="del"  icon="md-square-o">
                {{$t('l.exchange.details.del')}}
            </v-ons-action-sheet-button>
            <v-ons-action-sheet-button @click="settingSheetVisible=false"  icon="md-square-o">{{$t('l.wallet.setting.cancel')}}</v-ons-action-sheet-button>
        </v-ons-action-sheet>
    </v-ons-page>
</template>


<script>
    import Clipboard from "clipboard"

    export default {
        name: 'exchangeDetails',
        data(){
            return{
                modalVisible:false,
                api:'',
                key:'',
                list:[],
                settingSheetVisible:false,
                model:{}
            }
        },
        methods: {
            load() {
                this.modalVisible=true;

                this.$store.state.wallet.exchange.forEach(item=>{
                    this.$http.get( this.api + '/transactions/'+item+'/'+this.key).then(v => {
                        v.data.updatedAt= this.$g.wallet.formatDateTime(v.data.updatedAt)
                        this.list.push(v.data);
                        this.list.sort(function(a,b){
                            return Date.parse(b.updatedAt) - Date.parse(a.updatedAt);//时间正序
                        })
                        this.modalVisible=false
                    })
                })

            },
            setting(item){
                this.model=item;
                this.settingSheetVisible=true;
            },
            del(){
                this.settingSheetVisible=false
                let exchangeIndex='';
                let listIndex='';
                this.$store.state.wallet.exchange.forEach((item,index)=>{
                    if(item==this.model.id){
                        exchangeIndex=index;
                    }
                })
                this.list.forEach((item,index)=>{
                    if(item.id==this.model.id){
                        listIndex=index;
                    }
                })
                let _this=this;
                this.$ons.notification.confirm({
                    'title': this.$t('l.prompt.title'),
                    'message': this.$t('l.exchange.details.del')+this.model.id+'（'+ $t('l.exchange.details.confirm')+'）',
                    'callback': function (ok) {
                        if (ok) {
                            _this.delExchange(exchangeIndex,listIndex);
                        }
                    }
                })

            },
            delExchange(exchangeIndex,listIndex){
                this.$store.state.wallet.exchange.splice(exchangeIndex,1);
                this.list.splice(listIndex,1)
                this.$store.state.wallet=JSON.parse(JSON.stringify(this.$store.state.wallet))
                this.$store.commit('setWallet',this.$store.state.wallet);
            }
        },
        created: function () {
            if(!this.$store.state.wallet.exchange||this.$store.state.wallet.exchange.length==0){
                this.$ons.notification.alert({
                    'title': this.$t('l.prompt.title'),
                    'message':this.$t('l.exchange.details.none'),
                })
                return;
            }
            this.api=this.$store.state.changenow.api;
            this.key=this.$store.state.changenow.key;
            this.load()
            let _this = this;
            new Clipboard('.payinAddress', {
                text: function (trigger) {
                    _this.settingSheetVisible=false
                    return trigger.getAttribute('addr')
                }
            });
            new Clipboard('.payoutAddress', {
                text: function (trigger) {
                    _this.settingSheetVisible=false
                    return trigger.getAttribute('addr')
                }
            });
        }
    }
</script>


<style scoped lang='less'>
    .details_List {
        margin: 16px 20px 0 20px;
        background: #fff;
        padding-bottom: 14px;
        border-radius: 4px;
        box-shadow: rgba(14, 61, 118, 0.16) 0 0 9px;
        overflow: hidden;
        .details_List_sum {
            margin-left: 20px;
            margin-right: 20px;
            padding-top: 14px;
            font-size: 14px;
            color: #4d4d4d;
            overflow: hidden;
            .sum_addr{
                float: right;  width: 70%;word-break: break-all;
                text-align: right;font-size: 12px;
                color: #a2a2a2;
            }
            div {
                float: left
            }
            .details_balance {
                margin-left: 30px
            }
            .details_cut_back_add{
                color: #45b148 !important;
            }

            .detail_cut_back {
                float: right;
                color: #dc2f31;

            }
        }
        .details_List_send {
            font-size: 12px;
            color: #a2a2a2;
        }
    }
</style>
