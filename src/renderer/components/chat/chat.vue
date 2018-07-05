<!--<template>-->
    <!--<v-ons-page>-->
        <!--<v-ons-toolbar style="padding-top: 0px" class="zhs_head">-->
            <!--<div class="zhs_left" @click="$store.commit('pop')">-->
                <!--<img src="../../assets/left.png"/>-->
            <!--</div>-->
            <!--<div class="center" style="font-size: 14px;">一般聊天频道</div>-->
        <!--</v-ons-toolbar>-->
        <!--<div id="div2"  style="    margin-bottom: 60px;    padding-top: 72px;overflow: hidden">-->
              <!--<div  v-for="(item,index) in transactions">-->
                   <!--<div class="chat-left" v-if="youAddr==item.senderRS">-->
                       <!--<img src="../../assets/t.png"/>-->
                       <!--<div class="chat-name">{{item.senderRS}}</div>-->
                       <!--<div class="chat-warp">-->
                           <!--<div class="chat-icon"></div>-->
                           <!--{{item.attachment.message}}-->
                       <!--</div>-->
                   <!--</div>-->
                   <!--<div  class="chat-right" v-if="youAddr!=item.senderRS">-->
                       <!--<img  src="../../assets/t.png"/>-->
                       <!--<div class="chat-name">{{item.senderRS}}</div>-->
                       <!--<div class="chat-warp">-->
                           <!--<div class="chat-icon"></div>-->
                           <!--{{item.attachment.message}}-->
                       <!--</div>-->
                   <!--</div>-->
               <!--</div>-->
            <!--<div id="ding"></div>-->
           <!--</div>-->
        <!--<v-ons-bottom-toolbar style="height: 50px;display: flex">-->
          <!--<input type="text" v-model="msg" style="height: 26px;-->
    <!--margin: 10px;-->
    <!--border-radius: 4px;-->
    <!--border: 1px solid #ddd;text-indent: 6px;flex: 1"/>-->
            <!--<div @click="send" style="color: #fff;text-align: center;-->
            <!--border-radius: 4px;width: 50px;line-height: 28px;-->
            <!--background: #1a99d5;height: 28px;margin: 10px;-->
            <!--font-size: 14px">-->
                <!--发送-->
            <!--</div>-->
            <!--<a style="display: none"  id="a" href="#ding">2222</a>-->
        <!--</v-ons-bottom-toolbar>-->
        <!--<v-ons-modal :visible="modalVisible" >-->
            <!--<p style="text-align: center">-->
                <!--Loading <v-ons-icon icon="fa-spinner" spin></v-ons-icon>-->
            <!--</p>-->
        <!--</v-ons-modal>-->
    <!--</v-ons-page>-->
<!--</template>-->


