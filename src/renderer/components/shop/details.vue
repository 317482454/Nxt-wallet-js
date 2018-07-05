<!--<template>-->
    <!--<v-ons-page>-->

        <!--<v-ons-toolbar style="padding-top: 0px" class="zhs_head">-->
            <!--<div class="zhs_left" @click="$store.commit('pop')">-->
                <!--<img src="../../assets/left.png"/>-->
            <!--</div>-->
            <!--<div class="center">商品详情</div>-->
        <!--</v-ons-toolbar>-->
        <!--<div class="swipeable">-->
            <!--<v-ons-carousel  fullscreen swipeable auto-scroll overscrollable-->
                            <!--:index.sync="carouselIndex">-->
                <!--<v-ons-carousel-item v-for="item in items">-->
                    <!--<img :src="$store.state.url+item" style="width: 100%;" />-->
                    <!--{{item}}-->
                <!--</v-ons-carousel-item>-->
            <!--</v-ons-carousel>-->
            <!--<div :style="dots">-->
              <!--<span :index="dotIndex - 1" v-for="dotIndex in Object.keys(items).length" :key="dotIndex" style="cursor: pointer" @click="carouselIndex = dotIndex - 1">-->
                <!--{{ carouselIndex === dotIndex - 1 ? '\u25CF' : '\u25CB' }}-->
              <!--</span>-->
            <!--</div>-->
        <!--</div>-->
        <!--<div class="warp">-->
            <!--<div class="name">-->
                <!--（第{{model.transaction}}期） {{model.name}}-->
            <!--</div>-->
            <!--<div class="price" v-show="model.type==0">-->
                <!--{{model.count}} {{model.coin}} ≈ ¥ {{model.price}}-->
            <!--</div>-->
            <!--<div class="price" v-show="model.type!=0">-->
                <!--{{model.count}} {{model.coin}}-->
            <!--</div>-->
            <!--<div class="progress">-->
                <!--<div style="float: left;">-->
                    <!--进度 {{count}}/{{model.count}} （{{(count/model.count*100).toFixed(2)}}%）-->
                <!--</div>-->
                <!--<div class="progress_sum">月销售量 {{model.sum+model.transaction}}</div>-->
            <!--</div>-->
            <!--<div>-->
                <!--<progress style="width: 100%" :max="model.count" :value="count"></progress>-->
            <!--</div>-->
        <!--</div>-->
        <!--<v-ons-list class="index_list"  >-->
            <!--<v-ons-list-item @click="my" tappable modifier="chevron" >-->
                <!--我的号码-->
            <!--</v-ons-list-item>-->
            <!--<v-ons-list-item @click="push(lottery)" tappable modifier="chevron" >-->
                <!--往期中奖记录-->
            <!--</v-ons-list-item>-->
            <!--<a target="_blank" style="text-decoration:none" href="http://forum.walletnxt.com/t/51">-->
                <!--<v-ons-list-item tappable modifier="chevron" >-->
                    <!--游戏规则-->
                <!--</v-ons-list-item>-->
            <!--</a>-->
        <!--</v-ons-list>-->

        <!--<v-ons-list class="index_list" >-->
            <!--<v-ons-list-item>-->
                <!--当前参与记录-->
            <!--</v-ons-list-item>-->
        <!--</v-ons-list>-->
        <!--<section>-->

        <!--<div class="listAddr" v-for="item in listAddr">-->
            <!--<div>-->
                <!--序号：{{item.transaction}}-->
            <!--</div>-->
            <!--<div>-->
                <!--账号：{{item.addr}}-->
            <!--</div>-->
            <!--<div>-->
                <!--参与：{{item.count}} {{model.coin}}-->
            <!--</div>-->
            <!--<div>-->
                <!--号码：{{item.lottery}}-->
            <!--</div>-->
        <!--</div>-->
        <!--</section>-->

        <!--<div class="h20"></div>-->
        <!--<v-ons-bottom-toolbar>-->
           <!--<div v-show="model.type==0" class="bottom">-->
               <!--<div @click="buy(0)" class="type0" style="background: #ff9402;">-->
                   <!--参与夺宝-->
               <!--</div>-->
               <!--<div  @click="buy(1)" class="type0" style="background: #ff5000;">-->
                   <!--直接购买-->
               <!--</div>-->
           <!--</div>-->
            <!--<div @click="buy" v-show="model.type==1" class="bottom">-->
                <!--<div @click="buy(0)"  class="type0" style="width: 100%; background: #ff5000;">-->
                    <!--参与夺宝-->
                <!--</div>-->

            <!--</div>-->
        <!--</v-ons-bottom-toolbar>-->
        <!--<v-ons-modal :visible="modalVisible" >-->
            <!--<p style="text-align: center">-->
                <!--Loading <v-ons-icon icon="fa-spinner" spin></v-ons-icon>-->
            <!--</p>-->
        <!--</v-ons-modal>-->
    <!--</v-ons-page>-->
