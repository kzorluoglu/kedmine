<script>
import Timer from "./components/Timer.vue";
import {inject, toRefs} from "vue";

export default {
  components: {
    Timer
  },
  data(){
    return {
      user: '',
    }
  },

  methods: {
    // async handleClickSignIn(){
    // },
  },
};
</script>

<template>
  <Timer :ticketNumber="222"/>
  <Timer :ticketNumber="111"/>
  <Timer :ticketNumber="333"/>
  <Timer :ticketNumber="444"/>
  Test <b>TEst</b>
</template>

<style lang="less">
@import './assets/css/styles.less';
</style>
