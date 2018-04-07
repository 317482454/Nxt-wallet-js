<template>
    <v-ons-page @show="load" >
        <!--<img class="zhs_ps" src="../../assets/bg.png"/>-->
        <div class="zhs_ps" style="background: rgb(26, 153, 213);">
            <div class="zhs_ps_head">
                <div @click="$store.commit('pop')">
                    <img src="../../assets/left.png"/>
                </div>
                <v-ons-segment @postchange="changge" :index.sync="segmentIndex" style="width: 180px;    height: 32px;">
                    <button>{{$t('l.import.phrase')}}</button>
                    <button>{{$t('l.import.addr')}}</button>
                </v-ons-segment>
            </div>
            <section style="margin: 15px 20px;">
                <v-ons-card style="background: #fff">
                    <input type="text" :placeholder="$t('l.import.name')" v-model="user.name"/>
                    <input type="password" :placeholder="$t('l.import.password')" v-model="user.password"/>
                    <input type="password" :placeholder="$t('l.import.again')" v-model="passwordConfirm"/>
                    <input type="text" :placeholder="$t('l.import.phrase')" v-model="user.phrase"/>
                </v-ons-card>

                <section class="section">
                    <ons-button class="button button--large button" @click="save" modifier="large">
                        {{$t('l.import.btn')}}
                    </ons-button>
                </section>
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
                segmentIndex:0,
                model: {},
                passwordConfirm: '',
                checkboxIs:false,
                protocol:require('@/components/user/protocol').default,
                addr:require('@/components/user/importAddr').default,
            }
        },
        methods: {
            save() {
                if (this.user.password.length < 9) {
                    this.$ons.notification.alert({
                        'title': this.$t('l.prompt.title'),
                        'message': this.$t('l.error.digits')
                    });
                    return;
                }
                if (this.user.name != '' && this.user.password != '' && this.user.phrase != '' && this.passwordConfirm == this.user.password) {
                    this.$g.wallet.setWallet(this.user.name, this.user.password, this.user.phrase, 'Nxt', this);
                    this.$ons.notification.alert({
                        'title': this.$t('l.prompt.title'),
                        'message': this.$t('l.prompt.import')
                    })
                    this.$store.commit('pop')
                } else {
                    this.$ons.notification.alert({
                        'title': this.$t('l.prompt.title'),
                        'message': this.$t('l.error.information')
                    })
                }


            },
            push(page){
                this.$store.commit('push', {page: page,txt: ''});
            },
            changge(){
                if(this.segmentIndex==1){
                    this.push(this.addr)
                }
            },
            load(){
                this.segmentIndex=0;
            }
        },
        created: function () {
            this.$ons.notification.confirm({
                title: this.$t('l.prompt.disclaimer'),
                message: this.$t('l.prompt.disclaimerTxt'),
                buttonLabels:this.$t('l.prompt.buttonLabels'),
            })
        }
    }
</script>

<style scoped lang="less">
    .create_list{
        background: inherit;font-size: 12px;
        label{
            color: #fff;
            span{
                color: #fff;font-size: 12px;border-bottom: 1px dotted #fff;
            }
        }
    }
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
