import { fabric } from 'fabric'
import { ajaxPrefilter } from 'jquery';
import BlockType from './bean/BlockType.js'
import LinkBlock from "./bean/LinkBlock.js"
import XYUtil from '@/util/XYUtil.js'

export default {
    data(){
      return {
        windowWidth: 1024,
        windowHeight: 768,
        canvas: null, // 画布对象
        menuBackground: null, // 右键菜单背景

        menuList: [], // 菜单列表

        allBlock: [], // 图标列表

        linkBlockMenuBackground: null, // 链接菜单右键
        linkBlockMenuList: [] // 链接菜单
      } 
    },
    methods:{
        // 初始化鼠标右键菜单
        createdMenu(){
          this.menuBackground = new fabric.Rect({width: 100, height: 75, fill: '#eeeeee' });
          this.menuBackground.hasControls = false; 
          this.menuBackground.hasBorders = false;
          this.menuBackground.selectable = false;
          this.menuAddLink();
          this.menuAddSave();
          this.menuAddClear();
        },
        /** 添加清空菜单 */
        menuAddClear(){
          const text = new fabric.Text('清空', {
            fontSize: 15,
            fill: '#141414',
            top: 5,
            left: 5
          })
          const background = new fabric.Rect({width: 100, height: 25, fill: '#eeeeee'});
          background.hasControls = false; 
          background.hasBorders = false;
          background.selectable = false;

          let menuItem = new fabric.Group([background, text], {})

          menuItem.hasControls = false; 
          menuItem.hasBorders = false;
          menuItem.selectable = false;
          menuItem.on('mouseover', (opts)=> {
            console.log('清空 悬停 opts=', opts);
            background.set("fill", '#ffffff')
            this.canvas.renderAll();
          });
          menuItem.on('mouseout', (opts)=> {
            background.set("fill", '#eeeeee')
            this.canvas.renderAll();
          });

          menuItem.on('mousedown', (opts)=> {
            console.log('清空 点击 opts=', opts);
            this.clear()
          });

          this.menuList.push(menuItem)
        },
        /** 添加保存菜单 */
        menuAddSave(){
          // 初始化新建连接菜单栏
          const text = new fabric.Text('保存', {
            fontSize: 15,
            fill: '#141414',
            top: 5,
            left: 5
          })
          const background = new fabric.Rect({width: 100, height: 25, fill: '#eeeeee'});
          background.hasControls = false; 
          background.hasBorders = false;
          background.selectable = false;

          let menuItem = new fabric.Group([background, text], {})

          menuItem.hasControls = false; 
          menuItem.hasBorders = false;
          menuItem.selectable = false;
          menuItem.on('mouseover', (opts)=> {
            console.log('保存 悬停 opts=', opts);
            background.set("fill", '#ffffff')
            this.canvas.renderAll();
          });
          menuItem.on('mouseout', (opts)=> {
            background.set("fill", '#eeeeee')
            this.canvas.renderAll();
          });

          menuItem.on('mousedown', (opts)=> {
            console.log('保存 点击 opts=', opts);
            this.save()
          });

          this.menuList.push(menuItem)
        },
        menuAddLink(){
          // 初始化新建连接菜单栏
          const addLinkText = new fabric.Text('新建连接', {
            fontSize: 15,
            fill: '#141414',
            top: 5,
            left: 5
          })
          const addLinkBackground = new fabric.Rect({width: 100, height: 25, fill: '#eeeeee'});
          addLinkBackground.hasControls = false; 
          addLinkBackground.hasBorders = false;
          addLinkBackground.selectable = false;

          let menuAddLink = new fabric.Group([addLinkBackground, addLinkText], {})

          menuAddLink.hasControls = false; 
          menuAddLink.hasBorders = false;
          menuAddLink.selectable = false;
          menuAddLink.on('mouseover', (opts)=> {
            console.log('新建连接 悬停 opts=', opts);
            addLinkBackground.set("fill", '#ffffff')
            this.canvas.renderAll();
          });
          menuAddLink.on('mouseout', (opts)=> {
            addLinkBackground.set("fill", '#eeeeee')
            this.canvas.renderAll();
          });

          menuAddLink.on('mousedown', (opts)=> {
            console.log('新建连接 点击 opts=', opts);
            this.addLink()
          });

          this.menuList.push(menuAddLink)
        },
        /** 添加连接图标 */
        addLink(){
          this.$prompt('请输入连接地址', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then((urlInputData) => {
            let urlInput = urlInputData.value;
            this.$prompt('请输入标签名称', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消'
            }).then((nameInputData) => {
              let nameInput = nameInputData.value

              let linkBlock = new LinkBlock();
              linkBlock.url = urlInput
              linkBlock.name = nameInput;

              this.addLinkBlock(linkBlock);

              
            })
          }).catch(() => {});
        },
        addLinkBlock(linkBlock){
          let urlBlockText = new fabric.Textbox(linkBlock.name, {
            fontFamily: "Inconsolata",
            width: 60,
            top: 10,
            left: 5,
            fontSize: 15,
            lineHeight: 1,
            textAlign: "left", // 文字对齐
            lockRotation: true, // 禁止旋转
            lockScalingY: true, // 禁止Y轴伸缩
            lockScalingFlip: true, // 禁止负值反转
            splitByGrapheme: true, // 拆分中文，可以实现自动换行
            objectCaching: false,
          });

          let urlBlockbackground = new fabric.Rect({
            width: 70, 
            height: 70, 
            fill: '#eeeeee'
          });
          urlBlockbackground.hasControls = false; 
          urlBlockbackground.hasBorders = false;

          let urlBlock = new fabric.Group([urlBlockbackground, urlBlockText], {})
          urlBlock.hasControls = false; 
          urlBlock.hasBorders = false;

          urlBlock.set("top", linkBlock.top || 0)
          urlBlock.set("left", linkBlock.left || 0)
          
          urlBlock.set("block", linkBlock)

          this.allBlock.push(urlBlock);
          this.canvas.add(urlBlock);
          // 添加点击跳转事件
          urlBlock.on("mouseup", (opts)=>{
            console.log("连接点击", opts)
            let now = new Date().getTime();
            let oldTime = opts.target.time;
            opts.target.time = now;
            
            if(oldTime){
              if(now - oldTime < 500){
                // 双击
                let url = opts.target.block.url
                if(new RegExp("http.*").test(url)){
                  window.open(url)
                }else{
                  window.open("http://" + url)
                }
              }else{
                // 单击
                this.save();
              }
            }else{
              // 单击
              this.save();
            }
          })
          this.save();
        },
        save(){
          console.log("保存this.allBlock=", this.allBlock)
          let allBlock = [];
          for(let item of this.allBlock){
            let block = item.block
            block.top = item.top
            block.left = item.left
            allBlock.push(block)
          }

          let jsonarr = JSON.stringify(allBlock);
          console.log("保存jsonarr=", jsonarr)
          localStorage.setItem("canvasJsonnnjnjnj", jsonarr)

          // let canvasJson = JSON.stringify(this.canvas);
          // console.log("保存json=", canvasJson)
          // localStorage.setItem("canvasJsonnnjnjnj", canvasJson)
        },
        load(){
          let jsonarrStr = localStorage.getItem("canvasJsonnnjnjnj");
          console.log("读取jsonarrStr=", jsonarrStr)
          let jsonarr = jsonarrStr && JSON.parse(jsonarrStr) || []
          console.log("读取jsonarr=", jsonarr)
          for(let block of jsonarr){
            if(block.blockType == BlockType.type_link){
              this.addLinkBlock(block)
            }
          }
        },
        clear(){
          localStorage.removeItem("canvasJsonnnjnjnj")
          location.reload();
        },
        /** 选取一个对象 */
        fabricChooseObj(x, y){
          let chooseObj = null;
          for(let obj of this.canvas.getObjects()){
            // console.log("选中了一个对象", obj)
            // let x = e.offsetX
            // let y = e.offsetY
            if(XYUtil.checkPointIn(x, y, obj.left, obj.top, obj.width, obj.height)){
              chooseObj = obj
              continue;
            }
          }
          return chooseObj;
        },
        /** 选取多个对象 */
        fabricChooseObjs(x, y){
          let objs = []

          for(let obj of this.canvas.getObjects()){
            if(XYUtil.checkPointIn(x, y, obj.left, obj.top, obj.width, obj.height)){
              objs.push(obj)
            }
          }
          return objs;
        },
        /**展示菜单 */
        fabricShowMenu(x, y){
          this.canvas.discardActiveObject(); // 取消所有对象选中状态
          this.canvasRemoveMenu();
          this.fabricRemoveBlockMenu();
          this.menuBackground.top = y
          this.menuBackground.left = x
          
          this.canvas.add(this.menuBackground);
          let topIndex = 0
          for(let menuItem of this.menuList){
            menuItem.top = y + (menuItem.height * topIndex)
            menuItem.left = x
            this.canvas.add(menuItem);
            topIndex++;
          }
        },
        /** 视图移除菜单 */
        canvasRemoveMenu(){
          // console.log('mouse:down', options);
          this.canvas.remove(this.menuBackground);
          
          for(let menuItem of this.menuList){
            this.canvas.remove(menuItem);
          }
        },
        /** 视图展示菜单 */
        fabricShowBlockMenu(chooseObj, x, y){
          let block = chooseObj.block
          if(block.blockType == BlockType.type_link){
            this.fabricShowLinkBlockMenu(chooseObj, block, x, y)
          }
        },
        /** 创建链接菜单 */
        cheatedLinkBlockMenu(){
          this.linkBlockMenuBackground = new fabric.Rect({width: 100, height: 25, fill: '#eeeeee' });
          this.linkBlockMenuBackground.hasControls = false; 
          this.linkBlockMenuBackground.hasBorders = false;
          this.linkBlockMenuBackground.selectable = false;

          // 初始化新建连接菜单栏
          let itemText = new fabric.Text('删除', {
            fontSize: 15,
            fill: '#141414',
            top: 5,
            left: 5
          })

          let itemBackground = new fabric.Rect({width: 100, height: 25, fill: '#eeeeee'});
          itemBackground.hasControls = false; 
          itemBackground.hasBorders = false;
          itemBackground.selectable = false;

          let item = new fabric.Group([itemBackground, itemText], {})
          item.hasControls = false; 
          item.hasBorders = false;
          item.selectable = false;
          item.on('mouseover', (opts)=> {
            itemBackground.set("fill", '#ffffff')
            this.canvas.renderAll();
          });
          item.on('mouseout', (opts)=> {
            itemBackground.set("fill", '#eeeeee')
            this.canvas.renderAll();
          });
          item.on('mousedown', (opts)=> {
            console.log("选中删除", opts)
            let objs = this.fabricChooseObjs(opts.pointer.x, opts.pointer.y)
            for(let obj of objs){
              if(obj.block.blockType == BlockType.type_link){
                this.fabricRemoveBlock(obj)
                break
              }
            }
          });

          this.linkBlockMenuList.push(item)
        },
        /** 视图展示链接菜单 */
        fabricShowLinkBlockMenu(chooseObj, block, x, y){
          this.linkBlockMenuBackground.top = y
          this.linkBlockMenuBackground.left = x
          
          this.canvas.discardActiveObject(); // 取消所有对象选中状态
          this.canvasRemoveMenu(); // 取消菜单显示
          this.fabricRemoveBlockMenu(); // 取消菜单显示
          
          this.canvas.add(this.linkBlockMenuBackground);
          let topIndex = 0
          for(let menuItem of this.linkBlockMenuList){
            menuItem.top = y + (menuItem.height * topIndex)
            menuItem.left = x
            this.canvas.add(menuItem);
            topIndex++;
          }
        },
        /** 视图移除菜单 */
        fabricRemoveBlockMenu(){
          this.fabricRemoveLinkBlockMenu();
        },
        /** 视图移除链接菜单 */
        fabricRemoveLinkBlockMenu(){
          this.canvas.remove(this.linkBlockMenuBackground);
          for(let menuItem of this.linkBlockMenuList){
            this.canvas.remove(menuItem);
          }
        },
        /** 移除一个图标 */
        fabricRemoveBlock(obj){
          this.canvas.remove(obj)
          for(let i = 0 ; i < this.allBlock.length ; i++){
            console.log("删除log", this.allBlock[i].block, obj.block)
            if(this.allBlock[i].block == obj.block){
              this.allBlock.splice(i, 1)
              break;
            }
          }
        }
    },
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

      this.load();
    }
}