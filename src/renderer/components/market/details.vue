<template>
    <v-ons-page>
        <section>
            <div class="zhs_head">
                <img src="../../assets/head.png" class="zhs_head"/>
                <div class="zhs_txt">
                    Nxt/CNY
                </div>
                <div class="zhs_left" @click="$store.commit('pop')">
                    <img src="../../assets/left.png"/>
                </div>
            </div>
            <div class="details_List">
                <div class="title">
                    Nxt（未来币）
                </div>
                <div class="price">
                    ¥2.01 <span>CNY</span>
                </div>
                <div class="percent">
                    -0.55% (24h)
                </div>
                <div class="volume">
                    量 ¥76,477,364 CNY/1,073 BTC (24h)
                </div>
                <div>
                    <div class="exchangge">
                        Bittrex,NXT/BTC
                        <div>
                            30%
                        </div>
                    </div>
                    <div class="exchangge_price">
                        价格/交易量（24h）
                        <div>
                            ¥2.01/¥76,477,364
                        </div>
                    </div>
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
                state: 'initial',
            };
        },
        methods: {

        },
        created: function () {


        }
    };
</script>

<style scoped lang='less'>


    .details_List {
        .exchangge_price{
            color: #a2a2a2;font-size: 12px;margin-top: 4px;
            div{
                float: right;margin-right: 10px;
            }
        }
        .exchangge{
            font-size: 14px;margin-top: 4px;
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
        padding-bottom: 6px;
        border-radius: 4px;
        border-bottom: 1px solid #f2f2f2;
        overflow: hidden;
        padding-left: 16px;
    }
</style>

