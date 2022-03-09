import { fabric } from 'fabric'
import { ajaxPrefilter } from 'jquery';
import BlockType from './bean/BlockType.js'
import LinkBlock from "./bean/LinkBlock.js"
import XYUtil from '@/util/XYUtil.js'
import UrlUtil from "@/util/UrlUtil.js"
import WindowsData from './Windows2Data.js'
import {saveKey} from '@/common/M.js'
import Windows2Methods from './Windows2Methods.js'
import Table from './bean/Table.js'


export default {
    mixins: [WindowsData, Windows2Methods],
    
    created(){
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight;
    },//
    async mounted(){
      // 创建画布
      this.canvas = new fabric.Canvas("myCanvas")
      this.canvas.selection = false; // 禁止画布滑动选中
      this.canvas.hoverCursor = 'default' // 鼠标样式
      this.canvas.moveCursor = 'default' // 鼠标样式

      // 设置背景图片
      fabric.Image.fromURL('/img/img0_3840x2160.jpg', (oImg)=>{
        oImg.set({
          scaleX: this.windowWidth / oImg.width,
          scaleY: this.windowHeight / oImg.height
        })
        this.canvas.setBackgroundImage(oImg);
        this.canvas.renderAll();
      });

      this.tableRightMenuInit(); // 桌面右键菜单初始化
      this.linkBlockMenuInit(); // 链接菜单初始化
      this.nodepadBlockMenuInit(); // 记事本菜单初始化

      // 右键事件注册
      this.rightClickRegist();

      // 左键事件注册
      this.leftClickRegist();

      // 登录弹窗默认显示
      this.loginDialogFlag = true;
    }
}