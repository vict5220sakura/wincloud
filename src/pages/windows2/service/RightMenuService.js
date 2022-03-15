/**
 * 右键菜单控制器
 */
export default class RightMenuService{
    vm;

    /**@type RightMenu[]*/
    list = []

    constructor(vm) {
        this.vm = vm
    }

    /**@type RightMenu*/
    add(rightMenu){
        this.list.push(rightMenu);
    }
    /**移除*/
    /**@type RightMenu*/
    remove(rightMenu){
        let index = this.list.indexOf(rightMenu)
        if(index > -1){
            this.list.splice(index, 1);
        }
    }
    /**
     * 关闭所有
     */
    closeAll(){
        for(let rightMenuItem of this.list){
            rightMenuItem.close();
        }
    }
}