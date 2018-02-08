<template>
    <v-ons-page>




    </v-ons-page>
</template>

<script>
    export default {
        data() {
            return {
                state: 'initial',
                ratio: 0
            };
        }
    };
</script>

<style>
    .pull-hook-spinner {
        color: #666;
        transition: transform .25s ease-in-out;
    }

    .pull-hook-progress {
        background-color: white;
        width: 32px;
        height: 32px;
        margin: 30px auto 0;
        border-radius: 100%;
        position: relative;
        box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
        display: inline-block;
        line-height: 0px;
    }

    .pull-hook-progress .progress-circular {
        width: 24px;
        height: 24px;
        position: absolute;
        top: 4px;
        left: 4px;
    }

    .pull-hook-progress .progress-circular__primary {
        transition: stroke-dashoffset 0s;
    }
</style>
