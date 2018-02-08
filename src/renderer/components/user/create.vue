<template>
    <v-ons-page  style="background: #1a99d5">
        <!--<img class="zhs_ps" src="../../assets/bg.png"/>-->
        <div class="zhs_ps" style="background: rgb(26, 153, 213);">
            <div class="zhs_ps_head">
                <div @click="$store.commit('pop')">
                    <img src="../../assets/left.png"/>
                </div>
                创建钱包
            </div>
            <section v-show="is" class="create">
                <v-ons-card>
                    <input type="text" placeholder="钱包名称" v-model="user.name"/>
                    <input type="password" placeholder="钱包密码" v-model="user.password"/>
                    <input type="password" placeholder="再次输入钱包密码" v-model="passwordConfirm"/>
                </v-ons-card>
                <section class="section">
                    <ons-button class="button button--large" @click="save" modifier="large">
                        创建
                    </ons-button>
                </section>
            </section>
            <section v-show="!is">
                <div class="copy_txt">
                    助记词
                </div>
                <div class="copy" :index="phrase">
                    {{phrase}}
                </div>
                <section class=" create ">
                    <section class=" section">
                        <ons-button style="margin: 30px auto;position: relative;  overflow: initial;"
                                    class="button button--large copyAddr" :index="phrase" modifier="large">
                            复制
                            <div v-show="copyShow" style="position: absolute;bottom: -70px;background: #000;opacity: 0.6;;color: #fff;height: 40px;
            width: 140px;font-size: 12px;line-height: 40px;border-radius: 5px;left: 50%;margin-left: -70px">
                                复制成功
                            </div>
                        </ons-button>
                    </section>
                </section>
            </section>
        </div>
    </v-ons-page>
</template>

<script>

    import Clipboard from "clipboard"

    export default {
        data() {
            return {
                model: {
                    name: '',
                    phrase: '',
                    address: ''
                },
                user: {
                    name: '',
                    password: '',
                },
                passwordConfirm: '',
                is: true,
                copyShow: false,
                phrase: ''
            }
        },
        methods: {
            save() {
                if (this.user.password.length < 9) {
                    this.$ons.notification.alert({
                        'title': '提示',
                        'message': '密码需要大于9位'
                    });
                    return;
                }
                if (this.user.name != '' && this.user.password != '' && this.passwordConfirm == this.user.password) {
                    let PassPhrase = this.$g.wallet.generatePassPhrase();
                    this.phrase = PassPhrase;
                    this.$g.wallet.setWallet(this.user.name, this.user.password, PassPhrase, 'Nxt', this);
                    this.is = false;
                } else {
                    this.$ons.notification.alert({
                        'title': '提示',
                        'message': '请输入全部信息'
                    })
                }

            },

        },
        created: function () {
            let _this = this;
            new Clipboard('.copyAddr', {
                text: function (trigger) {
                    _this.copyShow = true;
                    setInterval(() => {
                        _this.copyShow = false;
                    }, 1000);
                    return trigger.getAttribute('index')
                }
            });
        }
    }
</script>

<style scoped lang="less">
    .create {
        margin: 15px 20px;
        input {
            font-size: 12px;
            color: #a2a2a2
        }
        .section {
            text-align: center;
            margin: 20px 10px;
            .button {
                border: 2px solid #fff;
                border-radius: 7px;
                background: #6894cc;
                font-size: 12px
            }
            .selected {
                background: #009dde !important;
            }
        }
    }

    input {
        height: 34px;
        border: none;
        border-bottom: 1px solid #e5e5e5;
        width: 100%;
        font-size: 14px;
        text-indent: 6px;
    }

    .list-header {
        background: none;
    }

    .page__content {
        position: relative;
    }

    .copy_txt {
        color: #fff;
        width: 80%;
        margin: 0 auto;
        font-size: 12px
    }

    .copy {
        height: 90px;
        width: 82%;
        background: #fff;
        margin: 16px auto;
        border-radius: 8px;
        padding: 3%;
        font-size: 16px;
        line-height: 24px;
        color: #4d4d4d;
    }
</style>
