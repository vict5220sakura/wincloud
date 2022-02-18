import { fabric } from 'fabric'
import { ajaxPrefilter } from 'jquery';
import BlockType from './bean/BlockType.js'
import LinkBlock from "./bean/LinkBlock.js"
import XYUtil from '@/util/XYUtil.js'
import UrlUtil from "@/util/UrlUtil.js"
import WindowsData from './Windows2Data.js'
import Windows2Methods from './Windows2Methods.js'
import {saveKey} from '@/common/M.js'


export default {
    mixins: [WindowsData, Windows2Methods],
    
    created(){
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight;
    },
    async mounted(){
      this.createdMenu();
      this.cheatedLinkBlockMenu();

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

      // 右键事件
      document.getElementsByClassName("upper-canvas")[0].oncontextmenu = (e)=>{
        console.log("鼠标右键e=", e)
        
        let chooseObj = this.fabricChooseObj(e.offsetX, e.offsetY);

        if(chooseObj){
          console.log("选中对象", chooseObj)
          // 移除菜单
          this.canvasRemoveMenu();
          this.fabricRemoveBlockMenu();
          // 展示对象菜单
          this.fabricShowBlockMenu(chooseObj, e.offsetX, e.offsetY);
        }else{
          console.log("没有选中任何对象")
          // 展示菜单
          this.fabricShowMenu(e.offsetX, e.offsetY)
        }
        
        e.preventDefault(); // 取消右键事件
      };

      this.canvas.on('mouse:down', (options)=> {
        this.canvasRemoveMenu();
        this.fabricRemoveBlockMenu();
      });

      
      this.loginDialogFlag = true;
    }
}