<template>
  <div>
    <van-loading size="24px" class="loading" v-if="loading"
      >加载中...</van-loading
    >
    <div v-else class="box" ></div>
  </div>
</template>
<script>
import { Loading } from "vant";
export default {
  data() {
    return {
      loading: false,
      formHtml: "",
    };
  },
  created() {
    // this.loading = true;
  },
  mounted() {
    // this.loading = false;

    this.formHtml = localStorage.getItem("formHtml");
    // var box = document.getElementsByClassName("box")[0];
       var box = document.getElementsByClassName("box")[0];
    box.innerHTML = this.formHtml
    document.forms[0].submit()
   
   
  },
  methods: {},
};
</script>
<style  scoped>
.loading {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.box{
    width: 100vw;
    height: 100vh;
}
</style>