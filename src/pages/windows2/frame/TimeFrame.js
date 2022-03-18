export default class TimeFrame{
    vm;
    constructor(vm) {
        this.vm = vm
        this.init();
    }
    init(){
        setInterval(()=>{
            this.vm.myCanvasService.renderAllMain();
        }, 17)
    }
}