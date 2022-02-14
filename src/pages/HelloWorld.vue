<template>
  <div>
    <div>helloworld</div>
    <button @click="test1">点击</button>
  </div>
</template>

<script>
export default {
  methods:{
    test1(){
      this.$router.push("/Windows")
    }
  }
}
</script>

<style>

</style>