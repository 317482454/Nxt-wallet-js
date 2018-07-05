<template>
    <v-ons-page>
        <div class="zhs_head">
            <img src="../../assets/head.png" class="zhs_head"/>
            <div class="zhs_txt">
                {{$t('l.wallet.assets')}}
            </div>
            <div class="zhs_left" @click="$store.commit('pop')">
                <img src="../../assets/left.png"/>
            </div>
        </div>
        <ons-list>
            <ons-list-item v-for="(item,index) in List" style="padding: 0 0 0 20px;">
                <label class="center" :for="item.txt" style="    padding: 14px 6px 14px 0;">
                    {{item.txt}}
                </label>
                <div class="right">
                    <v-ons-switch @change="test(index)" :input-id="item.txt" v-model="item.is"></v-ons-switch>
                </div>
            </ons-list-item>
        </ons-list>
        <v-ons-modal :visible="modalVisible" >
            <p style="text-align: center">
                Loading <v-ons-icon icon="fa-spinner" spin></v-ons-icon>
            </p>
        </v-ons-modal>
    </v-ons-page>
</template>

<script>
    export default {
        data() {
            return {
                List: [
                ],
                model: '',
                modalVisible:true,
            };
        },
        methods: {
            test(index) {
                this.$nextTick(() => {
                    let wallet = this.$store.state.wallet.list;
                    let model = JSON.parse(JSON.stringify(wallet[0]));
                    if(!this.List[index].is){
                        let spliceIndex=0
                        wallet.forEach((key,index)=>{
                            if(key.txt==this.List[index].txt){
                                spliceIndex=index;
                            }
                        })
                        if(spliceIndex!=0){
                            wallet.splice(spliceIndex,1)
                        }
                    }
                    else {
                        if(this.List[index].txt=='Eac'){
                            this.$g.wallet.getWallet(this)
                                .then(m => {
                                    if (m.plaintext != '') {
                                        model.address = this.$g.wallet.eac(m.plaintext,0);
                                        model.txt = this.List[index].txt;
                                        model.api = this.List[index].api;
                                        model.apikey = this.List[index].apikey;
                                        model.sum = 0;
                                        wallet.push(model)
                                        this.$store.commit('setWalletList2', wallet);
                                    }else{
                                        this.List[index].is=false;
                                    }
                                })
                        }else if(this.List[index].txt=='Mtr'){
                            this.$g.transaction.getPhrase(this, wallet[0].publickey).then(
                                account=>{
                                    model.address=this.$mtr.publicKeyToAccountId(account.publickey);
                                    if (this.List[index].id != -1) {
                                        model.chainId = this.List[index].id;
                                    }
                                    model.txt = this.List[index].txt;
                                    model.api = this.List[index].api;
                                    model.apikey = this.List[index].apikey;
                                    model.sum = 0;
                                    wallet.push(model)
                                    this.$store.commit('setWalletList2', wallet);
                                })

                        } else{
                            model.address = this.List[index].txt.toLocaleUpperCase() + wallet[0].address.split('NXT')[1];
                            if (this.List[index].id != -1) {
                                model.chainId = this.List[index].id;
                            }
                            model.txt = this.List[index].txt;
                            model.api = this.List[index].api;
                            model.apikey = this.List[index].apikey;
                            model.sum = 0;
                            wallet.push(model)
                            this.$store.commit('setWalletList2', wallet);
                        }
                    }
                })
            },
            titleCase(str) {
                let newarr,newarr1=[];
                newarr = str . toLowerCase() . split(" ");
                for(let i = 0 ; i < newarr . length ; i++){
                    newarr1 . push(newarr[i][0] . toUpperCase()+newarr[i] . substring(1));
                }
                return newarr1.join(' ');
            }
        },
        created: function () {
            this.$http.get(this.$store.state.url+'candy',{timeout:5000}).then(v => {
                this.modalVisible=false;
                if(v.data){
                    v.data.forEach(key=>{
                        let t=false;
                        this.$store.state.wallet.list.forEach(item=>{
                            if(key.txt==item.txt){
                                t=true;
                            }
                        })
                        this.List.push({txt:key.txt,id:key.id,is:t,api:key.api,apikey:key.apikey})
                    })
                }
            }).catch(error=>{
                this.modalVisible=false;
            })

        }
    }
</script>

<style scoped>

</style>
