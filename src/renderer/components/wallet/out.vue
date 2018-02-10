<template>
    <v-ons-page>
        <div class="zhs_head">
            <img src="../../assets/head.png" class="zhs_head"/>
            <div class="zhs_txt">
                发送 {{$store.state.pageText.model.txt}}
            </div>
            <div class="zhs_left" @click="$store.commit('pop')">
                <img src="../../assets/left.png"/>
            </div>
        </div>
        <v-ons-list class="out">
            <v-ons-list-item modifier="nodivider ">
                <div class="out_div out_div_txt">可用余额</div>
                <div class="out_div out_div_sum">
                    <span>{{$store.state.pageText.model.sum}}</span>
                </div>
            </v-ons-list-item>
        </v-ons-list>
        <v-ons-list class="out">
            <v-ons-list-item modifier="nodivider ">
                <div class="out_div out_div_txt">接收地址</div>
                <div class="out_div_input">
                    <input v-model="tx.to" placeholder="请输入转账地址"/>
                </div>
                <img v-if="$ons.platform.isWebView()" src="../../assets/scan.png" @click="scan"/>
            </v-ons-list-item>
        </v-ons-list>
        <v-ons-list class="out">
            <v-ons-list-item modifier="nodivider ">
                <div class="out_div out_div_txt">转账数量</div>
                <div class="out_div_input">
                    <input v-model="tx.count" placeholder="请输入转账数量"/>
                </div>
            </v-ons-list-item>
        </v-ons-list>
        <v-ons-list class="out">
            <v-ons-list-item modifier="nodivider ">
                <div class="out_div out_div_txt">消息</div>
                <div class="out_div_input">
                    <input v-model="tx.message" placeholder="请输入消息（可选）"/>
                </div>
            </v-ons-list-item>
        </v-ons-list>
        <v-ons-list class="out">
            <v-ons-list-item modifier="nodivider ">
                <div class="out_div out_div_txt">矿工费</div>
                <div class="out_div_input">
                    <input v-model="tx.fees" placeholder="请输入矿工费"/>
                </div>
            </v-ons-list-item>
        </v-ons-list>
        <div style="margin: 20px 10px">
            <ons-button class="button button--large" style="background: #ed3554" @click="save" modifier="large">
                确定发送
            </ons-button>
        </div>

        <v-ons-dialog cancelable :visible.sync="alertDialog1Visible">
            <p style="text-align: center">提示</p>
            <p style="text-align: center;font-size: 14px">
                正在发送...
            </p>
        </v-ons-dialog>
    </v-ons-page>
</template>

