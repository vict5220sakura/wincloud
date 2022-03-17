export default class TimeFrame{
    vm;
    constructor(vm) {
        this.vm = vm
        this.init();
    }
    init(){
        // setInterval(()=>{
        //     if(this.isRenderAll){
        //         console.log("this.canvas.renderAll()")
        //         this.isRenderAll = false
        //         this.vm.myCanvasService.renderAllMain();
        //     }
        // }, 17)
    }
}