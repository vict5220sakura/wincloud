<template>
  <div id="d1">
    <canvas id="myCanvas" :width="windowWidth" :height="windowHeight" class="myCanvas"><p>您的系统不支持此程序!</p></canvas>
    <img id="myCanvasImg" src="/img/img0_3840x2160.jpg" :width="windowWidth" :height="windowHeight" calss="myCanvasImg">

    <el-dialog width="400px" title="注册登录" v-model="loginDialogFlag" :close-on-click-modal="false" :show-close="false">
      <el-form ref="loginForm" :rules="rules">
        <el-form-item label="用户名" label-width="70px" prop="username">
          <el-input v-model="username" style="width: 230px"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="70px" prop="password">
          <el-input v-model="password" type="password" style="width: 230px"></el-input>
        </el-form-item>
      </el-form>
      <div class="row main-center">
        <div style="margin-right: 50px"><el-button style="width:117px" @click="btnLocalLogin">本地使用</el-button></div>
        <div><el-button type="primary" style="width:117px" @click="btnLogin">注 册 / 登 录</el-button></div>
      </div>
    </el-dialog>

  </div>
</template>

<script src="./Windows2.js"></script>

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
  .row{
    display: flex;
    flex-direction: row;
  }
  .column{
    display: flex;
    flex-direction: column;
  }
  .main-center{
    justify-content:center
  }
  .main-end{
    justify-content:end
  }
  .main-around{
    justify-content:space-around;
  }
  .second-center{
    align-items:center
  }
  .second-end{
    align-items:end
  }
  
</style>