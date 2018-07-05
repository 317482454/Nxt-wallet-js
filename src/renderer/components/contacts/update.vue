<template>
    <v-ons-page>
        <section>
            <div class="zhs_head">
                <img src="../../assets/head.png" class="zhs_head"/>
                <div class="zhs_txt">
                    {{$t('l.contacts.update.title')}}{{$t('l.profile.contact')}}:{{$store.state.pageText.name}}
                </div>
                <div class="zhs_left" @click="$store.commit('pop')">
                    <img src="../../assets/left.png"/>
                </div>
                <div @click="save" class="zhs_right">
                    {{$t('l.contacts.create.txt')}}
                </div>
            </div>
            <div>
                <v-ons-list>
                    <v-ons-list-item>
                        <v-ons-input v-model="model.name" class="input" :placeholder="$t('l.contacts.create.name')">
                        </v-ons-input>
                    </v-ons-list-item>
                    <v-ons-list-item style="position: relative">
                        <v-ons-input v-model="model.addr" class="input" :placeholder="$t('l.contacts.create.addr')">
                        </v-ons-input>
                        <img @click="scan" v-if="$ons.platform.isWebView()" style="position: absolute;top: 10px;width: 36px;right: 10px;"   src="../../assets/scan2.png" />
                    </v-ons-list-item>
                    <v-ons-list-item>
                        <v-ons-input v-model="model.note"  class="input" :placeholder="$t('l.contacts.create.note')">
                        </v-ons-input>
                    </v-ons-list-item>
                </v-ons-list>
            </div>
        </section>
    </v-ons-page>
</template>

<script>
    export default {
        name: "update",
        data() {
            return {
                model:{
                    name:'',
                    addr:'',
                    note:''
                }
            }
        },
        methods: {
            save() {
                if(this.model.name.trim()!=''&&this.model.addr.trim()!=''){
                    if(!this.$store.state.wallet.contacts)
                        this.$store.state.wallet.contacts=[]
                    this.$store.state.wallet.contacts[this.model.index] = this.model;
                    this.$store.state.wallet=JSON.parse(JSON.stringify(this.$store.state.wallet))
                    this.$store.commit('setWallet',this.$store.state.wallet)
                    let _this = this;
                    this.$ons.notification.alert({
                        'title':this.$t('l.prompt.title'),
                        'message':this.$t('l.contacts.update.update'),
                        'callback': function () {
                            _this.$store.commit('pop');
                        }
                    });
                }else{
                    this.$ons.notification.alert({
                        'title': this.$t('l.prompt.title'),
                        'message': this.$t('l.error.message')
                    })
                }
            },
            scan() {
                this.$g.app.scan().then(data => {
                    if(data.addr)
                        this.model.addr = data.addr;
                    else
                        this.model.addr = data
                })
            }
        },
        created: function () {
            this.model =JSON.parse(JSON.stringify(this.$store.state.pageText));
        }
    }
</script>

<style scoped lang="less">
    .input{
        width: 80%;text-indent: 8px
    }

</style>