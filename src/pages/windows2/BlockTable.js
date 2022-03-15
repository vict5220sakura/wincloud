import idUtil from '@/util/IdUtil'
import TableData from './bean/table/TableData.js'
import {fabric} from "fabric";
import BlockType from "./bean/block/BlockType";
import {saveKey, doubleClickTimeMillsseconds} from "../../common/M.js";
import CoordinateService from "./service/CoordinateService.js";
import TableBlock from './bean/block/TableBlock.js'
import TableBackBlock from './bean/block/TableBackBlock.js'

/**
 * 桌面工具
 */
export default{


    /** 添加一个桌面图标 */
    async addTableBlock(tableBlock/**@type TableBlock*/) {
        // 先添加一个默认背景的图标
        let urlBlockText = new fabric.Textbox(tableBlock.name, {
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
            fabric.Image.fromURL('/img/table.png', (oImg) => {
                urlBlockbackground = oImg
                r()
            })
        })


        urlBlockbackground.set("scaleX", 70 / urlBlockbackground.width)
        urlBlockbackground.set("scaleY", 70 / urlBlockbackground.height)


        urlBlockbackground.hasControls = false;
        urlBlockbackground.hasBorders = false;

        let block = new fabric.Group([urlBlockbackground, urlBlockText])
        block.addWithUpdate()

        block.hasControls = false;
        block.hasBorders = false;

        block.set("left", tableBlock.left || 0)
        block.set("top", tableBlock.top || 0)
        block.set("block", tableBlock)

        await this.allBlock.push(block);
        await this.canvas.add(block);

        this.canvas.renderAll();

        // 添加点击打开桌面事件
        block.on("mouseup", async (opts) => {
            let now = new Date().getTime();
            let oldTime = opts.target.time;
            opts.target.time = now;

            if (oldTime) {
                if (now - oldTime < doubleClickTimeMillsseconds) {
                    // 双击打开
                    let x = opts.pointer.x
                    let y = opts.pointer.y

                    let updateObj;
                    let objs = this.fabricChooseObjs(x, y)
                    for (let obj of objs) {
                        if (obj.block.blockType == BlockType.type_tableBlock) {
                            updateObj = obj
                            break
                        }
                    }
                    await this.openTableKey(tableBlock.key)
                } else {
                    // 单击
                    this.blockAutoArrange();
                }
            } else {
                // 单击
                this.blockAutoArrange();
            }
        })
    },


    /** 链接图标右键菜单初始化 */
    tableBlockMenuInit() {
        // 菜单背景初始化
        this.tableBlockMenuBackground = new fabric.Rect({ width: 100, height: 50, fill: '#eeeeee' });
        this.tableBlockMenuBackground.hasControls = false;
        this.tableBlockMenuBackground.hasBorders = false;
        this.tableBlockMenuBackground.selectable = false;

        this.tableBlockMenuXiugaiInit();
        this.tableBlockMenuDeleteInit();
    },
    tableBlockMenuXiugaiInit(){
        // 添加修改按钮
        let updateItemText = new fabric.Text('修改', {
            fontSize: 15,
            fill: '#141414',
            top: 5,
            left: 5
        })

        let updateItemBackground = new fabric.Rect({ width: 100, height: 25, fill: '#eeeeee' });
        this.tableBlockMenuItembackgroundList.push(updateItemBackground);
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
            let x = this.rightMouseXTemp
            let y = this.rightMouseYTemp

            let updateObj; /**@type canvasObj*/
            let objs = this.fabricChooseObjs(x, y)
            for (let obj of objs) {
                if (obj.block.blockType == BlockType.type_tableBlock) {
                    updateObj = obj
                    break
                }
            }
            this.$prompt('请输入桌面名称', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputValue: updateObj.block.name
            }).then(async(input) => {
                let name = input.value;
                this.removOneBlock(updateObj)
                let tableBlock/**@type TableBlock*/ = updateObj.block
                tableBlock.name = name
                tableBlock.top = updateObj.top
                tableBlock.left = updateObj.left

                await this.addTableBlock(tableBlock)

                // 保存
                this.blockAutoArrange();
                await this.save();
                this.autoSaveNotify();
            })
        });

        this.tableBlockMenuList.push(updateItem)
    },
    tableBlockMenuDeleteInit(){
        // 添加删除按钮
        let itemText = new fabric.Text('删除', {
            fontSize: 15,
            fill: '#141414',
            top: 5,
            left: 5
        })

        let itemBackground = new fabric.Rect({ width: 100, height: 25, fill: '#eeeeee' });
        this.tableBlockMenuItembackgroundList.push(itemBackground);
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
        item.on('mousedown', async (opts) => {
            let x = this.rightMouseXTemp
            let y = this.rightMouseYTemp
            let delCanvasObj;
            let objs = this.fabricChooseObjs(x, y)
            for (let obj of objs) {
                if (obj.block.blockType == BlockType.type_tableBlock) {
                    delCanvasObj = obj
                    break
                }
            }

            let name = delCanvasObj.block.name

            this.$prompt('此操作将删除桌面('+name+')全部数据, 输入"'+name+'"继续', '删除桌面('+name+')', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async(input) => {
                if(name == input.value){
                    this.removOneBlock(delCanvasObj)
                    await this.save();
                    this.autoSaveNotify();
                }
            }).catch((e) => {console.log(e)});
        });

        this.tableBlockMenuList.push(item)
    },
    /** 展示菜单 */
    tableBlockShowMenu(chooseObj, block, x, y) {
        this.tableBlockMenuBackground.top = y
        this.tableBlockMenuBackground.left = x

        this.canvas.discardActiveObject(); // 取消所有对象选中状态
        // this.closeAllBlockMenu();

        this.canvas.add(this.tableBlockMenuBackground);
        let topIndex = 0
        for (let menuItem of this.tableBlockMenuList) {
            menuItem.top = y + (menuItem.height * topIndex)
            menuItem.left = x
            this.canvas.add(menuItem);
            topIndex++;
        }
    },
    /** 关闭菜单 */
    tableBlockCloseMenu() {
        this.canvas.remove(this.tableBlockMenuBackground);
        for (let menuItem of this.tableBlockMenuList) {
            this.canvas.remove(menuItem);
        }
        for(let item of this.tableBlockMenuItembackgroundList){
            item.set("fill", '#eeeeee')
        }
        this.canvas.renderAll();
    },
}