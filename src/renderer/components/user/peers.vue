<template>
    <v-ons-page>
        <section>
            <div class="zhs_head">
                <img src="../../assets/head.png" class="zhs_head"/>
                <div class="zhs_txt">
                    节点设置
                </div>
                <div class="zhs_left" @click="$store.commit('pop')">
                    <img src="../../assets/left.png"/>
                </div>
            </div>
            <ons-list>
                <ons-list-item v-for="(item,index) in peers" style="padding: 0 0 0 20px;">
                    <label class="center" style="padding: 14px 6px 14px 0;">
                        {{item.address}}:{{item.apiPort}}
                    </label>
                    <div class="right">
                        <v-ons-switch @change="test(index)" :input-id="item.address" v-model="item.is"></v-ons-switch>
                    </div>
                </ons-list-item>
            </ons-list>
        </section>
    </v-ons-page>
</template>


<script>
    export default {
        name: "peers",
        data() {
            return {
                peers: []
            }
        },
        methods: {
            test(index) {
                this.peers.forEach(v => {
                    v.is = false;
                })
                this.$set(this.peers[index], 'is', true);
                let api = 'http://' + this.peers[index].address + ':' + this.peers[index].apiPort;
                this.$store.state.wallet.list.forEach(v => {
                    if (v.txt == 'Nxt') {
                        v.api = api;
                    }
                });
                this.$store.commit('setWallet', this.$store.state.wallet);
            }
        },
        mounted: function () {
            let api = ''
            this.$store.state.wallet.list.forEach(v => {
                if (v.txt == 'Nxt') {
                    api = v.api;
                }
            });
            this.peers = [];
            this.$http.get('http://178.33.203.157:7876/nxt-proxy?requestType=getPeers&active=true&includePeerInfo=true').then(v => {
                if (v.status == 200) {
                    v.data.peers.forEach(item => {
                        if (item.state == 1 && item.apiPort != undefined) {
                            let api2 = 'http://' + item.address + ':' + item.apiPort;
                            item.is = api == api2 ? true : false;
                            this.peers.push(item)
                        }
                    })
                }
            })
        }
    }
</script>

<style scoped>

</style>