<script>
    export default {
        data() {
            return {
                tx: {
                    count: '',
                    fees: 1,
                    to: '',
                    message:''
                },
                alertDialog1Visible: false,

            }
        },
        methods: {
            save() {
                if ((parseFloat(this.tx.count)+parseFloat(this.tx.fees))>parseFloat(this.$store.state.pageText.model.sum)
                ||(parseFloat(this.tx.count)+parseFloat(this.tx.fees))<1) {
                    this.$ons.notification.alert({
                        'title': '提示',
                        'message': '请输入正确的金额'
                    })
                    return;
                }
                if (this.tx.count != '' && this.tx.to != '' && this.tx.fees != '') {
                    this.$g.wallet.getWallet(this)
                        .then(model => {
                            if (model.plaintext != '') {
                                let formData = new FormData();
                                formData.append("requestType", "sendMoney");
                                formData.append("publicKey", this.$store.state.pageText.model.publickey);
                                formData.append("recipient", this.tx.to);
                                formData.append("amountNQT", this.tx.count * 100000000);
                                formData.append("feeNQT", this.tx.fees * 100000000);
                                formData.append("deadline", 60);
                                if(this.tx.message.trim()!=''){
                                    formData.append("message", this.tx.message);
                                    formData.append("messageIsText",true);
                                }
                                this.alertDialog1Visible = true;
                                this.$http.post(this.$store.state.pageText.model.api + '/nxt', formData).then(v => {
                                    if (v.status == 200) {
                                        return this.$nxt.signTransactionBytes(v.data.unsignedTransactionBytes, model.plaintext);
                                    }
                                    else {
                                        this.alertDialog1Visible = false;
                                        this.$ons.notification.alert({
                                            'title': '提示',
                                            'message': '发送失败'
                                        })
                                    }
                                }).then(signedBytes => {
                                    let signed = new FormData();
                                    signed.append("requestType", "broadcastTransaction");
                                    signed.append("transactionBytes", signedBytes);
                                    this.$http.post(this.$store.state.pageText.model.api + '/nxt', signed).then(v => {
                                        this.alertDialog1Visible = false;
                                        let _this = this;
                                        this.$ons.notification.alert({
                                            'title': '提示',
                                            'message': '发送成功',
                                            'callback': function () {
                                                _this.$store.commit('pop');
                                            }
                                        })
                                    })
                                })
                            }
                        })
                        .catch(error => {
                            this.$ons.notification.alert({
                                'title': '提示',
                                'message': '发送失败'
                            })
                        })
                }
                else {
                    this.$ons.notification.alert({
                        'title': '提示',
                        'message': '请输入正确的内容'
                    })
                }

            },
            scan() {
                let _this = this;
                document.getElementById('ding').style.display = 'block';
                document.getElementById('ding_selected').style.display = 'none';
                var app = {
                    // Application Constructor
                    initialize: function () {
                        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
                    },
                    onDeviceReady: function () {
                        QRScanner.prepare(onDone); // show the prompt
                        function onDone(err, status) {
                            if (err) {
                                // here we can handle errors and clean up any loose ends.
                                console.error(err);
                            }
                            if (status.authorized) {
                                var callback = function (err, contents) {
                                    if (err) {
                                        console.error(err._message);
                                    }
                                    document.getElementById('app').style.display = 'block';
                                    _this.tx.to = contents;
                                    QRScanner.disableLight(function (err, status) {
                                        err && console.error(err);
                                        console.log(status);
                                    });
                                    QRScanner.hide(function(status){
                                        console.log(status);
                                    });
                                };

                                QRScanner.scan(callback);
                                QRScanner.show(function (status) {
                                    document.getElementById('ding').onclick = function () {
                                        QRScanner.enableLight(function (err, status) {
                                            err && console.error(err);
                                            document.getElementById('ding_selected').style.display = 'block'
                                            document.getElementById('ding').style.display = 'none'
                                        });
                                    };
                                    document.getElementById('scan_cancel').onclick = function () {
                                        QRScanner.disableLight(function (err, status) {
                                            err && console.error(err);
                                            console.log(status);
                                        });
                                        QRScanner.hide(function(status){
                                            console.log(status);
                                        });
                                        document.getElementById('app').style.display = 'block'
                                    }
                                    document.getElementById('ding_selected').onclick = function () {
                                        QRScanner.disableLight(function (err, status) {
                                            err && console.error(err);
                                            console.log(status);
                                        });
                                        document.getElementById('ding').style.display = 'block'
                                        document.getElementById('ding_selected').style.display = 'none'
                                    };
                                    document.getElementById('app').style.display = 'none'
                                });
                            } else if (status.denied) {
                                QRScanner.openSettings()
                            } else {
                                // we didn't get permission, but we didn't get permanently denied. (On
                                // Android, a denial isn't permanent unless the user checks the "Don't
                                // ask again" box.) We can ask again at the next relevant opportunity.
                            }
                        }
                    },
                };
                app.initialize();
            }
        },
        created: function () {
            if(this.$store.state.pageText.to!=''){
                this.tx.to=this.$store.state.pageText.to;
            }
        }
    }
</script>

<style scoped lang="less">
    .out {
        margin-top: 16px;
        background-image: none;
        position: relative;

        .out_div {
            float: right;
            font-size: 14px;
        }

        .out_div_txt {
            width: 60px
        }

        img {
            position: absolute;
            top: 8px;
            right: 20px;
            width: 26px;
        }

        .out_div_input {
            float: right;
            font-size: 14px;
            margin-left: 20px;
            word-break: break-all;
            word-wrap: break-word;
            width: 60%;
            margin-right: 40px;

            input {
                border: none
            }

        }
        .out_div_sum {
            margin-left: 20px;
            word-break: break-all;
            word-wrap: break-word;
            width: 70%;

            span {
                color: red
            }

        }
    }

    .select-input {
        font-size: 12px !important;
    }

    input {
        width: 100%;
    }
</style>
