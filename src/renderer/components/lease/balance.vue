<template>
    <v-ons-page @show="show">
        <div class="zhs_head">
            <!--<img src="../../assets/head.png" class="zhs_head"/>-->
            <div class="zhs_txt">
                {{$t('l.lease.balance.title')}} {{$store.state.pageText.model.txt}}
            </div>
            <div class="zhs_left" @click="pop">
                <img src="../../assets/left.png"/>
            </div>
            <div class="zhs_right" @click="infoVisible=true" >
                <v-ons-icon style="font-size: 22px;margin-right: 20px;float: right;" icon="md-info-outline"></v-ons-icon>
            </div>
        </div>
        <v-ons-list class="out">
            <v-ons-list-item modifier="nodivider ">
                <div class="out_div out_div_txt">{{$t('l.lease.balance.recipient')}}</div>
                <div class="out_div_input">
                    <input v-model="tx.recipient"
                           :placeholder="$t('l.out.please')+$t('l.lease.balance.recipient')"/>
                </div>
                <img @click="push" src="../../assets/select.png" />
            </v-ons-list-item>
        </v-ons-list>
        <v-ons-list class="out">
            <v-ons-list-item modifier="nodivider ">
                <div class="out_div out_div_txt">{{$t('l.lease.balance.period')}}</div>
                <div class="out_div_input">
                    <input v-model="tx.period"
                           :placeholder="$t('l.out.please')+$t('l.lease.balance.period')+'：1440-65535'"/>
                </div>
            </v-ons-list-item>
        </v-ons-list>
        <section style="margin: 16px">
            <v-ons-button @click="verification" modifier="large"  style="background: #ed3554;margin: 6px 0">
                {{$t('l.lease.balance.save')}}
            </v-ons-button>
        </section>
        <v-ons-alert-dialog class="dialogVisible" modifier="rowfooter" :visible.sync="dialogVisible">
            <span slot="title">{{$t('l.lease.balance.account.title')}}</span>
            <p>{{$t('l.lease.balance.account.addr')}}：{{lessors.accountRS}}</p>
            <p>{{$t('l.lease.balance.account.id')}}：{{lessors.account}}</p>
            <p>{{$t('l.lease.balance.account.lessorsLength')}}：{{lessors.lessors.length}}</p>
            <p>{{$t('l.lease.balance.account.lessorsSum')}}：{{$g.wallet.amount(lessors.sum)}}</p>
            <template slot="footer">
                <v-ons-alert-dialog-button @click="dialogVisible = false">Cancel</v-ons-alert-dialog-button>
                <v-ons-alert-dialog-button @click="save" >Ok</v-ons-alert-dialog-button>
            </template>
        </v-ons-alert-dialog>
        <v-ons-alert-dialog class="dialogVisible" modifier="rowfooter" :visible.sync="infoVisible">
            <span slot="title">{{$t('l.lease.balance.current.title')}}</span>
            <section v-show="$store.state.pageText.model.model.currentLesseeRS">
                <p>{{$t('l.lease.balance.current.addr')}}：{{$store.state.pageText.model.model.currentLesseeRS}}</p>
                <p>{{$t('l.lease.balance.current.id')}}：{{$store.state.pageText.model.model.currentLessee}}</p>
                <p>{{$t('l.lease.balance.current.heightFrom')}}：{{$store.state.pageText.model.model.currentLeasingHeightFrom}}</p>
                <p>{{$t('l.lease.balance.current.heightTo')}}：{{$store.state.pageText.model.model.currentLeasingHeightTo}}</p>
            </section>
            <section v-show="!$store.state.pageText.model.model.currentLesseeRS">
                {{$t('l.lease.balance.current.info')}}
            </section>
            <template slot="footer">
                <v-ons-alert-dialog-button @click="infoVisible = false" >Ok</v-ons-alert-dialog-button>
            </template>
        </v-ons-alert-dialog>
        <v-ons-modal :visible="modalVisible" >
            <p style="text-align: center">
                Loading <v-ons-icon icon="fa-spinner" spin></v-ons-icon>
            </p>
        </v-ons-modal>
    </v-ons-page>
</template>


<script>
    export default {
        name: 'balance',
        data() {
            return {
                contacts: require('@/components/contacts/contactsIndex').default,
                dialogVisible:false,
                infoVisible:false,
                tx:{
                    recipient:'',
                    period:''
                },
                modalVisible:false,
                lessors:{
                    lessors:[]
                },
                nextInfo:''
            }
        },
        methods: {
            pop() {
                this.$store.state.pageText.model = ''
                this.$store.commit('pop')
            },
            push() {
                this.$store.state.pageText.model.push = 'out';
                this.$store.commit('push', {page: this.contacts});
            },
            show() {
                if (this.$store.state.pageText.model.to) {
                    this.tx.recipient = this.$store.state.pageText.model.to;
                }
            },
            verification() {
                if (isNaN(parseInt(this.tx.period)) || parseInt(this.tx.period) < 1440
                    || parseInt(this.tx.period) > 65535) {
                    this.$ons.notification.alert({
                        'title': this.$t('l.prompt.title'),
                        'message': this.$t('l.lease.balance.periodError'),
                    })
                    return;
                }
                this.modalVisible = true;
                this.$http.get(this.$store.state.pageText.model.api + "/" +
                    this.$store.state.pageText.model.apikey +
                    "?requestType=getAccountLessors&account=" +
                    this.tx.recipient, {timeout: 5000}).then(v => {
                    if (v.data.errorCode) {
                        this.$ons.notification.alert({
                            'title': this.$t('l.prompt.title'),
                            'message': this.$t('l.lease.balance.errorCode')
                        })
                    }
                    else {
                        this.lessors = v.data;
                        this.lessors.sum = 0
                        this.lessors.lessors.forEach(item => {
                            this.lessors.sum = this.lessors.sum + parseInt(item.guaranteedBalanceNQT);
                        })
                        this.dialogVisible = true;
                    }
                    this.modalVisible = false;
                }).catch(error => {
                    this.modalVisible = false;
                    this.$ons.notification.alert({
                        'title': this.$t('l.prompt.title'),
                        'message': this.$t('l.lease.balance.nodeError')
                    })
                })
            },
            save() {
                this.dialogVisible = false;
                this.$g.transaction.getPhrase(this, this.$store.state.pageText.model.publickey).then(account=>{
                    this.modalVisible = true;
                    return this.$g.transaction.leaseBalance(this,account,this.tx,this.$store.state.pageText.model)
                }).
                then(resp=> {
                    return this.$g.transaction.broadcastTransaction(this,this.$store.state.pageText.model,resp.transactionBytes)
                }).then(resp=>{
                    this.modalVisible = false;
                    if(resp){
                        let _this=this;
                        this.$ons.notification.alert({
                            'title': this.$t('l.prompt.title'),
                            'message': this.$t('l.lease.balance.success'),
                            'callback': function () {
                                _this.$store.commit('pop');
                            }
                        })
                    }
                })

            }
        },
        created: function () {
            this.$store.state.pageText.model.to=''
        }
    }
</script>


<style scoped lang="less">
    .dialogVisible{
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