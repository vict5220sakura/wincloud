import {fabric} from "fabric";
import BlockType from "./bean/BlockType";
import LinkBlock from "./bean/LinkBlock";
import Table from "./bean/Table";

/**
 * 图标右键菜单
 */
export default{
    /** 链接图标右键菜单初始化 */
    linkBlockMenuInit() {
        // 菜单背景初始化
        this.linkBlockMenuBackground = new fabric.Rect({ width: 100, height: 50, fill: '#eeeeee' });
        this.linkBlockMenuBackground.hasControls = false;
        this.linkBlockMenuBackground.hasBorders = false;
        this.linkBlockMenuBackground.selectable = false;

        this.linkBlockMenuXiugaiInit();
        this.linkBlockMenuDeleteInit();
    },
    /** 修改按钮初始化 */
    linkBlockMenuXiugaiInit(){
        // 添加修改按钮
        let updateItemText = new fabric.Text('修改', {
            fontSize: 15,
            fill: '#141414',
            top: 5,
            left: 5
        })

        let updateItemBackground = new fabric.Rect({ width: 100, height: 25, fill: '#eeeeee' });
        this.linkBlockMenuItembackgroundList.push(updateItemBackground);
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
            let y = this.linkBlockMenuBackground.top
            let x = this.linkBlockMenuBackground.left
            let updateObj;
            let objs = this.fabricChooseObjs(x, y)
            for (let obj of objs) {
                if (obj.block.blockType == BlockType.type_link) {
                    updateObj = obj
                    break
                }
            }
            console.log("opts", opts)
            console.log("选中更新", updateObj)
            console.log("全部图标", this.allBlock)
            let topTemp = updateObj.top;//this.rightMouseYTemp - (Table.blockHeight / 2 + Table.marginTop)
            let leftTemp = updateObj.left;//this.rightMouseXTemp - (Table.blockWidth / 2 + Table.marginLeft)

            // let left = this.rightMouseXTemp - (Table.blockWidth / 2 + Table.marginLeft)
            // let top = this.rightMouseYTemp - (Table.blockHeight / 2 + Table.marginTop)

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

                    let linkBlock = new LinkBlock(this);
                    linkBlock.url = urlInput
                    linkBlock.name = nameInput;
                    linkBlock.top = topTemp
                    linkBlock.left = leftTemp

                    await this.addLinkBlock(linkBlock);
                    await this.save();
                    this.autoSaveNotify();
                    // this.blockAutoArrange();
                })
            }).catch((e) => {console.log(e)});
        });

        this.linkBlockMenuList.push(updateItem)
    },
    /** 添加删除按钮 */
    linkBlockMenuDeleteInit(){
        // 添加删除按钮
        let itemText = new fabric.Text('删除', {
            fontSize: 15,
            fill: '#141414',
            top: 5,
            left: 5
        })

        let itemBackground = new fabric.Rect({ width: 100, height: 25, fill: '#eeeeee' });
        this.linkBlockMenuItembackgroundList.push(itemBackground);
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
                let y = this.linkBlockMenuBackground.top
                let x = this.linkBlockMenuBackground.left
                let objs = this.fabricChooseObjs(x, y)
                for (let obj of objs) {
                    if (obj.block.blockType == BlockType.type_link) {
                        this.removOneBlock(obj)
                        break
                    }
                }
                await this.save();
                this.autoSaveNotify();
            }).catch((e) => {
                console.log(e)
            });

        });

        this.linkBlockMenuList.push(item)
    },
    /** 展示菜单 */
    linkBlockShowMenu(chooseObj, block, x, y) {
        this.linkBlockMenuBackground.top = y
        this.linkBlockMenuBackground.left = x

        this.canvas.discardActiveObject(); // 取消所有对象选中状态
        this.closeAllBlockMenu();

        this.canvas.add(this.linkBlockMenuBackground);
        let topIndex = 0
        for (let menuItem of this.linkBlockMenuList) {
            menuItem.top = y + (menuItem.height * topIndex)
            menuItem.left = x
            this.canvas.add(menuItem);
            topIndex++;
        }
    },
    /** 关闭菜单 */
    linkBlockCloseMenu() {
        this.canvas.remove(this.linkBlockMenuBackground);
        for (let menuItem of this.linkBlockMenuList) {
            this.canvas.remove(menuItem);
        }
        for(let item of this.linkBlockMenuItembackgroundList){
            item.set("fill", '#eeeeee')
        }
        this.canvas.renderAll();
    },
}