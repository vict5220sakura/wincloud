import LinkBlock from "./bean/block/LinkBlock";
import RightMenu from "./bean/RightMenu/RightMenu";
import RightMenuItem from "./bean/RightMenu/RightMenuItem";
import TableBackBlock from "./bean/block/TableBackBlock";
import {fabric} from "fabric";
export default{
    /** 左键事件注册 */
    async leftClickRegist(){
        this.myCanvasService.canvas.on('mouse:down', async (options)=> {
            let x = options.pointer.x
            let y = options.pointer.y
            this.rightMenuService.closeAll()
        });
        // this.myCanvasService.canvas.on('object:moving', async (options)=> {
        //     console.log("object:moving")
        // });
        // this.myCanvasService.canvas.on('selection:created', async (options)=> {
        //     console.log("selection:created", options)
        //     options.target.set({hasRotatingPoint: false})
        //     options.target.set("hasRotatingPoint", false)
        // });
        // this.myCanvasService.canvas.on('selection:updated', function (options) {
        //     options.target.set({hasRotatingPoint: false})
        //     options.target.set("hasRotatingPoint", false)
        // })
        // this.myCanvasService.canvas.on('selection:cleared', async (options)=> {
        //     console.log("selection:cleared", options)
        // });
        // this.myCanvasService.canvas.on('mouse:up', async (options)=> {
        //     // if(this.manyChoose == true){
        //     //     // this.coordinateService.reset()
        //     //     console.log("this.manyChoose == true mouse:up")
        //     // }
        //     console.log(this.myCanvasService.canvas.globalCompositeOperation)
        // });
        // this.myCanvasService.canvas.on('event:dragleave', async (options)=> {
        //     console.log("event:dragleave")
        // });

    },
}