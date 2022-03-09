import { fabric } from 'fabric'
import { ajaxPrefilter } from 'jquery';
import BlockType from './bean/BlockType.js'
import LinkBlock from "./bean/LinkBlock.js"
import XYUtil from '@/util/XYUtil.js'
import UrlUtil from "@/util/UrlUtil.js"
import { saveKey } from '@/common/M.js'
import LoginService from '@/service/LoginService.js'
import WinDataService from '@/service/WinDataService.js'
import Windows2MethonsRules from './Windows2MethonsRules.js'
import TableRightMenuDownMethods from './TableRightMenuDownMethods.js'
import RightInit from './RightInit.js'
import LeftInit from './LeftInit.js'
import TableRightMenu from './TableRightMenu.js'
import LinkRightMenu from './LinkRightMenu.js'
import { login_mode } from '@/common/M.js'
import Table from "./bean/Table";

export default {
    methods:{
        ...LeftInit, // 左键初始化
        ...RightInit, // 右键初始化
        ...TableRightMenu, // 桌面右键菜单
        ...LinkRightMenu, // 链接右键菜单
        ...Windows2MethonsRules,
        ...TableRightMenuDownMethods,
        /** 自动保存提示 */
        autoSaveNotify(){
            this.notify("自动保存成功", "success")
        },
        notify(str, type){
            if(type == 'success'){
                this.$notify({
                    message: '<i class="el-icon-success" style="color: green; margin-right: 6px"></i><span style="padding-botton: 4px">' + str + '</span>',
                    dangerouslyUseHTMLString: true,
                    showClose: false,
                    duration: 1000,
                    customClass: "autoSaveNotifyClass"
                });
            }else if(type == 'error'){
                this.$notify({
                    message: '<i class="el-icon-error" style="color: red; margin-right: 6px"></i><span style="padding-botton: 4px">' + str + '</span>',
                    dangerouslyUseHTMLString: true,
                    showClose: false,
                    duration: 1000,
                    customClass: "autoSaveNotifyClass"
                });
            }

        },
        /** 添加一个链接图标 */
        async addLinkBlock(linkBlock) {
            // 先添加一个默认背景的图标
            let urlBlockText = new fabric.Textbox(linkBlock.name, {
                fontFamily: "Inconsolata",
                width: 60,
                top: 70 + 10,
                left: 5,
                fontSize: 15,
                lineHeight: 1,
                textAlign: "center", // 文字对齐
                lockRotation: true, // 禁止旋转
                lockScalingY: true, // 禁止Y轴伸缩
                lockScalingFlip: true, // 禁止负值反转
                splitByGrapheme: true, // 拆分中文，可以实现自动换行
                objectCaching: false,
            });
    
            // 设置背景图片
            let urlBlockbackground = new fabric.Rect({
                width: 70,
                height: 70,
                fill: '#eeeeee'
            });
            await new Promise((r)=>{
                fabric.Image.fromURL('/img/chrome.png', (oImg) => {
                    urlBlockbackground = oImg
                    r()
                })
            })
            
    
            urlBlockbackground.set("scaleX", 70 / urlBlockbackground.width)
            urlBlockbackground.set("scaleY", 70 / urlBlockbackground.height)
    
    
            urlBlockbackground.hasControls = false;
            urlBlockbackground.hasBorders = false;
    
            let urlBlock = new fabric.Group([urlBlockbackground, urlBlockText])
            urlBlock.addWithUpdate()
            
            urlBlock.hasControls = false;
            urlBlock.hasBorders = false;
    
            urlBlock.set("left", linkBlock.left || 0)
            urlBlock.set("top", linkBlock.top || 0)
            urlBlock.set("block", linkBlock)
            
            await this.allBlock.push(urlBlock);
            await this.canvas.add(urlBlock);

            this.canvas.renderAll();

            // 添加点击跳转事件
            urlBlock.on("mouseup", async (opts) => {
                console.log("连接点击", urlBlock)
                let now = new Date().getTime();
                let oldTime = opts.target.time;
                opts.target.time = now;
    
                if (oldTime) {
                    if (now - oldTime < 500) {
                        // 双击
                        let url = opts.target.block.url
                        if (new RegExp("http.*").test(url)) {
                            window.open(url)
                        } else {
                            window.open("http://" + url)
                        }
                    } else {
                        // 单击
                        this.blockAutoArrange();
                        await this.save();
                        this.autoSaveNotify();
                    }
                } else {
                    // 单击
                    this.blockAutoArrange();
                    await this.save();
                    this.autoSaveNotify();
                }
            })
            // 懒加载图标
            fabric.Image.fromURL(UrlUtil.getLogoUrl(linkBlock.url), (oImgNew) => {
                if (oImgNew.width == 0) {
                    
                } else {
                    let urlBlockbackgroundNew = oImgNew
                    urlBlockbackgroundNew.set("scaleX", 70 / urlBlockbackgroundNew.width)
                    urlBlockbackgroundNew.set("scaleY", 70 / urlBlockbackgroundNew.height)
                    urlBlockbackgroundNew.hasControls = false;
                    urlBlockbackgroundNew.hasBorders = false;
                    
                    let urlBlockTextNew = new fabric.Textbox(linkBlock.name, {
                        fontFamily: "Inconsolata",
                        width: 60,
                        top: 70 + 10,
                        left: 5,
                        fontSize: 15,
                        lineHeight: 1,
                        textAlign: "center", // 文字对齐
                        lockRotation: true, // 禁止旋转
                        lockScalingY: true, // 禁止Y轴伸缩
                        lockScalingFlip: true, // 禁止负值反转
                        splitByGrapheme: true, // 拆分中文，可以实现自动换行
                        objectCaching: false,
                    });
                    
                    let top = urlBlock.top
                    let left = urlBlock.left
                    urlBlock.remove(urlBlockText)
                    urlBlock.remove(urlBlockbackground)

                    urlBlock.addWithUpdate(urlBlockbackgroundNew)
                    urlBlock.addWithUpdate(urlBlockTextNew)
                    urlBlock.set("left", left || 0)
                    urlBlock.set("top", top || 0)
                    urlBlock.set("block", linkBlock)
                    urlBlock.addWithUpdate()
                    urlBlock.set("block", linkBlock)

                    this.canvas.renderAll();
                }
            });
        },
        /** 保存 */
        async save() {
            let allBlock = [];
            for (let item of this.allBlock) {
                let block = item.block
                block.top = item.top
                block.left = item.left
                allBlock.push(block)
            }
    
            let jsonarrStr = JSON.stringify(allBlock);
    
            if(this.loginMode == login_mode.login_mode_local){
                localStorage.setItem(saveKey, jsonarrStr)
            }else if(this.loginMode == login_mode.login_mode_serve){
                let res = await WinDataService.saveWinData(this.username, this.password, jsonarrStr)
                if(!res || res.code != "00000"){
                    throw "未知异常"
                }
            }
        },
        /** 加载 */
        async load() {
            if(this.loginMode == login_mode.login_mode_local){ // 本地登录加载
                let jsonarrStr = localStorage.getItem(saveKey);
                let jsonarr = jsonarrStr && JSON.parse(jsonarrStr) || []
                for (let block of jsonarr) {
                    if (block.blockType == BlockType.type_link) {
                        await this.addLinkBlock(block)
                    }
                }
            }else if(this.loginMode == login_mode.login_mode_serve){
                let jsonarr = this.winDataStr && JSON.parse(this.winDataStr) || []
                for (let block of jsonarr) {
                    if (block.blockType == BlockType.type_link) {
                        await this.addLinkBlock(block)
                    }
                }
            }
        },
        /** 选取一个对象 */
        fabricChooseObj(x, y) {
            let chooseObj = null;
            for (let obj of this.canvas.getObjects()) {
                // console.log("选中了一个对象", obj)
                // let x = e.offsetX
                // let y = e.offsetY
                if (XYUtil.checkPointIn(x, y, obj.left, obj.top, obj.width, obj.height)) {
                    chooseObj = obj
                    continue;
                }
            }
            return chooseObj;
        },
        /** 选取多个对象 */
        fabricChooseObjs(x, y) {
            let objs = []
    
            for (let obj of this.canvas.getObjects()) {
                if (XYUtil.checkPointIn(x, y, obj.left, obj.top, obj.width, obj.height)) {
                    objs.push(obj)
                }
            }
            return objs;
        },
        
        /** 视图展示菜单 */
        fabricShowBlockMenu(chooseObj, x, y) {
            let block = chooseObj.block
            if(block){ // 存在实体
                if (block.blockType == BlockType.type_link) {
                    this.linkBlockShowMenu(chooseObj, block, x, y)
                }
            }
        },

        /** 移除全部图标 */
        removeAllBlock(){
            for (let obj of this.allBlock) {
                this.canvas.remove(obj)
            }
            this.allBlock = []
        },
        /** 移除一个图标 */
        removOneBlock(canvasObj) {
            this.canvas.remove(canvasObj)
            for (let i = 0; i < this.allBlock.length; i++) {
                console.log("删除log", this.allBlock[i].block, canvasObj.block)
                if (this.allBlock[i].block == canvasObj.block) {
                    this.allBlock.splice(i, 1)
                    break;
                }
            }
        },
        
        /**
         * 注册登录按钮点击
         */
        async btnLogin() {
            this.$refs["loginForm"].validateField("username")
            this.$refs["loginForm"].validateField("password")
            if(!this.checkUsername().b || !this.checkPassword().b){
                return false;
            }
            
            let res = await LoginService.registLogin(this.username, this.password);
            if(res.code == '00000'){
                this.$message({
                    type: 'success',
                    message: (res.data.registLoginMode == "regist" ? "注册" : "登录") + '成功!'
                });
                this.winDataStr = res.data.winData
                this.loginMode = login_mode.login_mode_serve
                this.loginDialogFlag = false;
                this.load();
            }else{
                this.$message({
                    type: 'error',
                    message: "用户名或密码错误"
                });
            }
        },
        /**
         * 本地登录按钮点击
         */
        async btnLocalLogin() {
            this.loginMode = login_mode.login_mode_local
            this.loginDialogFlag = false;
            await this.load();

        },
        /** 图标自动排列 */
        blockAutoArrange(){
            let table = new Table();
            table.width = this.windowWidth;
            table.height = this.windowHeight;
            table.initAllPoint()
            // 全部图标加入table
            for(let block of this.allBlock){
                table.addBlock(block)
            }
            // 全部图标批量对齐
            table.activeBlock();
            this.canvas.renderAll();
            // this.canvas.discardActiveObject(); // 取消所有对象选中状态
        }
    }
    
}