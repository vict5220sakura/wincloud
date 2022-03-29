export default class TimeFrame{
    vm;
    constructor(vm) {
        this.vm = vm
        this.init();
    }
    init(){
        setInterval(()=>{
            this.vm.myCanvasService.renderAllMain();

            this.longTouchCheck()
        }, 17)
    }
    startTime;
    longTouchCheck(){
        if(this.vm.mousedown == true){
            this.startTime = new Date().getTime();
        }else{

        }
    }
}