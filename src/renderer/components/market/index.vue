<template>
    <v-ons-page>
        <v-ons-pull-hook :action="loadItem" :height="84" @changestate="state = $event.state">
            <v-ons-icon size="22px" class="pull-hook-spinner"
                        :icon="state === 'action' ? 'fa-spinner' : 'fa-arrow-down'"
                        :rotate="state === 'preaction' && 180" :spin="state === 'action'"></v-ons-icon>
        </v-ons-pull-hook>
        <section>
            <div class="zhs_head" >
                <!--<img src="../../assets/head.png" class="zhs_head"/>-->
                <div class="zhs_txt">
                    {{$t('l.market.title')}}
                </div>
            </div>
            <div v-for="(item,index) in $store.state.ticker" class="details_List">
                <div class="title">
                    {{item.ticker.text}}（{{$t('l.market.rank')}}：{{item.ticker.rank}}）
                </div>
                <div class="warp">
                    {{item.ticker.name}}
                    <div class="percent"
                         v-show="item.ticker.percent_change_24h.toString().indexOf('-')==-1">
                        +{{item.ticker.percent_change_24h}}%
                    </div>
                    <div class="percent" style="background: #e40101"
                         v-show="item.ticker.percent_change_24h.toString().indexOf('-')!=-1">
                         {{item.ticker.percent_change_24h}}%
                    </div>
                    <div class="price" v-show="$i18n.locale=='zh-CN'">
                        {{parseFloat(item.ticker.price_cny).toFixed(2)}} CNY
                    </div>
                    <div class="price" v-show="$i18n.locale!='zh-CN'">
                        {{parseFloat(item.ticker.price_usd).toFixed(6)}} USD
                    </div>
                </div>
                <div class="volume" v-show="$i18n.locale=='zh-CN'">
                    {{$t('l.market.amount')}} {{item.ticker['24h_volume_cny']}} CNY (24h)
                </div>
                <div class="volume" v-show="$i18n.locale!='zh-CN'">
                    {{$t('l.market.amount')}} {{item.ticker['24h_volume_usd']}} USD (24h)
                </div>
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
                pages: [
                    {
                        page: require('@/components/market/details').default
                    }
                ],
                state: 'initial',
            };
        },
        methods: {
            push(page, index) {
                this.$store.commit('push', {page: page,index});
            },
            loadItem(done) {
                setTimeout(() => {
                    this.$parent.$parent.$parent.$parent.$parent.ticker();
                    done();
                }, 400);
            }
        },
        created: function () {


        }
    };
</script>

<style scoped lang='less'>


    .details_List {
        .volume{
            color: #a2a2a2;font-size: 12px;margin-top: 4px
        }
        .title{
            color: #a2a2a2;font-size: 12px;margin-top: 10px;
        }
        .warp{
            margin-top: 4px;color: #000000;position: relative;
        }
        .percent{
            border-radius: 4px;text-align: center;
            font-size: 14px;color: #fff;float: right;margin-top: -6px;
            width: 80px;height: 30px;line-height: 30px;background: #3ca316;margin-right: 10px;
        }
        .price{
            float: right;margin-right: 10px;
        }
        background: #fff;
        padding-bottom: 14px;
        border-radius: 4px;
        border-bottom: 1px solid #f2f2f2;
        overflow: hidden;
        height: 60px;
        padding-left: 16px;
    }
</style>

