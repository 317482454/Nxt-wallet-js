<template>
    <v-ons-page @show="show">
        <div class="zhs_head">
            <img src="../../assets/head.png" class="zhs_head"/>
            <div class="zhs_txt">
                {{$t('l.out.title')}} {{$store.state.pageText.model.txt}}
            </div>
            <div class="zhs_left" @click="pop">
                <img src="../../assets/left.png"/>
            </div>
            <div class="zhs_right">
                <img v-if="$ons.platform.isWebView()" src="../../assets/scan1.png" class="scan" @click="scan"/>
            </div>
        </div>
        <v-ons-list class="out">
            <v-ons-list-item modifier="nodivider ">
                <div class="out_div out_div_txt">{{$t('l.out.sum')}}</div>
                <div class="out_div out_div_sum">
                    <span>{{$store.state.pageText.model.sum}}</span>
                </div>
            </v-ons-list-item>
        </v-ons-list>
        <v-ons-list class="out">
            <v-ons-list-item modifier="nodivider ">
                <div class="out_div out_div_txt">{{$t('l.out.to')}}</div>
                <div class="out_div_input">
                    <input v-model="tx.to" :placeholder="$t('l.out.please')+$t('l.out.to')"/>
                </div>
                <img @click="push" src="../../assets/select.png" />
            </v-ons-list-item>
        </v-ons-list>
        <v-ons-list class="out">
            <v-ons-list-item modifier="nodivider ">
                <div class="out_div out_div_txt">{{$t('l.out.count')}}</div>
                <div class="out_div_input">
                    <input v-model="tx.count" :placeholder="$t('l.out.please')+$t('l.out.count')"/>
                </div>
            </v-ons-list-item>
        </v-ons-list>
        <v-ons-list class="out">
            <v-ons-list-item modifier="nodivider ">
                <div class="out_div out_div_txt">{{$t('l.out.message')}}</div>
                <div class="out_div_input">
                    <input v-model="tx.message" :placeholder="$t('l.out.please')+$t('l.out.message')"/>
                </div>
            </v-ons-list-item>
        </v-ons-list>

        <div style="margin: 20px 10px">
            <ons-button class="button button--large" style="background: #ed3554" @click="save" modifier="large">
                {{$t('l.out.btn')}}
            </ons-button>
        </div>

        <v-ons-dialog cancelable :visible.sync="alertDialog1Visible">
            <p style="text-align: center">{{$t('l.prompt.title')}}</p>
            <p style="text-align: center;font-size: 14px">
                {{$t('l.prompt.send')}}
            </p>
        </v-ons-dialog>
        <v-ons-alert-dialog class="transaction" modifier="rowfooter"
                            :visible.sync="dialogVisible">
            <span slot="title">{{$t('l.out.alertTitle')}}</span>
            <p>
                {{$t('l.out.to')}}：{{model.transactionJSON.recipientRS}}
            </p>
            <p>
                {{$t('l.out.count')}}：{{$g.wallet.amount(model.transactionJSON.amountNQT)}} {{$store.state.pageText.model.txt}}
            </p>
            <p v-if="!model.minimumFeeFQT">
                {{$t('l.out.fees')}}：{{$g.wallet.amount(model.transactionJSON.feeNQT)}} {{$store.state.pageText.model.txt}}
            </p>
            <p v-if="model.minimumFeeFQT" >
                {{$t('l.out.fees')}}：{{$g.wallet.amount(model.minimumFeeFQT)}} {{$store.state.pageText.model.txt}}
            </p>
            <template slot="footer">
                <v-ons-alert-dialog-button @click="dialogVisible = false">Cancel</v-ons-alert-dialog-button>
                <v-ons-alert-dialog-button @click="nextCoin()">Ok</v-ons-alert-dialog-button>
            </template>
        </v-ons-alert-dialog>
    </v-ons-page>
</template>

<script>
    export default {
        data() {
            return {
                tx: {
                    count: '',
                    to: '',
                    message:''
                },
                alertDialog1Visible: false,
                dialogVisible:false,
                contacts: require('@/components/contacts/contactsIndex').default,
                model:{transactionJSON:{}},
                nextInfo:''
            }
        },
        methods: {
            save() {
                let bool=this.$g.transaction.verification(this,this.tx,this.$store.state.pageText.model.sum)
                if(bool)
                    this.$g.transaction.getPhrase(this, this.$store.state.pageText.model.publickey).
                    then(account=>{
                           return this.$g.transaction.sendMoney(this,account,this.tx,this.$store.state.pageText.model)
                        }).
                    then(resp=> {
                        this.dialogVisible = true;
                        this.model = resp.data;
                        if(this.$store.state.pageText.model.txt=='Mtr'){
                            this.model.transactionJSON.amountNQT=this.model.transactionJSON.amountMQT;
                            this.model.transactionJSON.feeNQT=this.model.transactionJSON.feeMQT
                        }
                        if(this.$store.state.pageText.model.txt=='Apl'){
                            this.model.transactionJSON.amountNQT=this.model.transactionJSON.amountATM;
                            this.model.transactionJSON.feeNQT=this.model.transactionJSON.feeATM
                        }
                        this.nextInfo=resp.transactionBytes;
                    })
            },
            nextCoin(){
               this.dialogVisible=false;
               this.alertDialog1Visible = true;
               this.$g.transaction.broadcastTransaction(this,this.$store.state.pageText.model,this.nextInfo)
                   .then(resp=>{
                       this.alertDialog1Visible = false;
                       if(resp){
                           let _this=this;
                            this.$ons.notification.alert({
                                'title': _this.$t('l.prompt.title'),
                                'message': _this.$t('l.prompt.sent'),
                                'callback': function () {
                                    _this.$store.commit('pop');
                                }
                            })
                       }
                   })
            },
            scan() {
                this.$g.app.scan().then(data=>{
                    this.tx.to=data;
                })
            },
            push(){
                this.$store.state.pageText.model.push = 'out';
                this.$store.commit('push', {page: this.contacts});
            },
            pop(){
                this.$store.state.pageText=''
                this.$store.commit('pop')
            },
            show(){
                if (this.$store.state.pageText.model.to) {
                    this.tx.to = this.$store.state.pageText.model.to;
                }
            },
        },
        created: function () {
            if(this.$store.state.pageText.to!=''){
                this.tx.to=this.$store.state.pageText.to;
            }
            if(this.$store.state.pageText.sum!=''){
                this.tx.count=this.$store.state.pageText.sum;
            }
        }
    }
</script>

<style scoped lang="less">
    .transaction{
        p{
            font-size: 12px;margin-left: 10px;text-align: left
        }
    }
    .scan{
        width: 28px;margin-top: 16px;margin-left: 10px;
    }
    .out {
        margin-top: 16px;
        background-image: none;
        position: relative;

        .out_div {
            float: right;
            font-size: 14px;
        }

        .out_div_txt {
            width: 72px
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

    .select-input {
        font-size: 12px !important;
    }

    input {
        width: 100%;
    }
</style>
