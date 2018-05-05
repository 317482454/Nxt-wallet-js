<template>
    <v-ons-page>
        <section>
            <div class="zhs_head">
                <img src="../../assets/head.png" class="zhs_head"/>
                <div class="zhs_txt">
                    {{$t('l.profile.about')}}
                </div>
                <div class="zhs_left" @click="$store.commit('pop')">
                    <img src="../../assets/left.png"/>
                </div>
            </div>
            <div class="about">
                <div class="ico">
                    <img src="../../assets/ico.png" />
                </div>
                <v-ons-list class="index_list" >
                    <v-ons-list-item class="pr" >
                        {{$t('l.about.application')}} <div>{{$store.state.version}}</div>
                    </v-ons-list-item>
                    <v-ons-list-item @click="push(log)" tappable modifier="chevron">
                        {{$t('l.about.version')}}
                    </v-ons-list-item>
                    <a target="_blank" style="text-decoration:none" href="https://github.com/317482454/Nxt-wallet-js/issues">
                        <v-ons-list-item tappable modifier="chevron">
                            {{$t('l.about.feedback')}}
                        </v-ons-list-item>
                    </a>
                    <v-ons-list-item @click="update()" tappable >
                        {{$t('l.about.new')}}
                    </v-ons-list-item>
                </v-ons-list>
            </div>
        </section>
    </v-ons-page>
</template>

<script>
    export default {
        name: "about",
        data() {
            return {
                log:require('@/components/user/log').default
            }
        },
        methods: {
            push(page) {
                this.$store.commit('push', {page: page});
            },
            update(){
                this.$parent.$parent.$parent.$parent.update(1)
            }
        }
    }
</script>

<style scoped lang='less'>
    .about{
        .ico{
            text-align: center;margin-top: 16%;
            img{width: 120px}
        }
        .index_list{
            margin-top: 40px;
            .pr{
                position: relative;
                div{
                    position: absolute;top: 14px;right: 20px;
                }
            }
        }
    }
</style>