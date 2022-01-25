<template>
  <div>helloworld</div>
  <button @click="test1">点击</button>
</template>

<script>
export default {
  methods:{
    test1(){
      this.$router.push("/list")
    }
  }
}
</script>

<style>

</style>