<!--</template>-->


<!--<script>-->
    <!--var shopDetails;-->

    <!--export default {-->
        <!--name: 'shopDetails',-->
        <!--data() {-->
            <!--return {-->
                <!--carouselIndex: 0,-->
                <!--modalVisible:false,-->
                <!--items: [-->
                <!--],-->
                <!--dots: {-->
                    <!--textAlign: 'center',-->
                    <!--fontSize: '18px',-->
                    <!--color: 'rgb(228, 1, 1)',-->
                    <!--position: 'absolute',-->
                    <!--bottom: '20px',-->
                    <!--left: 0,-->
                    <!--right: 0-->
                <!--},-->
                <!--model:{-->
                <!--},-->
                <!--listAddr:[],-->
                <!--count:0,-->
                <!--coinCount:0,-->
                <!--mylist:[],-->
                <!--lottery:require('@/components/shop/lottery').default,-->

            <!--}-->
        <!--},-->
        <!--methods: {-->
            <!--push(page, txt) {-->
                <!--this.$store.commit('push', {page: page, txt: txt});-->
            <!--},-->
            <!--load(){-->
                <!--this.$http.get(this.$store.state.url+"shop/").then(v => {-->
                    <!--this.list=v.data;-->
                <!--});-->
            <!--},-->
            <!--getCount(){-->
                <!--this.modelCoin=0;-->
                <!--this.$store.state.wallet.list.forEach(item=>{-->
                    <!--if(item.txt.toUpperCase()==this.model.coin){-->
                        <!--this.modelCoin=item-->
                    <!--}-->
                <!--})-->
            <!--},-->
            <!--buy(type) {-->
                <!--this.getCount()-->
                <!--if (this.modelCoin.sum == 0) {-->
                    <!--this.$ons.notification.alert({-->
                        <!--'title': this.$t('l.prompt.title'),-->
                        <!--'message': '你的' + this.model.coin + '数为' + this.coinCount,-->
                    <!--})-->
                <!--}-->
                <!--else{-->
                    <!--let _this = this;-->
                    <!--if(type==0){-->
                        <!--this.$ons.notification.prompt({-->
                            <!--'title': this.$t('l.prompt.title'),-->
                            <!--'message': "请输入你的要参与的币数",-->
                            <!--'callback': function (sum) {-->
                                <!--sum=parseInt(sum);-->
                                <!--if (isNaN(sum) || sum < 1) {-->
                                    <!--_this.$ons.notification.alert({-->
                                        <!--'title': _this.$t('l.prompt.title'),-->
                                        <!--'message': '请输入正确参与币数',-->
                                    <!--})-->
                                    <!--return;-->
                                <!--}-->
                                <!--_this.send(sum,type);-->
                            <!--}-->
                        <!--});-->
                    <!--}-->
                    <!--if(type==1){-->
                        <!--this.send(this.model.count,type);-->
                    <!--}-->
                <!--}-->

            <!--},-->
            <!--send(sum,type){-->
                <!--let tx={-->
                    <!--count: sum,-->
                    <!--to: this.model.addr,-->
                    <!--message:"id:"+this.model.id+'/'+this.model.transaction-->
                <!--}-->
                <!--let bool=this.$g.transaction.verification(this,tx,this.modelCoin.sum)-->
                <!--if(bool)-->
                    <!--this.$g.transaction.getPhrase(this, this.modelCoin.publickey).-->
                    <!--then(account=>{-->
                        <!--this.modalVisible=true;-->
                        <!--return this.$g.transaction.sendMoney(this,account,tx,this.modelCoin)-->
                    <!--}).-->
                    <!--then(resp=> {-->
                        <!--return resp.transactionBytes-->
                    <!--}).-->
                    <!--then(transactionBytes=>{-->
                        <!--return this.$g.transaction.broadcastTransaction(this,this.modelCoin,transactionBytes)-->
                    <!--}).-->
                    <!--then(resp=>{-->
                        <!--let model={-->
                            <!--"id":this.model.id,-->
                            <!--"fileId":this.model.transaction,-->
                            <!--"addr":this.modelCoin.address,-->
                            <!--"count":sum,-->
                            <!--"transaction":resp.transaction-->
                        <!--}-->
                        <!--if(type==0){-->
                            <!--this.postTransaction(model)-->

                        <!--}else{-->
                            <!--this.$http.post(this.$store.state.url+"shop/buy",model).then(v => {-->
                                <!--this.modalVisible=false;-->
                                <!--this.$ons.notification.alert({-->
                                    <!--'title': this.$t('l.prompt.title'),-->
                                    <!--'message': v.data,-->
                                <!--})-->
                                <!--this.transaction();-->
                            <!--});-->
                        <!--}-->
                    <!--})-->
            <!--},-->
            <!--postTransaction(model){-->
                <!--this.$http.post(this.$store.state.url+"shop/transaction",model).then(v => {-->
                    <!--this.modalVisible=false;-->
                    <!--if(v.data=='名额已满'){-->
                        <!--model.fileId=parseInt(model.fileId)+1-->
                        <!--this.postTransaction(model)-->
                    <!--}else{-->
                        <!--this.$ons.notification.alert({-->
                            <!--'title': this.$t('l.prompt.title'),-->
                            <!--'message': v.data,-->
                        <!--})-->
                    <!--}-->
                    <!--this.transaction();-->
                <!--});-->
            <!--},-->
            <!--transaction(){-->
                <!--this.$http.get(this.$store.state.url+"shop/transaction?id="+this.model.id+'/'+this.model.transaction).then(v => {-->
                    <!--this.listAddr=v.data.list;-->
                    <!--this.count=0;-->
                    <!--this.mylist=[]-->
                    <!--this.listAddr.forEach(item=>{-->
                        <!--item.lottery=this.count+'-'+(this.count+item.count-1);-->
                        <!--this.count=this.count+item.count-->
                        <!--if(this.modelCoin.address==item.addr) this.mylist.push(item)-->
                    <!--})-->
                    <!--this.listAddr.reverse();-->
                    <!--if(this.count/this.model.count*100>=100){-->
                        <!--this.$http.get(this.$store.state.url+"shop/").then(v => {-->
                            <!--v.data.forEach(item=>{-->
                                <!--if(item.id==this.model.id){-->
                                 <!--this.model=item;-->
                                <!--}-->
                            <!--})-->
                        <!--});-->
                    <!--}-->
                <!--});-->
            <!--},-->
            <!--my(){-->
                <!--let txt=''-->
                <!--this.mylist.forEach(item=>{-->
                    <!--txt=txt+item.lottery+' '-->
                <!--})-->
                <!--if(txt.trim()==''){-->
                    <!--txt='无'-->
                <!--}-->
                <!--this.$ons.notification.alert({-->
                    <!--'title': '我的号码',-->
                    <!--'message':txt,-->
                <!--})-->
            <!--},-->
            <!--push(page) {-->
                <!--this.$store.commit('push', {page: page, txt: this.model});-->
            <!--},-->
        <!--},-->
        <!--beforeDestroy: function () {-->
            <!--window.clearInterval(shopDetails);-->
        <!--},-->
        <!--created: function () {-->
            <!--this.model=this.$store.state.pageText;-->
            <!--this.items=this.model.imgList;-->
            <!--this.getCount()-->
            <!--this.transaction();-->
            <!--shopDetails=setInterval(()=> {-->
                <!--this.transaction();-->
            <!--},3000)-->
        <!--}-->
    <!--}-->
