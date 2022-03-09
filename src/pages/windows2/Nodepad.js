import {fabric} from "fabric";
import NodepadBlock from "./bean/NodepadBlock.js"
import { login_mode, doubleClickTimeMillsseconds, createOrUpdate} from '@/common/M.js'
import BlockType from "./bean/BlockType";

export default{
    /** 展示记事本 创建 */
    showNodepadCreate(left, top){
        this.nodepadFlag = true
        this.nodepadLeft = left
        this.nodepadTop = top
        this.nodepadCreateOrUpdate = createOrUpdate.create
    },
    /** 展示记事本 更新 */
    showNodepadUpdate(x, y , title, body){
        this.nodepadCreateOrUpdate = createOrUpdate.update
        // let y = this.linkBlockMenuBackground.top
        // let x = this.linkBlockMenuBackground.left
        let updateObj;
        let objs = this.fabricChooseObjs(x, y)
        for (let obj of objs) {
            if (obj.block.blockType == BlockType.type_nodepad) {
                updateObj = obj
                break
            }
        }

        this.nodepadFlag = true
        this.nodepadTitle = title
        this.nodepadBody = body
        this.nodepadUpdateObj = updateObj;
    },
    /** 取消点击 */
    nodepadCancelClick(){
        this.nodepadFlag = false
        this.nodepadTitle = null;
        this.nodepadBody = null;
        this.nodepadLeft = null;
        this.nodepadTop = null;
    },
    /** 保存点击 */
    async nodepadSaveClick(){
        let title = this.nodepadTitle;
        let body = this.nodepadBody;
        let left = this.nodepadLeft;
        let top = this.nodepadTop;
        this.nodepadTitle = null;
        this.nodepadBody = null;
        this.nodepadLeft = null;
        this.nodepadTop = null;

        if(!title || title.trim() == ""){
            title = "记事本";
        }

        if(this.nodepadCreateOrUpdate = createOrUpdate.update){ // 如果是更新 先删除原先的
            console.log("更新this.nodepadUpdateObj", this.nodepadUpdateObj)
            left = this.nodepadUpdateObj.left
            top = this.nodepadUpdateObj.top
            this.removOneBlock(this.nodepadUpdateObj)
        }

        let nodepadBlock = new NodepadBlock()
        nodepadBlock.left = left
        nodepadBlock.top = top
        nodepadBlock.title = title
        nodepadBlock.body = body
        await this.addNodepadBlock(nodepadBlock)
        // 保存
        await this.save();
        this.autoSaveNotify();

        // 关闭
        this.nodepadFlag = false
    },

    /** 添加一个记事本图标 */
    async addNodepadBlock(nodepadBlock) {
        console.log("addNodepadBlock(nodepadBlock) = ", nodepadBlock)
        // 先添加一个默认背景的图标
        let urlBlockText = new fabric.Textbox(nodepadBlock.title, {
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
            fabric.Image.fromURL('/img/nodepad.png', (oImg) => {
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

        block.set("left", nodepadBlock.left || 0)
        block.set("top", nodepadBlock.top || 0)
        block.set("block", nodepadBlock)

        await this.allBlock.push(block);
        await this.canvas.add(block);

        this.canvas.renderAll();

        // 添加点击打开记事本事件
        block.on("mouseup", async (opts) => {
            let now = new Date().getTime();
            let oldTime = opts.target.time;
            opts.target.time = now;

            if (oldTime) {
                if (now - oldTime < doubleClickTimeMillsseconds) {
                    // 双击打开
                    this.showNodepadUpdate(opts.pointer.x, opts.pointer.y, nodepadBlock.title, nodepadBlock.body)
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
    },
}