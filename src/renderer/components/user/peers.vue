<template>
    <v-ons-page>
        <section>
            <div class="zhs_head" style="position: fixed;top: 0;z-index: 10" >
                <img src="../../assets/head.png" class="zhs_head"/>
                <div class="zhs_txt">
                    {{this.$store.state.pageText.txt}} {{$t('l.peers.title')}}
                </div>
                <div class="zhs_left" @click="$store.commit('pop')">
                    <img src="../../assets/left.png"/>
                </div>
                <div @click="addPeers" class="zhs_right">{{$t('l.peers.add')}}</div>
            </div>
            <ons-list style="margin-top: 60px">
                <ons-list-item v-for="(item,index) in peers" style="padding: 0 0 0 20px;">
                    <label class="center" style="padding: 14px 6px 14px 0;">
                        {{item.api}}
                    </label>
                    <div class="right">
                        <v-ons-switch @change="test(index)" :input-id="item.api" v-model="item.is"></v-ons-switch>
                    </div>
                </ons-list-item>
            </ons-list>
            <v-ons-modal :visible="modalVisible" >
                <p style="text-align: center">
                    Loading <v-ons-icon icon="fa-spinner" spin></v-ons-icon>
                </p>
            </v-ons-modal>
        </section>
    </v-ons-page>
</template>


<script>
    export default {
        name: "peers",
        data() {
            return {
                peers: [],
                modalVisible:true
            }
        },
        methods: {
            test(index) {
                this.peers.forEach(v => {
                    v.is = false;
                })
                this.$set(this.peers[index], 'is', true);
                this.$store.state.pageText.api=this.peers[index].api;
                this.$store.commit('setWallet', this.$store.state.wallet);
            },
            addPeers(){
                let _this=this;
                this.$ons.notification.prompt({
                    'title': this.$t('l.prompt.title'),
                    'message': this.$t('l.peers.prompt'),
                    'callback': function (data) {
                        _this.modalVisible=true;
                        _this.$http.get(data+'/'+_this.$store.state.pageText.apikey+'?requestType=getBlockchainStatus',{timeout:3000}).then(v=>{
                            if(v.status==200){
                                if(v.data.services.toString().indexOf('CORS')!=-1&&v.data.services.toString().indexOf('API')!=-1){
                                    _this.peers.unshift({api:data,is:false})
                                }
                            }
                            _this.modalVisible=false;
                        }).catch(error=>{
                            _this.modalVisible=false;
                            _this.$ons.notification.alert({
                                'title': _this.$t('l.prompt.title'),
                                'message': _this.$t('l.error.node'),
                            })
                        })
                    }
                });
            }
        },
        mounted: function () {
            let api =this.$store.state.pageText.api;
            this.peers = [];
            let bis=false;
            this.$http.get( api+'/'+this.$store.state.pageText.apikey+'-proxy?requestType=getPeers&active=true&includePeerInfo=true',{timeout:3000}).
            then(v => {
                this.modalVisible=false;
                if (v.status == 200) {
                    v.data.peers.forEach(item => {
                        if (item.state == 1 && item.apiPort != undefined&&item.services.toString().indexOf('CORS')!=-1&&item.services.toString().indexOf('API')!=-1) {
                            let api2 = 'http://' + item.address + ':' + item.apiPort;
                            let model={
                                api:api2,
                                is:false
                            }
                            if(api == api2){
                                bis=true;
                                model.is =true;
                                this.peers.unshift(model)
                            }else{
                                this.peers.push(model)
                            }
                        }
                    })
                    if(!bis){
                        let model={
                            api:api,
                            is:true
                        }
                        this.peers.unshift(model)
                    }
                }
            }).
            catch(error=>{
                this.modalVisible=false;
                let _this = this;
                this.$ons.notification.confirm({
                    'title': this.$t('l.prompt.title'),
                    'message': this.$t('l.prompt.api'),
                    'callback': function (ok) {
                        if (ok) {
                            _this.$http.get(_this.$store.state.url+'node?name='+_this.$store.state.pageText.txt,{timeout:3000}).
                            then(v => {
                                _this.peers=v.data
                            })

                        }
                    }
                })
            })
        }
    }
</script>

<style scoped>

</style>