<!--<script>-->
    <!--var Interval;-->
    <!--export default {-->
        <!--name: 'chat',-->
        <!--data(){-->
            <!--return{-->
                <!--modalVisible:true,-->
                <!--transactions:[],-->
                <!--youAddr:'',-->
                <!--msg:'',-->
                <!--Interval:'',-->
            <!--}-->
        <!--},-->
        <!--methods: {-->
            <!--send(){-->
                <!--if(this.$store.state.pageText.publickey!='') {-->
                    <!--this.$g.wallet.getWallet(this)-->
                        <!--.then(model => {-->
                            <!--if (model.plaintext != '') {-->
                                <!--this.sendInfo(model.plaintext,this.$store.state.pageText.publickey)-->
                            <!--}-->
                        <!--})-->
                        <!--.catch(error => {-->
                            <!--this.$ons.notification.alert({-->
                                <!--'title': this.$t('l.prompt.title'),-->
                                <!--'message': this.$t('l.error.sent')-->
                            <!--})-->
                        <!--})-->
                <!--}else{-->
                    <!--let _this=this;-->
                    <!--this.$ons.notification.prompt({-->
                        <!--'inputType':'password',-->
                        <!--'title': this.$t('l.prompt.title'),-->
                        <!--'message': this.$t('l.prompt.phrase'),-->
                        <!--'callback': function (phrase) {-->
                            <!--if(phrase!=''){-->
                                <!--let publickey=_this.$nxt.secretPhraseToPublicKey(phrase)-->
                                <!--let addr=_this.$nxt.publicKeyToAccountId(publickey,false).split('-');-->
                                <!--addr.splice(0,1)-->
                                <!--let addr2=_this.$store.state.pageText.address.split('-')-->
                                <!--addr2.splice(0,1)-->
                                <!--if(addr.toString()==addr2.toString()){-->
                                    <!--_this.sendInfo(phrase,publickey)-->
                                <!--}else{-->
                                    <!--_this.$ons.notification.alert({-->
                                        <!--title: this.$t('l.prompt.title'),-->
                                        <!--message: this.$t('l.error.phrase'),-->
                                        <!--buttonLabels:_this.$t('l.prompt.buttonLabels')[1],-->
                                    <!--})-->
                                <!--}-->
                            <!--}-->
                        <!--}-->
                    <!--});-->
                <!--}-->

            <!--},-->
            <!--sendInfo(plaintext,publickey){-->
                <!--let formData = new FormData();-->
                <!--formData.append("requestType", "sendMessage");-->
                <!--formData.append("publicKey", publickey);-->
                <!--formData.append("recipient", 'HEBE-CG7M-M25X-P5VB-9V9VL');-->
                <!--formData.append("feeNQT", 0);-->
                <!--if(this.transactions.length==0){-->
                    <!--formData.append("deadline", 1440);-->
                <!--}else {-->
                    <!--formData.append("deadline", 1);-->
                <!--}-->
                <!--formData.append("messageIsText", true);-->
                <!--formData.append("messageIsPrunable", true);-->
                <!--formData.append("message", this.msg);-->
                <!--this.alertDialog1Visible = true;-->
                <!--this.$http.post(                this.$store.state.pageText.api+'/'+this.$store.state.pageText.apikey, formData).-->
                <!--then(data=>{-->
                    <!--formData.set("feeNQT",data.data.transactionJSON.feeNQT);-->
                    <!--this.$http.post(this.$store.state.pageText.api+'/'+this.$store.state.pageText.apikey, formData).then(model=>{-->
                        <!--return model;-->
                    <!--}).then(v => {-->
                        <!--if (v.status == 200) {-->
                            <!--return {-->
                                <!--prunableAttachmentJSON:v.data.transactionJSON.attachment,-->
                                <!--transactionBytes:this.$nxt.signTransactionBytes(v.data.unsignedTransactionBytes,plaintext)-->
                            <!--};-->
                        <!--}-->
                        <!--else {-->
                            <!--this.alertDialog1Visible = false;-->
                            <!--this.$ons.notification.alert({-->
                                <!--'title': this.$t('l.prompt.title'),-->
                                <!--'message':  this.$t('l.error.sent')-->
                            <!--})-->
                        <!--}-->
                    <!--}).then(model => {-->

                        <!--let signed = new FormData();-->
                        <!--signed.append("requestType", "broadcastTransaction");-->
                        <!--signed.append("transactionBytes", model.transactionBytes);-->
                        <!--signed.append("prunableAttachmentJSON", JSON.stringify(model.prunableAttachmentJSON));-->
                        <!--this.$http.post('http://39.104.107.100/nxt', signed).then(v => {-->
                            <!--this.alertDialog1Visible = false;-->
                            <!--let _this = this;-->
                            <!--if(v.data.error){-->
                                <!--this.$ons.notification.alert({-->
                                    <!--'title': this.$t('l.prompt.title'),-->
                                    <!--'message': v.data.errorDescription,-->
                                <!--})-->
                            <!--}else{-->
                                <!--this.msg=''-->
                                <!--this.$ons.notification.alert({-->
                                    <!--'title': this.$t('l.prompt.title'),-->
                                    <!--'message': '已发送至区块链请耐心等待',-->

                                <!--})-->
                            <!--}-->

                        <!--}).-->
                        <!--catch(error => {-->
                            <!--this.alertDialog1Visible = false;-->
                            <!--this.$ons.notification.alert({-->
                                <!--'title': this.$t('l.prompt.title'),-->
                                <!--'message': this.$t('l.error.sent')-->
                            <!--})-->
                        <!--})-->
                    <!--})-->
                        <!--.catch(error => {-->
                            <!--this.alertDialog1Visible = false;-->
                            <!--this.$ons.notification.alert({-->
                                <!--'title': this.$t('l.prompt.title'),-->
                                <!--'message': this.$t('l.error.sent')-->
                            <!--})-->
                        <!--})-->
                <!--})-->
            <!--},-->
            <!--load(){-->
                <!--this.youAddr="HEBE"+this.$store.state.wallet.list[0].address.split('NXT')[1];-->
                <!--this.modalVisible = false;-->
                <!--this.$http.get('http://39.104.107.100/nxt?requestType=getBlockchainTransactions&firstIndex=0&lastIndex=15&account=HEBE-CG7M-M25X-P5VB-9V9VL&type=1&subtype=0').then(v => {-->
                    <!--if(v.data.transactions){-->
                        <!--let transactions=v.data.transactions.reverse()-->
                        <!--if(JSON.stringify(this.transactions)!=JSON.stringify(transactions)){-->
                            <!--this.transactions=transactions;-->
                            <!--this.$nextTick(function () {-->
                                <!--document.querySelector("#a").click();-->
                            <!--})-->
                        <!--}-->
                    <!--}-->
                <!--});-->
            <!--}-->
        <!--},-->
        <!--beforeDestroy: function () {-->
            <!--window.clearInterval(Interval);-->
        <!--},-->

        <!--created: function () {-->
            <!--Interval=setInterval(() => {-->
                <!--this.load();-->
            <!--}, 6000);-->
        <!--}-->
    <!--}-->
