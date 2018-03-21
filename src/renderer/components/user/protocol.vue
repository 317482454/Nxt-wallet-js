<template>
    <v-ons-page>
        <div class="zhs_head">
            <img src="../../assets/head.png" class="zhs_head"/>
            <div class="zhs_txt">
                {{$t('l.protocol.title')}}
            </div>
            <div class="zhs_left" @click="$store.commit('pop')">
                <img src="../../assets/left.png"/>
            </div>
        </div>
        <div style="font-size: 14px;margin: 10px">
            {{$t('l.protocol.txt')}}
            <ul>
                <li style="font-size: 12px" v-for="item in $t('l.protocol.list')">
                    {{item}}
                </li>
            </ul>
        </div>

    </v-ons-page>
</template>

<script>
    export default {
        name: "protocol"
    }
</script>

<style scoped>

</style>