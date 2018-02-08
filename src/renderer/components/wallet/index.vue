<template>
    <v-ons-page>
        <v-ons-pull-hook :action="loadItem" :height="84" @changestate="state = $event.state">
            <v-ons-icon size="22px" class="pull-hook-spinner"
                        :icon="state === 'action' ? 'fa-spinner' : 'fa-arrow-down'"
                        :rotate="state === 'preaction' && 180" :spin="state === 'action'"></v-ons-icon>
        </v-ons-pull-hook>
        <div class="wallet_index">
            <v-ons-list class="wallet_index_head"  style="background: #1a99d5">
                <!--<img src="../../assets/background.png"/>-->
                <div class="wallet_index_head_warp">
                    <div class="wallet_index_head_txt">
                        总资产 (CNY)
                    </div>
                    <div class="wallet_index_head_sum">
                        {{$store.state.sum}}
                    </div>
                    <!--<div  v-if="$store.state.wallet.name" style="margin: 0 auto;margin-top: 14px;font-size: 12px;width: 94px;line-height: 20px;" @click="push(pages[0].page)">-->
                        <!--<img src="../../assets/add.png" style="width: 20px;float: left"/>-->
                        <!--Add Assets-->
                    <!--</div>-->
                </div>
            </v-ons-list>
            <v-ons-card class="wallet_index_list" v-for="item in $store.state.wallet.list">
                <div class="wallet_index_list_warpHead">
                    <div class=" wallet_index_list_name">
                        {{item.txt}}
                    </div>
                    <div class="wallet_index_list_sum">
                        {{item.sum}}
                    </div>
                    <div class="wallet_index_list_frizen">
                        {{item.address}}
                    </div>
                </div>
                <div class="wallet_index_list_btn">
                    <div class="wallet_index_list_warp">
                        <div class="wallet_index_list_div wallet_index_list_div1" @click="push(pages[1].page,{model:item})">
                            <div style="width: 72px">
                                <img src="../../assets/recieve.png" />接收
                            </div>
                        </div>
                        <div class="wallet_index_list_div wallet_index_list_div2" @click="push(pages[2].page, {model:item})">
                            <div style="width: 62px;">
                                <img src="../../assets/send.png"/>发送
                            </div>
                        </div>
                        <div class="wallet_index_list_div wallet_index_list_div3" @click="push(pages[3].page, {model:item})">
                            <div style="width: 54px;">
                                <img src="../../assets/bill.png"/>明细
                            </div>
                        </div>
                    </div>
                </div>
            </v-ons-card>
        </div>
    </v-ons-page>
</template>

<script>
    export default {
        data() {
            return {
                pages: [
                    {
                        page: require('@/components/wallet/addAssets').default
                    },
                    {
                        page: require('@/components/wallet/into').default
                    },
                    {
                        page: require('@/components/wallet/out').default
                    },
                    {
                        page: require('@/components/wallet/details').default
                    }
                ],
                state: 'initial',
            };
        },
        methods: {
            push(page, txt) {
                this.$store.commit('push', {page: page, txt: txt});
            },
            loadItem(done) {
                setTimeout(() => {
                    this.$parent.$parent.$parent.$parent.$parent.list();
                    done();
                }, 400);
            }
        },
        created: function () {


        }
    };
</script>

<style scoped lang="less">
    .wallet_index {
        position: relative;
        .wallet_index_head {
            height: 190px;
            text-align: center;
            position: relative;
            img {
                width: 100%;
                height: 100%;
            }
            .wallet_index_head_warp {
                position: absolute;
                top: 0;
                width: 100%;
                color: #fff;
                .wallet_index_head_txt {
                    margin-top: 60px;
                    font-size: 14px;
                }
                .wallet_index_head_sum {
                    margin-top: 12px;
                    font-size: 36px;
                }
            }
        }
        .wallet_index_btn {
            padding: 0;
            width: 200px;
            left: 50%;
            margin-left: -100px;
            height: 50px;
            line-height: 52px;
            font-size: 12px;
            position: absolute;
            top: 155px;
            box-shadow: 0 6px 9px rgba(14, 61, 118, .16);
            .wallet_index_btn_left {
                float: left;
                color: #4d4d4d;
                width: 40%;
                margin-left: 10%;
            }
            img {
                width: 18px;
                margin-top: 16px;
                float: left;
                margin-right: 10px;
            }

            .wallet_index_btn_right {
                float: right;
                color: #4d4d4d;
                position: relative;
                width: 50%;
                div {
                    height: 30px;
                    background: #ccc;
                    position: absolute;
                    top: 10px;
                    width: 1px;
                    left: 0%;
                }
                img {
                    margin-left: 10%;
                }
            }
        }
        .wallet_index_list {
            margin: 15px;
            padding: 0;
            .wallet_index_list_warpHead {
                margin-left: 25px;
                padding-top: 18px;
                .wallet_index_list_name {
                    color: #049adc
                }
                .wallet_index_list_sum {
                    margin-top: 16px;
                    color: #000000;
                    font-size: 20px
                }
                .wallet_index_list_frizen {
                    margin-top: 16px;
                    color: #bdbdbd;
                    font-size: 12px
                }
            }
            .wallet_index_list_btn {
                height: 40px;
                background: #e8eaf0;
                margin-top: 16px;
                border-top: 1px solid #e2e2e2;
                border-bottom-left-radius: 4px;
                border-bottom-right-radius: 4px;
                .wallet_index_list_warp {
                    margin: 5px 0;
                    width: 100%;
                    line-height: 30px;
                    color: #686868;
                    font-size: 14px;
                    .wallet_index_list_div {
                        float: left;
                        width: 33%;
                        text-align: center;
                        font-size: 12px;
                        div {
                            margin: 0 auto;
                        }
                        img {
                            width: 14px;
                            float: left;
                            margin-top: 8px;
                            margin-right: 6px;
                        }
                    }
                    .wallet_index_list_div1{
                        border-right: 1px solid #ffffff;
                    }
                    .wallet_index_list_div2 {
                        border-right: 1px solid #e2e2e2;
                    }
                    .wallet_index_list_div3 {
                        border-left: 1px solid #ffffff;
                    }
                }
            }

        }
    }
</style>
