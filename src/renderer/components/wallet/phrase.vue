<template>
    <v-ons-page>
        <div class="zhs_head">
            <img src="../../assets/head.png" class="zhs_head"/>
            <div class="zhs_txt">
                {{$t('l.phrase.title')}}
            </div>
            <div class="zhs_left" @click="$store.commit('pop')">
                <img src="../../assets/left.png"/>
            </div>
        </div>
        <div class="phrase_title">
            {{$t('l.phrase.title1')}}
        </div>
        <div class="phrase_txt">
            {{$t('l.phrase.txt')}}
        </div>
        <div class="phrase_div">
            {{phrase}}
        </div>
        <div class="phrase_copy">
            <ons-button class="button button--large copy"  :index="phrase"    modifier="large">
                {{$t('l.copy.title')}}
                <div v-show="show" class="copy_btn">
                    {{$t('l.copy.txt')}}
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
                        'title': this.$t('l.prompt.title'),
                        'message': this.$t('l.error.password'),
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

<style scoped lang="less">
    .phrase_title{
        margin-top: 30px;text-align: center;font-size: 16px;font-weight: bold;color: #4d4d4d
    }
    .phrase_txt{
        margin: 30px auto;font-size: 14px;;color: #9c9c9c;width: 330px;text-align: justify;line-height: 18px
    }
    .phrase_div{
        height: 90px;width: 82%;background: #fff;margin: 16px auto;border-radius: 8px;
        padding: 3%;font-size: 16px;line-height: 24px;color: #4d4d4d;
    }
    .phrase_copy{
        width: 180px;margin: 0 auto;
        .copy{
            margin: 30px auto;position: relative;  overflow: initial;width: 160px;background:#009dde;
            .copy_btn{
                position: absolute;bottom: -70px;background: #000;opacity: 0.6;;color: #fff;height: 40px;
                width: 140px;font-size: 12px;line-height: 40px;border-radius: 5px;left: 50%;margin-left: -70px;
            }
        }
    }
</style>