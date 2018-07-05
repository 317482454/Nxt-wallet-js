<!--<template>-->
    <!--<v-ons-page>-->
        <!--<v-ons-toolbar style="padding-top: 0px" class="zhs_head">-->
            <!--<div class="zhs_left" @click="$store.commit('pop')">-->
                <!--<img src="../../assets/left.png"/>-->
            <!--</div>-->
            <!--<div class="center">往期中奖记录</div>-->
        <!--</v-ons-toolbar>-->
        <!--<div style="padding-top: 60px;">-->
            <!--<div class="listAddr" v-for="item in list" @click="push(shopList,item)">-->
                <!--<div>-->
                    <!--第{{item.id}}期&#45;&#45;中奖号码：{{item.lottery}}-->
                <!--</div>-->
                <!--<div>-->
                    <!--中奖地址：{{item.addr}}-->
                <!--</div>-->
                <!--<div>-->
                    <!--block：{{item.block}}-->
                <!--</div>-->
                <!--<div>-->
                    <!--计算高度：{{item.height}}-->
                <!--</div>-->
                <!--<div>-->
                    <!--最后交易id：{{item.transaction}}-->
                <!--</div>-->
            <!--</div>-->

        <!--</div>-->

    <!--</v-ons-page>-->
<!--</template>-->


<!--<script>-->
    <!--export default {-->
        <!--name: 'lottery',-->
        <!--data() {-->
            <!--return {-->
                <!--list:[],-->
                <!--shopList:require('@/components/shop/list').default,-->
            <!--}-->
        <!--},-->
        <!--methods: {-->
            <!--push(page,item) {-->
                <!--this.$store.state.pageText.item=item,-->
                <!--this.$store.commit('push', {page: page});-->
            <!--},-->
        <!--},-->
        <!--created: function () {-->
            <!--this.$http.get(this.$store.state.url+"shop/lottery?id="+this.$store.state.pageText.id).then(v => {-->
                <!--this.list=v.data.list.reverse();-->
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