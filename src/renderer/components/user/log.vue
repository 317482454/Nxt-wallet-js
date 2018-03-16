<template>
    <v-ons-page>
        <section style="min-height: 100%;background: #fff" >
            <div class="zhs_head">
                <img src="../../assets/head.png" class="zhs_head"/>
                <div class="zhs_txt">
                    {{$t('l.about.version')}}
                </div>
                <div class="zhs_left" @click="$store.commit('pop')">
                    <img src="../../assets/left.png"/>
                </div>
            </div>
            <div class="log">
                <div v-for="item in list" class="div_warp">
                    <div>
                        {{item.model.version}}
                    </div>
                    <ul>
                        <li v-for="txt in item.txt">
                            {{txt}}
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    </v-ons-page>
</template>

<script>
    export default {
        name: "log",
        data(){
            return{
                list:[]
            }
        },
        created: function () {
            this.$http.get(this.$store.state.url+'/log').then(v => {
                if(v.data.log){
                    v.data.log.forEach(item=>{
                        if(this.$store.state.lang=='zh-CN'){
                            item.txt=item.model.zh
                        }else{
                            item.txt=item.model.en
                        }
                    })
                    console.log(v.data.log);
                    this.list=v.data.log;
                }
            });
        }
    }
</script>

<style scoped lang="less">
    .log{
        padding-bottom: 40px;
        .div_warp{
            margin-left: 20px;margin-top: 20px;
            div{font-size: 18px}
            ul{font-size: 14px;color: #686868}
        }
    }
</style>