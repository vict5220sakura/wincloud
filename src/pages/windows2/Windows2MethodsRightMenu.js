import { fabric } from 'fabric'
import { ajaxPrefilter } from 'jquery';
import BlockType from './bean/BlockType.js'
import LinkBlock from "./bean/LinkBlock.js"
import XYUtil from '@/util/XYUtil.js'
import UrlUtil from "@/util/UrlUtil.js"
import { saveKey } from '@/common/M.js'
import LoginService from '@/service/LoginService.js'
import WinDataService from '@/service/WinDataService.js'


import { login_mode } from '@/common/M.js'

export default {
    // 左键事件注册
    leftClickRegistn(){
        this.canvas.on('mouse:down', (options)=> {
            this.closeTableRightMenu();
            this.closeBlockMenu();
        });
    },
    // 右键事件注册
    rightClickRegist(){
      document.getElementsByClassName("upper-canvas")[0].oncontextmenu = (e)=>{
        console.log("鼠标右键e=", e)
        
        let chooseObj = this.fabricChooseObj(e.offsetX, e.offsetY);

        if(chooseObj){
          console.log("选中对象", chooseObj)
          // 移除菜单
          this.closeTableRightMenu();
          this.closeBlockMenu();
          // 展示对象菜单
          this.fabricShowBlockMenu(chooseObj, e.offsetX, e.offsetY);
        }else{
          console.log("没有选中任何对象")
          // 展示桌面右键菜单
          this.showTableRightMenu(e.offsetX, e.offsetY)
        }
        
        e.preventDefault(); // 取消右键事件
      };
    },

    /**展示桌面右键菜单 */
    showTableRightMenu(x, y) {
        this.canvas.discardActiveObject(); // 取消所有对象选中状态
        this.closeTableRightMenu();
        this.closeBlockMenu();
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
    /** 关闭桌面右键菜单 */
    closeTableRightMenu() {
        // console.log('mouse:down', options);
        this.canvas.remove(this.menuBackground);

        for (let menuItem of this.menuList) {
            this.canvas.remove(menuItem);
        }
    },
    /** 关闭图标视图菜单 */
    closeBlockMenu() {
        this.fabricRemoveLinkBlockMenu();
    },

    // 桌面右键菜单初始化
    tableRightMenuInit() {
        this.menuBackground = new fabric.Rect({ width: 100, height: 75, fill: '#eeeeee' });
        this.menuBackground.hasControls = false;
        this.menuBackground.hasBorders = false;
        this.menuBackground.selectable = false;
        this.tableRightMenuInitLink();
        this.tableRightMenuInitSave();
        this.tableRightMenuInitClear();
    },
    /** 添加清空菜单 */
    tableRightMenuInitClear() {
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
                this.removeAllBlock()
                this.$message({
                    type: 'success',
                    message: '清空桌面数据成功!'
                });
            }).catch(() => {

            });

        });

        this.menuList.push(menuItem)
    },
    
    /** 添加保存菜单 */
    tableRightMenuInitSave() {
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
    tableRightMenuInitLink() {
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
    
                    let linkBlock = new LinkBlock();
                    linkBlock.url = urlInput
                    linkBlock.name = nameInput;
    
                    this.addLinkBlock(linkBlock);
                    await this.save();
                    this.autoSaveNotify();
                })
            }).catch(() => { });
        });

        this.menuList.push(menuAddLink)
    },
    /** 链接图标右键菜单初始化 */
    linkBlockMenuInit() {
        this.linkBlockMenuBackground = new fabric.Rect({ width: 100, height: 50, fill: '#eeeeee' });
        this.linkBlockMenuBackground.hasControls = false;
        this.linkBlockMenuBackground.hasBorders = false;
        this.linkBlockMenuBackground.selectable = false;

        // 添加修改按钮
        let updateItemText = new fabric.Text('修改', {
            fontSize: 15,
            fill: '#141414',
            top: 5,
            left: 5
        })

        let updateItemBackground = new fabric.Rect({ width: 100, height: 25, fill: '#eeeeee' });
        updateItemBackground.hasControls = false;
        updateItemBackground.hasBorders = false;
        updateItemBackground.selectable = false;

        let updateItem = new fabric.Group([updateItemBackground, updateItemText], {})
        updateItem.hasControls = false;
        updateItem.hasBorders = false;
        updateItem.selectable = false;
        updateItem.on('mouseover', (opts) => {
            updateItemBackground.set("fill", '#ffffff')
            this.canvas.renderAll();
        });
        updateItem.on('mouseout', (opts) => {
            updateItemBackground.set("fill", '#eeeeee')
            this.canvas.renderAll();
        });
        updateItem.on('mousedown', (opts) => {
            let updateObj;
            let objs = this.fabricChooseObjs(opts.pointer.x, opts.pointer.y)
            for (let obj of objs) {
                if (obj.block.blockType == BlockType.type_link) {
                    updateObj = obj
                    break
                }
            }
            let topTemp = updateObj.block.top
            let leftTemp = updateObj.block.left
            console.log("选中更新", updateObj)
            
            this.$prompt('请输入连接地址', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputValue: updateObj.block.url
            }).then((urlInputData) => {
                let urlInput = urlInputData.value;
                this.$prompt('请输入标签名称', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputValue: updateObj.block.name
                }).then(async (nameInputData) => {
                    let nameInput = nameInputData.value

                    // 先删除 在新建
                    this.removOneBlock(updateObj)
                    
                    let linkBlock = new LinkBlock();
                    linkBlock.url = urlInput
                    linkBlock.name = nameInput;
                    linkBlock.top = topTemp
                    linkBlock.left = leftTemp

                    await this.addLinkBlock(linkBlock);
                    await this.save();
                    this.autoSaveNotify();

                })
            }).catch(() => { });
        });

        this.linkBlockMenuList.push(updateItem)


        // 添加删除按钮
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
            this.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                let objs = this.fabricChooseObjs(opts.pointer.x, opts.pointer.y)
                for (let obj of objs) {
                    if (obj.block.blockType == BlockType.type_link) {
                        this.removOneBlock(obj)
                        break
                    }
                }
                await this.save();
                this.autoSaveNotify();
            }).catch(() => {

            });
            
        });

        this.linkBlockMenuList.push(item)
    },
}