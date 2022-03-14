import {fabric} from "fabric";
import {doubleClickTimeMillsseconds} from "../../../common/M.js"

export default class Block{
    vm;
    top;
    left;
    blockType;
    text="-";

    fabricObj; // fabric原生obj
    textFabricObj;
    backgroundFabricObj;
    
    /** 图标单击事件*/
    mouseupFunc(){
        return undefined
    }
    /** 图标双击事件*/
    mouseDoubleupFunc(){
        return undefined
    }
    /** 默认图标 */
    getDefaultBackgroundImg(){
        return undefined;
    }
    /** 懒加载图标 */
    getLazyBackgroundImg(){
        return undefined;
    }

    constructor(vm) {
        this.vm = vm
    }
    async init(){
        this.fabricObj = new fabric.Textbox(this.text, {
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
            new Promise((r)=>{
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
        this.fabricObj.hasBorders = false;

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
                    // 双击
                    if(this.mouseDoubleupFunc()){
                        this.mouseDoubleupFunc()()
                    }
                } else {
                    // 单击
                    if(this.mouseupFunc()){
                        this.mouseupFunc()()
                    }
                }
            } else {
                // 单击
                if(this.mouseupFunc()){
                    this.mouseupFunc()()
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

                    this.textFabricObj = new fabric.Textbox(this.text, {
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

        
        return this;
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

    addWithUpdate(){
        try{
            this.fabricObj.addWithUpdate()
        }catch(err){}
    }


}