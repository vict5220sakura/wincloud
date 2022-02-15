<template>
  <div>
    <div>
      <button @click="windows1">第一版Windows</button>
    </div>
    <div>
      <button @click="windows2">第二版Windows</button>
    </div>
  </div>
</template>

<script>
export default {
  methods:{
    windows1(){
      this.$router.push("/windows")
    },
    windows2(){
      this.$router.push("/windows2")
    }
  }
}
</script>

<style>

</style>