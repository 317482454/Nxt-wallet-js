<template>
    <v-ons-page>
        <section >
            <div class="zhs_head">
                <img src="../../assets/head.png" class="zhs_head"/>
                <div class="zhs_txt">
                    {{$store.state.pageText.txt}}交易记录
                </div>
                <div class="zhs_left" @click="$store.commit('pop')">
                    <img src="../../assets/left.png"/>
                </div>
            </div>
            <div class="transaction_sum">
                {{$store.state.pageText.item.sum}} <span>{{$store.state.pageText.txt}}</span>
            </div>
            <div class="transaction_title">
                发款方
            </div>
            <div class="transaction_txt">
                {{$store.state.pageText.item.senderRS}}
            </div>
            <div class="transaction_title">
                收款方
            </div>
            <div class="transaction_txt">
                {{$store.state.pageText.item.recipientRS}}
            </div>
            <div class="transaction_title">
                手续费
            </div>
            <div class="transaction_txt">
                {{$store.state.pageText.item.fee}} {{$store.state.pageText.txt}}
            </div>
            <div class="transaction_title">
                备注
            </div>
            <div class="transaction_msg">
                <span v-if="$store.state.pageText.item.attachment.message">
                     {{$store.state.pageText.item.attachment.message}}
                </span>
                <span v-if="$store.state.pageText.item.attachment.encryptedMessage&&message==''"style="color: #0076ff" @click="analyz">解密</span>
                <span v-if="message!=''" v-html="message"></span>
            </div>
            <div class="transaction_title">
                交易区块
            </div>
            <div class="transaction_txt1">
                {{$store.state.pageText.item.ecBlockId}}
            </div>
            <div class="transaction_title">
                交易时间
            </div>
            <div class="transaction_txt1">
                {{$store.state.pageText.item.time}}
            </div>
            <div class="transaction_title">
                确定
            </div>
            <div class="transaction_txt1">
               {{$store.state.pageText.item.confirmations}}
            </div>
        </section>
    </v-ons-page>
</template>

<script>
    export default {
        data(){
            return{
                message:''
            }
        },
        methods: {
            analyz(){
                // decryptMessage（cipherText，nonce，senderPublicKey，recipientSecretPhrase）
                this.$g.wallet.getWallet(this).then(pass => {
                    if (pass.plaintext != '') {
                      this.message=this.$nxt.decryptMessage(this.$store.state.pageText.item.attachment.encryptedMessage.data,
                            this.$store.state.pageText.item.attachment.encryptedMessage.nonce,
                            this.$store.state.pageText.item.senderPublicKey,
                            pass.plaintext)
                    }
                    else {
                        this.$ons.notification.alert({
                            'title': this.$t('l.prompt.title'),
                            'message': this.$t('l.error.password')
                        })
                    }
                })
            }
        },
        mounted: function () {
            console.log(this.$store.state.pageText);
        }
    }
</script>

<style scoped lang="less">
 section{
     min-height: 100%;
     background: #fff;
 }
 .transaction_sum{
     text-align: center;margin: 20px;font-size: 24px;color: #45b148;
     padding-bottom: 16px;border-bottom: 1px solid #bdbdbd;
     span{
         font-size: 12px;    color: #6f6d6d;
     }
 }
 .transaction_title{
     margin: 0 0 4px 20px;font-size: 14px;color: #6f6d6d;
 }
 .transaction_txt{
     margin: 0 0 4px 20px;font-size: 12px;color: #4d4d4d;
 }
 .transaction_txt1 {
     margin: 0 0 10px 20px;
     font-size: 12px;
     color: #4d4d4d;
 }
 .transaction_msg{
     margin: 0 20px 10px 20px;font-size: 12px;color: #4d4d4d;min-height: 60px;border-bottom: 1px solid #bdbdbd;
 }
</style>