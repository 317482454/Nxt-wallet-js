<!--<template>-->
    <!--<v-ons-page>-->
        <!--<v-ons-toolbar style="padding-top: 0px" class="zhs_head">-->
            <!--<div class="zhs_left" @click="$store.commit('pop')">-->
                <!--<img src="../../assets/left.png"/>-->
            <!--</div>-->
            <!--<div class="center">第{{$store.state.pageText.item.id}}期记录</div>-->
        <!--</v-ons-toolbar>-->
        <!--<div style="padding-top: 60px;">-->
            <!--<div class="listAddr" v-for="item in listAddr">-->
                <!--<div>-->
                    <!--序号：{{item.transaction}}-->
                <!--</div>-->
                <!--<div>-->
                    <!--账号：{{item.addr}}-->
                <!--</div>-->
                <!--<div>-->
                    <!--参与：{{item.count}} {{$store.state.pageText.coin}}-->
                <!--</div>-->
                <!--<div>-->
                    <!--号码：{{item.lottery}}-->
                <!--</div>-->
            <!--</div>-->

        <!--</div>-->

    <!--</v-ons-page>-->
<!--</template>-->



<!--<script>-->
    <!--export default {-->
        <!--name: 'list',-->
        <!--data() {-->
            <!--return {-->
                <!--listAddr:[],-->
                <!--count:0,-->
                <!--mylist:[],-->
                <!--address:''-->
            <!--}-->
        <!--},-->
        <!--methods: {-->
            <!--getCount(){-->
                <!--this.$store.state.wallet.list.forEach(item=>{-->
                    <!--if(item.txt.toUpperCase()==this.$store.state.pageText.coin){-->
                        <!--this.address=item.address-->
                    <!--}-->
                <!--})-->
            <!--},-->
        <!--},-->
        <!--created: function () {-->
            <!--this.$http.get(this.$store.state.url+"shop/transaction?id="+this.$store.state.pageText.id+'/'+this.$store.state.pageText.item.id).then(v => {-->
                <!--this.listAddr=v.data.list;-->
                <!--this.count=0;-->
                <!--this.mylist=[]-->
                <!--this.listAddr.forEach(item=>{-->
                    <!--item.lottery=this.count+'-'+(this.count+item.count-1);-->
                    <!--this.count=this.count+item.count-->
                    <!--if(this.address==item.addr) this.mylist.push(item)-->
                <!--})-->
                <!--this.listAddr.reverse();-->
            <!--});-->
        <!--}-->
    <!--}-->
<!--</script>-->


<!--<style scoped lang="less">-->
    <!--.listAddr{-->
        <!--margin: 16px 20px 0; background: #fff; padding-bottom: 14px;border-radius: 4px;box-shadow: 0 0 9px rgba(14,61,118,.16); overflow: hidden;-->
        <!--div{-->
            <!--margin-left: 20px; margin-right: 20px;padding-top: 14px; font-size: 14px; color: #4d4d4d;overflow: hidden;-->
        <!--}-->
    <!--}-->
<!--</style>-->