import Api from "../../../util/Api";

/**
 * 本地存储服务
 */
export default class LocalDbService{
    vm;
    db;
    static table_table = "table"; // 桌面表
    static table_block = "block"; // 桌面表

    constructor(vm) {
        this.vm = vm;
        this.db = this.vm.$db;
    }

    /** 清空数据库数据 */
    clearLocalDB(){
        this.db.removeCollection(LocalDbService.table_table);
        this.db.removeCollection(LocalDbService.table_block);
    }

    /** 获取桌面列表
     * @return list
     */
    getTableListDb(){
        let table = this.db.addCollection(LocalDbService.table_table);
        let findList = table.find();
        return findList;
    }

    /** 本地获取一个table */
    getTableDb(key){
        let table = this.db.addCollection(LocalDbService.table_table);
        let one = table.findOne({key: key});
        return one;
    }
    /** 删除桌面 */
    deleteTableByKeyDb(key){
        let table = this.db.addCollection(LocalDbService.table_table);
        let tableOne = table.findOne({key: key});
        table.remove(tableOne)
    }
    /** 桌面插入一条数据 */
    insertTableDb(key, parentsKey, type, name){
        let table = this.db.addCollection(LocalDbService.table_table);
        table.insert({key, parentsKey, type, name})
    }

    /** 获取blocklist */
    getBlockListDb(tableKey){
        let blockTable = this.db.addCollection(LocalDbService.table_block);
        return blockTable.find({tableKey: tableKey})
    }
    /** 插入一个block数据 */
    insertBlockDb(tableKey, item){
        let blockTable = this.db.addCollection(LocalDbService.table_block);
        blockTable.insert({
            ...item,
            tableKey,
            blockType: item.blockType,
            blockKey: item.blockKey
        });
    }
    /** 插入多个block数据 */
    insertBlockListDb(tableKey, itemList){
        for(let item of itemList){
            this.insertBlockDb(tableKey, item)
        }
    }
    /** 根据桌面key删除block */
    deleteBlockByTableKeyDb(key){
        let blockTable = this.db.addCollection(LocalDbService.table_block);
        blockTable.removeWhere({tableKey: key})
    }
    /** 移动block */
    moveBlockDb(fromTableKey, blockKey, toTableKey){
        let blockTable = this.db.addCollection(LocalDbService.table_block);
        let block = blockTable.findOne({tableKey: fromTableKey, blockKey: blockKey});
        block.tableKey = toTableKey
        blockTable.update(block);
    }


    /**
     * 获取桌面列表
     * @return {b: true, msg:"", list:[{key, type, parentsKey, name}]}
     */
    getTableList(){
        let tableList = this.getTableListDb();
        return {b: true, msg:"", list: tableList}
    }
    /**
     * 获取桌面数据
     * @return {b: true, msg:"", data:{name, key, type, allBlock}}]}
     */
    getTableData(key){
        let tableDb = this.getTableDb(key);
        let list = this.getBlockListDb(tableDb.key);
        tableDb.allBlock = list

        return {b: true, msg:"", data: tableDb}
    }
    /**
     * 保存桌面数据
     * @return {b: true, msg:"", list:[{key, type, parentsKey}]}
     */
    async saveTableData(key, type, allBlock, name, parentsKey){
        let tableOne = this.getTableDb(key);
        if(tableOne == null || tableOne == undefined){
            this.insertTableDb(key, parentsKey, type, name)
        }
        // 删除桌面全部数据
        this.deleteBlockByTableKeyDb(key);
        this.insertBlockListDb(key, allBlock)
        return {b: true, msg:""}
    }
    /**
     * 移动图标
     * @return {b: true, msg:""}
     */
    async moveBlock(fromTableKey, blockKey, toTableKey){
        this.moveBlockDb(fromTableKey, blockKey, toTableKey)
        return {b: true, msg:""}
    }

    /**
     * 删除桌面
     * @return {b: true, msg:""}
     */
    async removeTable(tableKey){
        this.deleteTableByKeyDb(tableKey)
        return {b: true, msg:""}
    }

}

