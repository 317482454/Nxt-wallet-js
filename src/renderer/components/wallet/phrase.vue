<template>
    <v-ons-page>
        <div class="zhs_head">
            <img src="../../assets/head.png" class="zhs_head"/>
            <div class="zhs_txt">
                导出助记词
            </div>
            <div class="zhs_left" @click="$store.commit('pop')">
                <img src="../../assets/left.png"/>
            </div>
        </div>
        <div style="margin-top: 30px;text-align: center;font-size: 16px;font-weight: bold;color: #4d4d4d">
            请保存好你的助记词
        </div>
        <div style="margin: 30px auto;font-size: 14px;;color: #9c9c9c;width: 330px;text-align: justify;line-height: 18px">
            这12个单词，是你唯一能恢复你的钱包，正确地写在纸上，并保存在一个安全的地方。
        </div>
        <div style="height: 90px;width: 82%;background: #fff;margin: 16px auto;border-radius: 8px;
        padding: 3%;font-size: 16px;line-height: 24px;color: #4d4d4d;">
            {{phrase}}
        </div>
        <div style="width: 180px;margin: 0 auto">
            <ons-button style="margin: 30px auto;position: relative;  overflow: initial;width: 160px;background:#009dde "
                        class="button button--large copy"  :index="phrase"    modifier="large">
                复制
                <div v-show="show" style="position: absolute;bottom: -70px;background: #000;opacity: 0.6;;color: #fff;height: 40px;
            width: 140px;font-size: 12px;line-height: 40px;border-radius: 5px;left: 50%;margin-left: -70px">
                    复制成功
                </div>
            </ons-button>
        </div>
    </v-ons-page>
</template>

<script>
    import Clipboard from "clipboard"
    export default {
        name: "phrase",
        data(){
            return{
                show:false,
                phrase:''
            }
        },
        created: function () {
            this.$g.wallet.getWallet(this).then(pass => {
                let _this=this;
                if(pass.plaintext==''){
                    this.$ons.notification.alert({
                        'title': '提示',
                        'message': '密码错误',
                        'callback':function () {
                            _this.$store.commit('pop');
                        }
                    })
                }else{
                    _this.$g.wallet.decrypt(_this.$store.state.wallet.phrase,pass.pass).then(txt=>{
                        _this.phrase=txt.plaintext;
                    })

                    // _this.$g.wallet.decrypt()
                }

            });
            let _this = this;
            new Clipboard('.copy', {
                text: function (trigger) {
                    _this.show=true;
                    setInterval(()=>{
                        _this.show=false;
                    },1000);
                    return trigger.getAttribute('index')
                }
            });
        }
    }
</script>

<style scoped>

</style>