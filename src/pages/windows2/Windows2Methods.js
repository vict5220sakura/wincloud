import { fabric } from 'fabric'
import { ajaxPrefilter } from 'jquery';
import BlockType from './bean/BlockType.js'
import LinkBlock from "./bean/LinkBlock.js"
import XYUtil from '@/util/XYUtil.js'
import UrlUtil from "@/util/UrlUtil.js"
import { saveKey } from '@/common/M.js'
import LoginService from '@/service/LoginService.js'
import WinDataService from '@/service/WinDataService.js'

import rules from './Windows2Rules.js'
import { login_mode } from '@/common/M.js'

export default {
    methods: {
        ...rules, // 校验规则方法
        // 初始化鼠标右键菜单
        createdMenu() {
            this.menuBackground = new fabric.Rect({ width: 100, height: 75, fill: '#eeeeee' });
            this.menuBackground.hasControls = false;
            this.menuBackground.hasBorders = false;
            this.menuBackground.selectable = false;
            this.menuAddLink();
            this.menuAddSave();
            this.menuAddClear();
        },
        /** 添加清空菜单 */
        menuAddClear() {
            const text = new fabric.Text('清空', {
                fontSize: 15,
                fill: '#141414',
                top: 5,
                left: 5
            })
            const background = new fabric.Rect({ width: 100, height: 25, fill: '#eeeeee' });
            background.hasControls = false;
            background.hasBorders = false;
            background.selectable = false;

            let menuItem = new fabric.Group([background, text], {})

            menuItem.hasControls = false;
            menuItem.hasBorders = false;
            menuItem.selectable = false;
            menuItem.on('mouseover', (opts) => {
                console.log('清空 悬停 opts=', opts);
                background.set("fill", '#ffffff')
                this.canvas.renderAll();
            });
            menuItem.on('mouseout', (opts) => {
                background.set("fill", '#eeeeee')
                this.canvas.renderAll();
            });

            menuItem.on('mousedown', (opts) => {
                console.log('清空 点击 opts=', opts);

                this.$confirm('此操作将清空桌面数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.clear()
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(() => {

                });

            });

            this.menuList.push(menuItem)
        },
        /** 添加保存菜单 */
        menuAddSave() {
            // 初始化新建连接菜单栏
            const text = new fabric.Text('保存', {
                fontSize: 15,
                fill: '#141414',
                top: 5,
                left: 5
            })
            const background = new fabric.Rect({ width: 100, height: 25, fill: '#eeeeee' });
            background.hasControls = false;
            background.hasBorders = false;
            background.selectable = false;

            let menuItem = new fabric.Group([background, text], {})

            menuItem.hasControls = false;
            menuItem.hasBorders = false;
            menuItem.selectable = false;
            menuItem.on('mouseover', (opts) => {
                console.log('保存 悬停 opts=', opts);
                background.set("fill", '#ffffff')
                this.canvas.renderAll();
            });
            menuItem.on('mouseout', (opts) => {
                background.set("fill", '#eeeeee')
                this.canvas.renderAll();
            });

            menuItem.on('mousedown', async (opts) => {
                console.log('保存 点击 opts=', opts);
                try{
                    await this.save()
                    this.$message({
                        type: 'success',
                        message: "保存"+ (this.loginMode == login_mode.login_mode_local? "本地" : "远程" ) +"成功!"
                    });
                }catch(err){
                    this.$message({
                        type: 'error',
                        message: "保存失败! (请联系网站管理员arcueid5220@163.com)"
                    });
                }
            });

            this.menuList.push(menuItem)
        },
        menuAddLink() {
            // 初始化新建连接菜单栏
            const addLinkText = new fabric.Text('新建连接', {
                fontSize: 15,
                fill: '#141414',
                top: 5,
                left: 5
            })
            const addLinkBackground = new fabric.Rect({ width: 100, height: 25, fill: '#eeeeee' });
            addLinkBackground.hasControls = false;
            addLinkBackground.hasBorders = false;
            addLinkBackground.selectable = false;

            let menuAddLink = new fabric.Group([addLinkBackground, addLinkText], {})

            menuAddLink.hasControls = false;
            menuAddLink.hasBorders = false;
            menuAddLink.selectable = false;
            menuAddLink.on('mouseover', (opts) => {
                console.log('新建连接 悬停 opts=', opts);
                addLinkBackground.set("fill", '#ffffff')
                this.canvas.renderAll();
            });
            menuAddLink.on('mouseout', (opts) => {
                addLinkBackground.set("fill", '#eeeeee')
                this.canvas.renderAll();
            });

            menuAddLink.on('mousedown', (opts) => {
                console.log('新建连接 点击 opts=', opts);
                this.addLink()
            });

            this.menuList.push(menuAddLink)
        },
        /** 添加连接图标 */
        addLink() {
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
            }).catch(() => { });
        },
        async addLinkBlock(linkBlock) {
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
            let urlBlockbackground = null

            await new Promise((r) => {
                fabric.Image.fromURL(UrlUtil.getLogoUrl(linkBlock.url), (oImg) => {
                    if (oImg.width == 0) {
                        urlBlockbackground = new fabric.Rect({
                            width: 70,
                            height: 70,
                            fill: '#eeeeee'
                        });
                    } else {
                        urlBlockbackground = oImg
                    }

                    r()
                });
            })

            urlBlockbackground.set("scaleX", 70 / urlBlockbackground.width)
            urlBlockbackground.set("scaleY", 70 / urlBlockbackground.height)


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
            urlBlock.on("mouseup", (opts) => {
                console.log("连接点击", opts)
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
                        this.save();
                    }
                } else {
                    // 单击
                    this.save();
                }
            })
            this.save();
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
        load() {
            if(this.loginMode == login_mode.login_mode_local){ // 本地登录加载
                let jsonarrStr = localStorage.getItem(saveKey);
                // console.log("读取jsonarrStr=", jsonarrStr)
                let jsonarr = jsonarrStr && JSON.parse(jsonarrStr) || []
                // console.log("读取jsonarr=", jsonarr)
                for (let block of jsonarr) {
                    if (block.blockType == BlockType.type_link) {
                        this.addLinkBlock(block)
                    }
                }
            }else if(this.loginMode == login_mode.login_mode_serve){
                console.log("远程载入", this.winDataStr)
                let jsonarr = this.winDataStr && JSON.parse(this.winDataStr) || []
                for (let block of jsonarr) {
                    if (block.blockType == BlockType.type_link) {
                        this.addLinkBlock(block)
                    }
                }
            }
            
        },
        clear() {
            this.fabricRemoveAllBlock()

            localStorage.removeItem(saveKey)
            // location.reload();
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
        /**展示菜单 */
        fabricShowMenu(x, y) {
            this.canvas.discardActiveObject(); // 取消所有对象选中状态
            this.canvasRemoveMenu();
            this.fabricRemoveBlockMenu();
            this.menuBackground.top = y
            this.menuBackground.left = x

            this.canvas.add(this.menuBackground);
            let topIndex = 0
            for (let menuItem of this.menuList) {
                menuItem.top = y + (menuItem.height * topIndex)
                menuItem.left = x
                this.canvas.add(menuItem);
                topIndex++;
            }
        },
        /** 视图移除菜单 */
        canvasRemoveMenu() {
            // console.log('mouse:down', options);
            this.canvas.remove(this.menuBackground);

            for (let menuItem of this.menuList) {
                this.canvas.remove(menuItem);
            }
        },
        /** 视图展示菜单 */
        fabricShowBlockMenu(chooseObj, x, y) {
            let block = chooseObj.block
            if (block.blockType == BlockType.type_link) {
                this.fabricShowLinkBlockMenu(chooseObj, block, x, y)
            }
        },
        /** 创建链接菜单 */
        cheatedLinkBlockMenu() {
            this.linkBlockMenuBackground = new fabric.Rect({ width: 100, height: 25, fill: '#eeeeee' });
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

            let itemBackground = new fabric.Rect({ width: 100, height: 25, fill: '#eeeeee' });
            itemBackground.hasControls = false;
            itemBackground.hasBorders = false;
            itemBackground.selectable = false;

            let item = new fabric.Group([itemBackground, itemText], {})
            item.hasControls = false;
            item.hasBorders = false;
            item.selectable = false;
            item.on('mouseover', (opts) => {
                itemBackground.set("fill", '#ffffff')
                this.canvas.renderAll();
            });
            item.on('mouseout', (opts) => {
                itemBackground.set("fill", '#eeeeee')
                this.canvas.renderAll();
            });
            item.on('mousedown', (opts) => {
                console.log("选中删除", opts)
                let objs = this.fabricChooseObjs(opts.pointer.x, opts.pointer.y)
                for (let obj of objs) {
                    if (obj.block.blockType == BlockType.type_link) {
                        this.fabricRemoveBlock(obj)
                        break
                    }
                }
            });

            this.linkBlockMenuList.push(item)
        },
        /** 视图展示链接菜单 */
        fabricShowLinkBlockMenu(chooseObj, block, x, y) {
            this.linkBlockMenuBackground.top = y
            this.linkBlockMenuBackground.left = x

            this.canvas.discardActiveObject(); // 取消所有对象选中状态
            this.canvasRemoveMenu(); // 取消菜单显示
            this.fabricRemoveBlockMenu(); // 取消菜单显示

            this.canvas.add(this.linkBlockMenuBackground);
            let topIndex = 0
            for (let menuItem of this.linkBlockMenuList) {
                menuItem.top = y + (menuItem.height * topIndex)
                menuItem.left = x
                this.canvas.add(menuItem);
                topIndex++;
            }
        },
        /** 视图移除菜单 */
        fabricRemoveBlockMenu() {
            this.fabricRemoveLinkBlockMenu();
        },
        /** 视图移除链接菜单 */
        fabricRemoveLinkBlockMenu() {
            this.canvas.remove(this.linkBlockMenuBackground);
            for (let menuItem of this.linkBlockMenuList) {
                this.canvas.remove(menuItem);
            }
        },
        /** 移除全部图标 */
        fabricRemoveAllBlock(){
            for (let obj of this.allBlock) {
                this.canvas.remove(obj)
            }
            this.allBlock = []
        },
        /** 移除一个图标 */
        fabricRemoveBlock(obj) {
            this.canvas.remove(obj)
            for (let i = 0; i < this.allBlock.length; i++) {
                console.log("删除log", this.allBlock[i].block, obj.block)
                if (this.allBlock[i].block == obj.block) {
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
            console.log("远程登录", res)
        },
        /**
         * 本地登录按钮点击
         */
        btnLocalLogin() {
            this.loginMode = login_mode.login_mode_local
            this.loginDialogFlag = false;
            this.load();
        }
    }
}