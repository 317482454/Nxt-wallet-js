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
                modalVisible:true
            };
        },
        methods: {
            test(index) {
                this.$nextTick(() => {
                    let wallet = this.$store.state.wallet.list;
                    let model=JSON.parse(JSON.stringify(wallet[0]));
                    model.address='ARDOR'+wallet[0].address.split('NXT')[1];
                    model.chainId=this.List[index].id;
                    model.txt=this.List[index].txt;
                    model.api=this.$store.state.wallet.ardrApi;
                    model.sum=0;
                    if(this.List[index].is){
                         wallet.push(model)
                    }else{
                        let spliceIndex=0
                        wallet.forEach((key,index)=>{
                            if(key.txt==model.txt){
                                spliceIndex=index;
                            }
                        })
                        wallet.splice(spliceIndex,1)
                    }
                    this.$store.commit('setWalletList2', wallet);
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
            this.$http.get(this.$store.state.wallet.ardrApi+"/nxt?requestType=getConstants&chain=1").then(v => {
                this.modalVisible=false;
               if(v.status==200){
                   for (let key in v.data.chains){
                       let t=false;
                       let txt=this.titleCase(key)=='Ardr'?'Ardor':this.titleCase(key);
                       this.$store.state.wallet.list.forEach(item=>{
                           if(txt==item.txt){
                               t=true;
                           }
                       })
                       this.List.push({txt:txt,id:v.data.chains[key],is:t})
                   }

               }
            }).catch(error=>{
                this.modalVisible=false;
            })
        }
    }
</script>

<style scoped>

</style>