<!--</script>-->


<!--<style scoped lang="less">-->
    <!--.chat-left{-->
        <!--margin-top: 20px;margin-left: 10px;overflow: hidden;-->
        <!--img{-->
            <!--width: 40px;border-radius: 10px;    float: left;-->
        <!--}-->
        <!--.chat-name{-->
            <!--font-size:12px;margin-left: 54px;    color: #bdbdbd;-->
        <!--}-->
        <!--.chat-warp{-->
            <!--position: relative;margin-top: 4px;margin-left: 14px;border-radius: 4px;font-size: 14px;background: #fff;max-width: 64%;float: left;padding: 8px;-->
            <!--.chat-icon{-->
                <!--position: absolute;top:6px;left: -10px;width: 0;-->
                <!--height: 0;border-top: 5px solid transparent;border-right: 10px solid #fff;border-bottom: 5px solid transparent;-->
        <!--}-->
        <!--}-->
    <!--}-->
    <!--.chat-right{-->
        <!--margin-top: 20px;margin-right: 10px;overflow: hidden;-->
        <!--img{-->
            <!--width: 40px;border-radius: 10px;    float: right;-->
        <!--}-->
        <!--.chat-name{-->
            <!--font-size:12px;margin-right: 54px;text-align: right;    color: #bdbdbd;-->
        <!--}-->
        <!--.chat-warp{-->
            <!--position: relative;margin-top: 4px;margin-right: 14px;border-radius: 4px;font-size: 14px;background: #fff;max-width: 64%;float: right;padding: 8px;-->
            <!--.chat-icon{-->
                <!--position: absolute;top:6px;right: -10px;width: 0;-->
                <!--height: 0;-->
                <!--border-top: 5px solid transparent; border-left: 10px solid #fff; border-bottom: 5px solid transparent;-->
            <!--}-->
        <!--}-->
    <!--}-->
<!--</style>-->