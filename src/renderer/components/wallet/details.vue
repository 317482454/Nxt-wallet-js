<template>
    <v-ons-page>
        <v-ons-toolbar style="padding-top: 0px" class="zhs_head">
            <div class="zhs_left" @click="$store.commit('pop')">
                <img src="../../assets/left.png"/>
            </div>
            <div class="center" style="font-size: 14px;">
                {{$store.state.pageText.txt}} {{$t('l.details.title')}}
            </div>
        </v-ons-toolbar>
        <section style="padding-top: 60px" >
            <div class="details_List" v-for="item in list2" @click="push(item)">
                <div class="details_List_sum">
                    <div>
                        {{$t('l.details.quantity')}}
                    </div>
                    <div class="details_balance">
                        <!--10000.00-->
                    </div>
                    <!--details_cut_back_add-->

                    <div v-if="item.is" class="detail_cut_back details_cut_back_add">
                        {{item.sum}}
                    </div>

                    <div v-if="!item.is" class="detail_cut_back">
                        {{item.sum}}
                    </div>
                </div>
                <div class="details_List_sum details_List_send">
                    <div v-if="!item.is" style="float: left">
                        {{$t('l.details.out')}}
                    </div>
                    <div v-if="item.is" style="float: left">
                        {{$t('l.details.into')}}
                    </div>
                    <div style="float: left;font-size: 12px;margin-left:10px ">
                        {{$t('l.details.fee')}}:{{item.fee}}
                    </div>
                    <div style="float: right">
                        {{item.time}}
                    </div>
                </div>
            </div>
            <div  v-if="!currentPageIs" style="height: 60px;width: 100%;text-align: center;line-height: 60px">

            </div>
            <div @click="add" v-show="!modalVisible" v-if="currentPageIs" style="color: #409eff;font-size: 14px;height: 60px;width: 100%;text-align: center;line-height: 60px">
                {{$t('l.details.next')}}
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
        data(){
            return{
                list2:[],
                state: 'initial',
                modalVisible:true,
                epochBeginning:0,
                transactionDetails:require('@/components/wallet/transactionDetails').default,
                currentPage:1,
                currentPageIs:true
            }
        },
        methods: {
            add(){
                if(this.currentPage) {
                    this.currentPage++;
                    this.load()
                }
            },
            push(item) {
                this.$store.state.pageText.item=item;
                this.$store.commit('push', {page: this.transactionDetails, txt: this.$store.state.pageText});
            },
            load(){
                this.modalVisible=true;
                this.$g.wallet.getBlockchainTransactions(this,this.$store.state.pageText).then(sum=>{
                    this.modalVisible=false;
                    if(sum.length!=15){
                        this.currentPageIs=false;
                    }
                    sum.forEach(v=>{
                        v.time=this.$g.wallet.formatDateTime(v.timestamp*1000+(this.epochBeginning - 500));
                        v.sum=(parseInt(v.amountNQT)*0.00000001).toFixed(4);
                        v.fee=(parseInt(v.feeNQT)*0.00000001).toFixed(4);
                        if(this.$store.state.pageText.txt=='Mtr'){
                            v.time=this.$g.wallet.formatDateTime(v.timestamp+(this.epochBeginning - 500));
                            v.sum=(parseInt(v.amountMQT)*0.00000001).toFixed(4);
                            v.fee=(parseInt(v.feeMQT)*0.00000001).toFixed(4);
                        }
                        if(this.$store.state.pageText.txt=='Apl'){
                            v.sum=(parseInt(v.amountATM)*0.00000001).toFixed(4);
                            v.fee=(parseInt(v.feeATM)*0.00000001).toFixed(4);
                        }
                        if(v.senderRS.split("-")[0]!=this.$store.state.pageText.txt.toUpperCase()){
                            v.senderRS=this.$g.wallet.addrReplace(v.senderRS,this.$store.state.pageText.txt.toUpperCase());
                            v.recipientRS=this.$g.wallet.addrReplace(v.recipientRS,this.$store.state.pageText.txt.toUpperCase());
                        }
                        if(v.senderRS!=this.$store.state.pageText.address){
                            v.is=true
                        }else{
                            v.is=false;
                        }
                        this.list2.push(v);
                    })

                }).catch(error=>{
                    this.modalVisible=false;
                })
            },

        },
        mounted: function () {
            if(this.$store.state.pageText.txt=="Eac"){
                this.modalVisible=false;
                this.currentPageIs=false;
                this.$ons.notification.alert({
                    'title': this.$t('l.prompt.title'),
                    'message':'不支持'
                })
            }else{
                this.$http.get(this.$store.state.pageText.api+"/"+this.$store.state.pageText.apikey+"?requestType=getConstants",{timeout:5000}).then(v => {
                    this.epochBeginning=v.data.epochBeginning;
                    this.load();
                }).catch(error=>{
                    this.modalVisible=false
                })
            }

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
