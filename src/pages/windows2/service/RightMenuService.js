/**
 * 右键菜单控制器
 */
export default class RightMenuService{
    vm;

    /**@type Menu[]*/
    list = []

    constructor(vm) {
        this.vm = vm
    }

    /**@type Menu*/
    add(menu){
        this.list.push(menu);
    }
    /**移除*/
    /**@type Menu*/
    remove(menu){
        let index = this.list.indexOf(menu)
        this.vm.myCanvasService.removeFabricObj(menu.fabricObj)
        for(let item of menu.itemList){
            this.vm.myCanvasService.removeFabricObj(item.fabricObj)
            this.vm.myCanvasService.removeFabricObj(item.textFabric)
            this.vm.myCanvasService.removeFabricObj(item.backgroundFabric)
        }
        if(index > -1){
            this.list.splice(index, 1);
        }
    }
    /**
     * 关闭所有
     */
    closeAll(){
        for(let menuItem of this.list){
            menuItem.close();
        }
    }
}