<!--</script>-->


<!--<style scoped lang="less">-->
    <!--.h20{-->
        <!--height: 20px;width: 100%;-->
    <!--}-->
    <!--.bottom{-->
        <!--font-weight: bold;height: 100%;width: 100%;text-align: center;color: #fff;line-height: 44px;-->
        <!--.type0{-->
            <!--float: left;width: 50%;height: 100%;-->
        <!--}-->
    <!--}-->
    <!--.listAddr{-->
        <!--margin: 16px 20px 0; background: #fff; padding-bottom: 14px;border-radius: 4px;box-shadow: 0 0 9px rgba(14,61,118,.16); overflow: hidden;-->
        <!--div{-->
            <!--margin-left: 20px; margin-right: 20px;padding-top: 14px; font-size: 14px; color: #4d4d4d;overflow: hidden;-->
        <!--}-->
    <!--}-->
    <!--.index_list{-->
        <!--margin-top: 10px;background-image: none;-->
    <!--}-->
    <!--.warp{-->
        <!--background: #fff;margin-top: 6px;padding: 10px 6px;-->
        <!--.name{-->
            <!--font-size: 14px;-->
        <!--}-->
        <!--.price{-->
            <!--font-size: 18px;color:rgb(228, 1, 1);margin-top: 4px;-->
            <!--span{-->
                <!--font-size: 14px;-->
            <!--}-->
        <!--}-->
        <!--.progress{-->
            <!--font-size: 12px;margin-top: 4px;    overflow: hidden;color: #999;text-align: center;-->
            <!--.progress_sum{-->
                <!--float: right;margin-right: 10px-->
            <!--}-->
        <!--}-->
    <!--}-->
    <!--.swipeable{-->
        <!--height: 375px;padding-top: 60px;position: relative;text-align: center-->
    <!--}-->
<!--</style>-->