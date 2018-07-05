<template>
    <v-ons-page>
        <section >
            <div class="zhs_head">
                <img src="../../assets/head.png" class="zhs_head"/>
                <div class="zhs_txt">
                    {{$store.state.pageText.txt}} {{$t('l.transactionDetails.title')}}
                </div>
                <div class="zhs_left" @click="$store.commit('pop')">
                    <img src="../../assets/left.png"/>
                </div>
            </div>
            <div class="transaction_sum" style="color: red" v-if="$store.state.pageText.address==$store.state.pageText.item.senderRS">
                {{$store.state.pageText.item.sum}} <span>{{$store.state.pageText.txt}}</span>
            </div>
            <div class="transaction_sum" v-if="$store.state.pageText.address!=$store.state.pageText.item.senderRS">
                {{$store.state.pageText.item.sum}} <span>{{$store.state.pageText.txt}}</span>
            </div>
            <div class="transaction_title">
                {{$t('l.transactionDetails.sender')}}
            </div>
            <div class="transaction_txt">
                {{$store.state.pageText.item.senderRS}}
            </div>
            <div class="transaction_title">
                {{$t('l.transactionDetails.recipient')}}
            </div>
            <div class="transaction_txt">
                {{$store.state.pageText.item.recipientRS}}
            </div>
            <div class="transaction_title">
                {{$t('l.transactionDetails.fee')}}
            </div>
            <div class="transaction_txt">
                {{$store.state.pageText.item.fee}} {{$store.state.pageText.txt}}
            </div>
            <div class="transaction_title">
                {{$t('l.transactionDetails.note')}}
            </div>
            <div class="transaction_msg">
                <span v-if="$store.state.pageText.item.attachment.message">
                     {{$store.state.pageText.item.attachment.message}}
                </span>
                <span v-if="$store.state.pageText.item.attachment.encryptedMessage&&message==''"style="color: #0076ff" @click="analyz">解密</span>
                <span v-if="message!=''" v-html="message"></span>
            </div>
            <div class="transaction_title">
                {{$t('l.transactionDetails.ecBlock')}}
            </div>
            <div class="transaction_txt1">
                {{$store.state.pageText.item.ecBlockId}}
            </div>
            <div class="transaction_title">
                {{$t('l.transactionDetails.time')}}
            </div>
            <div class="transaction_txt1">
                {{$store.state.pageText.item.time}}
            </div>
            <div class="transaction_title">
                {{$t('l.transactionDetails.confirm')}}
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
            analyz() {
                if (this.$store.state.pageText.publickey != '') {
                    this.$g.wallet.getWallet(this).then(pass => {
                        if (pass.plaintext != '') {
                            this.message = this.$nxt.decryptMessage(this.$store.state.pageText.item.attachment.encryptedMessage.data,
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
                else {
                    let _this = this;
                    this.$ons.notification.prompt({
                        'inputType': 'password',
                        'title': this.$t('l.prompt.title'),
                        'message': this.$t('l.prompt.phrase'),
                        'callback': function (phrase) {
                            if (phrase != '') {
                                let publickey=_this.$nxt.secretPhraseToPublicKey(phrase)
                                let addr=_this.$nxt.publicKeyToAccountId(publickey,false).split('-');
                                addr.splice(0,1)
                                let addr2=_this.$store.state.pageText.address.split('-')
                                addr2.splice(0,1)
                                if(addr.toString()==addr2.toString()){
                                    _this.message = _this.$nxt.decryptMessage(_this.$store.state.pageText.item.attachment.encryptedMessage.data,
                                        _this.$store.state.pageText.item.attachment.encryptedMessage.nonce,
                                        _this.$store.state.pageText.item.senderPublicKey,
                                        phrase)
                                }else{
                                    _this.$ons.notification.alert({
                                        title: this.$t('l.prompt.title'),
                                        message: this.$t('l.error.phrase'),
                                        buttonLabels:_this.$t('l.prompt.buttonLabels')[1],
                                    })
                                }

                            }
                        }
                    });
                }
            }
        },
        mounted: function () {
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
     span{
         word-wrap:break-word;
     }
 }
</style>