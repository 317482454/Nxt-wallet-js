<template>
    <v-ons-page>
        <v-ons-toolbar style="padding-top: 0px" class="zhs_head">
            <div class="zhs_left" @click="$store.commit('pop')">
                <img src="../../assets/left.png"/>
            </div>
            <div class="center" style="font-size: 14px;">
                {{this.$store.state.pageText}}
            </div>
        </v-ons-toolbar>

        <section style="padding-top: 60px">
            <a  v-for="item in list" target="_blank" :href="item.url" style="text-decoration: none;">
                <div class="details_List">
                    <img :src="item.imageUrl"/>
                    <div class="details_List_sum">
                        <div>
                            {{item.name}}
                        </div>
                        <div class="details_balance">
                            <!--10000.00-->
                        </div>
                        <div class="detail_cut_back details_cut_back_add">

                        </div>
                    </div>
                    <div class="details_List_sum">
                        <div>
                            <v-ons-icon v-show="item.platforms.android" icon="fa-android"></v-ons-icon>
                            <v-ons-icon v-show="item.platforms.ios" icon="fa-apple"></v-ons-icon>
                            <v-ons-icon v-show="item.platforms.linux" icon="fa-linux"></v-ons-icon>
                            <v-ons-icon v-show="item.platforms.chromeos" icon="fa-chrome"></v-ons-icon>
                            <v-ons-icon v-show="item.platforms.windows" icon="fa-windows"></v-ons-icon>
                            <v-ons-icon v-show="item.platforms.macos" icon="fa-laptop"></v-ons-icon>
                            <v-ons-icon v-show="item.platforms.web" icon="fa-internet-explorer"></v-ons-icon>
                        </div>
                    </div>

                </div>
            </a>
            <div style="height: 60px;width: 100%">
            </div>
        </section>
    </v-ons-page>
</template>


<script>
    export default {
        name: 'wallets',
        data() {
            return {
                list: []
            }
        },
        created: function () {
            this.$http.get(this.$store.state.changenow.api + '/currencies/' + this.$store.state.pageText.toLowerCase()).then(v => {
                this.list = v.data.wallets.primary.concat(v.data.wallets.secondary);
            })
        }
    }
</script>


<style scoped lang='less'>
    .details_List {
        margin: 16px 20px 0 20px;
        background: #fff;
        padding-bottom: 14px;
        border-radius: 4px;
        box-shadow: rgba(14, 61, 118, 0.16) 0 0 9px;
        overflow: hidden;
        position: relative;
        img {
            width: 40px;
            position: absolute;
            right: 20px;
            top: 18px;
        }
        .details_List_sum {
            margin-left: 20px;
            margin-right: 20px;
            padding-top: 14px;
            font-size: 14px;
            color: #4d4d4d;
            overflow: hidden;
            .sum_addr {
                float: right;
                width: 70%;
                word-break: break-all;
                text-align: right;
                font-size: 12px;
                color: #a2a2a2;
            }
            div {
                float: left
            }
            .details_balance {
                margin-left: 30px
            }
            .details_cut_back_add {
                color: #45b148 !important;
            }

            .detail_cut_back {
                float: right;
                color: #dc2f31;

            }
        }
        .details_List_send {
            font-size: 12px;
            color: #a2a2a2;
        }
    }
</style>