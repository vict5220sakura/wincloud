import { fabric } from 'fabric'
import { ajaxPrefilter } from 'jquery';
import BlockType from './bean/block/BlockType.js'
import XYUtil from '../../util/XYUtil.js'
import UrlUtil from "../../util/UrlUtil.js"
import { saveKey } from '../../common/M.js'
import LoginService from '../../service/LoginService.js'
import Windows2MethonsRules from './Windows2MethonsRules.js'
import RightInit from './RightInit.js'
import LeftInit from './LeftInit.js'
import { login_mode, doubleClickTimeMillsseconds, createOrUpdate } from '../../common/M.js'
import BlockTable from './BlockTable.js'
import TableData from './bean/table/TableData.js'
import LinkBlock from "./bean/block/LinkBlock";
import CoordinateService from "./service/CoordinateService.js"
import NodepadBlock from "./bean/block/NodepadBlock";



export default {
    methods:{
        ...LeftInit, // 左键初始化
        ...RightInit, // 右键初始化
        ...Windows2MethonsRules,
        ...BlockTable,
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
        /**
         * 右键新建连接菜单按下
         * @param opts
         */
        menuAddLinkMouseDown(opts){
            this.$prompt('请输入连接地址', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then((urlInputData) => {
                let urlInput = urlInputData.value;
                this.$prompt('请输入标签名称', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(async (nameInputData) => {
                    let nameInput = nameInputData.value

                    let linkBlock = await LinkBlock.newInstance(this, nameInput, urlInput)
                    linkBlock.setLeft(this.rightMouseXTemp - (CoordinateService.blockWidth / 2 + CoordinateService.marginLeft))
                    linkBlock.setTop(this.rightMouseYTemp - (CoordinateService.blockHeight / 2 + CoordinateService.marginTop))
                    this.myCanvasService.addBlock(linkBlock)
                    // this.blockAutoArrange();
                    // await this.save();
                    // this.autoSaveNotify();
                })
            }).catch((e) => {console.log(e)});
        },
        async menuSaveMouseDown(opts){
            console.log('保存 点击 opts=', opts);
            try{
                await this.save()
                this.notify("保存"+ (this.loginMode == login_mode.login_mode_local? "本地" : "远程" ) +"成功", "success")
            }catch(err){
                console.log(err)
                this.notify("保存失败! (请联系网站管理员arcueid5220@163.com)", "error")
            }
        },
        menuClearMouseDown(opts){
            console.log('清空 点击 opts=', opts);


            this.$prompt('此操作将清空桌面数据, 输入"清空"继续', '清空', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then((input) => {
                if('清空' == input.value){
                    this.removeAllBlock()
                    this.$message({
                        type: 'success',
                        message: '清空桌面数据成功!'
                    });
                }
            }).catch((e) => {console.log(e)});
        },
        async menuAutopailieMouseDown(opts){
            this.blockAutoArrange();
            await this.save();
            this.autoSaveNotify();
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
                    if (now - oldTime < doubleClickTimeMillsseconds) {
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
                        // await this.save();
                        // this.autoSaveNotify();
                    }
                } else {
                    // 单击
                    this.blockAutoArrange();
                    // await this.save();
                    // this.autoSaveNotify();
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
            this.nowTable.allBlock = allBlock
            TableData.saveInstance(this.nowTable, this.loginMode, this.username, this.password)
        },
        /** 加载 */
        async load(tableData/**TableData*/) {
            for (let block of tableData.allBlock) {
                if (block.blockType == BlockType.type_link) {
                    await this.addLinkBlock(block)
                }else if(block.blockType == BlockType.type_nodepad){
                    await this.addNodepadBlock(block)
                }else if(block.blockType == BlockType.type_tableBlock){
                    await this.addTableBlock(block)
                }else if(block.blockType == BlockType.type_tableBlock_back){
                    // await this.addTableBackBlock(block)
                }
            }

            this.nowTable = tableData
        },
        /** 选取一个对象 */
        fabricChooseObj(x, y) {
            let chooseObj = null;
            for (let obj of this.canvas.getObjects()) {
                if (XYUtil.checkPointIn(x, y, obj.left, obj.top, obj.width, obj.height)) {
                    chooseObj = obj
                    continue;
                }
            }
            return chooseObj;
        },
        /** 选取多个对象
         * @return canvasObj
         */
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
                }else if(block.blockType == BlockType.type_nodepad){
                    this.nodepadBlockShowMenu(chooseObj, block, x, y)
                }else if(block.blockType == BlockType.type_tableBlock){
                    this.tableBlockShowMenu(chooseObj, block, x, y);
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
                // this.winDataStr = res.data.winData
                let tableData = new TableData();
                tableData.allBlock = (res.data.winData && JSON.parse(res.data.winData)) || []

                this.loginMode = login_mode.login_mode_serve
                this.loginDialogFlag = false;
                this.load(tableData);
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
            let tableData/**@type TableData*/ = await TableData.loadInstance(null, this.loginMode)
            await this.load(tableData);

        },
        /** 图标自动排列 */
        blockAutoArrange(){

            // 全部图标加入table
            for(let block of this.allBlock){
                // table.addBlock(block)
            }
            // 全部图标批量对齐
            // table.activeBlock();

        },
        async openTableKey(key/**@type String*/){
            let tableData /**@type TableData*/ = await TableData.loadInstance(key, this.loginMode, this.username, this.password)
            await this.openTableData(tableData);
            this.nowTable = tableData
        },
        /** 打开新窗口*/
        async openTableData(tableData /**@type TableData*/){
            this.removeAllBlock();
            await this.load(tableData);
        }
    }

    
}