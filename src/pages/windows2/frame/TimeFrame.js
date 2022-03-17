export default class TimeFrame{
    vm;
    constructor(vm) {
        this.vm = vm
        this.init();
    }
    init(){
        setInterval(()=>{
            if(this.vm.myCanvasService.isRenderAll){
                this.vm.myCanvasService.isRenderAll = false
                this.vm.myCanvasService.renderAllMain();
            }
        }, 17)
    }
}