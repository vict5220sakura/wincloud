import idUtil from '@/util/IdUtil'
import TableData from '../../bean/TableData.js'
import {fabric} from "fabric";
import BlockType from "./bean/BlockType";
import {saveKey, doubleClickTimeMillsseconds} from "../../common/M.js";
import Table from "./bean/Table";
import TableBlock from './bean/TableBlock.js'
import TableBackBlock from './bean/TableBackBlock.js'

/**
 * 桌面工具
 */
export default{
    // /**
    //  * 创建一个桌面
    //  */
    // async createTable(name, nowTable /**@type TableData*/){
    //     let tableData = new TableData();
    //     tableData.key = saveKey + "_" + idUtil();
    //     tableData.type = TableData.type_children
    //     tableData.name = name
    //     tableData.parentsKey = nowTable.key
    //
    //     let tableBackBlock = new TableBackBlock();
    //     tableBackBlock.left = 0;
    //     tableBackBlock.top = 0
    //     tableData.allBlock.push(tableBackBlock)
    //
    //     let tableBlock = new TableBlock();
    //     tableBlock.key = tableData.key;
    //     tableBlock.name = tableData.name
    //     tableBlock.parentsKey = tableData.parentsKey
    //
    //     tableBlock.left = this.rightMouseXTemp - (Table.blockWidth / 2 + Table.marginLeft)
    //     tableBlock.top = this.rightMouseYTemp - (Table.blockHeight / 2 + Table.marginTop)
    //
    //     await TableData.saveInstance(tableData, this.loginMode)
    //
    //     // 当前位置创建一个图标
    //     await this.addTableBlock(tableBlock);
    //
    //     // 保存
    //     this.blockAutoArrange();
    //     await this.save();
    //     this.autoSaveNotify();
    // },

    /** 添加一个桌面图标 */
    async addTableBackBlock(tablebackBlock/**@type TableBackBlock*/) {
        console.log("添加一个返回按钮", tablebackBlock)
        // 先添加一个默认背景的图标
        let urlBlockText = new fabric.Textbox(tablebackBlock.name, {
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
            fabric.Image.fromURL('/img/back1.png', (oImg) => {
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

        block.set("left", tablebackBlock.left || 0)
        block.set("top", tablebackBlock.top || 0)
        block.set("block", tablebackBlock)

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
                        if (obj.block.blockType == BlockType.type_tableBlock_back) {
                            updateObj = obj
                            break
                        }
                    }
                    await this.openTableKey(this.nowTable.parentsKey)
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
}