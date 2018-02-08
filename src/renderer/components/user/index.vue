<template>
    <v-ons-page>
        <div>
            <v-ons-list class="user_index" style="background: #1a99d5">
                <!--<img src="../../assets/background.png" class="user_index_bg"/>-->
                <div class="user_index_warp">
                    <div class="user_index_warp_title">
                        我的
                    </div>
                    <img v-if="$store.state.wallet.name" class="user_index_warp_avatar" src="../../assets/user.png"/>
                    <div v-if="!$store.state.wallet.name" class="user_index_warp_btn">
                        <div class="div_left" @click="push(pages[0].page)">
                            <img src="../../assets/importWallet.png"/>
                            <div>导入钱包</div>
                        </div>
                        <div class="div_left div_right" @click="push(pages[1].page)">
                            <img src="../../assets/createWallet.png"/>
                            <div>创建</div>
                        </div>
                    </div>
                    <div v-if="$store.state.wallet.name" class="user_index_warp_name" @click="pass">
                        {{$store.state.wallet.name}}
                    </div>
                </div>
            </v-ons-list>

            <v-ons-list class="index_list" v-if="$store.state.wallet.name"  style="margin-top: 10px;" >
                <v-ons-list-item tappable modifier="chevron" @click="push(pages[3].page)">
                    <img src="../../assets/Phrase.png" />导出助记词
                </v-ons-list-item>
                <v-ons-list-item tappable modifier="chevron" @click="push(pages[2].page)">
                    <img src="../../assets/yun.png" />节点
                </v-ons-list-item>
            </v-ons-list>
            <v-ons-list class="index_list" v-if="$store.state.wallet.name" style="margin-top: 10px;" @click="out">
                <v-ons-list-item tappable modifier="chevron">
                    <img src="../../assets/logOut.png" />删除钱包
                </v-ons-list-item>
            </v-ons-list>
        </div>
    </v-ons-page>

</template>

<script>
    export default {
        data() {
            return {
                pages: [
                    {
                        page: require('@/components/user/import').default
                    },
                    {
                        page: require('@/components/user/create').default
                    },
                    {
                        page: require('@/components/user/peers').default
                    },
                    {
                        page: require('@/components/wallet/phrase').default
                    }
                ],
                password: ''
            };
        },
        methods: {
            push(page) {
                this.$store.commit('push', {page: page});
            },
            pass() {
                this.$g.wallet.getWallet(this).then(pass => {
                    this.password = pass;
                    console.log(this.password);
                });
            },
            kyes() {
                var blob = new Blob([JSON.stringify(this.$store.state.wallet)]);
                var a = document.createElement("a");
                a.href = window.URL.createObjectURL(blob);
                a.download = "keys";
                a.textContent = "Download";
                a.click();
            },
            out() {
                this.$g.wallet.getWallet(this).then(pass => {
                    if (pass.plaintext != '') {
                        this.$store.commit('logOutWallet');
                    }
                    else {
                        this.$ons.notification.alert({
                            'title': '提示',
                            'message': '密码错误'
                        })
                    }
                })
            },

        }

    };
</script>

<style scoped lang='less'>
    .user_index {
        text-align: center;
        position: relative;
        background-image: none;
        height: 190px;
        .user_index_bg {
            width: 100%;
            height: 100%;
        }
        .user_index_warp {
            position: absolute;
            top: 0;
            width: 100%;
            .user_index_warp_title {
                color: #fff;
                margin-top: 20px;
                font-size: 14px;
            }
            .user_index_warp_avatar {
                border-radius: 50%;
                height: 60px;
                width: 60px;
                margin-top: 26px;
            }
            .user_index_warp_btn {
                width: 240px;
                margin: 0 auto;
                font-size: 12px;
                margin-top: 40px;
                overflow: hidden;
                color: #fff;
                .div_left {
                    float: left;
                    img {
                        width: 46px
                    }
                    div {
                        margin-top: 10px
                    }
                }
                .div_right {
                    float: right;
                }
            }
            .user_index_warp_name {
                text-align: center;
                width: 220px;
                margin: 0 auto;
                font-size: 14px;
                margin-top: 14px;
                color: #fff
            }
        }
    }
    .index_list {
        background-image: none;
        img{
            width: 18px;margin-right: 20px;margin-left:10px;font-size: 14px;
        }
    }
    .list-item__center {
        background-image: linear-gradient(0deg, #dadada, #dadada 100%);
        font-size: 14px;
        color: #4d4d4d
    }
</style>
