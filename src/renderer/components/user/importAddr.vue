<template>
    <v-ons-page >
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
                    <input type="text" :placeholder="$t('l.import.addr')" v-model="user.addr"/>
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
                    addr: ''
                },
                segmentIndex:1,
                model: {},
                passwordConfirm: '',
                checkboxIs:false,
                protocol:require('@/components/user/protocol').default,
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
                if (this.user.name != '' && this.user.password != '' && this.user.addr != '' && this.passwordConfirm == this.user.password) {
                    let addrList=this.user.addr.split('-');
                    addrList[0]='NXT';
                    let addr=addrList.toString().replace(/,/g, '-');
                    this.$g.wallet.setWalletAddr(this.user.name, this.user.password,addr, 'Nxt', this);
                    this.$ons.notification.alert({
                        'title': this.$t('l.prompt.title'),
                        'message': this.$t('l.prompt.import')
                    })
                    this.$store.state.pageStack=[require('@/components/index').default]
                } else {
                    this.$ons.notification.alert({
                        'title': this.$t('l.prompt.title'),
                        'message': this.$t('l.error.information')
                    })
                }
            },
            changge(){
                if(this.segmentIndex==0){
                    this.$store.commit('pop');
                }
            },
            push(page){
                this.$store.commit('push', {page: page,txt: ''});
            },
        },
        created: function () {
            this.$ons.notification.confirm({
                title: this.$t('l.prompt.title'),
                message: this.$t('l.prompt.addr'),
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
