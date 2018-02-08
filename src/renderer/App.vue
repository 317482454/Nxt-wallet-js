<template>
    <div style="height: 100%;">
        <v-ons-navigator id="app" swipeable
                         :page-stack="$store.state.pageStack"
                         @push-page="$store.state.pageStack.push($event)"
                         @prepop="list"
        ></v-ons-navigator>
        <div style="width: 100%;height: 100%;position: relative;background-color:rgba(0,0,0,0.2); ">
            <div class="zhs_head" style="background-color:rgba(0,0,0,0.4);">
                <div class="zhs_txt">
                    Scan QR Code
                </div>
                <div id="scan_cancel" class="zhs_left" style="text-indent: 10px">
                    Cancel
                </div>
            </div>
            <img src="./assets/scan.png"
                 style="position: absolute;width: 200px;height: 200px;top: 50%;margin-top: -120px;left: 50%;margin-left: -100px"/>
            <img src="./assets/ding.png" id="ding"
                 style="position: absolute;width: 50px;top: 50%;margin-top:120px;left: 50%;margin-left: -25px;"/>
            <img src="./assets/ding_selected.png" id="ding_selected"
                 style="display:none;position: absolute;width: 50px;top: 50%;margin-top:120px;left: 50%;margin-left: -25px;"/>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'app',
        methods: {
            list() {
                if (this.$store.state.wallet.list) {
                    let model = [];
                    this.$store.state.wallet.list.forEach((v, k) => {
                        this.$g.wallet.getAccount(this, v).then(sum => {
                            if (sum == 'errorCode') {
                                v.sum = 0;
                                v.is = false;
                                this.$store.commit('setWalletList2', model)
                            } else {
                                v.sum = sum;
                                v.is = true;
                                this.$store.commit('setWalletList2', model)
                            }
                        })
                        model.push(v);
                    })
                    this.ticker()
                }
            },
            ticker() {
                this.$http.get("http://97.64.126.168:3003/").then(v => {
                    let sum = 0;
                    this.$store.state.ticker = v.data;
                    this.$store.state.wallet.list.forEach(model => {
                        this.$store.state.ticker.forEach(item => {
                            if (model.txt == item.ticker.name) {
                                sum = sum + parseFloat(item.ticker.price_cny).toFixed(2) * model.sum;
                            }
                        })
                    })
                    this.$store.state.sum = sum.toFixed(2);
                })
            }
        },
        created: function () {
            this.list();
            setInterval(() => {
                this.list();
            }, 1000);
        }
    }
</script>

<style>
    .toolbar {
        position: relative;
    }

    body {
        background: none transparent;
    }

    .page__content {
        top: 0 !important;
    }
</style>
