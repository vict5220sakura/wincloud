import {fabric} from "fabric";
import {doubleClickTimeMillsseconds} from "../../../../common/M.js"
import RightMenu from "../RightMenu/RightMenu.js";
import RightMenuItem from "../RightMenu/RightMenuItem";
import UrlUtil from '../../../../util/UrlUtil.js'
import IdUtil from "../../../../util/IdUtil";

export default class Block{
    vm;

    blockKey;
    top;
    left;
    blockType; // 图标类型

    /**@type BlockPoint 坐标点*/
    blockPoint;

    fabricObj; // fabric原生obj
    textFabricObj; // fabric原生obj
    backgroundFabricObj; // fabric原生obj

    /**@type RightMenu*/
    rightMenu;

    constructor(vm, blockKey) {
        console.log("创建对象", blockKey)
        this.vm = vm
        if(blockKey){
            this.blockKey = blockKey
        }else{
            this.blockKey = IdUtil()
        }
    }

    /**
     * 保存忽略字段名
     * @returns {string[]}
     */
    getIgnoreFieldName(){
        return ["vm", "blockPoint", "fabricObj", "textFabricObj", "backgroundFabricObj", "rightMenu"];
    }

    /** @abstract 文本*/
    toJson(){
        let json = {};
        for(let fieldName in this){
            if(this.getIgnoreFieldName().indexOf(fieldName) > -1){
                continue;
            }else{
                json[fieldName] = this[fieldName]
            }
        }
        return json;
    }



    async init(){
        this.textFabricObj = new fabric.Textbox(this.getText(), {
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
        this.backgroundFabricObj = new fabric.Rect({
            width: 70,
            height: 70,
            fill: '#eeeeee'
        });
        if(this.getDefaultBackgroundImg()){
            await new Promise((r)=>{
                fabric.Image.fromURL(this.getDefaultBackgroundImg(), (oImg) => {
                    this.backgroundFabricObj = oImg
                    r()
                })
            })
        }

        this.backgroundFabricObj.set("scaleX", 70 / this.backgroundFabricObj.width)
        this.backgroundFabricObj.set("scaleY", 70 / this.backgroundFabricObj.height)
        this.backgroundFabricObj.hasControls = false;
        this.backgroundFabricObj.hasBorders = false;

        this.fabricObj = new fabric.Group([this.backgroundFabricObj, this.textFabricObj])
        this.fabricObj.hasControls = false;
        this.fabricObj.hasBorders = true; // 选中边框

        this.fabricObj.set("left", this.left || 0)
        this.fabricObj.set("top", this.top || 0)
        this.fabricObj.set("block", this)
        this.addWithUpdate()

        // 添加点击跳转事件
        this.fabricObj.on("mouseup", async (opts) => {
            let now = new Date().getTime();
            let oldTime = opts.target.time;
            opts.target.time = now;
            if (oldTime) {
                if (now - oldTime < doubleClickTimeMillsseconds) {
                    this.defaultMouseDoubleup();
                    // 双击
                    if(this.getMouseDoubleupFunc()){
                        this.getMouseDoubleupFunc()()
                    }
                } else {
                    this.defaultMouseup()
                    // 单击
                    if(this.getMouseupFunc()){
                        this.getMouseupFunc()()
                    }
                }
            } else {
                this.defaultMouseup()
                // 单击
                if(this.getMouseupFunc()){
                    this.getMouseupFunc()()
                }
            }
        })

        // 懒加载图标
        if(this.getLazyBackgroundImg()){
            fabric.Image.fromURL(UrlUtil.getLogoUrl(this.getLazyBackgroundImg()), (oImgNew) => {
                if (oImgNew.width == 0) {

                } else {
                    this.top = this.fabricObj.top
                    this.left = this.fabricObj.left
                    this.fabricObj.remove(this.textFabricObj)
                    this.fabricObj.remove(this.backgroundFabricObj)

                    this.backgroundFabricObj = oImgNew
                    this.backgroundFabricObj.set("scaleX", 70 / this.backgroundFabricObj.width)
                    this.backgroundFabricObj.set("scaleY", 70 / this.backgroundFabricObj.height)
                    this.backgroundFabricObj.hasControls = false;
                    this.backgroundFabricObj.hasBorders = false;

                    this.textFabricObj = new fabric.Textbox(this.getText(), {
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

                    this.fabricObj.addWithUpdate(this.backgroundFabricObj)
                    this.fabricObj.addWithUpdate(this.textFabricObj)
                    this.fabricObj.set("left", this.left || 0)
                    this.fabricObj.set("top", this.top || 0)

                    this.addWithUpdate()
                    this.fabricObj.set("block", this)

                    this.vm.myCanvasService.renderAll();
                }
            });
        }

        this.initRightMenu()
        return this;
    }

    initRightMenu(){
        this.rightMenu = new RightMenu(this.vm);

        if(this.getRightMenuItemList()){
            for(let rightMenuItem of this.getRightMenuItemList()){
                this.rightMenu.addItem(rightMenuItem)
            }
        }
    }

    /** @abstract 文本*/
    getText(){
        return "-";
    }
    
    /** @abstract 图标单击事件*/
    getMouseupFunc(){
        return undefined
    }
    defaultMouseup(){
        this.vm.coordinateService.reset()
    }
    /** @abstract 图标双击事件*/
    getMouseDoubleupFunc(){
        return undefined
    }
    defaultMouseDoubleup(){

    }
    /** @abstract 默认图标地址 */
    getDefaultBackgroundImg(){
        return undefined;
    }
    /** @abstract 懒加载图标 */
    getLazyBackgroundImg(){
        return undefined;
    }
    /** @abstract 菜单列表
     * @return RightMenuItem[]
     * */
    getRightMenuItemList(){
        return undefined;
    }

    setTop(top){
        this.top = top
        this.fabricObj.set("top", top || 0)
        this.addWithUpdate()
    }

    setLeft(left){
        this.left = left
        this.fabricObj.set("left", left || 0)
        this.addWithUpdate()
    }

    getTop(){
        return this.fabricObj.top
    }

    getLeft(){
        return this.fabricObj.left
    }

    addWithUpdate(){
        try{
            this.fabricObj.addWithUpdate()
        }catch(err){}
    }
}