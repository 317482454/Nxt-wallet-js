<!--<template>-->
    <!--<v-ons-page @show="load">-->
        <!--<v-ons-toolbar style="padding-top: 0px" class="zhs_head">-->
            <!--<div class="zhs_left" @click="$store.commit('pop')">-->
                <!--<img src="../../assets/left.png"/>-->
            <!--</div>-->
            <!--<div class="center" style="font-size: 14px;">商品列表</div>-->
        <!--</v-ons-toolbar>-->
        <!--<section class="shopIndex">-->
            <!--<div class="shopIndexlist" @click="push(shop,item)" v-for="item in list">-->
                <!--<img :src="$store.state.url+item.imgList[0]" />-->
                <!--<div class="div_name">-->
                 <!--（第{{item.transaction}}期）  {{item.name}}-->
                <!--</div>-->
                <!--<div class="div_price" v-show="item.type==0">-->
                    <!--{{item.count}} {{item.coin}} ≈ ¥ {{item.price}}-->
                <!--</div>-->
                <!--<div class="div_price" v-show="item.type!=0">-->
                    <!--{{item.count}} {{item.coin}}-->
                <!--</div>-->
                <!--<div class="div_sum">-->
                    <!--月销售量 {{item.sum+item.transaction}}-->
                <!--</div>-->
            <!--</div>-->
        <!--</section>-->
    <!--</v-ons-page>-->
<!--</template>-->


<!--<script>-->
    <!--var Interval;-->
    <!--export default {-->
        <!--name: 'shopIndex',-->
        <!--data(){-->
            <!--return{-->
                <!--shop:require('@/components/shop/details').default,-->
                <!--list:[]-->
            <!--}-->
        <!--},-->
        <!--methods: {-->
            <!--push(page, txt) {-->
                <!--this.$store.commit('push', {page: page, txt: txt});-->
            <!--},-->
            <!--load(){-->
                <!--this.shopList();-->

            <!--},-->
            <!--shopList(){-->
                <!--this.$http.get(this.$store.state.url+"shop/").then(v => {-->
                    <!--this.list=v.data;-->
                <!--});-->
            <!--}-->
        <!--},-->
        <!--beforeDestroy: function () {-->
            <!--window.clearInterval(Interval);-->
        <!--},-->
        <!--created: function () {-->
            <!--Interval=setInterval(()=> {-->
                <!--this.shopList();-->
            <!--},3000)-->
        <!--}-->
    <!--}-->
<!--</script>-->


<!--<style scoped lang="less">-->
    <!--.shopIndex{-->
        <!--padding-top: 60px;-->
        <!--.shopIndexlist{-->
            <!--min-height: 80px;padding: 12px 6px;border-bottom: 1px solid #dbdbdb;position: relative;overflow: hidden;-->
            <!--img{-->
                <!--width: 90px;height: 90px;float: left;margin-right: 2.5%;-->
            <!--}-->
            <!--.div_name{-->
                <!--font-size: 14px;    color: #3d4245;height: 38px;overflow: hidden;-->
            <!--}-->
            <!--.div_price{-->
                <!--font-size: 18px;color:rgb(228, 1, 1);margin-top: 4px;-->
                <!--span{-->
                    <!--font-size: 14px;-->
                <!--}-->
            <!--}-->
            <!--.div_sum{-->
                <!--font-size: 12px;margin-top: 4px;    overflow: hidden;color: #999;text-align: left;-->
            <!--}-->
        <!--}-->
    <!--}-->
<!--</style>-->