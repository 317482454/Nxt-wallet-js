<template>
    <v-ons-page>
        <v-ons-tabbar swipeable position="auto"
                      :tabs="tabs"
                      :position="position"
                      :visible="true"
                      :index.sync="activeIndex">
        </v-ons-tabbar>
    </v-ons-page>


</template>

<script>
    export default {
        name: 'index',
        data() {
            return {
                activeIndex: 2,
                position: 'bottom',

                tabs: [
                    {
                        icon: 'ion-market',
                        label: 'Market',
                        page: require('@/components/market/index').default,
                        key: 'homePage'
                    },
                    {
                        icon: 'ion-wallet',
                        label: 'Wallet',
                        page: require('@/components/wallet/index').default,
                        key: 'newsPage'
                    },
                    {
                        icon: 'ion-profile',
                        label: 'Profile',
                        page: require('@/components/user/index').default,
                        key: 'settingsPage'
                    }
                ]
            }
        },
        methods: {

            md() {
                return this.$ons.platform.isAndroid()
            },
            i(index) {
                this.activeIndex = index;
            }
        },
        computed: {
            title() {
                return this.tabs[this.activeIndex].label
            }
        },
        created: function () {
            if (this.$store.state.wallet.name) {
                this.activeIndex = 1;
            }

        }
    }
</script>

<style lang='less'>
    .alertDiv{
        margin-left: 20px;text-align: left;
    }
    .tabbar__item {
        .ion-market {
            background: url("../assets/market.png");
            height: 22px;
            width: 22px;
            background-size: cover;
        }
        .ion-wallet {
            background: url("../assets/wallet.png");
            height: 18px;
            width: 20px;
            background-size: cover;
        }
        .ion-profile {
            background: url("../assets/profile.png");
            height: 18px;
            width: 20px;
            background-size: cover;
        }
    }
    .toolbar{
        background-color:  #1a99d5 !important;
        height: 60px !important;
        .left{
            img{
                position: absolute;
                top: 50%;
                margin-top: -7.5px;
                width: 9px;
                margin-left: 20px;
            }
        }
        .center{
            color: #fff !important;
            line-height: 60px !important;
        }
    }
    .active {
        color: #2ba2de;
        .ion-market {
            background: url("../assets/market_selected.png");
            height: 22px;
            width: 22px;
            background-size: cover;
        }
        .ion-wallet {
            background: url("../assets/wallet_selected.png");
            height: 18px;
            width: 20px;
            background-size: cover;
        }
        .ion-profile {
            background: url("../assets/profile_selected.png");
            height: 18px;
            width: 20px;
            background-size: cover;
        }
    }

    .zhs_head {
        height: 60px;
        width: 100%;
        background: #1a99d5;
        position: relative;
        text-align: center;
        line-height: 60px;
        color: #fff;
        font-size: 14px;

        .zhs_head {
            width: 100%;
            height: 100%;
            display: none;
        }
        .center
        .zhs_txt {
            position: absolute;
            width: 100%;
            height: 100%;
            text-align: center;
            top: 0;
        }
        .zhs_left {
            position: relative;
            position: absolute;
            width: 20%;
            height: 100%;
            top: 0;
            text-align: left;
            img {
                position: absolute;
                top: 50%;
                margin-top: -7.5px;
                width: 9px;
                margin-left: 20px;
            }
        }
        .zhs_right{
            position: absolute; width: 20%; height: 100%; top: 0;right: 0; text-align: center;

        }
    }

    .zhs_ps {
        position: absolute;
        height: 100%;
        width: 100%;
        top: 0;
        .zhs_ps_head {
            height: 60px;
            width: 100%;
            position: relative;
            text-align: center;
            line-height: 60px;
            color: #fff;
            font-size: 14px;
            div {
                position: relative;
                position: absolute;
                width: 20%;
                height: 100%;
                top: 0;
                text-align: left;
                img {
                    position: absolute;
                    top: 50%;
                    margin-top: -7.5px;
                    width: 9px;
                    margin-left: 20px;
                }
            }
        }
    }
</style>
