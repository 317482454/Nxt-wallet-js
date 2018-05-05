<template>
    <v-ons-page>
        <v-ons-pull-hook :action="loadItem" :height="84" @changestate="state = $event.state">
            <v-ons-icon size="22px" class="pull-hook-spinner"
                        :icon="state === 'action' ? 'fa-spinner' : 'fa-arrow-down'"
                        :rotate="state === 'preaction' && 180" :spin="state === 'action'"></v-ons-icon>
        </v-ons-pull-hook>
        <div class="wallet_index">
            <!--<div style="text-align: center;position: absolute;top: 20px;width: 100%;font-size: 14px;    z-index: 2;color: #fff">-->
                <!--{{$store.state.wallet.name}}-->
            <!--</div>-->
           <div v-if="$store.state.wallet.name" @click="$store.state.openSide=!$store.state.openSide" style="z-index: 2;height: 60px;width: 60px;position: absolute;top: 0;right: 0">
               <v-ons-icon style="color: #fff;font-size: 38px;margin-left: 18px;    margin-top: 6px;"
                           icon="ion-navicon, material:md-menu"></v-ons-icon>
           </div>
            <v-ons-list class="wallet_index_head"  style="background: #1a99d5">
                <!--<img src="../../assets/background.png"/>-->
                <div class="wallet_index_head_warp">
                    <div class="wallet_index_head_txt">
                        {{$t('l.wallet.title')}}
                    </div>
                    <div class="wallet_index_head_sum">
                        {{$store.state.sum}}
                    </div>
                    <div  v-if="$store.state.wallet.name" style="margin: 0 auto;margin-top: 14px;font-size: 12px;width: 100px;line-height: 20px;" @click="push(pages[0].page)">
                        <img src="../../assets/add.png" style="height: 20px;width: 20px;float: left"/>
                        {{$t('l.wallet.assets')}}
                    </div>
                </div>
            </v-ons-list>
            <v-ons-card class="wallet_index_list" v-for="(item,index) in $store.state.wallet.list">
                <div @click="setting(index)" class="wallet_index_list_warpHead">
                    <div class=" wallet_index_list_name">
                        {{item.txt}}
                    </div>
                    <div class="wallet_index_list_sum">
                        {{item.sum}}<span class="wallet_index_list_price">（≈{{item.price}} {{$t('l.wallet.price')}}）</span>
                    </div>
                    <div class="wallet_index_list_frizen">
                        {{item.address}}
                    </div>
                    <div v-show="item.is" class="state"></div>
                </div>
                <div class="wallet_index_list_btn">
                    <div class="wallet_index_list_warp">
                        <div class="wallet_index_list_div wallet_index_list_div1" @click="push(pages[1].page,{model:item})">
                            <div style="width: 72px">
                                <img src="../../assets/recieve.png" />{{$t('l.wallet.receive')}}
                            </div>
                            <div class="divfff"></div>
                            <div class="dive2"></div>
                        </div>
                        <div class="wallet_index_list_div wallet_index_list_div2" @click="push(pages[2].page, {model:item})">
                            <div style="width: 62px;">
                                <img src="../../assets/send.png"/>{{$t('l.wallet.send')}}
                            </div>
                            <div class="divfff"></div>
                            <div class="dive2"></div>
                        </div>
                        <div class="wallet_index_list_div wallet_index_list_div3" @click="push(pages[3].page, item)">
                            <div style="width: 60px;">
                                <img src="../../assets/bill.png"/>{{$t('l.wallet.details')}}
                            </div>
                        </div>
                    </div>
                </div>
            </v-ons-card>
        </div>
        <section>
            <v-ons-action-sheet :visible.sync="settingSheetVisible"
                                cancelable
                                :title="model.txt+' '+$t('l.wallet.setting.title')">
                <v-ons-action-sheet-button @click="settingPeers" icon="md-square-o">{{$t('l.wallet.setting.node')}}</v-ons-action-sheet-button>
                <v-ons-action-sheet-button  icon="md-square-o">
                    <a style="    display: block;text-decoration: none;    color: #0076ff;"
                      :href="model.api" target="_blank">{{$t('l.wallet.setting.apl')}}</a>
                </v-ons-action-sheet-button>
                <v-ons-action-sheet-button @click="settingDel" v-show="model.index!=0" icon="md-square-o">{{$t('l.wallet.setting.del')}}</v-ons-action-sheet-button>
                <v-ons-action-sheet-button @click="settingSheetVisible=false"  icon="md-square-o">{{$t('l.wallet.setting.cancel')}}</v-ons-action-sheet-button>
            </v-ons-action-sheet>
        </section>
        <!--<v-ons-speed-dial position="bottom right" direction="up"-->
        <!--:visible="spdVisible"-->
        <!--&gt;-->
        <!--<v-ons-fab>-->
        <!--<v-ons-icon icon="ion-jfsc"></v-ons-icon>-->
        <!--</v-ons-fab>-->
        <!--</v-ons-speed-dial>-->
    </v-ons-page>
</template>

<script>
    export default {
        data() {
            return {
                spdVisible:true,
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
                    // {
                    //     page: require('@/components/wallet/transactionDetails').default
                    // }
                ],
                state: 'initial',
                peers: require('@/components/user/peers').default,
                settingSheetVisible:false,
                model:{}
            };
        },
        methods: {
            push(page, txt) {
                if (txt&&txt.model) txt.model.to = ''
                this.$store.commit('push', {page: page, txt: txt});
            },
            loadItem(done) {
                setTimeout(() => {
                      this.$parent.$parent.$parent.$parent.$parent.$parent.$parent.list();
                    done();
                }, 400);
            },
            setting(index){
                this.settingSheetVisible=true;
                this.model=this.$store.state.wallet.list[index];
                this.model.index=index;
            },
            settingDel(){
                this.settingSheetVisible=false;
                this.$store.state.wallet.list.splice(this.model.index,1)
                this.$store.commit('setWalletList2', this.$store.state.wallet.list);
            },
            settingPeers(){
                this.settingSheetVisible=false;
                this.$store.commit('push', {page: this.peers,txt:this.model});

            }
        },
        created: function () {
        }
    };
</script>

<style scoped lang="less">
    .ion-jfsc {
        background: url("../../assets/jfsc.png");
        height: 26px;
        width: 26px;
        background-size: cover;
    }
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
                position: relative;
                .state{
                    right: 20px;top: 20px;border-radius: 50%;position: absolute;width: 12px;height: 12px;background: red;
                }
                .wallet_index_list_name {
                    color: #049adc
                }
                .wallet_index_list_sum {
                    margin-top: 16px;
                    color: #000000;
                    font-size: 20px
                }
                .wallet_index_list_price {
                    color: #bdbdbd;
                    font-size: 12px
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
                        position: relative;
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
                    .divfff{
                        top: 0px;right: 0;position: absolute;height: 100%;width: 1px;background: #fff;
                    }
                    .dive2{
                        top: 0px;right: -1px;position: absolute;height: 100%;;width: 1px;background: #e2e2e2
                    }
                }
            }

        }
    }
</style>
