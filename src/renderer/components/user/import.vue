<template>
    <v-ons-page >
        <!--<img class="zhs_ps" src="../../assets/bg.png"/>-->
        <div class="zhs_ps" style="background: rgb(26, 153, 213);">
            <div class="zhs_ps_head">
                <div @click="$store.commit('pop')">
                    <img src="../../assets/left.png"/>
                </div>
                导入钱包
            </div>
            <v-ons-card>
                <input type="text" placeholder="钱包名称" v-model="user.name"/>
                <input type="password" placeholder="钱包密码" v-model="user.password"/>
                <input type="password" placeholder="再次输入钱包密码" v-model="passwordConfirm"/>
                <input type="text" placeholder="助记词" v-model="user.phrase"/>
            </v-ons-card>
            <section class="section">
                <ons-button class="button button--large button" @click="save" modifier="large">
                    导入
                </ons-button>
            </section>
        </div>
    </v-ons-page>
</template>

<script>

    export default {
        data() {
            return {
                user: {
                    name: '',
                    password: '',
                    phrase: ''
                },
                model: {},
                passwordConfirm: ''
            }
        },
        methods: {
            save() {
                if (this.user.password.length < 9) {
                    this.$ons.notification.alert({
                        'title': '提示',
                        'message': '密码不能少于9位'
                    });
                    return;
                }
                if (this.user.name != '' && this.user.password != '' && this.user.phrase != '' && this.passwordConfirm == this.user.password) {
                    this.$g.wallet.setWallet(this.user.name, this.user.password, this.user.phrase, 'Nxt', this);
                    this.$ons.notification.alert({
                        'title': '提示',
                        'message': '导入成功'
                    })
                    this.$store.commit('pop')
                } else {
                    this.$ons.notification.alert({
                        'title': '提示',
                        'message': '请输入全部信息'
                    })
                }


            }
        }
    }
</script>

<style scoped lang="less">
    input {
        height: 34px;
        border: none;
        border-bottom: 1px solid #e5e5e5;
        width: 100%;
        text-indent: 6px;
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
            font-size: 12px;
        }
    }
</style>
