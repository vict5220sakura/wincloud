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
        // setInterval(()=>{
        //     this.longTouchCheck()
        // }, 100)
    }
    // mousedownflag = false;
    // startTime;
    // longPressAction = false;
    // longTouchCheck(){
    //
    //     if(this.mousedownflag == true){
    //         if(this.vm.mousedown == true){
    //             // this.startTime = new Date().getTime();
    //             // this.mousedownflag = true
    //         }else{
    //             this.startTime = null;
    //             this.mousedownflag = false
    //         }
    //     }else{
    //         if(this.vm.mousedown == true){
    //             this.startTime = new Date().getTime();
    //             this.mousedownflag = true
    //         }else{
    //             this.startTime = null;
    //             this.mousedownflag = false
    //         }
    //     }
    //
    //     if(this.mousedownflag){
    //         if(new Date().getTime() - this.startTime > 1000){
    //             if(this.longPressAction == false){
    //                 console.log("鼠标长按事件")
    //                 this.longPressAction = true;
    //                 this.startTime = null;
    //                 this.mousedownflag = false
    //             }
    //         }
    //     }
    // }
}