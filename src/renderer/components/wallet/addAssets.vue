<template>
    <v-ons-page>
        <div style="height: 60px;width: 100%;position: relative;text-align: center;line-height: 60px;color: #fff;font-size: 14px">
            <img src="../../assets/head.png" style="width: 100%;height: 100%"/>
            <div style="position: absolute;width: 100%;height: 100%;text-align: center;top: 0;">
                Add Assets
            </div>
            <div style="position: relative;position: absolute;width: 20%;height: 100%;top: 0;text-align: left"
                 @click="$store.commit('pop')">
                <img src="../../assets/left.png"
                     style="position: absolute;   top: 50%;margin-top: -7.5px;width: 9px;margin-left: 20px;"/>
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
    </v-ons-page>
</template>

<script>
    export default {
        data() {
            return {
                List: [
                    {
                        "txt": "Photon",
                        "val": "photon"
                    },
                    {
                        "txt": "Iris",
                        "val": "iris"
                    }
                ],
                model: ''
            };
        },
        methods: {
            test(index) {
                this.$nextTick(() => {
                    let wallet = this.$store.state.wallet.list;
                    for(let i=0;i<wallet.length;i++){
                        if(wallet[i].val==this.List[index].val&&!this.List[index].is){
                            wallet.splice(i, 1);
                            break;
                        } else {
                            if (this.List[index].is) {
                                let model = JSON.parse(JSON.stringify(wallet[0]));
                                model.txt = this.List[index].txt;
                                model.val = this.List[index].val;
                                model.sum=0;
                                wallet.push(model)
                                break;
                            }
                        }
                    }
                    this.$store.commit('setWalletList2', wallet);
                })
            }
        },
        created: function () {
            let t=new Set();
            this.$store.state.wallet.list.forEach((v)=>{
                t.add(v["val"]);
            })
            for(let i=0;i<this.List.length;i++){
                this.List[i].is=t.has(this.List[i]["val"]);
            }
        }
    }
</script>

<style scoped>

</style>
