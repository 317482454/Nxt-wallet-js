<template>
    <v-ons-page>
        <div class="zhs_head">
            <img src="../../assets/head.png" class="zhs_head"/>
            <div class="zhs_txt">
                {{$t('l.into.title')}} {{$store.state.pageText.model.txt}}
            </div>
            <div class="zhs_left" @click="$store.commit('pop')">
                <img src="../../assets/left.png"/>
            </div>
            <div class="copy zhs_right" :index="$store.state.pageText.model.publickey">公钥</div>
        </div>
        <div class="imgSrc">
            <img id="imgSrc"/>
        </div>
        <v-ons-list class="addr">
            <v-ons-list-item modifier="nodivider ">
                <div class="addr_txt">{{$t('l.into.addr')}} </div>
                <div class=" addr_val">
                    {{$store.state.pageText.model.address}}
                </div>
            </v-ons-list-item>

        </v-ons-list>
        <div class="addrCopy ">
            <ons-button class="button button--large copyBtn copy" :index="$store.state.pageText.model.address">
                {{$t('l.copy.title')}}{{$t('l.into.addr')}}
                <div v-show="copyShow">
                    {{$t('l.copy.txt')}}
                </div>
            </ons-button>
        </div>
    </v-ons-page>
</template>

<script>
    var QRCode = require('qrcode')
    import Clipboard from "clipboard"

    export default {
        data() {
            return {
                address: '',
                copyShow: false
            }
        },
        mounted: function () {
            QRCode.toDataURL(this.$store.state.pageText.model.address, {errorCorrectionLevel: 'H'}, function (err, url) {
                document.getElementById('imgSrc').src = url;
            })
        },
        created: function () {
            let _this = this;
            new Clipboard('.copy', {
                text: function (trigger) {
                    _this.copyShow = true;
                    setInterval(() => {
                        _this.copyShow = false;
                    }, 1000);
                    return trigger.getAttribute('index')
                }
            });
        }
    }
</script>

<style scoped lang="less">
    .imgSrc {
        text-align: center;
        margin-top: 40px;
        border-radius: 4px;
    }


    .addrCopy {
        width: 310px;
        margin: 30px auto;
        .copyBtn {
            background: #009dde;
            border-radius: 5px;
            position: relative;
            overflow: initial;
            div {
                position: absolute;
                bottom: -70px;
                background: #000;
                opacity: 0.6;;
                color: #fff;
                height: 40px;
                width: 140px;
                font-size: 12px;
                line-height: 40px;
                border-radius: 5px;
                left: 50%;
                margin-left: -70px;
            }
        }
    }

    .addr {
        margin-top: 40px;
        background-image: none;
        .addr_txt {
            float: right;
            font-size: 12px;
        }
        .addr_val {
            float: right;
            font-size: 12px;
            margin-left: 20px;
            word-break: break-all;
            word-wrap: break-word;
            width: 76%;
        }
    }
</style>
