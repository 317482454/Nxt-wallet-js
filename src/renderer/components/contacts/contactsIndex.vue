<template>
    <v-ons-page>
        <section>
            <div class="zhs_head" style="position: fixed;top:0">
                <img src="../../assets/head.png" class="zhs_head"/>
                <div class="zhs_txt">
                    {{$t('l.profile.contact')}}
                </div>
                <div class="zhs_left" @click="$store.commit('pop')">
                    <img src="../../assets/left.png"/>
                </div>
                <div v-if="!isOut" class="zhs_right" @click="push(create)">
                    <img class="addContacts" src="../../assets/addContacts.png"/>
                </div>
            </div>
            <div class="warp" v-if="$store.state.wallet.contacts">
                <div  class="list" @click="sheet(item,index)"
                      v-for="(item,index) in $store.state.wallet.contacts" >
                    <div class="div1">{{item.name}}</div>
                    <div class="div2">{{item.addr}}</div>
                    <div class="div2">{{$t('l.contacts.index.note')}}: {{item.note}}</div>
                </div>
            </div>
            <div v-if="model.name">
                <v-ons-action-sheet
                        :visible.sync="actionSheetVisible"
                        cancelable
                        :title="model.name">
                    <v-ons-action-sheet-button v-if="isOut" @click="out" icon="md-square-o">{{$t('l.contacts.index.payment')}}
                    </v-ons-action-sheet-button>
                    <v-ons-action-sheet-button v-if="!isOut" icon="md-square-o" @click="contactUpdate">{{$t('l.contacts.index.modify')}}
                    </v-ons-action-sheet-button>
                    <v-ons-action-sheet-button v-if="!isOut" icon="md-square-o" @click="contactSlice">{{$t('l.contacts.index.delete')}}
                    </v-ons-action-sheet-button>
                    <v-ons-action-sheet-button @click="actionSheetVisible=false" icon="md-square-o">{{$t('l.contacts.index.cancel')}}
                    </v-ons-action-sheet-button>
                </v-ons-action-sheet>
            </div>
        </section>
    </v-ons-page>
</template>

<script>
    export default {
        name: "contactsIndex",
        data() {
            return {
                create:require('@/components/contacts/create').default,
                update:require('@/components/contacts/update').default,
                actionSheetVisible:false,
                model:{},
                isOut:false
            };
        },
        methods: {
            push(page) {
                this.$store.commit('push', {page: page});
            },
            sheet(item, index) {
                item.index = index;
                this.model = item;
                this.actionSheetVisible = true;
            },
            contactSlice() {
                let _this = this;
                this.$ons.notification.confirm({
                    'title': this.$t('l.prompt.title'),
                    'message': this.$t('l.contacts.index.del') + _this.model.name,
                    'callback': function (ok) {
                        if (ok) {
                            _this.$store.state.wallet.contacts.splice(_this.model.index, 1)
                            _this.$store.commit('setWalletContact')
                        }
                        _this.actionSheetVisible = false;
                    }
                })
            },
            contactUpdate() {
                this.$store.commit('push', {page: this.update, txt: this.model});
                this.actionSheetVisible = false;
            },
            out() {
                this.$store.state.pageText.model.to =this.$g.wallet.addrReplace(
                    this.model.addr,this.$store.state.pageText.model.txt);
                this.$store.commit('pop');
            }
        },
        created: function () {
            if (this.$store.state.pageText&&this.$store.state.pageText.model && this.$store.state.pageText.model.push != '') {
                this.isOut = true;
            } else {
                this.isOut = false;
            }
        }
    }
</script>

<style scoped lang="less">
    .addContacts{
        width: 28px;margin-top: 16px;margin-left: 10px;
    }
    .warp{
        margin-top: 80px;
        .list{
            margin: 15px;background: #fff;box-shadow: 0 1px 2px rgba(0, 0, 0, .12);
            border-radius: 8px;padding: 10px 14px;
            .div1{
                font-size: 14px;
            }
            .div2{
                font-size: 12px;color: #bdbdbd;margin-top: 6px;
            }
        }
    }
</style>