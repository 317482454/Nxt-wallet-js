<template>
    <v-ons-page>

        <v-ons-pull-hook :action="loadItem" :height="84" @changestate="state = $event.state">
            <v-ons-icon size="22px" class="pull-hook-spinner"
                        :icon="state === 'action' ? 'fa-spinner' : 'fa-arrow-down'"
                        :rotate="state === 'preaction' && 180" :spin="state === 'action'"></v-ons-icon>
        </v-ons-pull-hook>

        <section >
            <div class="zhs_head">
                <img src="../../assets/head.png" class="zhs_head"/>
                <div class="zhs_txt">
                    {{$store.state.pageText.model.txt}} {{$t('l.details.title')}}
                </div>
                <div class="zhs_left" @click="$store.commit('pop')">
                    <img src="../../assets/left.png"/>
                </div>
            </div>
            <div class="details_List" v-for="item in list2">
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
            <div style="height: 60px;width: 100%">
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
                epochBeginning:0
            }
        },
        methods: {
            load(){
                this.$g.wallet.getBlockchainTransactions(this,this.$store.state.pageText.model).then(sum=>{
                    this.modalVisible=false;
                    sum.forEach(v=>{
                        v.time=this.$g.wallet.formatDateTime(v.timestamp*1000+(this.epochBeginning - 500));
                        v.sum=(parseInt(v.amountNQT)*0.00000001).toFixed(2);
                        v.fee=(parseInt(v.feeNQT)*0.00000001).toFixed(2);
                        if(v.senderRS!=this.$store.state.pageText.model.address){
                            v.is=true
                        }else{
                            v.is=false;
                        }
                    })
                    this.list2=sum;
                }).catch(error=>{
                    this.modalVisible=false;
                })
            },
            loadItem(done) {
                setTimeout(() => {
                    this.load();
                    done();
                }, 400);
            }
        },
        mounted: function () {
            let api=''
            if(this.$store.state.pageText.model.txt=='Nxt'){
                api=this.$store.state.pageText.model.api;
            }else{
                api=this.$store.state.wallet.ardrApi;
            }
            this.$http.get(api+"/nxt?requestType=getConstants").then(v => {
                this.epochBeginning=v.data.epochBeginning
                this.load();
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
