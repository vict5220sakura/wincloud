<template>
  <div id="d1">
    <canvas id="myCanvas" :width="windowWidth" :height="windowHeight" class="myCanvas"><p>您的系统不支持此程序!</p></canvas>
    <img id="myCanvasImg" src="/img/img0_3840x2160.jpg" :width="windowWidth" :height="windowHeight" calss="myCanvasImg">
  </div>
</template>

<script src="./Windows2.js">

</script>

<style>
  html,body{
      margin:0;
      padding:0;
      width: 100%;
      height: 100%;
      overflow-x: hidden;
      overflow-y: hidden;
  }
  #d1{
      width: 100%;
      height: 100%;
  }
  .myCanvas{
      position: absolute;
      top: 0;
      left: 0;
  }
  .myCanvasImg{
    position: absolute;
    top: 0;
    left: 0;
  }
</style>