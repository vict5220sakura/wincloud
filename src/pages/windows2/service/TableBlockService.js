import TableData from "../bean/table/TableData.js";
import {saveKey} from "../../../common/M.js";
import TableBackBlock from "../bean/block/TableBackBlock.js";
import TableBlock from "../bean/block/TableBlock.js";
import idUtil from "../../../util/IdUtil.js"

/**
 * 桌面图标服务类
 */
export default class TableBlockService{

    vm;
    constructor(vm) {
        this.vm = vm
    }
    /**新建桌面*/
    menuAddTableMouseDown(){
        this.vm.$prompt('请输入桌面名称', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
        }).then(async (data) => {
            let name = data.value;
            if(!name || name.trim() == ''){
                name = "桌面"
            }
            await this.createTable(name);
        }).catch((e) => {console.log(e)});
    }
    /**
     * 创建一个桌面
     */
    async createTable(name){
        let tableData = new TableData();
        tableData.key = saveKey + "_" + idUtil();
        tableData.type = TableData.type_children
        tableData.name = name
        tableData.parentsKey = this.vm.nowTableData.key

        let tableBackBlock = new TableBackBlock();
        tableBackBlock.left = 0;
        tableBackBlock.top = 0;
        tableData.allBlock.push(tableBackBlock)

        let tableBlock = new TableBlock();
        tableBlock.key = tableData.key;
        tableBlock.name = tableData.name
        tableBlock.parentsKey = tableData.parentsKey

        tableBlock.left = this.rightMouseXTemp - (Table.blockWidth / 2 + Table.marginLeft)
        tableBlock.top = this.rightMouseYTemp - (Table.blockHeight / 2 + Table.marginTop)

        await TableData.saveInstance(tableData, this.loginMode, this.username, this.password)

        // 当前位置创建一个图标
        await this.addTableBlock(tableBlock);

        // 保存
        this.blockAutoArrange();
        await this.save();
        this.autoSaveNotify();
    }
}