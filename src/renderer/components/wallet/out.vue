<template>
    <v-ons-page @show="show">
        <div class="zhs_head">
            <img src="../../assets/head.png" class="zhs_head"/>
            <div class="zhs_txt">
                {{$t('l.out.title')}} {{$store.state.pageText.model.txt}}
            </div>
            <div class="zhs_left" @click="pop">
                <img src="../../assets/left.png"/>
            </div>
            <div class="zhs_right">
                <img v-if="$ons.platform.isWebView()" src="../../assets/scan1.png" class="scan" @click="scan"/>
            </div>
        </div>
        <v-ons-list class="out">
            <v-ons-list-item modifier="nodivider ">
                <div class="out_div out_div_txt">{{$t('l.out.sum')}}</div>
                <div class="out_div out_div_sum">
                    <span>{{$store.state.pageText.model.sum}}</span>
                </div>
            </v-ons-list-item>
        </v-ons-list>
        <v-ons-list class="out">
            <v-ons-list-item modifier="nodivider ">
                <div class="out_div out_div_txt">{{$t('l.out.to')}}</div>
                <div class="out_div_input">
                    <input v-model="tx.to" :placeholder="$t('l.out.please')+$t('l.out.to')"/>
                </div>
                <img @click="push" src="../../assets/select.png" />
            </v-ons-list-item>
        </v-ons-list>
        <v-ons-list class="out">
            <v-ons-list-item modifier="nodivider ">
                <div class="out_div out_div_txt">{{$t('l.out.count')}}</div>
                <div class="out_div_input">
                    <input v-model="tx.count" :placeholder="$t('l.out.please')+$t('l.out.count')"/>
                </div>
            </v-ons-list-item>
        </v-ons-list>
        <v-ons-list class="out">
            <v-ons-list-item modifier="nodivider ">
                <div class="out_div out_div_txt">{{$t('l.out.message')}}</div>
                <div class="out_div_input">
                    <input v-model="tx.message" :placeholder="$t('l.out.please')+$t('l.out.message')"/>
                </div>
            </v-ons-list-item>
        </v-ons-list>
        <v-ons-list class="out">
            <v-ons-list-item modifier="nodivider ">
                <div class="out_div out_div_txt">{{$t('l.out.fees')}}</div>
                <div class="out_div_input">
                    <input v-model="tx.fees" :placeholder="$t('l.out.please')+$t('l.out.fees')"/>
                </div>
            </v-ons-list-item>
        </v-ons-list>
        <div style="margin: 20px 10px">
            <ons-button class="button button--large" style="background: #ed3554" @click="save" modifier="large">
                {{$t('l.out.btn')}}
            </ons-button>
        </div>

        <v-ons-dialog cancelable :visible.sync="alertDialog1Visible">
            <p style="text-align: center">{{$t('l.prompt.title')}}</p>
            <p style="text-align: center;font-size: 14px">
                {{$t('l.prompt.send')}}
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
                contacts: require('@/components/contacts/contactsIndex').default,
            }
        },
        methods: {
            save() {
                if ((parseFloat(this.tx.count)+parseFloat(this.tx.fees))>parseFloat(this.$store.state.pageText.model.sum)
                ||(parseFloat(this.tx.count)+parseFloat(this.tx.fees))<1) {
                    this.$ons.notification.alert({
                        'title':  this.$t('l.prompt.title'),
                        'message': this.$t('l.error.amount')
                    })
                    return;
                }
                if (this.tx.count != '' && this.tx.to != '' && this.tx.fees != '') {
                    if(this.$store.state.pageText.model.publickey!='') {
                        this.$g.wallet.getWallet(this)
                            .then(model => {
                                if (model.plaintext != '') {
                                    this.sendCoin(model.plaintext,this.$store.state.pageText.model.publickey)
                                }
                            })
                            .catch(error => {
                                this.$ons.notification.alert({
                                    'title': this.$t('l.prompt.title'),
                                    'message': this.$t('l.error.sent')
                                })
                            })
                    }else{
                        let _this=this;
                        this.$ons.notification.prompt({
                            'inputType':'password',
                            'title': this.$t('l.prompt.title'),
                            'message': this.$t('l.prompt.phrase'),
                            'callback': function (phrase) {
                                if(phrase!=''){
                                    let publickey=_this.$nxt.secretPhraseToPublicKey(phrase)
                                    let addr=_this.$nxt.publicKeyToAccountId(publickey,false).split('-');
                                    addr.splice(0,1)
                                    let addr2=_this.$store.state.pageText.model.address.split('-')
                                    addr2.splice(0,1)
                                    if(addr.toString()==addr2.toString()){
                                        _this.sendCoin(phrase,publickey)
                                    }else{
                                        _this.$ons.notification.alert({
                                            title: this.$t('l.prompt.title'),
                                            message: this.$t('l.error.phrase'),
                                            buttonLabels:_this.$t('l.prompt.buttonLabels')[1],
                                        })
                                    }
                                }
                            }
                        });
                    }
                }
                else {
                    this.$ons.notification.alert({
                        'title':  this.$t('l.prompt.title'),
                        'message': this.$t('l.error.message')
                    })
                }
            },
            sendCoin(plaintext,publickey){
                let formData = new FormData();
                formData.append("requestType", "sendMoney");
                formData.append("publicKey", publickey);
                formData.append("recipient", this.tx.to);
                formData.append("amountNQT", this.tx.count * 100000000);
                formData.append("feeNQT", this.tx.fees * 100000000);
                if(this.$store.state.pageText.model.chainId){
                    formData.append("chain", this.$store.state.pageText.model.chainId);
                    formData.append("deadline", 15);
                }else{
                    formData.append("deadline", 60);
                }
                if(this.tx.message.trim()!=''){
                    formData.append("message", this.tx.message);
                    if(this.$store.state.pageText.model.chainId){
                        formData.append("messageIsText",true);
                        formData.append("messageIsPrunable",true);
                        formData.append("referencedTransaction",'');

                    }
                }
                this.alertDialog1Visible = true;
                this.$http.post(this.$store.state.pageText.model.api + '/'+this.$store.state.pageText.model.apikey, formData).then(v => {
                    if (v.status == 200) {
                        if(this.$store.state.pageText.model.chainId) {
                            return {
                                prunableAttachmentJSON:v.data.transactionJSON.attachment,
                                transactionBytes:this.$ardor.signTransactionBytes(v.data.unsignedTransactionBytes, plaintext)
                            };
                        }else{
                            return this.$nxt.signTransactionBytes(v.data.unsignedTransactionBytes, plaintext);
                        }
                    }
                    else {
                        this.alertDialog1Visible = false;
                        this.$ons.notification.alert({
                            'title': this.$t('l.prompt.title'),
                            'message':  this.$t('l.error.sent')
                        })
                    }
                }).then(model => {
                    let signed = new FormData();
                    signed.append("requestType", "broadcastTransaction");

                    if(this.$store.state.pageText.model.chainId) {
                        signed.append("transactionBytes", model.transactionBytes);
                        signed.append("prunableAttachmentJSON", JSON.stringify(model.prunableAttachmentJSON));
                    }else{
                        signed.append("transactionBytes", model);
                    }
                    this.$http.post(this.$store.state.pageText.model.api + '/'+this.$store.state.pageText.model.apikey, signed).then(v => {
                        this.alertDialog1Visible = false;
                        let _this = this;
                        if(v.data.error){
                            this.$ons.notification.alert({
                                'title': this.$t('l.prompt.title'),
                                'message': v.data.errorDescription,
                            })
                        }else{
                            this.$ons.notification.alert({
                                'title': this.$t('l.prompt.title'),
                                'message': this.$t('l.prompt.sent'),
                                'callback': function () {
                                    _this.$store.commit('pop');
                                }
                            })
                        }

                    }).
                    catch(error => {
                        this.alertDialog1Visible = false;
                        this.$ons.notification.alert({
                            'title': this.$t('l.prompt.title'),
                            'message': this.$t('l.error.sent')
                        })
                    })
                }) .catch(error => {
                    this.alertDialog1Visible = false;
                    this.$ons.notification.alert({
                        'title': this.$t('l.prompt.title'),
                        'message': this.$t('l.error.sent')
                    })
                })
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
            },
            push(){
                this.$store.state.pageText.model.push = 'out';
                this.$store.commit('push', {page: this.contacts});
            },
            pop(){
                this.$store.state.pageText=''
                this.$store.commit('pop')
            },
            show(){
                if (this.$store.state.pageText.model.to) {
                    this.tx.to = this.$store.state.pageText.model.to;
                }
            },
        },
        created: function () {
            if(this.$store.state.pageText.to!=''){
                this.tx.to=this.$store.state.pageText.to;
            }
        }
    }
</script>

<style scoped lang="less">
    .scan{
        width: 28px;margin-top: 16px;margin-left: 10px;
    }
    .out {
        margin-top: 16px;
        background-image: none;
        position: relative;

        .out_div {
            float: right;
            font-size: 14px;
        }

        .out_div_txt {
            width: 72px
        }

        img {
            position: absolute;
            top: 10px;
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
