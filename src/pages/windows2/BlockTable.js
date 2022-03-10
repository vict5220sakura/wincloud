import idUtil from '@/util/IdUtil'
import TableData from '../../bean/TableData.js'
/**
 * 桌面工具
 */
export default{
    /**
     * 创建一个桌面
     */
    createTable(name){
        let tableData = new TableData();
        tableData.id = idUtil();
        tableData.type = TableData.type_children
        tableData.name = name

        // 保存当前桌面
    }
}