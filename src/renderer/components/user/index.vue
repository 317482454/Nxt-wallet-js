<template>
    <v-ons-page>
        <div>
            <v-ons-list class="user_index" style="background: #1a99d5">
                <!--<img src="../../assets/background.png" class="user_index_bg"/>-->
                <div class="user_index_warp">
                    <div class="user_index_warp_title">
                        {{$t('l.profile.my')}}
                    </div>
                    <img v-if="$store.state.wallet.name" class="user_index_warp_avatar" src="../../assets/user.png"/>
                    <div v-if="!$store.state.wallet.name" class="user_index_warp_btn">
                        <div class="div_left" @click="push(pages[0].page)">
                            <img src="../../assets/importWallet.png"/>
                            <div>{{$t('l.profile.import')}}</div>
                        </div>
                        <div class="div_left div_right" @click="push(pages[1].page)">
                            <img src="../../assets/createWallet.png"/>
                            <div>{{$t('l.profile.create')}}</div>
                        </div>
                    </div>
                    <div v-if="$store.state.wallet.name" class="user_index_warp_name" @click="pass">
                        {{$store.state.wallet.name}}
                    </div>
                </div>
            </v-ons-list>

            <v-ons-list class="index_list" v-if="$store.state.wallet.name"  style="margin-top: 10px;" >
                <v-ons-list-item tappable modifier="chevron" @click="push(pages[3].page)">
                    <img src="../../assets/Phrase.png" />{{$t('l.profile.phrase')}}
                </v-ons-list-item>
                <v-ons-list-item tappable modifier="chevron" @click="peersSheetVisible=true" >
                    <img src="../../assets/yun.png" />{{$t('l.profile.node')}}
                </v-ons-list-item>
            </v-ons-list>
            <v-ons-list class="index_list"  style="margin-top: 10px;">
                <v-ons-list-item tappable modifier="chevron" @click="languageSheetVisible=true">
                    <img src="../../assets/language.png" />{{$t('l.profile.language')}}
                </v-ons-list-item>
                <v-ons-list-item v-if="$store.state.wallet.name" tappable modifier="chevron"  @click="out">
                    <img src="../../assets/logOut.png" />{{$t('l.profile.delete')}}
                </v-ons-list-item>
            </v-ons-list>
            <v-ons-list class="index_list" v-if="$store.state.wallet.name"
                        style="margin-top: 10px;" >
                <v-ons-list-item tappable modifier="chevron"  @click="actionSheetVisible=true">
                    <img src="../../assets/reward.png" />{{$t('l.profile.reward')}}
                </v-ons-list-item>
                <a target="_blank" href="https://github.com/317482454/Nxt-wallet-js/issues">
                    <v-ons-list-item tappable modifier="chevron">
                          <img src="../../assets/fk.png" />{{$t('l.profile.feedback')}}
                    </v-ons-list-item>
                </a>
            </v-ons-list>
           <section v-show="$store.state.wallet.name">
               <v-ons-action-sheet :visible.sync="peersSheetVisible"
                                   cancelable
                                   :title="$t('l.profile.node')">
                   <v-ons-action-sheet-button @click="peers('Nxt')"   icon="md-square-o">Nxt</v-ons-action-sheet-button>
                   <v-ons-action-sheet-button @click="peers('Ardor')"  icon="md-square-o">Ardor</v-ons-action-sheet-button>
                   <v-ons-action-sheet-button @click="peersSheetVisible=false"  icon="md-square-o">关闭</v-ons-action-sheet-button>
               </v-ons-action-sheet>
               <v-ons-action-sheet :visible.sync="actionSheetVisible"
                                   v-if="actionSheetVisible"
                                   cancelable
                                   :title="$t('l.profile.reward')">
                   <v-ons-action-sheet-button @click="rewar(item)" v-for="item in $store.state.wallet.list" icon="md-square-o">{{item.txt}}</v-ons-action-sheet-button>
                   <v-ons-action-sheet-button @click="actionSheetVisible=false"  icon="md-square-o">关闭</v-ons-action-sheet-button>
               </v-ons-action-sheet>
               <v-ons-action-sheet :visible.sync="languageSheetVisible"
                                   cancelable
                                   :title="$t('l.profile.language')">
                   <v-ons-action-sheet-button @click="language(item.val)"  v-for="item in languageList" :modifier="item.val==$store.state.lang?'destructive':''">{{item.txt}}</v-ons-action-sheet-button>
                   <v-ons-action-sheet-button @click="languageSheetVisible=false"  icon="md-square-o">关闭</v-ons-action-sheet-button>
               </v-ons-action-sheet>

           </section>
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
                    },
                    {
                        page: require('@/components/wallet/out').default
                    }
                ],
                languageList:[
                    {
                        txt:'中文',
                        val:'zh-CN',
                        modifier:''
                    },
                    {
                        txt:'English',
                        val:'en-US',
                        modifier:''
                    }
                ],
                password: '',
                languageSheetVisible:false,
                actionSheetVisible:false,
                peersSheetVisible:false
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
                            'title': this.$t('l.prompt.title'),
                            'message': this.$t('l.error.password')
                        })
                    }
                })
            },
            rewar(item){
                this.actionSheetVisible=false;
                let addr='NXT-X949-FWSQ-BQFD-7B5PQ'
                if(item.txt!='Nxt'){
                    addr='ARDOR-X949-FWSQ-BQFD-7B5PQ'
                }
                this.$store.commit('push', {page: this.pages[4].page,txt:{model:item,to:addr}});
            },
            peers(txt){
                this.peersSheetVisible=false;
                this.$store.commit('push', {page: this.pages[2].page,txt:txt});

            },
            language(txt){
                this.$i18n.locale=txt;
                this.languageSheetVisible=false;
                this.$store.commit('setLang',txt);
            }
        }

    };
</script>

<style scoped lang='less'>
    a{
        text-decoration:none;
        color:#333;
    }
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
