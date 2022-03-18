export default class Lock{
    lockFlag;
    constructor() {}

    lock(func){
        let timer = setInterval(async()=>{
            if(this.lockFlag == false){
                clearInterval(timer)
                try{
                    this.lockFlag = true
                    func()
                }finally{
                    this.lockFlag = false
                }
            }
        }, 17)
    }
}
