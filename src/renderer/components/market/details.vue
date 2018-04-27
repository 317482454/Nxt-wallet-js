<template>
    <v-ons-page>
        <section>
            <div class="zhs_head" >
                <img src="../../assets/head.png" class="zhs_head"/>
                <div class="zhs_txt">
                    {{model.ticker.name}} {{$t('l.market.title')}}
                </div>
                <div class="zhs_left" @click="$store.commit('pop')">
                    <img src="../../assets/left.png"/>
                </div>
            </div>
            <div class="details_List">
                <a target="_blank" :href="item.href" v-for="item in model.list">
                    <div class="exchangge">
                        {{item.exchange}} , {{item.trading}}
                        <div  v-show="$i18n.locale!='zh-CN'">
                            {{parseFloat(item.usdPrice).toFixed(6)}} USD
                        </div>
                        <div  v-show="$i18n.locale=='zh-CN'">
                            {{parseFloat(item.cnyPrice).toFixed(2)}} CNY
                        </div>
                    </div>
                    <div class="exchangge_price">
                        {{parseFloat(item.volume/10000).toFixed(2)}}万{{model.ticker.name}} / {{parseFloat(item.btcPrice).toFixed(4)}} BTC（24h）
                        <div>{{item.ratio}}</div>
                    </div>
                </a>
            </div>
            <div style="height: 60px;width: 100%">
            </div>
        </section>
    </v-ons-page>
</template>

<script>
    export default {
        data() {
            return {
                state: 'initial',
                model:{}
            };
        },
        methods: {

        },
        created: function () {
            this.model=this.$store.state.ticker[this.$store.state.pageText.index]
            let sum=this.model.ticker.price_cny/this.model.ticker.price_usd;
            this.model.list.forEach(item=> {
                item.cnyPrice = item.usdPrice * sum;
                item.btcPrice = item.volume * item.btcPrice.split('e')[0] * 0.00001;
            })
        }
    };
</script>

<style scoped lang='less'>


    .details_List {
        a{

            display: block;padding: 8px 0;border-bottom: 1px solid #eee;
            text-decoration: none;color: #000; padding-left: 16px;
        }
        .exchangge_price{
            color: #a2a2a2;font-size: 12px;margin-top: 4px;
            div{
                float: right;margin-right: 10px;
            }
        }
        .exchangge{
            font-size: 14px;
            div{
                float: right;margin-right: 10px;
            }
        }
        .volume{
            color: #a2a2a2;font-size: 12px;margin-top: 6px;

            border-bottom: 1px solid #f2f2f2;height: 26px;
        }
        .percent{
            font-size: 18px;color: red;margin-top: 8px;
        }
        .price{
            font-size: 26px;margin-top: 8px;
            span{
                font-size: 14px;
            }
        }
        .title{
            margin-top: 4px;color: #000000;margin-top: 20px;
        }
        background: #fff;
        border-radius: 4px;
        border-bottom: 1px solid #f2f2f2;
        overflow: hidden;
    }
</style>

